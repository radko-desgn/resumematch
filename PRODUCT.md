# ResumeMatch — Product & Engineering Context

A single reference for what ResumeMatch is, how it works, how it's built, and
what's left to do. Written for the founder and anyone picking up the project.

_Last updated: 26 July 2026._

---

## 1. What it is

**ResumeMatch** is an AI tool that tells you whether your CV actually fits a job
before you apply. You give it your CV and a job post; it returns:

- an **overall match score** (0–100) with a plain-language verdict,
- an **evidence-backed gap analysis** — every requirement marked met / partial /
  missing, each judgment quoted from your CV,
- **actionable recommendations** (quick wins), and
- a **one-click tailored CV** rewritten for that specific job, downloadable as
  PDF or DOCX.

**Who it's for:** job seekers who are tired of applying blindly and never knowing
if they were close or nowhere near.

**The core promise: nothing is invented.** The scoring is required to cite
evidence from the CV, and the rewrite only rephrases what's already there — it
never fabricates skills, tools, or metrics. This is enforced by the prompt
design and the response schema, not left to chance.

**Live URLs**
- App (frontend): <https://resumematches.vercel.app>
- API (backend): <https://resumematch-api-40kl.onrender.com>
- Repo: <https://github.com/radko-desgn/resumematch>

---

## 2. How it works (user flow)

A four-step wizard:

1. **Add your CV** — paste text, upload a PDF/DOCX, or drop a screenshot (OCR).
2. **Add the job** — paste a link, a PDF, the text, or a screenshot.
3. **Choose your report** — the credit gate happens *before* any heavy analysis:
   - **Free Quick Check ($0)** — an instant percentage match. No account
     required, but it asks for an email (one free scan per address).
   - **Deep AI Analysis (1 credit)** — the full breakdown. Requires an account,
     and the credit is spent server-side.
4. **Results** — the score, verdict, coverage chips, and (paid) the executive
   summary, strengths, gaps, recommendations, tailored CV, and a branded PDF you
   can download or have emailed.

Signed-in users get every scan saved to a **history** they can revisit.

---

## 3. Architecture

```
Browser ── Next.js frontend (Vercel) ────────────────┐
   │  sign in (Supabase JS: email/pw + Google)        │
   │  every paid request carries a Supabase JWT       │
   ▼                                                  ▼
FastAPI backend (Render, Docker)              Supabase (EU region)
   │  verifies JWT against Supabase JWKS       ├─ Auth (users, sessions)
   │  owns all credit spend / grant            └─ Postgres
   ├─ Claude Haiku 4.5  (scoring, rewrite, tailored CV)   ├─ credits
   ├─ fastembed / bge-small (requirement matching)        ├─ free_scans
   └─ Playwright/Chromium (PDF, cards, reel)              └─ scans
```

**Why the split:** the backend needs a real Chromium (Playwright, for PDFs and
image rendering) and an on-device embedding model, so it can't run on Vercel's
serverless functions. The frontend is static/SSR and lives on Vercel; the
backend is a container on Render.

---

## 4. Tech stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 16 (App Router, Turbopack), React, Tailwind CSS v4, shadcn-style UI, Framer Motion |
| Backend | FastAPI (Python 3.12), Uvicorn, Docker |
| LLM | Claude **`claude-haiku-4-5`** via the Anthropic SDK (structured outputs) |
| Embeddings | **`BAAI/bge-small-en-v1.5`** via **fastembed** (ONNX runtime, CPU) |
| Rendering | Playwright + headless Chromium (PDFs, social cards, reel) |
| Auth + DB | Supabase (Postgres + Auth), JWT verified via JWKS (ES256) |
| Hosting | Vercel (frontend), Render (backend), Supabase (data) |
| Fonts/identity | Montserrat (display), Inter (body), JetBrains Mono (data) |

**Design identity:** one monochrome palette — background `#FFFFFF`, foreground
`#0A0A0A`, with `met` green `#12935C` and `missing` red `#D64545` as the only
functional accents. No theme toggle by design; contrast is structural (sections
alternate white and near-black). Motion is deliberately restrained.

---

## 5. The AI engine (`resumematch/`)

Two Claude calls per deep analysis, plus a local embedding match:

- **`analyzer.py`** — `analyze(resume, job, mock, with_rewrites)` and
  `generate_tailored_cv(...)`.
  - **Call 1 — scoring & gap analysis** (`prompts.SCORING_SYSTEM`): returns a
    `ScoreResult` (score, verdict, summary, requirements with met/partial/missing
    + evidence quotes, strengths, critical gaps, quick wins).
  - **Call 2 — bullet rewriting** (`prompts.REWRITE_SYSTEM`): only on the paid
    tier; rephrases existing bullets to mirror the job's language.
  - **Local embedding match** (`embeddings.py`): pairs each requirement with the
    nearest CV chunk by cosine similarity. Runs on-device, no API cost.
  - **Tailored CV** (`prompts.TAILORED_CV_SYSTEM`): a third call, paid only.
- **`schemas.py`** — Pydantic models. Evidence fields are schema-required, so a
  judgment without a quote can't validate — anti-hallucination by construction.
- **`mocks.py`** — canned results for **free/demo mode** (no API key, no cost).
  Used whenever the server has no `ANTHROPIC_API_KEY`.
- **`validation.py`** — refuses to score junk. Two layers: structure checks
  (length, letters-vs-symbols, vowel ratio, repetition) and a topic-similarity
  check against CV/job prototypes. Calibrated so real CVs (including terse
  keyword CVs) pass and gibberish/off-topic text is rejected.

**Mock vs live:** the deployed backend currently runs in **mock mode** (no
Anthropic key), so scores are canned samples and cost nothing. Add
`ANTHROPIC_API_KEY` in Render to switch to real analysis (a few cents per scan).

---

## 6. Backend API (`backend/main.py`)

| Endpoint | Auth | Purpose |
|---|---|---|
| `GET /api/health` | — | status, whether a key/accounts are configured |
| `POST /api/analyze` | optional | run analysis; free tier needs an email, deep tier needs sign-in + spends a credit |
| `GET /api/credits` | required | the user's balance (server is source of truth) |
| `POST /api/checkout` | required | buy a pack (simulated); grants credits to the ledger |
| `GET /api/scans` | required | scan history (summaries) |
| `GET /api/scans/{id}` | required | full stored analysis for review |
| `DELETE /api/scans/{id}` | required | delete one saved scan |
| `DELETE /api/account` | required | delete the account and all its data |
| `POST /api/report/pdf` | — | branded PDF of an analysis |
| `POST /api/report/email` | — | email the branded PDF |
| `POST /api/tailored-cv` | required | generate the tailored CV (spends a CV credit) |
| `POST /api/tailored-cv/export` | — | export the CV as PDF or DOCX |

**Input adapters (`extract.py`):** PDF (`pypdf`), DOCX (`python-docx`), URL
(JSON-LD JobPosting → known containers → fallback), and image OCR.

---

## 7. Accounts & credits

**Auth (`backend/auth.py`, `frontend/lib/auth.tsx`):** Supabase Auth with
email/password and Google. The backend verifies the access token against
Supabase's public JWKS (ES256), so it never needs the JWT secret.

**Credits are server-side and are the entitlement boundary.** The browser holds
a *display cache* only; it can't create or spend credits.

- Tables (`supabase/*.sql`): `credits` (scans, cvs, unlimited per user),
  `free_scans` (per-email free usage + marketing consent), `scans` (saved
  analyses). All have Row-Level Security; users read only their own rows.
- Writes go through `SECURITY DEFINER` SQL functions (`spend_scan`, `spend_cv`,
  `grant_credits`, `claim_free_scan`, `record_scan`) callable only by the backend
  service role. Spending is a single atomic guarded `UPDATE`, so concurrent
  requests can't double-spend or go negative.
- A credit is spent at the moment the expensive call is authorised, with an
  **automatic refund** if generation fails.

### Pricing packs (`frontend/lib/packs.ts`)

| Pack | Price | Grants |
|---|---|---|
| Free Basic Scan | $0 | percentage match only |
| Single Scan Pass | $3.99 | 1 deep scan |
| Job Hunter Pack (popular) | $9.99 | 6 scans + 1 tailored-CV credit |
| Pro Career Pass | $19.99 / mo | unlimited scans + CVs |

### Payments — current state

Checkout is **simulated** (`backend/billing.py`): it returns a
Stripe-Checkout-shaped session but never contacts Stripe and never charges. This
is deliberate — the paid endpoints only became safe to sell once server-side
entitlement existed, and going live also needs a legal/tax setup. Going live is a
single function swap in `billing.py`.

**Before charging real money** (see §12): decide **sole-trader + VAT/OSS** vs a
**merchant-of-record** (Lemon Squeezy / Paddle, which handles EU VAT for you).
No company is required to take payments, but the income is taxable and EU VAT on
digital goods applies from the first sale.

---

## 8. Free-scan gate & GDPR consent

The free Quick Check stays open to anonymous visitors but asks for an email
(**one free scan per address**, counted in Postgres, enforced by the backend —
never the browser). An email address is a soft limit and a lead capture, not a
security control.

Marketing consent is handled the way GDPR requires, not with a clause in the
terms: a **separate, unticked** opt-in checkbox; the scan runs identically
whether or not it's ticked (no coupling, Art. 7(4)); and `consent_at` /
`consent_source` are stored so consent can be demonstrated (Art. 7(1)).

---

## 9. Reports, exports & account management

- **Branded PDF report** (`report.py`) — rendered via Playwright, with the score
  dial and full breakdown. Downloadable or emailed.
- **Email delivery** (`mailer.py`) — Resend or SMTP when configured, with an
  honest simulated fallback otherwise.
- **Tailored CV export** (`cv_export.py`) — real `.pdf` and `.docx`.
- **Account area** (top-right avatar menu): scan history (list → review in a side
  panel), settings (change password, delete account, language placeholder), and
  log out. Delete account removes the Supabase user (credits + scans cascade) and
  erases the free-scan email record.

---

## 10. Marketing assets (all rendered with Playwright)

Same HTML→Chromium pipeline, kept in `backend/`:

- `og_image.py` — 1200×630 social-share card (`/og.png`).
- `social_cards.py` — 3-slide Instagram intro carousel (`docs/social/ig-1..3`).
- `coming_soon.py` — 3-slide "Coming Soon" launch carousel
  (`docs/social/coming-soon-1..3`): centered layout, highlight-chip accents,
  copy drafted with the `social` skill and run through `humanizer`.
- `site_visuals.py` — the landing-page product shots (`frontend/public/visuals`).
- `reel.py` — a vertical 1080×1920 MP4 walkthrough of the real app
  (`docs/social/reel.mp4`), recorded via Playwright video + ffmpeg.

---

## 11. Legal

Draft `/terms` and `/privacy` pages (`frontend/lib/legal.ts`,
`components/legal/`), branded to match the site. They describe what the app
actually does and are written to GDPR (EU/Bulgaria operator). **They are clearly
marked placeholders**: a "not legal advice" banner, `[PLACEHOLDER]` for every
company detail, `[⚠️ LEGAL REVIEW REQUIRED]` on clauses a lawyer must set, and
both pages are `noindex`. Fill the placeholders and get a review before launch.

---

## 12. Deployment & configuration

**Frontend (Vercel):** import the repo, set **Root Directory = `frontend`**.
**Backend (Render):** Docker web service from the repo root (`Dockerfile`).

### Environment variables

| Where | Key | Notes |
|---|---|---|
| Vercel | `NEXT_PUBLIC_API_URL` | backend URL (also has a hardcoded prod default) |
| Vercel | `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public by design |
| Render | `SUPABASE_URL` | must be `...supabase.co` (not `.com`) |
| Render | `SUPABASE_SECRET_KEY` | service role — **secret** |
| Render | `FRONTEND_ORIGINS` | CORS allow-list, e.g. the Vercel URL |
| Render | `ANTHROPIC_API_KEY` | optional; enables live AI |
| Render | `RESEND_API_KEY` | optional; enables real email |

The SQL in `supabase/` (`schema.sql`, `free_scans.sql`, `scans.sql`) must be run
once in the Supabase SQL editor.

### Known limitation

Render's **free tier (~0.1 CPU, tight memory)** makes each scan take ~15s and
cold-starts after idle. Fine for a demo; move to a small paid instance
(~$7–25/mo) before real users.

---

## 13. Repository layout

```
resumematch/       AI engine (analyzer, prompts, schemas, embeddings, mocks, validation)
backend/           FastAPI app + input extraction + rendering (PDF, cards, reel) + billing/auth/credits/history
frontend/          Next.js app (landing, wizard, account, legal, lib)
supabase/          SQL: credits, free_scans, scans + RLS + functions
evals/             golden set + LLM-as-judge harness
docs/social/       marketing images + reel
Dockerfile         backend container (Playwright base + baked model)
```

### Run locally

```bash
# backend
uvicorn backend.main:app --reload --port 8000     # mock mode without ANTHROPIC_API_KEY
# frontend
cd frontend && npm run dev                          # talks to localhost:8000 in dev
```

---

## 14. Security notes

- Credits/entitlement are enforced **server-side**; the client cannot grant or
  spend. RLS lets users read only their own rows.
- The mutation functions are `SECURITY DEFINER` with `EXECUTE` revoked from
  `public`/`anon`/`authenticated` and granted only to `service_role`. (An earlier
  version revoked only from `anon`/`authenticated`, which inherit the `PUBLIC`
  grant — that hole let a signed-in user grant themselves credits and was found
  and closed during testing.)
- The Supabase publishable/anon key is meant to be public; the service-role key
  and any API keys live only in Render's environment, never in the repo.

---

## 15. Status & roadmap

**Done and live:** landing site, 4-step wizard, mock analysis, accounts (email +
Google), server-side credits, scan history, settings/delete-account, garbage-input
protection, free-scan email gate, branded PDF + DOCX export, draft legal pages,
marketing assets (OG, carousels, reel).

**Left to do (recommended order):**
1. **Domain** — buy it, connect to Vercel, add to Supabase redirect list + CORS.
2. **Real email** (needs the domain) — verify in Resend, re-enable signup
   confirmation.
3. **Live AI** — add `ANTHROPIC_API_KEY` in Render.
4. **Backend upgrade** — small always-on Render instance.
5. **Publish Google consent screen** (currently in "Testing" — only test users
   can sign in).
6. **Payments** — build in Stripe test mode now; go live after the accountant
   decision (sole-trader+VAT vs merchant-of-record).
7. **Finalize legal** — fill placeholders, get a review, remove `noindex`.

---

## 16. Cost summary

- Frontend (Vercel): **$0**.
- AI: **$0** in demo mode; a few cents/scan when live.
- Backend host: free tier $0 (slow) or ~$7–25/mo (recommended).
- Supabase: free tier is enough to start.
- Payments (when live): no Stripe setup/monthly fee; ~1.5% + €0.25 per EU card,
  or ~5% via a merchant-of-record that handles VAT.
