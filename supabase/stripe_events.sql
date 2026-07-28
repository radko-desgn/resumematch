-- ResumeMatch — Stripe webhook idempotency.
--
-- Run once in the Supabase SQL Editor (idempotent). Stripe can deliver the same
-- webhook more than once; the backend records each event id here before granting
-- credits and skips any id it has already seen, so a repeated delivery can never
-- double-credit an account.
--
-- Only the backend (service_role, which bypasses RLS) ever touches this table.
-- RLS is enabled with no policies, so anon/authenticated clients see nothing.

create table if not exists public.stripe_events (
  event_id   text        primary key,
  created_at timestamptz not null default now()
);

alter table public.stripe_events enable row level security;
