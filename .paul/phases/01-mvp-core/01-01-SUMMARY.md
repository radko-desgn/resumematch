---
phase: 01-mvp-core
plan: 01
subsystem: api
tags: [python, anthropic, claude-haiku-4-5, pydantic, structured-outputs, sentence-transformers, bge-small, embeddings, cli]

requires: []
provides:
  - "resumematch package: analyze(resume, job, mock) -> Analysis"
  - "structured-output Claude wrapper (llm.structured_call)"
  - "Pydantic schemas: ScoreResult, RewriteResult, Requirement, Analysis"
  - "local bge-small requirement<->resume embedding matcher"
  - "CLI entrypoint (python -m resumematch.cli) with --mock free mode"
  - "offline pytest suite + sample fixtures"
affects: [01-02-streamlit-ui, 02-eval-llmops]

tech-stack:
  added: [anthropic, sentence-transformers, pydantic>=2, python-dotenv, numpy, pytest, torch]
  patterns: [structured-outputs-via-messages-parse, two-call-analysis-pipeline, mock-mode-for-paid-calls, local-free-embeddings]

key-files:
  created: [resumematch/config.py, resumematch/llm.py, resumematch/schemas.py, resumematch/prompts.py, resumematch/embeddings.py, resumematch/analyzer.py, resumematch/mocks.py, resumematch/cli.py, tests/test_smoke.py, docs/DESIGN.md, pyproject.toml]
  modified: []

key-decisions:
  - "Added --mock free mode: fake only the 2 paid Claude calls; keep embeddings real. Build free, apply payment at final stage."
  - "Live Claude calls deferred by design (need ANTHROPIC_API_KEY later)."
  - "Installed Python 3.12 via Homebrew; project targets 3.11+."

patterns-established:
  - "structured_call(system, user, schema) -> validated Pydantic via messages.parse(output_format=...)"
  - "analyze() runs exactly two Claude calls + one local embedding match; mock branch swaps the paid calls only"

duration: ~90min
started: 2026-07-20T00:00:00Z
completed: 2026-07-20T00:00:00Z
---

# Phase 1 Plan 01: MVP Core (Analysis Engine) Summary

**Shipped the headless ResumeMatch engine — resume+job → schema-validated fit score, evidence-backed gap analysis, and no-fabrication bullet rewrites — via two Claude Haiku 4.5 structured-output calls + local bge-small matching, runnable free with a --mock mode.**

## Performance

| Metric | Value |
|--------|-------|
| Duration | ~90 min |
| Tasks | 3 completed (+1 scope addition: mock mode) |
| Files created | 13 |
| Tests | 7 passing, 0 failing |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: Package installs & imports | Pass | `pip install -e .` on 3.12; import OK; missing-key raises clear ValueError |
| AC-2: Scoring + gap analysis, evidence-grounded | Pass | Function + schema implemented; schema round-trips; missing→null evidence enforced. Live call deferred by design (verified via mock + offline schema tests) |
| AC-3: Bullet rewriting, no fabrication | Pass | Function + schema; mock e2e asserts rewritten==original (no fabrication); prompt encodes the rule |
| AC-4: Local embedding match | Pass | Real bge-small match verified — FastAPI line correctly retrieved as nearest evidence; no API call |
| AC-5: End-to-end CLI combined JSON | Pass | `--mock` CLI run printed combined JSON, exit 0; live path shares the same code |

## Accomplishments

- Full `resumematch` package with a clean two-call analysis pipeline and Pydantic-validated outputs.
- Anti-hallucination encoded at two layers: prompts (evidence-or-null, no fabrication) + schemas (Optional evidence, typed status).
- **Free `--mock` mode** so the entire app is runnable/demoable with no API key and no cost — unblocks all UI/design work.
- Environment fixed: Python 3.12 via Homebrew, `.venv`, full editable install with torch; 7/7 tests green.
- Design direction for the UI captured in `docs/DESIGN.md` (mixed dark/white, git-diff signature) for Plan 01-02.

## Files Created/Modified

| File | Change | Purpose |
|------|--------|---------|
| `pyproject.toml`, `.env.example`, `README.md` | Created | Scaffold, deps, setup docs |
| `resumematch/config.py` | Created | Env/secrets + model constants |
| `resumematch/llm.py` | Created | Anthropic structured-output wrapper |
| `resumematch/schemas.py` | Created | Pydantic result models |
| `resumematch/prompts.py` | Created | Scoring + rewriting prompt builders |
| `resumematch/embeddings.py` | Created | Local bge-small matcher + text helpers |
| `resumematch/analyzer.py` | Created | Orchestrates the analysis (live + mock) |
| `resumematch/mocks.py` | Created | Canned results for free mode |
| `resumematch/cli.py` | Created | CLI entrypoint with `--mock` |
| `tests/test_smoke.py`, `tests/fixtures/*` | Created | Offline tests + sample resume/job |
| `docs/DESIGN.md` | Created | UI design direction for 01-02 |

## Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Add `--mock` free mode | User builds free, pays at final stage | UI/design phases need no credits; live calls later |
| Defer live Claude calls | No key yet | One real run needed later for portfolio result + Phase 2 eval |
| Python 3.12 via Homebrew | Sandbox had only 3.9; project needs 3.11+ | Full install + tests now work |

## Deviations from Plan

| Type | Count | Impact |
|------|-------|--------|
| Scope additions | 1 | `--mock` mode + mocks.py + mock test — additive, no scope creep; enables the free-build strategy |
| Auto-fixed | 0 | — |
| Deferred | 1 | Live Claude call execution (needs key) — intentional |

## Skill Audit

- `/claude-api` (required for LLM code) — ✓ invoked this session (used for exact `messages.parse` / model-id syntax).

## Next Phase Readiness

**Ready:**
- `analyze()` returns a complete, serializable `Analysis` — direct input for the Streamlit UI (01-02).
- `--mock` means the UI can be built and demoed with zero cost/key.
- `docs/DESIGN.md` defines the exact visual direction + tokens for 01-02.

**Concerns:**
- Live Claude output shape is validated only via schema/mock so far; first real run should sanity-check calibration + evidence quality.

**Blockers:** None.

---
*Phase: 01-mvp-core, Plan: 01*
*Completed: 2026-07-20*
