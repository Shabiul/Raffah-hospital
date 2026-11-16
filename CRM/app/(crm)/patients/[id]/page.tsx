import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  addPayment,
  addTreatment,
  createAppointment,
  removeRow,
  setAppointmentStatus,
  updatePatient,
} from "@/app/actions";
import { fmtDate, fmtDateTime, money, STATUS_LABEL, todayIST } from "@/lib/format";

export const dynamic = "force-dynamic";

function Remove({ table, id, patientId }: { table: string; id: string; patientId: string }) {
  return (
    <form action={removeRow}>
      <input type="hidden" name="table" value={table} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="patient_id" value={patientId} />
      <button className="link-btn danger" type="submit">
        Remove
      </button>
    </form>
  );
}

export default async function PatientPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; prefer?: string }>;
}) {
  const { id } = await params;
  const { error, prefer } = await searchParams;
  const supabase = await createClient();

  const { data: patient } = await supabase.from("patients").select("*").eq("id", id).maybeSingle();
  if (!patient) notFound();

  const [appts, treatments, payments, bal] = await Promise.all([
    supabase.from("appointments").select("*").eq("patient_id", id).order("scheduled_at", { ascending: false }),
    supabase.from("treatments").select("*").eq("patient_id", id).order("treated_on", { ascending: false }),
    supabase.from("payments").select("*").eq("patient_id", id).order("paid_on", { ascending: false }),
    supabase.from("patient_balances").select("billed, paid, balance").eq("patient_id", id).single(),
  ]);

  const today = todayIST();
  const back = `/patients/${id}`;
  const defaultWhen = `${prefer ?? today}T10:30`;

  return (
    <>
      <header className="page-head">
        <div>
          <Link className="link small" href="/patients">
            ← All patients
          </Link>
          <h1>{patient.full_name}</h1>
          <p className="muted">
            {patient.phone}
            {patient.age != null ? ` · ${patient.age} yrs` : ""}
            {patient.sex ? ` · ${patient.sex}` : ""}
          </p>
        </div>
        <div className="stats mini">
          <div className="stat">
            <span className="muted small">Billed</span>
            <strong>{money(bal.data?.billed)}</strong>
          </div>
          <div className="stat">
            <span className="muted small">Paid</span>
            <strong>{money(bal.data?.paid)}</strong>
          </div>
          <div className="stat">
            <span className="muted small">Balance</span>
            <strong className={Number(bal.data?.balance) > 0 ? "due" : ""}>{money(bal.data?.balance)}</strong>
          </div>
        </div>
      </header>
      {error && <p className="alert">{error}</p>}

      <div className="cols">
        <section className="card wide">
          <h2>Appointments</h2>
          {(appts.data ?? []).length === 0 ? (
            <p className="muted">No appointments yet.</p>
          ) : (
            <ul className="rows">
              {(appts.data ?? []).map((a) => (
                <li key={a.id}>
                  <div>
                    <strong>{fmtDateTime(a.scheduled_at)}</strong>
                    <div className="muted small">{a.reason || "No reason noted"}</div>
                  </div>
                  <div className="row-actions">
                    <span className={`tag tag-${a.status}`}>{STATUS_LABEL[a.status]}</span>
                    {a.status === "scheduled" && (
                      <>
                        <form action={setAppointmentStatus}>
                          <input type="hidden" name="id" value={a.id} />
                          <input type="hidden" name="status" value="completed" />
                          <input type="hidden" name="back" value={back} />
                          <button className="btn-sm" type="submit">
                            Done
                          </button>
                        </form>
                        <form action={setAppointmentStatus}>
                          <input type="hidden" name="id" value={a.id} />
                          <input type="hidden" name="status" value="cancelled" />
                          <input type="hidden" name="back" value={back} />
                          <button className="btn-sm ghost" type="submit">
                            Cancel
                          </button>
                        </form>
                      </>
                    )}
                    <Remove table="appointments" id={a.id} patientId={id} />
                  </div>
                </li>
              ))}
            </ul>
          )}

          <h3>Book an appointment</h3>
          <form action={createAppointment} className="form inline">
            <input type="hidden" name="patient_id" value={id} />
            <input type="hidden" name="back" value={back} />
            <label>
              Date and time
              <input name="scheduled_at" type="datetime-local" defaultValue={defaultWhen} required />
            </label>
            <label>
              Reason
              <input name="reason" placeholder="Check-up, root canal…" />
            </label>
            <button className="btn" type="submit">
              Book
            </button>
          </form>
        </section>

        <section className="card">
          <h2>Details</h2>
          <form action={updatePatient} className="form">
            <input type="hidden" name="id" value={id} />
            <label>
              Full name
              <input name="full_name" defaultValue={patient.full_name} required />
            </label>
            <label>
              Phone
              <input name="phone" defaultValue={patient.phone} required />
            </label>
            <div className="two">
              <label>
                Age
                <input name="age" type="number" min={0} max={120} defaultValue={patient.age ?? ""} />
              </label>
              <label>
                Sex
                <select name="sex" defaultValue={patient.sex ?? ""}>
                  <option value="">—</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </label>
            </div>
            <label>
              Address
              <input name="address" defaultValue={patient.address ?? ""} />
            </label>
            <label>
              Notes
              <textarea name="notes" rows={3} defaultValue={patient.notes ?? ""} />
            </label>
            <button className="btn" type="submit">
              Save details
            </button>
          </form>
        </section>
      </div>

      <div className="cols">
        <section className="card wide">
          <h2>Treatments and charges</h2>
          {(treatments.data ?? []).length === 0 ? (
            <p className="muted">No treatments recorded.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Procedure</th>
                  <th>Tooth</th>
                  <th className="num">Amount</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {(treatments.data ?? []).map((t) => (
                  <tr key={t.id}>
                    <td>{fmtDate(t.treated_on)}</td>
                    <td>
                      {t.procedure}
                      {t.notes && <div className="muted small">{t.notes}</div>}
                    </td>
                    <td>{t.tooth || "—"}</td>
                    <td className="num">{money(t.amount)}</td>
                    <td className="num">
                      <Remove table="treatments" id={t.id} patientId={id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <h3>Add a treatment</h3>
          <form action={addTreatment} className="form inline">
            <input type="hidden" name="patient_id" value={id} />
            <label>
              Procedure
              <input name="procedure" placeholder="Root canal, scaling…" required />
            </label>
            <label>
              Tooth
              <input name="tooth" placeholder="e.g. 46" />
            </label>
            <label>
              Amount (₹)
              <input name="amount" type="number" min={0} step="0.01" required />
            </label>
            <label>
              Date
              <input name="treated_on" type="date" defaultValue={today} />
            </label>
            <button className="btn" type="submit">
              Add
            </button>
          </form>
        </section>

        <section className="card">
          <h2>Payments</h2>
          {(payments.data ?? []).length === 0 ? (
            <p className="muted">No payments yet.</p>
          ) : (
            <ul className="rows">
              {(payments.data ?? []).map((p) => (
                <li key={p.id}>
                  <div>
                    <strong>{money(p.amount)}</strong> · {p.method}
                    <div className="muted small">{fmtDate(p.paid_on)}</div>
                  </div>
                  <Remove table="payments" id={p.id} patientId={id} />
                </li>
              ))}
            </ul>
          )}
          <h3>Record a payment</h3>
          <form action={addPayment} className="form">
            <input type="hidden" name="patient_id" value={id} />
            <div className="two">
              <label>
                Amount (₹)
                <input name="amount" type="number" min={1} step="0.01" required />
              </label>
              <label>
                Method
                <select name="method" defaultValue="Cash">
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Card</option>
                  <option>Other</option>
                </select>
              </label>
            </div>
            <label>
              Date
              <input name="paid_on" type="date" defaultValue={today} />
            </label>
            <button className="btn" type="submit">
              Record payment
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
