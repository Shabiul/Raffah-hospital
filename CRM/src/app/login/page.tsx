import { redirect } from "next/navigation"
import { DentizzMark } from "@/components/brand/logo"
import { getCurrentUserOrNull } from "@/lib/auth"
import { LoginForm } from "@/components/auth/login-form"

export const dynamic = "force-dynamic"

export default async function LoginPage() {
  const user = await getCurrentUserOrNull()
  if (user) redirect("/dashboard")

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <DentizzMark className="mx-auto mb-3 h-14 w-14" />
          <h1 className="text-xl font-semibold tracking-tight">Dentizz</h1>
          <p className="text-sm text-muted-foreground">Staff sign-in · Add Smile to your Face</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
