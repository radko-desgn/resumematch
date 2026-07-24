-- Saved scans, so a signed-in user can revisit past analyses.
--
-- Run once in the Supabase SQL Editor (idempotent).
--
-- The full analysis payload is stored as JSON so a scan can be re-rendered
-- exactly as it first appeared, including the CV/job source. That source is
-- personal data (a CV may contain special-category data), so:
--   * rows are readable and deletable only by their owner (RLS below);
--   * they cascade-delete when the account is deleted;
--   * inserts happen only through the backend's service role — the browser
--     can read its own history but cannot forge entries.

create table if not exists public.scans (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  tier       text        not null default 'free',   -- 'free' | 'paid'
  score      integer,
  verdict    text,
  summary    text,
  analysis   jsonb       not null,                   -- the full result payload
  cv_chars   integer,
  job_chars  integer
);

create index if not exists scans_user_created_idx
  on public.scans (user_id, created_at desc);

alter table public.scans enable row level security;

drop policy if exists "read own scans" on public.scans;
create policy "read own scans"
  on public.scans for select
  using (auth.uid() = user_id);

drop policy if exists "delete own scans" on public.scans;
create policy "delete own scans"
  on public.scans for delete
  using (auth.uid() = user_id);

-- No insert/update policy: writes come from the backend only, through the
-- function below — the same SECURITY DEFINER pattern the credits ledger uses,
-- which sidesteps any table-level grant differences for a direct insert.
create or replace function public.record_scan(
  p_user     uuid,
  p_tier     text,
  p_score    integer,
  p_verdict  text,
  p_summary  text,
  p_analysis jsonb,
  p_cv_chars integer,
  p_job_chars integer
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare new_id uuid;
begin
  insert into public.scans (user_id, tier, score, verdict, summary, analysis, cv_chars, job_chars)
  values (p_user, p_tier, p_score, p_verdict, p_summary, p_analysis, p_cv_chars, p_job_chars)
  returning id into new_id;
  return new_id;
end;
$$;

revoke execute on function
  public.record_scan(uuid, text, integer, text, text, jsonb, integer, integer)
  from public, anon, authenticated;
grant execute on function
  public.record_scan(uuid, text, integer, text, text, jsonb, integer, integer)
  to service_role;
