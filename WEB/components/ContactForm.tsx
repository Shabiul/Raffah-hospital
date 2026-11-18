"use client";

import { useEffect, useRef, useState } from "react";
import Tick from "./Tick";

const WHATSAPP = "919845177371";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Saves the request where the clinic's CRM can see it. The public key can only add new requests.
async function saveRequest(r: { name: string; phone: string; date: string; reason: string }) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/appointment_requests`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        name: r.name,
        phone: r.phone,
        preferred_date: r.date || null,
        reason: r.reason || null,
      }),
      keepalive: true,
    });
    return res.ok;
  } catch {
    return false;
  }
}

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "saved" | "whatsapp">("idle");
  const reasonRef = useRef<HTMLTextAreaElement>(null);

  // The treatment finder can drop its suggestion into the reason box.
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const reason = (e as CustomEvent<{ reason: string }>).detail?.reason;
      if (reason && reasonRef.current) reasonRef.current.value = reason;
    };
    window.addEventListener("dz-prefill", onPrefill);
    return () => window.removeEventListener("dz-prefill", onPrefill);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const d = new FormData(form);
    const req = {
      name: String(d.get("name") ?? "").trim(),
      phone: String(d.get("phone") ?? "").trim(),
      date: String(d.get("date") ?? ""),
      reason: String(d.get("reason") ?? "").trim(),
    };
    const text = [
      "Appointment request",
      `Name: ${req.name}`,
      `Phone: ${req.phone}`,
      `Preferred date: ${req.date}`,
      `Reason: ${req.reason}`,
    ].join("\n");

    // Open WhatsApp straight away (browsers block popups opened after an await).
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    setState("sending");
    const saved = await saveRequest(req);
    setState(saved ? "saved" : "whatsapp");
    form.reset();
  }

  const note =
    state === "sending"
      ? "Sending your request…"
      : state === "saved"
        ? "Thank you. Your request has reached the clinic and we will call you to confirm."
        : state === "whatsapp"
          ? "Please send the WhatsApp message that just opened, or call 98451 77371. We will confirm by phone."
          : "We save your request and open WhatsApp with it pre-filled. For urgent needs call 98451 77371.";

  return (
    <form className={`ct-form${state === "saved" ? " is-sent" : ""}`} onSubmit={onSubmit}>
      <label className="field">
        <span>Full name</span>
        <input name="name" required autoComplete="name" maxLength={120} />
      </label>
      <label className="field">
        <span>Phone number</span>
        <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" minLength={5} maxLength={20} />
      </label>
      <label className="field field-wide">
        <span>Preferred date (closed on Sundays)</span>
        <input name="date" type="date" required />
      </label>
      <label className="field field-wide">
        <span>Reason for visit</span>
        <textarea ref={reasonRef} name="reason" rows={2} maxLength={1000} />
      </label>
      <div className="ct-send">
        <button className="btn" type="submit" disabled={state === "sending"}>
          <span>Send request</span>
          <Tick />
        </button>
        <p className="small ct-note" role="status">
          {note}
        </p>
      </div>
    </form>
  );
}
