# Specialized Flows: ResumeMatch

Skills wired into this project, mapped to the phase where PAUL should invoke them.
Invoke a skill with the Skill tool (e.g. `/frontend-design`) during the relevant phase's APPLY step.

## Build & Project Management (all phases)

| Skill | When to use |
|-------|-------------|
| `claude-api` | Any Claude wiring — model IDs, structured outputs, prompt caching, cost. Read before editing LLM-calling code. |
| `feature-dev` | Guided implementation of individual features within a phase. |
| `webapp-testing` | Playwright testing/screenshots of the Streamlit UI (Phases 1, 4). |

## Phase 4 — Design Polish

| Skill | When to use |
|-------|-------------|
| `frontend-design` | Give the UI a distinctive, intentional look (not default Streamlit). |
| `dataviz` | Fit-score gauge, matched/missing charts — before writing any chart code. |
| `image` | Hero image, OG/social share image, simple logo. |
| `theme-factory` | Consistent color/font theme across the app. |

## Phase 5 — Launch & Write-up

| Skill | When to use |
|-------|-------------|
| `copywriting` | Landing page / README hero copy. |
| `copy-editing` | Polish the final README / case study. |
| `humanizer` | Strip AI-tells from the write-up so it reads human. |
| `product-marketing` | Positioning + who it's for. |
| `free-tools` | Frame ResumeMatch as a free lead-gen tool (positioning angle). |
| `content-strategy` | Plan the "how I built an evaluated RAG system" blog post. |
| `ai-seo` | Make the write-up citable/findable by AI search. |
| `launch` | Product Hunt / Show HN launch checklist. |
| `social` | LinkedIn build-in-public posts. |

## Explicitly NOT used

- `ads`, `ad-creative` — paid advertising, overkill for a portfolio piece.
- Heavy `seo-audit` — this is a new project, not a ranking-recovery job.

---
*Configured: 2026-07-20*
