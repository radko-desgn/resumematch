-- ResumeMatch — credits ledger and entitlement.
--
-- Run this once in the Supabase SQL Editor (it is idempotent, so re-running is
-- safe after edits).
--
-- Design notes:
--   * Users may READ their own balance and nothing else. There is deliberately
--     no insert/update/delete policy, so a browser holding the publishable key
--     cannot grant itself credits — every mutation goes through the SECURITY
--     DEFINER functions below, which only the backend (holding the secret key)
--     can invoke.
--   * Spending is a single atomic UPDATE guarded by a WHERE clause, so two
--     concurrent requests can never drive a balance negative or double-spend
--     the last credit.

-- ---------------------------------------------------------------- table
create table if not exists public.credits (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  scans      integer     not null default 0 check (scans >= 0),
  cvs        integer     not null default 0 check (cvs >= 0),
  unlimited  boolean     not null default false,
  updated_at timestamptz not null default now()
);

alter table public.credits enable row level security;

drop policy if exists "read own credits" on public.credits;
create policy "read own credits"
  on public.credits for select
  using (auth.uid() = user_id);

-- ------------------------------------------------- auto-provision on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.credits (user_id) values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill anyone who signed up before this ran.
insert into public.credits (user_id)
select id from auth.users
on conflict (user_id) do nothing;

-- ------------------------------------------------------------ spend / grant
-- Returns true only if a credit was actually consumed. Unlimited plans always
-- succeed without decrementing.
create or replace function public.spend_scan(p_user uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare ok boolean;
begin
  update public.credits
     set scans = case when unlimited then scans else scans - 1 end,
         updated_at = now()
   where user_id = p_user
     and (unlimited or scans > 0)
  returning true into ok;
  return coalesce(ok, false);
end;
$$;

create or replace function public.spend_cv(p_user uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare ok boolean;
begin
  update public.credits
     set cvs = case when unlimited then cvs else cvs - 1 end,
         updated_at = now()
   where user_id = p_user
     and (unlimited or cvs > 0)
  returning true into ok;
  return coalesce(ok, false);
end;
$$;

-- Applied after a completed checkout. Additive, so repeat purchases stack.
create or replace function public.grant_credits(
  p_user      uuid,
  p_scans     integer default 0,
  p_cvs       integer default 0,
  p_unlimited boolean default false
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.credits (user_id, scans, cvs, unlimited)
  values (p_user, greatest(p_scans, 0), greatest(p_cvs, 0), p_unlimited)
  on conflict (user_id) do update
    set scans      = public.credits.scans + greatest(p_scans, 0),
        cvs        = public.credits.cvs + greatest(p_cvs, 0),
        unlimited  = public.credits.unlimited or p_unlimited,
        updated_at = now();
end;
$$;

-- Lock the functions down to the backend.
--
-- CREATE FUNCTION grants EXECUTE to PUBLIC by default, and anon/authenticated
-- inherit that. Revoking from those two roles alone is therefore useless — the
-- PUBLIC grant has to go, then execute is handed back to service_role only.
-- Without this, any signed-in user could call grant_credits() with their own id
-- and award themselves unlimited credits.
revoke execute on function public.spend_scan(uuid)  from public, anon, authenticated;
revoke execute on function public.spend_cv(uuid)    from public, anon, authenticated;
revoke execute on function public.grant_credits(uuid, integer, integer, boolean)
  from public, anon, authenticated;

grant execute on function public.spend_scan(uuid)  to service_role;
grant execute on function public.spend_cv(uuid)    to service_role;
grant execute on function public.grant_credits(uuid, integer, integer, boolean)
  to service_role;
