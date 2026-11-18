// Dentizz CRM seed.
// Reads prisma/dentizz-data.json (clinic details, treatments, the dentist's weekly sessions, FAQs).
// Idempotent: safe to re-run. Existing staff passwords are kept unless DENTIZZ_RESET_PASSWORDS=1.
// Passwords come from env (DENTIZZ_ADMIN_PASSWORD, DENTIZZ_RECEPTION_PASSWORD, DENTIZZ_BILLING_PASSWORD,
// DENTIZZ_DOCTOR_PASSWORD); any that are unset are generated and printed ONCE below. Nothing is hard-coded.
import "dotenv/config"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { randomBytes, scryptSync } from "node:crypto"
import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })
const data = JSON.parse(readFileSync(resolve(__dirname, "dentizz-data.json"), "utf8"))

const DOMAIN = (process.env.DENTIZZ_EMAIL_DOMAIN || "dentizz.in").trim()
const RESET = process.env.DENTIZZ_RESET_PASSWORDS === "1"
const issued: { who: string; email: string; password: string }[] = []

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`
}
const pw = (envKey: string) => process.env[envKey]?.trim() || randomBytes(9).toString("base64url")

const DAY: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

async function upsertStaff(name: string, email: string, role: "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "BILLING", password: string, extra: Record<string, unknown> = {}) {
  const existing = await prisma.user.findUnique({ where: { email } })
  const passwordHash = hashPassword(password)
  if (existing) {
    return prisma.user.update({ where: { email }, data: { name, role, active: true, ...extra, ...(RESET ? { passwordHash } : {}) } })
  }
  issued.push({ who: `${role.toLowerCase()}: ${name}`, email, password })
  return prisma.user.create({ data: { name, email, role, passwordHash, ...extra } })
}

async function main() {
  const biz = data.biz
  console.log(`Seeding ${biz.name} CRM (${data.syncedAt})…`)

  // Staff: front-of-house roles
  await upsertStaff(`${biz.short} Administrator`, `admin@${DOMAIN}`, "ADMIN", pw("DENTIZZ_ADMIN_PASSWORD"), { phone: biz.phone })
  await upsertStaff("Front Desk", `reception@${DOMAIN}`, "RECEPTIONIST", pw("DENTIZZ_RECEPTION_PASSWORD"), { phone: biz.phone })
  await upsertStaff("Billing Desk", `billing@${DOMAIN}`, "BILLING", pw("DENTIZZ_BILLING_PASSWORD"), { phone: biz.phone })

  // Services: one bookable service per treatment. No prices are invented; set them in Services.
  let order = 0
  for (const d of data.departments) {
    await prisma.service.upsert({
      where: { slug: d.id },
      create: { slug: d.id, name: d.name, shortDescription: d.summary, description: d.about, durationMinutes: 30, displayOrder: order++, active: true },
      update: { name: d.name, shortDescription: d.summary, description: d.about, displayOrder: order++, active: true },
    })
  }
  console.log(`  Services: ${data.departments.length} treatments`)

  // Dentist + weekly availability from the clinic's sessions
  const deptName = Object.fromEntries(data.departments.map((d: { id: string; name: string }) => [d.id, d.name]))
  const doctorPw = pw("DENTIZZ_DOCTOR_PASSWORD")
  for (const d of data.doctors) {
    // The CRM adds "Dr." itself wherever it shows a doctor, so store the bare name
    const doc = await upsertStaff(String(d.name).replace(/^Dr\.?\s+/i, ""), `${d.id}@${DOMAIN}`, "DOCTOR", doctorPw, {
      slug: d.id,
      specialization: `${d.role}`,
    })
    await prisma.doctorAvailability.deleteMany({ where: { doctorId: doc.id } })
    for (const s of d.sessions as { days: string[]; start: string; end: string }[]) {
      for (const day of s.days) {
        if (day in DAY) await prisma.doctorAvailability.create({ data: { doctorId: doc.id, dayOfWeek: DAY[day], startTime: s.start, endTime: s.end, slotDurationMinutes: 30 } })
      }
    }
    void deptName
  }
  console.log(`  Dentists: ${data.doctors.length} with weekly availability`)

  // Clinic settings
  await prisma.clinicSettings.upsert({
    where: { id: "clinic" },
    create: { id: "clinic", name: biz.name, addressLine: biz.address, landmark: "Opp Blessington Apartment", phone: biz.phone, email: biz.email, mapQuery: biz.mapQuery, weekdayOpen: "10:30", weekdayClose: "20:30", sundayClosed: true, heroHeadline: biz.tagline, aboutText: biz.intro },
    update: { name: biz.name, addressLine: biz.address, landmark: "Opp Blessington Apartment", phone: biz.phone, email: biz.email, mapQuery: biz.mapQuery, weekdayOpen: "10:30", weekdayClose: "20:30", sundayClosed: true, heroHeadline: biz.tagline, aboutText: biz.intro },
  })

  await prisma.fAQ.deleteMany()
  for (const [i, f] of (data.faq as { q: string; a: string }[]).entries()) {
    await prisma.fAQ.create({ data: { question: f.q, answer: f.a, displayOrder: i, active: true } })
  }
  console.log(`  Settings + ${data.faq.length} FAQs`)

  if (issued.length) {
    console.log("\n  NEW staff accounts. Passwords are shown ONCE. Save them now, then change them in the CRM:")
    for (const u of issued.filter((u) => !u.who.startsWith("doctor"))) console.log(`    ${u.who.padEnd(32)} ${u.email.padEnd(34)} ${u.password}`)
    if (issued.some((u) => u.who.startsWith("doctor"))) console.log(`    dentist (${data.doctors[0].id}@${DOMAIN})   initial password: ${doctorPw}`)
  } else console.log("\n  No new accounts created (existing passwords kept).")
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
