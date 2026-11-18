"use client";

import { useEffect, useRef, useState } from "react";
import Tick from "./Tick";

const WHATSAPP = "919845177371";
// The clinic CRM. Its public API lists treatments and free slots and creates the booking.
const CRM = (process.env.NEXT_PUBLIC_CRM_URL ?? "").replace(/\/$/, "");
const INDIAN_MOBILE = /^(?:\+?91)?[6-9]\d{9}$/;

type Service = { id: string; name: string };
type Doctor = { id: string; name: string };
type Done = { code: string; token: string; when: string; service: string };

const timeFmt = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit" });
const longFmt = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "numeric",
  minute: "2-digit",
});
const todayIST = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());

async function api<T>(path: string, init?: RequestInit): Promise<{ ok: boolean; status: number; body: T }> {
  const res = await fetch(`${CRM}${path}`, init);
  const body = (await res.json().catch(() => ({}))) as T;
  return { ok: res.ok, status: res.status, body };
}

export default function ContactForm() {
  const reasonRef = useRef<HTMLTextAreaElement>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [online, setOnline] = useState<boolean | null>(CRM ? null : false);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<string[] | null>(null);
  const [slot, setSlot] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState<Done | null>(null);

  // The treatment finder can drop its suggestion into the reason box.
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const reason = (e as CustomEvent<{ reason: string }>).detail?.reason;
      if (reason && reasonRef.current) reasonRef.current.value = reason;
    };
    window.addEventListener("dz-prefill", onPrefill);
    return () => window.removeEventListener("dz-prefill", onPrefill);
  }, []);

  // Load treatments and the dentist from the CRM.
  useEffect(() => {
    if (!CRM) return;
    let alive = true;
    (async () => {
      try {
        const [s, d] = await Promise.all([api<Service[]>("/api/public/services"), api<Doctor[]>("/api/public/doctors")]);
        if (!alive) return;
        if (s.ok && d.ok && Array.isArray(s.body) && Array.isArray(d.body) && d.body.length) {
          setServices(s.body);
          setDoctor(d.body[0]);
          setOnline(true);
        } else setOnline(false);
      } catch {
        if (alive) setOnline(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Free slots for the chosen day.
  useEffect(() => {
    setSlot("");
    setSlots(null);
    if (!online || !doctor || !date) return;
    let alive = true;
    api<{ slots: string[] }>(`/api/public/availability?doctorId=${doctor.id}&date=${date}`)
      .then((r) => alive && setSlots(r.ok ? r.body.slots : []))
      .catch(() => alive && setSlots([]));
    return () => {
      alive = false;
    };
  }, [online, doctor, date]);

  function whatsapp(r: { name: string; phone: string; date: string; reason: string; service?: string }) {
    const text = [
      "Appointment request",
      `Name: ${r.name}`,
      `Phone: ${r.phone}`,
      r.service ? `Treatment: ${r.service}` : "",
      `Preferred date: ${r.date}`,
      `Reason: ${r.reason}`,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const d = new FormData(form);
    const name = String(d.get("name") ?? "").trim();
    const phone = String(d.get("phone") ?? "").trim();
    const reason = String(d.get("reason") ?? "").trim();
    const serviceId = String(d.get("service") ?? "");
    const svc = services.find((s) => s.id === serviceId);

    // CRM unreachable: keep the old behaviour so nobody is turned away.
    if (!online || !doctor) {
      whatsapp({ name, phone, date, reason });
      setMsg("Please send the WhatsApp message that just opened, or call 98451 77371. We will confirm by phone.");
      form.reset();
      return;
    }

    if (!INDIAN_MOBILE.test(phone.replace(/[\s-]/g, ""))) {
      setMsg("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!slot) {
      setMsg(slots && slots.length === 0 ? "There are no free times on that day. Please pick another date." : "Please choose a time.");
      return;
    }

    setBusy(true);
    setMsg("");
    try {
      const [first, ...rest] = name.split(/\s+/);
      const r = await api<{ appointmentCode?: string; token?: string; scheduledAt?: string; service?: string; error?: string; fields?: Record<string, string> }>(
        "/api/public/appointments",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: first,
            lastName: rest.join(" ") || undefined,
            phone,
            serviceId,
            doctorId: doctor.id,
            scheduledAt: slot,
            reason: reason || undefined,
          }),
        },
      );
      if (r.ok && r.body.appointmentCode) {
        setDone({
          code: r.body.appointmentCode,
          token: r.body.token ?? "",
          when: longFmt.format(new Date(r.body.scheduledAt ?? slot)),
          service: r.body.service ?? svc?.name ?? "",
        });
        form.reset();
        setDate("");
      } else if (r.status === 409) {
        setMsg("That time was just taken. Please choose another.");
        setSlot("");
        setDate((x) => x); // keep the date; refetch below
        api<{ slots: string[] }>(`/api/public/availability?doctorId=${doctor.id}&date=${date}`).then((a) => setSlots(a.ok ? a.body.slots : []));
      } else {
        const first = r.body.fields ? Object.values(r.body.fields)[0] : "";
        setMsg(first || r.body.error || "Could not book. Please try again or call 98451 77371.");
      }
    } catch {
      setMsg("We could not reach the clinic system. Please try again or call 98451 77371.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="ct-form is-sent ct-done" role="status">
        <p className="ct-done-tag">Booked</p>
        <h3>You&apos;re booked, see you soon.</h3>
        <p>
          {done.service && <>{done.service}, </>}
          {done.when}
        </p>
        <p className="small">
          Booking <b>{done.code}</b>
          {done.token && (
            <>
              {" "}
              · queue token <b>{done.token}</b>
            </>
          )}
          . We may call you to confirm. If you need to change the time, call 98451 77371.
        </p>
        <button className="btn" type="button" onClick={() => setDone(null)}>
          <span>Book another visit</span>
          <Tick />
        </button>
      </div>
    );
  }

  const liveForm = online === true;

  return (
    <form className="ct-form" onSubmit={onSubmit}>
      <label className="field">
        <span>Full name</span>
        <input name="name" required autoComplete="name" maxLength={120} />
      </label>
      <label className="field">
        <span>Mobile number</span>
        <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" minLength={10} maxLength={20} />
      </label>

      {liveForm && (
        <label className="field field-wide">
          <span>Treatment</span>
          <select name="service" required defaultValue="">
            <option value="" disabled>
              Choose a treatment
            </option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="field field-wide">
        <span>{liveForm ? "Day (closed on Sundays)" : "Preferred date (closed on Sundays)"}</span>
        <input name="date" type="date" required min={todayIST()} value={date} onChange={(e) => setDate(e.target.value)} />
      </label>

      {liveForm && date && (
        <div className="field-wide slots-wrap">
          <span className="slots-label">Available times with Dr. {doctor?.name}</span>
          {slots === null ? (
            <p className="small">Checking free times…</p>
          ) : slots.length === 0 ? (
            <p className="small">No free times that day. The clinic is closed on Sundays. Please pick another date.</p>
          ) : (
            <div className="slots" role="radiogroup" aria-label="Available times">
              {slots.map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={slot === s}
                  className={`slot${slot === s ? " on" : ""}`}
                  onClick={() => setSlot(s)}
                >
                  {timeFmt.format(new Date(s))}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <label className="field field-wide">
        <span>Reason for visit (optional)</span>
        <textarea ref={reasonRef} name="reason" rows={2} maxLength={500} />
      </label>

      <div className="ct-send">
        <button className="btn" type="submit" disabled={busy}>
          <span>{busy ? "Booking…" : liveForm ? "Book appointment" : "Send request"}</span>
          <Tick />
        </button>
        <p className="small ct-note" role="status">
          {msg ||
            (online === null
              ? "Loading the booking calendar…"
              : liveForm
                ? "Pick a time and your booking is confirmed straight away. For urgent needs call 98451 77371."
                : "Opens WhatsApp with your request pre-filled. For urgent needs call 98451 77371.")}
        </p>
      </div>
    </form>
  );
}
