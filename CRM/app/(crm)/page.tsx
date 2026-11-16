import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { dayRange, fmtDate, fmtTime, money, STATUS_LABEL, todayIST } from "@/lib/format";
import { setAppointmentStatus } from "@/app/actions";

export const dynamic = "force-dynamic";

type Appt = {
  id: string;
  scheduled_at: string;
  reason: string | null;
  status: string;
  patients: { id: string; full_name: string; phone: string } | null;
};

export default async function Dashboard() {
  const supabase = await createClient();
  const today = todayIST();
  const { start, end } = dayRange(today);

  const [todayAppts, patients, requests, balances, recentReq] = await Promise.all([
    supabase
      .from("appointments")
      .select("id, scheduled_at, reason, status, patients(id, full_name, phone)")
      .gte("scheduled_at", start)
      .lte("scheduled_at", end)
      .order("scheduled_at")
      .returns<Appt[]>(),
    supabase.from("patients").select("id", { count: "exact", head: true }),
    supabase.from("appointment_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("patient_balances").select("balance").gt("balance", 0),
    supabase
      .from("appointment_requests")
      .select("id, name, phone, preferred_date, reason, created_at")
      .eq("status", "new")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const due = (balances.data ?? []).reduce((s, r) => s + Number(r.balance), 0);
  const list = todayAppts.data ?? [];

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">{fmtDate(today)}</p>
        </div>
        <Link className="btn" href="/appointments">
          Book appointment
        </Link>
      </header>

      <section className="stats">
        <div className="stat">
          <span className="muted small">Appointments today</span>
          <strong>{list.length}</strong>
        </div>
        <div className="stat">
          <span className="muted small">New website requests</span>
          <strong>{requests.count ?? 0}</strong>
        </div>
        <div className="stat">
          <span className="muted small">Patients</span>
          <strong>{patients.count ?? 0}</strong>
        </div>
        <div className="stat">
          <span className="muted small">Outstanding dues</span>
          <strong>{money(due)}</strong>
        </div>
      </section>

      <div className="cols">
        <section className="card">
          <h2>Today&apos;s appointments</h2>
          {list.length === 0 ? (
            <p className="muted">Nothing booked for today.</p>
          ) : (
            <ul className="rows">
              {list.map((a) => (
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
                    {a.status === "scheduled" && (
                      <form action={setAppointmentStatus}>
                        <input type="hidden" name="id" value={a.id} />
                        <input type="hidden" name="status" value="completed" />
                        <input type="hidden" name="back" value="/" />
                        <button className="btn-sm" type="submit">
                          Done
                        </button>
                      </form>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <h2>New website requests</h2>
          {(recentReq.data ?? []).length === 0 ? (
            <p className="muted">No new requests.</p>
          ) : (
            <ul className="rows">
              {(recentReq.data ?? []).map((r) => (
                <li key={r.id}>
                  <div>
                    <strong>{r.name}</strong> · {r.phone}
                    <div className="muted small">
                      {r.preferred_date ? `Prefers ${fmtDate(r.preferred_date)}` : "No date given"}
                      {r.reason ? ` · ${r.reason}` : ""}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p>
            <Link className="link" href="/requests">
              Open all requests
            </Link>
          </p>
        </section>
      </div>
    </>
  );
}
