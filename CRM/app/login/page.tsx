import { signIn } from "@/app/actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main className="login">
      <form action={signIn} className="login-card">
        <div className="brand-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <span className="logo">
            <img src="/tooth.png" alt="" width={630} height={887} />
          </span>
          <div>
            <h1>Dentizz CRM</h1>
            <p className="muted">Staff sign in</p>
          </div>
        </div>
        {error && <p className="alert">{error}</p>}
        <label>
          Email
          <input name="email" type="email" required autoComplete="username" autoFocus />
        </label>
        <label>
          Password
          <input name="password" type="password" required autoComplete="current-password" />
        </label>
        <button className="btn" type="submit">
          Sign in
        </button>
      </form>
    </main>
  );
}
