-- Free-scan usage, keyed by email address.
--
-- Run this once in the Supabase SQL Editor (idempotent).
--
-- Purpose: the free quick check stays open to people without an account, but
-- each email address gets a limited number of them. Enforcement lives here and
-- in the backend; the browser is never asked to keep count.
--
-- Honest about the limits: an email address is not identity. Nothing here
-- stops someone using a second address, and it is not meant to — it stops the
-- same person refreshing for unlimited free deep-ish scans, and it gives a
-- lawful record of who asked for what.
--
-- GDPR notes, deliberately encoded in the schema:
--   * marketing_consent defaults to FALSE. Consent must be an affirmative act,
--     so the column can only become true if the user ticked the box.
--   * consent_at / consent_source record WHEN and WHERE consent was given,
--     which is what "demonstrate consent" (Art. 7(1)) actually requires.
--   * Storing the address is necessary to deliver the free scan and enforce the
--     limit — a separate lawful basis from marketing, which is why the two are
--     separate columns rather than one flag.

create table if not exists public.free_scans (
  email            text        primary key,
  scans_used       integer     not null default 0 check (scans_used >= 0),
  marketing_consent boolean    not null default false,
  consent_at       timestamptz,
  consent_source   text,
  first_seen       timestamptz not null default now(),
  last_used        timestamptz not null default now()
);

alter table public.free_scans enable row level security;
-- No policies at all: this table is reachable only via the service role.
-- Email addresses are not readable by anon or authenticated clients.

-- How many free scans one address gets before it has to sign up.
create or replace function public.free_scan_limit()
returns integer language sql immutable as $$ select 1 $$;

-- Claim one free scan for an address.
-- Returns the row so the caller can report remaining quota in one round trip.
create or replace function public.claim_free_scan(
  p_email    text,
  p_consent  boolean default false,
  p_source   text default 'free-scan'
)
returns table (allowed boolean, scans_used integer, scans_left integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  norm  text := lower(btrim(p_email));
  limit_ integer := public.free_scan_limit();
  used  integer;
begin
  insert into public.free_scans as f (email, marketing_consent, consent_at, consent_source)
  values (
    norm,
    coalesce(p_consent, false),
    case when p_consent then now() else null end,
    case when p_consent then p_source else null end
  )
  on conflict (email) do update
     set -- consent is sticky once given, and only ever set by an affirmative act
         marketing_consent = f.marketing_consent or coalesce(p_consent, false),
         consent_at        = case
                               when f.marketing_consent then f.consent_at
                               when p_consent then now()
                               else f.consent_at
                             end,
         consent_source    = case
                               when f.marketing_consent then f.consent_source
                               when p_consent then p_source
                               else f.consent_source
                             end
  returning f.scans_used into used;

  if used >= limit_ then
    return query select false, used, 0;
    return;
  end if;

  update public.free_scans
     set scans_used = scans_used + 1,
         last_used  = now()
   where email = norm
  returning scans_used into used;

  return query select true, used, greatest(limit_ - used, 0);
end;
$$;

-- Withdrawing consent must be possible and must be as easy as giving it.
create or replace function public.set_marketing_consent(p_email text, p_consent boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.free_scans
     set marketing_consent = p_consent,
         consent_at        = case when p_consent then now() else consent_at end
   where email = lower(btrim(p_email));
end;
$$;

-- Backend only. CREATE FUNCTION grants EXECUTE to PUBLIC and anon/authenticated
-- inherit it, so revoking from those roles alone would be a no-op.
revoke execute on function public.claim_free_scan(text, boolean, text)
  from public, anon, authenticated;
revoke execute on function public.set_marketing_consent(text, boolean)
  from public, anon, authenticated;
revoke execute on function public.free_scan_limit() from public, anon, authenticated;

grant execute on function public.claim_free_scan(text, boolean, text) to service_role;
grant execute on function public.set_marketing_consent(text, boolean) to service_role;
grant execute on function public.free_scan_limit() to service_role;
