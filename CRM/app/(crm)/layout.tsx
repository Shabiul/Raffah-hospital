import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions";
import Nav from "@/components/Nav";

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { data: staff } = await supabase
    .from("staff")
    .select("full_name, role")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (!staff) {
    await supabase.auth.signOut();
    redirect("/login?error=" + encodeURIComponent("This account does not have access to the CRM."));
  }

  const { count } = await supabase
    .from("appointment_requests")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");

  return (
    <div className="shell">
      <aside className="side">
        <div className="brand-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <span className="logo">
            <img src="/tooth.png" alt="" width={630} height={887} />
          </span>
          <div>
            <strong>Dentizz</strong>
            <span className="muted small">CRM</span>
          </div>
        </div>
        <Nav newRequests={count ?? 0} />
        <div className="side-foot">
          <p className="small">{staff.full_name}</p>
          <form action={signOut}>
            <button className="link-btn" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
