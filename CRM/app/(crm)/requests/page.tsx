import { createClient } from "@/lib/supabase/server";
import { convertRequest, setRequestStatus } from "@/app/actions";
import { fmtDate, fmtDateTime, STATUS_LABEL } from "@/lib/format";

export const dynamic = "force-dynamic";

const FILTERS = ["new", "contacted", "booked", "dismissed"] as const;

export default async function Requests({
  searchParams,
}: {
  searchParams: Promise<{ s?: string; error?: string }>;
}) {
  const { s, error } = await searchParams;
  const status = (FILTERS as readonly string[]).includes(s ?? "") ? (s as string) : "new";
  const supabase = await createClient();
  const { data } = await supabase
    .from("appointment_requests")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Website requests</h1>
          <p className="muted">Appointment requests sent from the Dentizz website.</p>
        </div>
      </header>
      {error && <p className="alert">{error}</p>}

      <div className="tabs">
        {FILTERS.map((f) => (
          <a key={f} href={`/requests?s=${f}`} className={f === status ? "active" : undefined}>
            {STATUS_LABEL[f]}
          </a>
        ))}
      </div>

      <section className="card">
        {(data ?? []).length === 0 ? (
          <p className="muted">Nothing here.</p>
        ) : (
          <ul className="rows">
            {(data ?? []).map((r) => (
              <li key={r.id}>
                <div>
                  <strong>{r.name}</strong> ·{" "}
                  <a className="link" href={`tel:${r.phone}`}>
                    {r.phone}
                  </a>
                  <div className="muted small">
                    {r.preferred_date ? `Prefers ${fmtDate(r.preferred_date)}` : "No date given"} · received{" "}
                    {fmtDateTime(r.created_at)}
                  </div>
                  {r.reason && <div className="small">{r.reason}</div>}
                </div>
                <div className="row-actions">
                  {r.status !== "booked" && (
                    <form action={convertRequest}>
                      <input type="hidden" name="id" value={r.id} />
                      <button className="btn-sm" type="submit">
                        Add patient and book
                      </button>
                    </form>
                  )}
                  {r.status === "new" && (
                    <form action={setRequestStatus}>
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="status" value="contacted" />
                      <button className="btn-sm ghost" type="submit">
                        Mark contacted
                      </button>
                    </form>
                  )}
                  {r.status !== "dismissed" && r.status !== "booked" && (
                    <form action={setRequestStatus}>
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="status" value="dismissed" />
                      <button className="btn-sm ghost" type="submit">
                        Dismiss
                      </button>
                    </form>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
