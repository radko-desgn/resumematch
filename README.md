# ResumeMatch

AI-powered resume-to-job-fit analyzer. Paste in a **resume** and a **job posting**, and get:

1. A calibrated **fit score** (0–100)
2. An evidence-backed **gap analysis** — each requirement tagged must-have/nice-to-have and met/partial/missing, with a supporting quote from your resume
3. **Rewritten resume bullets** tailored to the job — with a before/after and rationale, and **no fabrication**

Built to demonstrate production-grade AI engineering patterns (RAG-style retrieval, embeddings, structured LLM outputs, evaluation, LLMOps) — not just an API wrapper.

## How it works

```
resume + job ──▶ [Claude: scoring + gap analysis]  ──┐
             │                                        ├──▶ combined Analysis (JSON)
             ├──▶ [local bge-small: requirement↔resume match]
             └──▶ [Claude: bullet rewriting] ─────────┘
```

Exactly **two** Claude calls per analysis (model: `claude-haiku-4-5`), plus on-device embeddings — keeping cost around ~1.5¢ per run.

## Setup

```bash
python -m venv .venv && source .venv/bin/activate
pip install -e .
cp .env.example .env      # then add your ANTHROPIC_API_KEY
```

## Run the app (v0.2 — full-stack wizard)

The current UI is a **Next.js + Tailwind + shadcn/ui** multi-step wizard talking to a
**FastAPI** backend that wraps the Python engine. Free by default (mock mode).

```bash
# 1) Backend (FastAPI) — from repo root, with the .venv active
uvicorn backend.main:app --reload --port 8000

# 2) Frontend (Next.js) — in a second terminal
cd frontend
npm install
npm run dev        # http://localhost:3000
```

Set `ANTHROPIC_API_KEY` (and flip mock off) for live analysis + image OCR.

## Legacy Streamlit UI

```bash
streamlit run app.py
```

The original single-page dark→white UI. **Free by default** (mock mode). Superseded by
the wizard above but kept for reference.

## Run the CLI

```bash
python -m resumematch.cli --mock \
  --resume tests/fixtures/sample_resume.txt \
  --job tests/fixtures/sample_job.txt
```

Prints a single combined JSON result (score + gap analysis + rewritten bullets).
Drop `--mock` for a live run (needs `ANTHROPIC_API_KEY`).

## Test

```bash
pip install -e ".[dev]"
pytest -q          # offline; spends zero API tokens
```

## Tech stack

| Layer | Tech |
|-------|------|
| LLM | Claude Haiku 4.5 (structured outputs) |
| Embeddings | `BAAI/bge-small-en-v1.5` (local, via sentence-transformers) |
| Models/validation | Pydantic v2 |
| UI (next) | Streamlit |

## Roadmap

Managed with [PAUL](.paul/ROADMAP.md): **v0.1 MVP** (this) → Eval & LLMOps → Data & Persistence → Design → Launch.
