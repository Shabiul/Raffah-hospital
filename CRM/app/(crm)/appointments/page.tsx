import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAppointment, setAppointmentStatus } from "@/app/actions";
import { dayRange, fmtDate, fmtTime, STATUS_LABEL, todayIST } from "@/lib/format";

export const dynamic = "force-dynamic";

type Appt = {
  id: string;
  scheduled_at: string;
  reason: string | null;
  status: string;
  patients: { id: string; full_name: string; phone: string } | null;
};

export default async function Appointments({
  searchParams,
}: {
  searchParams: Promise<{ d?: string; error?: string }>;
}) {
  const { d, error } = await searchParams;
  const today = todayIST();
  const day = d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : today;
  const { start, end } = dayRange(day);
  const back = `/appointments?d=${day}`;

  const supabase = await createClient();
  const [list, patients] = await Promise.all([
    supabase
      .from("appointments")
      .select("id, scheduled_at, reason, status, patients(id, full_name, phone)")
      .gte("scheduled_at", start)
      .lte("scheduled_at", end)
      .order("scheduled_at")
      .returns<Appt[]>(),
    supabase.from("patients").select("id, full_name, phone").order("full_name").limit(1000),
  ]);

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Appointments</h1>
          <p className="muted">{fmtDate(day)}</p>
        </div>
      </header>
      {error && <p className="alert">{error}</p>}

      <form className="toolbar" method="get">
        <input type="date" name="d" defaultValue={day} aria-label="Day" />
        <button className="btn" type="submit">
          Show day
        </button>
        {day !== today && (
          <Link className="link" href="/appointments">
            Back to today
          </Link>
        )}
      </form>

      <div className="cols">
        <section className="card wide">
          <h2>{day === today ? "Today" : fmtDate(day)}</h2>
          {(list.data ?? []).length === 0 ? (
            <p className="muted">No appointments on this day.</p>
          ) : (
            <ul className="rows">
              {(list.data ?? []).map((a) => (
                <li key={a.id}>
                  <div>
                    <strong>{fmtTime(a.scheduled_at)}</strong>{" "}
                    <Link href={`/patients/${a.patients?.id}`}>{a.patients?.full_name}</Link>
                    <div className="muted small">
                      {a.reason || "No reason noted"} · {a.patients?.phone}
                    </div>
                  </div>
                  <div className="row-actions">
                    <span className={`tag tag-${a.status}`}>{STATUS_LABEL[a.status]}</span>
                    {a.status === "scheduled" &&
                      (["completed", "no_show", "cancelled"] as const).map((s) => (
                        <form action={setAppointmentStatus} key={s}>
                          <input type="hidden" name="id" value={a.id} />
                          <input type="hidden" name="status" value={s} />
                          <input type="hidden" name="back" value={back} />
                          <button className={`btn-sm${s === "completed" ? "" : " ghost"}`} type="submit">
                            {s === "completed" ? "Done" : s === "no_show" ? "No show" : "Cancel"}
                          </button>
                        </form>
                      ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <h2>Book an appointment</h2>
          <form action={createAppointment} className="form">
            <input type="hidden" name="back" value={back} />
            <label>
              Patient
              <select name="patient_id" required defaultValue="">
                <option value="" disabled>
                  Choose a patient
                </option>
                {(patients.data ?? []).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name} · {p.phone}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Date and time
              <input name="scheduled_at" type="datetime-local" defaultValue={`${day}T10:30`} required />
            </label>
            <label>
              Reason
              <input name="reason" placeholder="Check-up, root canal…" />
            </label>
            <button className="btn" type="submit">
              Book
            </button>
            <p className="muted small">
              New patient? <Link href="/patients">Add them first</Link>.
            </p>
          </form>
        </section>
      </div>
    </>
  );
}
