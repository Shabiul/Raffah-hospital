"use server"

import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { verifyPassword, createSession, destroySession } from "@/lib/auth"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"

// Errors are returned, not thrown: Next hides the message of an error thrown from a server action
// in production, which would leave the user with a generic message.
export async function login(input: LoginInput): Promise<{ error: string } | { id: string; name: string; role: string }> {
  const parsed = loginSchema.safeParse(input)
  if (!parsed.success) return { error: "Enter a valid email and password" }
  const data = parsed.data

  const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } })
  // Constant-shape failure: don't reveal whether the email exists.
  if (!user || !user.active || !verifyPassword(data.password, user.passwordHash)) {
    return { error: "Invalid email or password" }
  }

  await createSession(user.id)
  return { id: user.id, name: user.name, role: user.role }
}

export async function logout() {
  await destroySession()
  redirect("/login")
}
