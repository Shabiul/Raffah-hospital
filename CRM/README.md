# Dentizz CRM

Staff-facing app for Dentizz Speciality Dental Care: patients (ID `DZ-YYYY-NNNNNN`), appointments and queue,
consultations and records, prescriptions, billing and refunds, inventory, finance, follow-ups, letterhead PDFs,
and the public booking API used by the website. Next.js (App Router) + Prisma 7 + Postgres (Supabase), shadcn/ui.

Based on the Lumi Hospitals CRM, rebranded and re-seeded for Dentizz.

## Run it
```bash
npm install
cp .env.example .env      # fill DATABASE_URL (Supabase session-pooler URL, port 5432)
npx prisma db push        # create tables
npm run db:seed           # clinic data + staff accounts (passwords printed ONCE)
npm run dev               # http://localhost:3001
```

Clinic data lives in `prisma/dentizz-data.json`; edit it and re-run `npm run db:seed`
(existing staff passwords are kept).

## Public booking API (used by the website)
`GET /api/public/services` · `GET /api/public/doctors` · `GET /api/public/availability?doctorId&date` ·
`POST /api/public/appointments`. Set `PUBLIC_SITE_ORIGIN` (comma-separated site origins) for CORS.

## Roles
ADMIN, DOCTOR, RECEPTIONIST, BILLING. The dentist account is `dr-abdul-azeez@dentizz.in`.

## Database safety
Prisma connects as the database owner. Row Level Security is switched on for every table with no
policies (see `prisma/secure-supabase.sql`) so the public Supabase API keys can never read patient data.
Run that file again after any `prisma db push` that adds tables.
