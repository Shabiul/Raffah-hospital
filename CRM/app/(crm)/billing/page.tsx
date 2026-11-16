import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Billing() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("patient_balances")
    .select("patient_id, full_name, phone, billed, paid, balance")
    .order("balance", { ascending: false });

  const rows = data ?? [];
  const sum = (k: "billed" | "paid" | "balance") => rows.reduce((s, r) => s + Number(r[k]), 0);
  const owing = rows.filter((r) => Number(r.balance) > 0);

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Billing</h1>
          <p className="muted">Charges are added on each patient&apos;s page.</p>
        </div>
      </header>

      <section className="stats">
        <div className="stat">
          <span className="muted small">Total billed</span>
          <strong>{money(sum("billed"))}</strong>
        </div>
        <div className="stat">
          <span className="muted small">Collected</span>
          <strong>{money(sum("paid"))}</strong>
        </div>
        <div className="stat">
          <span className="muted small">Outstanding</span>
          <strong className="due">{money(owing.reduce((s, r) => s + Number(r.balance), 0))}</strong>
        </div>
        <div className="stat">
          <span className="muted small">Patients owing</span>
          <strong>{owing.length}</strong>
        </div>
      </section>

      <section className="card">
        <h2>Outstanding balances</h2>
        {owing.length === 0 ? (
          <p className="muted">Nobody owes anything right now.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Phone</th>
                <th className="num">Billed</th>
                <th className="num">Paid</th>
                <th className="num">Balance</th>
              </tr>
            </thead>
            <tbody>
              {owing.map((r) => (
                <tr key={r.patient_id}>
                  <td>
                    <Link href={`/patients/${r.patient_id}`}>{r.full_name}</Link>
                  </td>
                  <td>{r.phone}</td>
                  <td className="num">{money(r.billed)}</td>
                  <td className="num">{money(r.paid)}</td>
                  <td className="num due">{money(r.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
