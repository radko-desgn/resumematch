# ResumeMatch

## What This Is

ResumeMatch is an AI-powered resume-to-job-fit analyzer. A user pastes in their resume and a job posting, and the app returns a calibrated fit score, a matched-vs-missing skills gap analysis (each requirement backed by evidence quoted from the resume), and rewritten resume bullet points tailored to that specific job — without fabricating experience. It is built as a portfolio project that demonstrates production-grade AI engineering patterns (RAG-style retrieval, embeddings, structured LLM outputs, an evaluation harness, and LLMOps), not just an API wrapper.

## Core Value

Job seekers get an instant, evidence-based read on how well they fit a specific job and concrete, honest edits to close the gap — in seconds instead of hours.

## Current State

| Attribute | Value |
|-----------|-------|
| Type | Application (full-stack: Next.js + FastAPI) |
| Version | 0.2.0 |
| Status | Beta (functional, mock-mode by default) |
| Last Updated | 2026-07-21 |

## Requirements

### Core Features

- Paste-in resume + job posting, get a calibrated **fit score** (0-100)
- **Gap analysis**: each job requirement tagged must-have/nice-to-have and met/partial/missing, with evidence quoted from the resume
- **Bullet rewriting**: tailor existing resume bullets to the target job with a before/after diff and rationale, no fabrication
- **Semantic matching** of requirements to resume content via local embeddings (RAG-style retrieval)
- **Evaluation harness**: golden set + LLM-as-judge to measure quality over time
- **Observability**: tracing + per-analysis cost tracking

### Validated (Shipped)
- [x] Headless analysis engine (score + evidence gap analysis + no-fabrication rewrites) — v0.1
- [x] Free `--mock` mode (no key, no cost) — v0.1
- [x] FastAPI backend `/api/analyze` wrapping the engine + input adapters (text/PDF/DOCX/URL/vision) — v0.2
- [x] Next.js 4-step wizard (CV → Job → Processing → Tiered results) with tabbed multi-source inputs — v0.2
- [x] Tiered Free/Paid ($10 simulated) results with count-up gauge, coverage chips, copy actions — v0.2
- [x] Landing page (hero+wizard, How It Works, Benefits, FAQ, footer) — v0.2
- [x] Monochrome black&white editorial identity (Montserrat/Inter), mobile-first — v0.2

### Active (In Progress)
None — v0.2 shipped. Next: verify PDF/URL adapters live, then v0.3 Eval & LLMOps.

### Planned (Next)
- Milestone v0.1 (MVP): scoring + gap analysis + bullet rewriting in a basic Streamlit UI
- Milestone v0.2: eval harness + LLMOps (Langfuse, cost tracking)
- Milestone v0.3: live job-search API (Adzuna/Jooble) + pgvector history
- Milestone v0.4: design polish (frontend-design, dataviz score gauge, hero/OG images)
- Milestone v0.5: launch + write-up (README/case study, LinkedIn build-in-public, Product Hunt/Show HN)

### Out of Scope
- Paid advertising / heavy SEO campaigns — overkill for a portfolio piece
- User accounts / multi-tenant auth — not needed for the portfolio goal (revisit only if it becomes a real product)
- Resume file parsing (PDF/DOCX) in MVP — start with paste-in text, add parsing later if time allows

## Target Users

**Primary:** The builder — a mid-level SWE (2-6 YOE) pivoting into an AI engineering role, using this as a portfolio project.
- Needs a demonstrably production-grade system, not a demo
- Optimizing for hiring managers / AI-eng interviewers as the real audience

**Secondary:** Actual job seekers who paste a resume + job posting.
- Want an honest fit score and concrete, non-fabricated resume edits fast

## Context

**Business Context:**
Portfolio project to help land an AI engineering role in the 2026 market. Success is measured by portfolio impact (demo quality, write-up, public traction), not revenue.

**Technical Context:**
Solo engineer, part-time. Cost must stay near zero (~$0-30 total) by using local HuggingFace embeddings and cheap Claude Haiku 4.5 calls. Free tiers for DB, hosting, tracing.

## Constraints

### Technical Constraints
- Cost near zero: local `bge-small` embeddings (free), Claude Haiku 4.5 (~1.5¢/analysis), free-tier DB/hosting/tracing
- LLM outputs must be strict, schema-validated JSON (structured outputs) for reliable parsing
- Anti-hallucination is a hard requirement: every judgment must cite resume evidence; no invented experience or metrics

### Business Constraints
- Solo engineer, ~15-20 hrs/week
- Timeline: working MVP in ~1 week part-time; polished portfolio version in ~1 month

## Key Decisions

| Decision | Rationale | Date | Status |
|----------|-----------|------|--------|
| Claude Haiku 4.5 for scoring/rewriting | Cheap ($1/$5 per MTok) and smart enough; keeps cost near zero | 2026-07-20 | Active |
| Local `bge-small` embeddings | Free, runs locally, good enough for requirement↔resume matching | 2026-07-20 | Active |
| Streamlit for MVP UI | Fastest path to a working end-to-end app | 2026-07-20 | Active |
| Structured outputs (schema-validated JSON) | Reliable parsing + anti-hallucination guardrails | 2026-07-20 | Active |
| Downscope from ThreatLens to ResumeMatch | ThreatLens too complex for solo 1-month build; ResumeMatch is finishable and relatable | 2026-07-20 | Active |

## Success Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Working MVP end-to-end | Paste → score + gaps + rewrites | - | Not started |
| Eval accuracy on golden set (LLM-judge) | ≥ 90% reasonable verdicts | - | Not started |
| Zero fabricated experience in rewrites | 0 across eval set | - | Not started |
| Cost per full analysis | ≤ 3¢ | - | Not started |
| Public launch + write-up shipped | Product Hunt/Show HN + case study | - | Not started |

## Tech Stack / Tools

| Layer | Technology | Notes |
|-------|------------|-------|
| Language | Python | Core app |
| UI | Streamlit | MVP; upgrade later if desired |
| LLM | Claude Haiku 4.5 (`claude-haiku-4-5`) | Scoring, gap analysis, bullet rewriting |
| Embeddings | HuggingFace `bge-small` (local) | Semantic requirement↔resume matching |
| Vector store | pgvector on Postgres | Later milestone: analysis history |
| Observability | Langfuse | Tracing + cost tracking |
| Evaluation | LLM-as-judge over golden set | Custom harness |
| Data APIs | Adzuna / Jooble | Later milestone: live job search |

---
*Created: 2026-07-20*
