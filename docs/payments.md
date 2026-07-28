# Payments (Stripe)

Real Stripe Checkout for the credit packs. Card data is handled entirely by
Stripe's hosted Checkout page — the app never sees it. Credits are granted only
after Stripe confirms payment, via a webhook, so a user can't get credits
without paying and a replayed webhook can't double-credit.

## How it flows

1. Signed-in user clicks a pack → frontend `POST /api/checkout`.
2. Backend creates a Stripe Checkout Session and returns its hosted `url`.
3. Browser is redirected to Stripe, pays, and returns to
   `/?checkout=success` (or `/?checkout=cancel`).
4. Stripe calls `POST /api/stripe/webhook`. The backend verifies the signature,
   records the event id once (idempotency), and grants the pack's credits to the
   user via the `grant_credits` RPC.
5. The success banner polls the balance until the new credits appear.

When Stripe env vars are absent the backend falls back to the **simulated**
checkout (grants immediately, no redirect), so local dev and the demo still work
with no Stripe account.

## Config (backend env)

See `backend/.env.example`. For local dev, copy it to `backend/.env`:

| Var | What |
|-----|------|
| `SUPABASE_URL`, `SUPABASE_SECRET_KEY` | credits ledger + auth (already used) |
| `STRIPE_SECRET_KEY` | `sk_test_…` then `sk_live_…` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` from `stripe listen` (local) or the dashboard endpoint (prod) |
| `STRIPE_PRICE_SINGLE/HUNTER/PRO` | from `python -m backend.stripe_setup` |
| `STRIPE_CURRENCY` | `eur` (matches the Stripe account) |
| `FRONTEND_URL` | where to return after checkout, e.g. `http://localhost:3001` |

The frontend needs no Stripe key — the backend returns the hosted URL and the
browser just follows it.

## One-time database setup

Run these once in the Supabase SQL Editor (both idempotent):
- `supabase/stripe_events.sql` — webhook idempotency table.
- `supabase/pro_subscription.sql` — `reset_credits` for the monthly Pro reset.

The credits table and the other RPCs from `supabase/schema.sql` are already in place.

## Plans

| Pack | Price | Grants | Type |
|------|-------|--------|------|
| Single Scan Pass | €3.99 | +1 scan | one-time |
| Job Hunter Pack | €9.99 | +6 scans, +1 CV | one-time |
| Pro Career Pass | €19.99/mo | 20 scans + 5 CVs, **reset each cycle** | subscription |

The Pro quota **resets** (not accumulates) on every renewal, and zeroes on
cancellation. Webhook actions: one-time → `grant` (add) on
`checkout.session.completed`; subscription → `reset` on `invoice.paid` (initial +
renewals); cancel → `reset` to zero on `customer.subscription.deleted`. The
subscription checkout is skipped on `checkout.session.completed` so credits are
applied in exactly one place.

## Create the products/prices

With the test secret key set:

```bash
STRIPE_SECRET_KEY=sk_test_... python -m backend.stripe_setup
```

Paste the printed `STRIPE_PRICE_*` lines into `backend/.env`.

## Test locally

Three terminals:

```bash
# 1. Backend
uvicorn backend.main:app --reload --port 8000

# 2. Stripe webhook forwarding (Stripe CLI). Copy the whsec_... it prints into
#    STRIPE_WEBHOOK_SECRET in backend/.env, then restart the backend.
stripe listen --forward-to localhost:8000/api/stripe/webhook

# 3. Frontend (full site, not coming-soon)
cd frontend && npm run dev   # .env.local sets NEXT_PUBLIC_COMING_SOON=false
```

Then: sign in on the site → buy a pack → pay with test card **4242 4242 4242
4242**, any future expiry, any CVC → you're redirected back and the credit
balance updates. `stripe listen` and the backend log will show the webhook
grant.

## Going live (later)

1. Activate the Stripe account (ID + Bulgarian IBAN).
2. Re-run `stripe_setup` with the **live** secret key; paste the live price IDs.
3. Add a webhook endpoint in the Stripe dashboard →
   `https://<api-host>/api/stripe/webhook`, event `checkout.session.completed`;
   copy its signing secret to `STRIPE_WEBHOOK_SECRET`.
4. Set all `STRIPE_*` + `FRONTEND_URL=https://resumematch.pro` on Render.
5. Enable Stripe Tax for EU VAT, and finalize the refund/withdrawal wording in
   the legal pages.

## Not yet handled (follow-ups)

- Copy that still says checkout is "simulated / no charge" (FAQ, PlanChoice
  out-of-credits line) needs updating when real charges go live.
- Proration/upgrades between plans aren't special-cased (Stripe handles the
  billing; our reset just applies the current plan's quota on the next invoice).
