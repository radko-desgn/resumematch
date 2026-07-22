# Roadmap: ResumeMatch

## Overview

ResumeMatch grows from a paste-in MVP (score + gap analysis + bullet rewriting) into a portfolio-grade AI product: an evaluated, observable, RAG-style analyzer with live job data, a polished UI, and a public launch. The journey deliberately front-loads the working core, then layers on the "senior signal" pieces (eval + LLMOps), then data/persistence, then design and launch.

## PIVOT (2026-07-20)

The UI direction changed from a Streamlit app to a full-stack **Next.js + Tailwind +
shadcn/ui** multi-step wizard with a **FastAPI** backend wrapping the existing Python
engine. The engine (analyze, schemas, prompts, embeddings, mock mode) is unchanged.
The Streamlit UI (app.py, resumematch/ui, plan 01-02) is now **legacy/superseded**.
New milestone **v0.2 Wizard UX** supersedes the Streamlit UI work.

## Current Milestone

**v0.2 Wizard UX — Full-Stack** (v0.2.0)
Status: ✅ SHIPPED (2026-07-21) — see .paul/phases/02-wizard-ux/02-SUMMARY.md
Delivered: 4-step wizard (CV → Job → Processing → Tiered results) on Next.js + Tailwind
+ FastAPI, simulated Free/Paid ($10) paywall, Claude-vision OCR (stubbed in mock),
full landing page, and a monochrome black&white editorial redesign (mobile-first).

Phases (all ✅ complete):
- A. **Backend API** — FastAPI `/api/analyze` + input adapters (text, PDF, DOCX, URL, image/vision), mock mode. ✅
- B. **Frontend shell** — Next.js + Tailwind + shadcn-style wizard shell (Step X of 4, state, back/edit, transitions). ✅
- C. **Steps 1 & 2** — CV + Job tabbed multi-source inputs with validation, sample-fill. ✅
- D. **Step 3** — animated processing (radar + staged checklist + progress). ✅
- E. **Step 4** — tiered results (Free gauge/locked/CTA vs Paid full breakdown), simulated unlock. ✅
- (+ Landing page, monochrome redesign, spacing pass, form polish.) ✅

All input adapters since verified e2e (text, PDF, DOCX, URL); live Claude path verified.

### Legacy — v0.1 MVP Core (engine SHIPPED, Streamlit UI superseded)
- Phase 1 plan 01-01 (headless engine) — ✅ done, still the core.
- Phase 1 plan 01-02 (Streamlit UI) — superseded by v0.2 (kept as legacy in app.py).

## v0.2.x — Post-milestone work (all ✅ SHIPPED)

Delivered after the v0.2 summary was written, outside the formal loop:

| Item | Status |
|------|--------|
| Branded PDF match report (Chromium render) + email delivery (Resend/SMTP) | ✅ |
| One-click **Tailored CV generator** — 3rd Claude call, ATS rules, live preview, .pdf/.docx export | ✅ |
| Pay-first tiering — plan chosen before scanning; free tier skips the rewrite call (~half cost) | ✅ |
| Free/live analysis toggle with spend protection (defaults free, disabled without a key) | ✅ |
| Targeted job-description extraction (JSON-LD → known containers → fallback) + fail-loud guard | ✅ |
| Real logo + favicon; monochrome black/white identity (Montserrat/Inter) | ✅ |
| Input adapters verified e2e (PDF, DOCX, URL); live Claude path verified (0 fabrication violations) | ✅ |
| Full mobile/responsive pass (overflow, stacking, tap targets) | ✅ |
| `/preview/results` design sandbox with real example data | ✅ |
| Portfolio README with screenshots + engineering rationale | ✅ |

## Planned milestones

| # | Milestone | Effort | Depends on | Status |
|---|-----------|--------|------------|--------|
| **v0.3** | **Payments & Entitlement (Stripe)** | ~1.5–2 days | — | 📋 Planned |
| **v0.4** | **Eval & LLMOps** | ~1 week | analysis pipeline | 📋 Planned |
| **v0.5** | Data & live job search | ~3–4 days | v0.3 persistence | 📋 Optional |
| **v0.6** | Launch & write-up | ~2–3 days | v0.4 | 📋 Planned |

### v0.3 — Payments & Entitlement (Stripe)

**Why now:** the paid tier is currently client-side state. `POST /api/analyze` with
`full=true`, `/api/tailored-cv`, and `/api/report/*` are unauthenticated — anyone can
call them directly. Server-side entitlement is needed regardless of payment provider;
Stripe is the smaller half of this milestone.

**Scope:**
- **Persistence (SQLite → Postgres later):** `purchases` table — id, status, inputs, result, consumed_at.
- **Server-side gating:** paid endpoints require a paid, unconsumed purchase. Never trust the client.
- **Stripe Checkout:** `POST /api/checkout` creates a session (one-time $10) storing inputs against a purchase id.
- **Webhook:** `POST /api/stripe/webhook` — signature-verified, idempotent (Stripe retries), handles `checkout.session.completed`.
- **Do not unlock from the success redirect** — it's forgeable; trust the webhook / `Session.retrieve`.
- **Test mode only** initially: full implementation, test cards, Stripe CLI webhook forwarding, zero real money.

**Deliberately deferred to "go live" (admin, not code):** business verification, EU VAT/OSS
registration, Terms/Privacy/refund pages, public HTTPS deployment.
Fees when live: EEA cards ~1.5% + €0.25 (≈€0.40 on a €10 sale).

### v0.4 — Eval & LLMOps

The milestone that makes this read as an AI-engineering project rather than a polished UI,
and the one gap the README currently admits to.

**Scope:** ~20-case golden set · LLM-as-judge (faithfulness, evidence-grounding, calibration,
no-fabrication) · CI-style score report · Langfuse tracing · per-analysis cost/latency.
Buildable against mock mode for free; a few dollars of API spend to score for real.

## Legacy phase table (superseded by the milestones above)

| Phase | Name | Status |
|-------|------|--------|
| 1 | MVP Core (engine) | ✅ shipped (Streamlit UI superseded) |
| 2 | Eval & LLMOps | → now v0.4 |
| 3 | Data & Persistence | → folded into v0.3 / v0.5 |
| 4 | Design Polish | ✅ shipped ad-hoc (monochrome redesign, logo, mobile) |
| 5 | Launch & Write-up | → now v0.6 (README done) |

## Phase Details

### Phase 1: MVP Core (score + gaps + rewrites)

**Goal:** A working Streamlit app where a user pastes a resume + job posting and gets a calibrated fit score, an evidence-backed gap analysis, and rewritten bullets — all via schema-validated Claude calls plus local embedding matching.
**Depends on:** Nothing (first phase)
**Research:** Unlikely (patterns known; Claude wiring covered by claude-api skill)

**Scope:**
- Project scaffold (Python env, config, secrets handling)
- Scoring + gap-analysis prompt call (structured JSON output)
- Bullet-rewriting prompt call (structured JSON output)
- Local `bge-small` embedding match: requirements ↔ resume chunks
- Basic Streamlit UI (two text areas, results view with score + gaps + before/after bullets)

### Phase 2: Eval & LLMOps

**Goal:** Prove and monitor quality — a hand-built golden set, an LLM-as-judge harness, Langfuse tracing, and per-analysis cost tracking. This is the "senior signal" milestone.
**Depends on:** Phase 1 (needs the working analysis pipeline)
**Research:** Likely (Langfuse integration, judge rubric design)
**Research topics:** Langfuse Python SDK wiring; LLM-judge rubric + scoring schema

**Scope:**
- Golden set (~20 resume/job pairs with known-correct verdicts)
- LLM-as-judge harness (faithfulness, evidence-grounding, calibration)
- Langfuse tracing on every LLM call
- Per-analysis cost + latency tracking
- CI-style eval run script + score report

### Phase 3: Data & Persistence

**Goal:** Move beyond paste-in — integrate live job search and persist analysis history for semantic recall.
**Depends on:** Phase 1 (analysis pipeline), Phase 2 (eval to guard regressions)
**Research:** Likely (external job APIs)
**Research topics:** Adzuna/Jooble API auth + rate limits; pgvector setup

**Scope:**
- Adzuna/Jooble job-search integration (search real jobs in-app)
- Postgres + pgvector for storing past analyses
- Semantic recall of prior analyses / jobs

### Phase 4: Design Polish

**Goal:** Make it look like a real product — distinctive UI, a proper score gauge, and marketing visuals.
**Depends on:** Phase 1 (something to style)
**Research:** Unlikely (design skills available: frontend-design, dataviz, image, theme-factory)

**Scope:**
- frontend-design pass on the UI (not default Streamlit gray)
- dataviz score gauge + matched/missing charts
- Hero image + OG/social share image + simple logo
- Consistent theme (colors/fonts)

### Phase 5: Launch & Write-up

**Goal:** Ship it publicly and tell the story — the part that converts the build into portfolio value.
**Depends on:** Phases 1-4
**Research:** Unlikely (marketing skills available: copywriting, humanizer, free-tools, launch, social, content-strategy, ai-seo, product-marketing)

**Scope:**
- README / case-study copy ("what it does, why it matters, how it's built")
- Technical write-up / blog post ("building an evaluated RAG system")
- LinkedIn build-in-public posts
- Product Hunt / Show HN launch checklist

---
*Roadmap created: 2026-07-20*
*Last updated: 2026-07-20*
