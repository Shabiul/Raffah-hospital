# Dentizz CRM

Patients, appointments, treatments, payments and website appointment requests for Dentizz
Speciality Dental Care. Next.js + Supabase.

## Run it

```bash
cd CRM
npm install
npm run dev        # http://localhost:3001
```

`.env.local` needs only the project URL and the **publishable** key (see `.env.example`).
Never add the secret key or the database password to this app.

## How access works

- Staff sign in with a Supabase Auth account. Only users listed in `public.staff` can use the CRM,
  so a stranger who signs up in Supabase still sees nothing.
- Every table has Row Level Security that requires `public.is_staff()`.
- The public website can only **insert** a new row into `appointment_requests`; it cannot read
  or change anything.

## Database

`supabase/schema.sql` creates everything and is safe to re-run. Tables: `staff`, `patients`,
`appointments`, `treatments` (charges), `payments`, `appointment_requests`, and the
`patient_balances` view (billed, paid, balance per patient).

## Adding a staff member

1. Supabase dashboard → Authentication → Users → add the user.
2. Run in the SQL editor:

```sql
insert into public.staff (user_id, full_name, role)
select id, 'Full Name', 'staff' from auth.users where email = 'person@example.com';
```

## Pages

- Dashboard: today's appointments, new website requests, dues.
- Appointments: by day, book, mark done / no show / cancel.
- Patients: search, add, edit; each patient has appointments, treatments, payments and balance.
- Website requests: requests from the Dentizz site; "Add patient and book" turns one into a patient.
- Billing: totals and outstanding balances.

Times are shown in India Standard Time.
