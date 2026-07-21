# Project State

## Project Reference

See: .paul/PROJECT.md (updated 2026-07-20)

**Core value:** Job seekers get an instant, evidence-based read on how well they fit a specific job and concrete, honest edits to close the gap — in seconds instead of hours.
**Current focus:** Project initialized — ready for planning

## Current Position

Milestone: v0.2 Wizard UX — Full-Stack — ✅ SHIPPED
Phase: v0.2 phases A–E complete
Plan: milestone reconciled (02-SUMMARY.md written)
Status: Milestone shipped; ready to plan v0.3 (or de-risk PDF/URL inputs)
Last activity: 2026-07-21 — Closed v0.2; full-stack wizard + landing + monochrome redesign shipped

Progress:
- v0.1 MVP engine: [██████████] shipped (Streamlit UI superseded)
- v0.2 Wizard UX: [██████████] shipped

## Loop Position

Current loop state:
```
PLAN ──▶ APPLY ──▶ UNIFY
  ✓        ✓        ✓     [v0.2 milestone closed — ready for next PLAN]
```

Servers (dev): FastAPI backend :8000, Next.js frontend :3001. Run instructions in README.

### Environment (stable)
Python 3.12 (.venv) + Node 24. Engine tests 11/11.
Input adapters verified e2e via /api/analyze (mock): text ✅, PDF ✅ (1523 chars),
DOCX ✅ (1530), URL ✅ (local HTML, 1238). Image/vision OCR stubbed in mock (needs key).
Live Claude calls still need ANTHROPIC_API_KEY (mock is default).

## Accumulated Context

### Decisions
- Claude Haiku 4.5 for scoring/rewriting (cheap, smart enough)
- Local `bge-small` embeddings (free) for requirement↔resume matching
- Streamlit for MVP UI (fastest path)
- Structured outputs (schema-validated JSON) for reliable parsing + anti-hallucination
- Downscoped from ThreatLens to ResumeMatch (finishable solo in ~1 month)
- 2026-07-20: Added `--mock` free mode (fakes only the 2 paid Claude calls; real
  embeddings kept). Strategy: build the whole app free; apply payment/live calls
  only at the final stage. Phases 1, 01-02 (UI), 4 (design), 5 (launch) need no
  credits; the portfolio "money shot" + Phase 2 eval need a key later (~$5 total).

### Deferred Issues
None yet.

### Blockers/Concerns
None yet.

## Session Continuity

Last session: 2026-07-21
Stopped at: v0.2 milestone shipped + reconciled in PAUL
Next action: Either de-risk PDF/URL inputs (real files through /api/analyze) OR plan v0.3 (Eval & LLMOps)
Resume file: .paul/phases/02-wizard-ux/02-SUMMARY.md

---
*STATE.md — Updated after every significant action*
