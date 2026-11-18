-- Run after every `prisma db push` that adds tables.
-- The CRM connects as the database owner (bypasses RLS). Turning RLS on with NO policies and removing
-- the grants means Supabase's public API keys (anon / authenticated) can never read or write CRM data.
do $$
declare t record;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t.tablename);
    execute format('revoke all on table public.%I from anon, authenticated', t.tablename);
  end loop;
end $$;
revoke all on all sequences in schema public from anon, authenticated;
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
