// Dentizz CRM: DEMO data seed. Dental-themed, clearly synthetic.
//   npm run db:seed:demo            -> remove previous demo rows, insert fresh ones
//   npm run db:seed:demo -- --reset -> remove demo rows only
// Run `npm run db:seed` first (staff and services must exist).
// Demo rows are found again by: phone 9000000001..9000000099 and email *@demo.invalid.
// Because it writes to a live database, it needs DENTIZZ_ALLOW_DEMO=1 unless the database is local.
import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { generateAppointmentCode, generateBillNumber, generateReceiptNumber, generateUHID } from "../src/lib/sequence"

const RESET_ONLY = process.argv.includes("--reset")
const host = (() => {
  try {
    return new URL(process.env.DATABASE_URL || "").hostname
  } catch {
    return ""
  }
})()
const local = ["127.0.0.1", "localhost", "::1", "[::1]"].includes(host)
if ((process.env.NODE_ENV === "production" || !local) && process.env.DENTIZZ_ALLOW_DEMO !== "1") {
  console.error(`REFUSING: database host ${host || "(unparseable)"} is not local. Set DENTIZZ_ALLOW_DEMO=1 to confirm.`)
  process.exit(1)
}
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })

const IST = 330 * 60000
/** Date at hh:mm IST, `day` days from today (negative = past). */
function at(day: number, h: number, m = 0) {
  const n = new Date(Date.now() + IST)
  return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate() + day, h, m) - IST)
}
const phone = (i: number) => String(9000000001 + i)

async function cleanup() {
  const demo = await prisma.patient.findMany({
    where: { phone: { gte: "9000000001", lte: "9000000099" }, email: { endsWith: "@demo.invalid" } },
    select: { id: true },
  })
  const ids = demo.map((p) => p.id)
  await prisma.payment.deleteMany({ where: { patientId: { in: ids } } })
  await prisma.billItem.deleteMany({ where: { bill: { patientId: { in: ids } } } })
  await prisma.bill.deleteMany({ where: { patientId: { in: ids } } })
  await prisma.followUp.deleteMany({ where: { patientId: { in: ids } } })
  await prisma.appointment.deleteMany({ where: { patientId: { in: ids } } })
  await prisma.communicationPreference.deleteMany({ where: { patientId: { in: ids } } })
  await prisma.patient.deleteMany({ where: { id: { in: ids } } })
  console.log(`Removed ${ids.length} demo patients and their records.`)
}

const PEOPLE: [string, string, "MALE" | "FEMALE", number, string][] = [
  ["Arjun", "Nair", "MALE", 34, "Richmond Road"],
  ["Meera", "Krishnan", "FEMALE", 28, "Langford Town"],
  ["Imran", "Sheikh", "MALE", 41, "Shanthi Nagar"],
  ["Priya", "Menon", "FEMALE", 9, "Richmond Town"],
  ["Rahul", "Verma", "MALE", 52, "Wilson Garden"],
  ["Fatima", "Begum", "FEMALE", 63, "Frazer Town"],
  ["Kiran", "Reddy", "MALE", 17, "Cox Town"],
  ["Ananya", "Iyer", "FEMALE", 24, "Ashok Nagar"],
  ["Suresh", "Pillai", "MALE", 46, "Austin Town"],
  ["Zainab", "Khan", "FEMALE", 31, "Shivajinagar"],
  ["Mohan", "Das", "MALE", 70, "Richmond Town"],
  ["Neha", "Gupta", "FEMALE", 12, "Domlur"],
  ["Vikram", "Rao", "MALE", 38, "Indiranagar"],
  ["Sana", "Pasha", "FEMALE", 22, "Benson Town"],
  ["David", "Joseph", "MALE", 29, "Langford Gardens"],
  ["Lakshmi", "Narayan", "FEMALE", 58, "Jayanagar"],
]

// treatment slug -> [bill line, unit price in rupees]. Illustrative demo prices only.
const TX: Record<string, [string, number]> = {
  "check-up-scaling": ["Check-up and scaling", 800],
  "root-canal": ["Root canal treatment (per tooth)", 4500],
  orthodontics: ["Braces: monthly adjustment", 2000],
  "crowns-bridges": ["Zirconia crown (per tooth)", 7000],
  "wisdom-tooth-removal": ["Wisdom tooth removal", 3500],
  "child-dentistry": ["Child check-up and fluoride", 600],
  "aesthetic-dentistry": ["Teeth whitening session", 5000],
  dentures: ["Complete denture (per arch)", 9000],
  aligners: ["Aligner review and tray change", 3000],
}
const SLUGS = Object.keys(TX)

async function main() {
  await cleanup()
  if (RESET_ONLY) return
  const doctor = await prisma.user.findFirst({ where: { role: "DOCTOR", active: true } })
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } })
  const services = await prisma.service.findMany({ where: { slug: { in: SLUGS } } })
  if (!doctor || !services.length) throw new Error("Run `npm run db:seed` first.")
  const svc = Object.fromEntries(services.map((s) => [s.slug, s]))

  let appts = 0
  let bills = 0
  for (const [i, [first, last, gender, age, area]] of PEOPLE.entries()) {
    const patient = await prisma.$transaction(async (tx) => {
      const uhid = await generateUHID(tx)
      return tx.patient.create({
        data: {
          uhid,
          firstName: first,
          lastName: last,
          gender,
          phone: phone(i),
          email: `${first.toLowerCase()}.${last.toLowerCase()}@demo.invalid`,
          dob: new Date(Date.UTC(new Date().getUTCFullYear() - age, (i * 3) % 12, 1 + (i % 27))),
          addressLine1: area,
          city: "Bengaluru",
          state: "Karnataka",
          postalCode: "560025",
          source: "CRM",
          notesSummary: "Demo patient (synthetic data).",
          communicationPreference: { create: { preferredChannel: "SMS" } },
        },
      })
    })

    // 2-3 past completed visits, each billed; most paid in full, some part paid
    const visits = 2 + (i % 2)
    for (let v = 0; v < visits; v++) {
      const slug = SLUGS[(i + v * 2) % SLUGS.length]
      const [desc, price] = TX[slug]
      const when = at(-(5 + v * 19 + i), 10 + ((i + v) % 3), ((i + v) % 2) * 30)
      await prisma.$transaction(async (tx) => {
        const a = await tx.appointment.create({
          data: {
            appointmentCode: await generateAppointmentCode(tx),
            patientId: patient.id,
            doctorId: doctor.id,
            serviceId: svc[slug]?.id,
            scheduledAt: when,
            durationMinutes: 30,
            status: "COMPLETED",
            source: "CRM",
            reason: desc,
            checkedInAt: when,
            startedAt: when,
            completedAt: new Date(when.getTime() + 35 * 60000),
          },
        })
        const qty = slug === "root-canal" || slug === "crowns-bridges" ? 1 + (i % 2) : 1
        const total = price * qty
        const part = (i + v) % 5 === 0
        const paid = part ? Math.round(total * 0.5) : total
        const bill = await tx.bill.create({
          data: {
            billNumber: await generateBillNumber(tx),
            patientId: patient.id,
            appointmentId: a.id,
            serviceId: svc[slug]?.id,
            totalAmount: total,
            netAmount: total,
            amountPaid: paid,
            balanceDue: total - paid,
            status: part ? "PARTIALLY_PAID" : "PAID",
            issuedAt: when,
            items: { create: [{ description: desc, quantity: qty, unitPrice: price, amount: total }] },
          },
        })
        await tx.payment.create({
          data: {
            receiptNumber: await generateReceiptNumber(tx),
            patientId: patient.id,
            billId: bill.id,
            amount: paid,
            method: (["CASH", "UPI", "CARD"] as const)[(i + v) % 3],
            referenceNumber: (i + v) % 3 ? `DEMO${1000 + i * 7 + v}` : null,
            receivedById: admin?.id,
            paidAt: when,
          },
        })
      })
      appts++
      bills++
    }

    // upcoming bookings for about half the patients: today, and later this week
    if (i % 2 === 0) {
      const day = i % 8 === 0 ? 0 : 1 + (i % 5)
      const slug = SLUGS[(i + 1) % SLUGS.length]
      await prisma.$transaction(async (tx) => {
        await tx.appointment.create({
          data: {
            appointmentCode: await generateAppointmentCode(tx),
            patientId: patient.id,
            doctorId: doctor.id,
            serviceId: svc[slug]?.id,
            scheduledAt: at(day, 17 + (i % 3), (i % 2) * 30),
            durationMinutes: 30,
            status: day === 0 ? "CONFIRMED" : "PENDING",
            source: i % 4 === 0 ? "WEBSITE" : "CRM",
            reason: TX[slug][0],
          },
        })
      })
      appts++
    }
    if (i % 5 === 1) {
      await prisma.followUp.create({
        data: { patientId: patient.id, dueDate: at(3 + i, 0), reason: "Review after treatment (demo)", status: "PENDING" },
      })
    }
  }
  console.log(`Created ${PEOPLE.length} demo patients, ${appts} appointments, ${bills} bills with payments.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
