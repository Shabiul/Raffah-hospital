import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createPatient } from "@/app/actions";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Patients({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; error?: string }>;
}) {
  const { q = "", error } = await searchParams;
  const term = q.replace(/[,()%*]/g, " ").trim();
  const supabase = await createClient();

  let query = supabase.from("patient_balances").select("patient_id, full_name, phone, balance").order("full_name").limit(200);
  if (term) query = query.or(`full_name.ilike.%${term}%,phone.ilike.%${term}%`);
  const { data } = await query;

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Patients</h1>
          <p className="muted">Search by name or phone number.</p>
        </div>
      </header>
      {error && <p className="alert">{error}</p>}

      <form className="toolbar" method="get">
        <input name="q" defaultValue={q} placeholder="Search patients" aria-label="Search patients" />
        <button className="btn" type="submit">
          Search
        </button>
        {q && (
          <Link className="link" href="/patients">
            Clear
          </Link>
        )}
      </form>

      <div className="cols">
        <section className="card wide">
          <h2>{term ? `Results for "${term}"` : "All patients"}</h2>
          {(data ?? []).length === 0 ? (
            <p className="muted">No patients found.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th className="num">Balance due</th>
                </tr>
              </thead>
              <tbody>
                {(data ?? []).map((p) => (
                  <tr key={p.patient_id}>
                    <td>
                      <Link href={`/patients/${p.patient_id}`}>{p.full_name}</Link>
                    </td>
                    <td>{p.phone}</td>
                    <td className="num">{Number(p.balance) > 0 ? money(p.balance) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="card">
          <h2>Add a patient</h2>
          <form action={createPatient} className="form">
            <label>
              Full name
              <input name="full_name" required />
            </label>
            <label>
              Phone
              <input name="phone" type="tel" required />
            </label>
            <div className="two">
              <label>
                Age
                <input name="age" type="number" min={0} max={120} />
              </label>
              <label>
                Sex
                <select name="sex" defaultValue="">
                  <option value="">—</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </label>
            </div>
            <label>
              Address
              <input name="address" />
            </label>
            <label>
              Notes
              <textarea name="notes" rows={2} />
            </label>
            <button className="btn" type="submit">
              Add patient
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
