-- ResumeMatch — Pro subscription monthly reset.
--
-- Run once in the Supabase SQL Editor (idempotent). Adds reset_credits, which
-- SETS a user's balance to the plan's monthly quota (rather than adding to it),
-- used when a subscription is paid each cycle so the allowance restarts every
-- month instead of accumulating. Canceling the subscription resets to zero.
--
-- Only the backend (service_role) may call it — same lockdown as the other
-- credit functions in schema.sql.

create or replace function public.reset_credits(
  p_user  uuid,
  p_scans integer default 0,
  p_cvs   integer default 0
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.credits (user_id, scans, cvs, unlimited)
  values (p_user, greatest(p_scans, 0), greatest(p_cvs, 0), false)
  on conflict (user_id) do update
    set scans      = greatest(p_scans, 0),
        cvs        = greatest(p_cvs, 0),
        unlimited  = false,
        updated_at = now();
end;
$$;

revoke execute on function public.reset_credits(uuid, integer, integer)
  from public, anon, authenticated;
grant execute on function public.reset_credits(uuid, integer, integer)
  to service_role;
