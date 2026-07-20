# Project State

## Project Reference

See: .paul/PROJECT.md (updated 2026-07-20)

**Core value:** Job seekers get an instant, evidence-based read on how well they fit a specific job and concrete, honest edits to close the gap — in seconds instead of hours.
**Current focus:** Project initialized — ready for planning

## Current Position

Milestone: v0.1 MVP Core
Phase: 1 of 5 (MVP Core) — Planning
Plan: 01-02 created, awaiting approval
Status: PLAN created, ready for APPLY
Last activity: 2026-07-20 — Created .paul/phases/01-mvp-core/01-02-PLAN.md (Streamlit UI)

Progress:
- Milestone: [█░░░░░░░░░] ~10%
- Phase 1: [█████░░░░░] 50% (1 of 2 plans complete; 01-02 planned)

## Loop Position

Current loop state:
```
PLAN ──▶ APPLY ──▶ UNIFY
  ✓        ○        ○     [Plan 01-02 created, awaiting approval]
```

Note: Phase 1 = 2 plans — 01-01 (analysis engine, ✅ DONE), 01-02 (Streamlit UI, planned).
01-02 is the LAST plan in Phase 1 → UNIFY will trigger the phase transition (commit).
Required skills for 01-02 APPLY: /theme-factory, /dataviz (blocking).

### Environment (RESOLVED 2026-07-20)
Installed Python 3.12.13 via Homebrew; created .venv; `pip install -e ".[dev]"`
succeeds. Full test suite now 6/6 passing (real bge-small embedding match runs,
no longer skipped).
1. `pip install -e .` — ✅ RESOLVED (works on 3.12).
2. Live Claude structured-output calls — 🟡 DEFERRED BY DESIGN. Free `--mock` mode
   works end-to-end without a key; live calls to be enabled at the final stage
   when the user adds credits.
3. Real bge-small embedding match — ✅ RESOLVED (7/7 tests pass, incl. mock e2e).
Status: fully runnable free. No blocker to continue building (UI is next).

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

Last session: 2026-07-20
Stopped at: Plan 01-02 (Streamlit UI) created, awaiting approval
Next action: Load /theme-factory + /dataviz, then run /paul:apply .paul/phases/01-mvp-core/01-02-PLAN.md
Resume file: .paul/phases/01-mvp-core/01-02-PLAN.md

---
*STATE.md — Updated after every significant action*
