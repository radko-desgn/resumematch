# Roadmap: ResumeMatch

## Overview

ResumeMatch grows from a paste-in MVP (score + gap analysis + bullet rewriting) into a portfolio-grade AI product: an evaluated, observable, RAG-style analyzer with live job data, a polished UI, and a public launch. The journey deliberately front-loads the working core, then layers on the "senior signal" pieces (eval + LLMOps), then data/persistence, then design and launch.

## Current Milestone

**v0.1 MVP Core** (v0.1.0)
Status: Not started
Phases: 0 of 5 complete

## Phases

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 1 | MVP Core (score + gaps + rewrites) | TBD | Not started | - |
| 2 | Eval & LLMOps | TBD | Not started | - |
| 3 | Data & Persistence | TBD | Not started | - |
| 4 | Design Polish | TBD | Not started | - |
| 5 | Launch & Write-up | TBD | Not started | - |

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
