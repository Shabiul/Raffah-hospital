-- Dentizz CRM schema. Safe to re-run.
-- Access model: only users listed in public.staff can read or write anything.
-- The website can only INSERT into appointment_requests (anon role), nothing else.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- staff
create table if not exists public.staff (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  full_name  text not null,
  role       text not null default 'staff' check (role in ('admin', 'staff')),
  created_at timestamptz not null default now()
);

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.staff where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------- patients
create table if not exists public.patients (
  id         uuid primary key default gen_random_uuid(),
  full_name  text not null check (length(trim(full_name)) > 0),
  phone      text not null check (length(trim(phone)) > 0),
  age        int  check (age between 0 and 120),
  sex        text check (sex in ('Male', 'Female', 'Other')),
  address    text,
  notes      text,
  created_at timestamptz not null default now()
);
create index if not exists patients_name_idx  on public.patients (lower(full_name));
create index if not exists patients_phone_idx on public.patients (phone);

-- ---------------------------------------------------------------- appointments
create table if not exists public.appointments (
  id           uuid primary key default gen_random_uuid(),
  patient_id   uuid not null references public.patients (id) on delete cascade,
  scheduled_at timestamptz not null,
  reason       text,
  status       text not null default 'scheduled'
               check (status in ('scheduled', 'completed', 'cancelled', 'no_show')),
  notes        text,
  created_at   timestamptz not null default now()
);
create index if not exists appointments_when_idx    on public.appointments (scheduled_at);
create index if not exists appointments_patient_idx on public.appointments (patient_id);

-- ---------------------------------------------------------------- treatments (charges)
create table if not exists public.treatments (
  id             uuid primary key default gen_random_uuid(),
  patient_id     uuid not null references public.patients (id) on delete cascade,
  appointment_id uuid references public.appointments (id) on delete set null,
  procedure      text not null check (length(trim(procedure)) > 0),
  tooth          text,
  amount         numeric(10, 2) not null check (amount >= 0),
  treated_on     date not null default current_date,
  notes          text,
  created_at     timestamptz not null default now()
);
create index if not exists treatments_patient_idx on public.treatments (patient_id);

-- ---------------------------------------------------------------- payments
create table if not exists public.payments (
  id         uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  amount     numeric(10, 2) not null check (amount > 0),
  method     text not null default 'Cash' check (method in ('Cash', 'UPI', 'Card', 'Other')),
  paid_on    date not null default current_date,
  notes      text,
  created_at timestamptz not null default now()
);
create index if not exists payments_patient_idx on public.payments (patient_id);

-- ---------------------------------------------------------------- website requests
create table if not exists public.appointment_requests (
  id             uuid primary key default gen_random_uuid(),
  name           text not null check (length(trim(name)) between 1 and 120),
  phone          text not null check (length(trim(phone)) between 5 and 20),
  preferred_date date,
  reason         text check (reason is null or length(reason) <= 1000),
  source         text not null default 'website',
  status         text not null default 'new'
                 check (status in ('new', 'contacted', 'booked', 'dismissed')),
  created_at     timestamptz not null default now()
);
create index if not exists requests_status_idx on public.appointment_requests (status, created_at desc);

-- ---------------------------------------------------------------- balances view
create or replace view public.patient_balances
with (security_invoker = true) as
select
  p.id as patient_id,
  p.full_name,
  p.phone,
  coalesce((select sum(t.amount) from public.treatments t where t.patient_id = p.id), 0) as billed,
  coalesce((select sum(y.amount) from public.payments y where y.patient_id = p.id), 0)   as paid,
  coalesce((select sum(t.amount) from public.treatments t where t.patient_id = p.id), 0)
  - coalesce((select sum(y.amount) from public.payments y where y.patient_id = p.id), 0) as balance
from public.patients p;

-- ---------------------------------------------------------------- row level security
alter table public.staff                enable row level security;
alter table public.patients             enable row level security;
alter table public.appointments         enable row level security;
alter table public.treatments           enable row level security;
alter table public.payments             enable row level security;
alter table public.appointment_requests enable row level security;

do $$
declare t text;
begin
  foreach t in array array['patients', 'appointments', 'treatments', 'payments', 'appointment_requests']
  loop
    execute format('drop policy if exists "staff full access" on public.%I', t);
    execute format(
      'create policy "staff full access" on public.%I for all to authenticated using (public.is_staff()) with check (public.is_staff())',
      t);
  end loop;
end $$;

drop policy if exists "staff read staff" on public.staff;
create policy "staff read staff" on public.staff
  for select to authenticated using (public.is_staff());

-- The public website may only add a new request, never read or change anything.
drop policy if exists "website can request" on public.appointment_requests;
create policy "website can request" on public.appointment_requests
  for insert to anon
  with check (status = 'new' and source = 'website');

-- ---------------------------------------------------------------- privileges
revoke all on all tables in schema public from anon, authenticated;
grant select, insert, update, delete on public.patients, public.appointments,
  public.treatments, public.payments, public.appointment_requests to authenticated;
grant select on public.staff, public.patient_balances to authenticated;
grant insert on public.appointment_requests to anon;
grant execute on function public.is_staff() to authenticated;
