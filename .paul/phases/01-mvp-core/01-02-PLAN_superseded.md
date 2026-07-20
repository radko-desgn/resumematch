---
phase: 01-mvp-core
plan: 02
type: execute
wave: 2
depends_on: ["01-01"]
files_modified:
  - pyproject.toml
  - app.py
  - resumematch/ui/__init__.py
  - resumematch/ui/theme.py
  - resumematch/ui/components.py
  - .streamlit/config.toml
  - tests/test_ui_smoke.py
  - README.md
autonomous: false
---

<objective>
## Goal
Build a Streamlit UI on top of the existing `analyze(resume, job, mock=True)` engine that realizes the docs/DESIGN.md direction: a dark, atmospheric hero (Space Grotesk headline + gradient glows + the two paste inputs + Analyze) transitioning to a white results section showing the fit-score gauge, an evidence-backed gap analysis, and the signature git-diff-style bullet rewrites. Fully runnable FREE via mock mode; uses live Claude only when a key is present and live is selected.

## Purpose
This is the face of the whole project — the thing an interviewer sees first. It turns the headless engine (01-01) into a demoable product and delivers Phase 1's user-facing value. Building it against `--mock` keeps it free until the paid stage.

## Output
A `streamlit run app.py` application with a themed dark→white layout, a score gauge, gap-analysis cards, git-diff rewrites, a mock/live toggle, and a headless UI smoke test.
</objective>

<context>
## Project Context
@.paul/PROJECT.md
@.paul/ROADMAP.md
@.paul/STATE.md

## Design direction (drives every visual choice)
@docs/DESIGN.md

## Prior Work (direct input to this plan)
@.paul/phases/01-mvp-core/01-01-SUMMARY.md
# This plan imports analyze() and the Analysis/ScoreResult/RewriteResult schemas from 01-01.
@resumematch/analyzer.py
@resumematch/schemas.py
</context>

<skills>
## Required Skills (from SPECIAL-FLOWS.md)

| Skill | Priority | When to Invoke | Loaded? |
|-------|----------|----------------|---------|
| /theme-factory | required | Before writing theme.py — formalize docs/DESIGN.md tokens into a reusable theme | ○ |
| /dataviz | required | Before building the fit-score gauge — form/color/mark decisions | ○ |
| /frontend-design | optional | Already consulted; brief captured in docs/DESIGN.md | ✓ |

**BLOCKING:** `/theme-factory` and `/dataviz` must be loaded before APPLY builds the theme and the gauge.

## Skill Invocation Checklist
- [ ] /theme-factory loaded
- [ ] /dataviz loaded
</skills>

<acceptance_criteria>

## AC-1: App launches with the dark hero
```gherkin
Given streamlit is installed and no API key is set
When I run `streamlit run app.py`
Then the page loads with a dark hero (Space Grotesk headline, green→cyan + violet glow), two text areas (resume, job), an Analyze button, and a mock/live control — with no exceptions in the server log
```

## AC-2: Free end-to-end analysis in the UI
```gherkin
Given mock mode (no API key) and the sample resume + job pasted in
When I click Analyze
Then a white results section renders the fit-score gauge, the gap-analysis list, and the git-diff bullet rewrites — with no cost and no error
```

## AC-3: Design fidelity to docs/DESIGN.md
```gherkin
Given the results are shown
When I inspect them
Then the layout is dark hero → white results; the score gauge uses the green→cyan gradient; requirements show must-have/nice-to-have chips and met(green)/partial(amber)/missing(red) status; evidence quotes render in JetBrains Mono; and rewrites render as a git diff (red − / green +, line numbers) inside a rounded app-window card with traffic-light dots
```

## AC-4: Mock/live toggle behaves safely
```gherkin
Given the mock/live control
When no ANTHROPIC_API_KEY is present
Then live is disabled/forced to mock with a clear inline notice; and when a key IS present and live is selected, clicking Analyze calls the real analyze() (mock=False)
```

## AC-5: Accessibility floor
```gherkin
Given a keyboard user or reduced-motion preference
When they navigate the app
Then interactive controls show a visible focus ring, text meets contrast on both dark and white sections, and glow/gauge animation is disabled under prefers-reduced-motion
```

</acceptance_criteria>

<tasks>

<task type="auto">
  <name>Task 1: Theme + app shell (dark hero + inputs)</name>
  <files>pyproject.toml, .streamlit/config.toml, resumematch/ui/__init__.py, resumematch/ui/theme.py, app.py</files>
  <action>
    - Add `streamlit>=1.40` to pyproject dependencies.
    - `.streamlit/config.toml`: base dark theme (backgroundColor #0B0D12, textColor #E6E9EF, primaryColor #35C1F1) so defaults align with the design.
    - `resumematch/ui/theme.py` (use /theme-factory to formalize docs/DESIGN.md tokens): a `CSS` string + `inject()` helper that `st.markdown`s a <style> block — @import Space Grotesk / Inter / JetBrains Mono; define CSS custom properties for every token in docs/DESIGN.md; hero background (#0B0D12) with two large blurred radial-gradient glows (green→cyan top-left, violet top-right) at low opacity; helpers/classes for the app-window chrome (traffic-light dots), chips, status colors, and the diff view. Respect `prefers-reduced-motion` (no glow animation) and add visible `:focus-visible` outlines.
    - `app.py`: Streamlit entry. Call theme.inject(). Render the dark hero: big Space Grotesk headline ("Does your resume fit the job?"), a short subhead, two `st.text_area`s (Resume, Job posting) prefilled from tests/fixtures for easy demo, an Analyze button, and the mock/live control (see Task 3). Below, an empty white results container. Use a wrapper div per section so the dark hero and white results have distinct backgrounds despite Streamlit's single-flow DOM.
    Avoid: relying on brittle auto-generated Streamlit class hashes — target stable structures / your own wrapper classes. Do not modify the analysis engine.
  </action>
  <verify>`.venv/bin/python -c "import ast; ast.parse(open('app.py').read()); ast.parse(open('resumematch/ui/theme.py').read())"` parses; `.venv/bin/streamlit run app.py --server.headless true` boots without a traceback (capture ~3s of log)</verify>
  <done>AC-1 satisfied: dark hero with inputs renders on launch, no errors</done>
</task>

<task type="auto">
  <name>Task 2: Results components — gauge, gap analysis, git-diff rewrites</name>
  <files>resumematch/ui/components.py</files>
  <action>
    Build pure render helpers that take the Analysis object and return HTML strings (or draw via st):
    - `score_gauge(score: int)` — use /dataviz for the treatment: a semicircular arc gauge, track in a muted tone, value arc in the green→cyan gradient, the number set in JetBrains Mono, a short verdict label. Inline SVG is preferred (crisp, themeable, no heavy deps); keep it responsive.
    - `gap_analysis(requirements)` — one row per requirement: a must-have/nice-to-have chip, a met/partial/missing status pill (green/amber/red from tokens), the requirement text, and the evidence quote in JetBrains Mono (muted when null → show "no evidence in resume").
    - `diff_rewrites(rewritten_bullets)` — the SIGNATURE: a rounded app-window card (traffic-light dots + a filename-style header like "resume.diff"), each changed bullet shown as a git diff — a red `−` line (original) then a green `+` line (rewritten) with left-gutter line numbers in JetBrains Mono; unchanged bullets shown once, dimmed. Include the tailored_summary above or below the card.
    Avoid: fabricating any content — render only what's in the Analysis. Keep functions pure/testable (return strings; no Streamlit calls inside the string builders).
  </action>
  <verify>`.venv/bin/python -c "from resumematch.ui import components; from resumematch.analyzer import analyze; a=analyze(open('tests/fixtures/sample_resume.txt').read(), open('tests/fixtures/sample_job.txt').read(), mock=True); print(bool(components.score_gauge(a.score.overall_fit_score)), bool(components.gap_analysis(a.score.requirements)), bool(components.diff_rewrites(a.rewrite.rewritten_bullets)))"` prints `True True True`</verify>
  <done>AC-3 satisfied: gauge, gap analysis, and git-diff rewrites render from a real Analysis with the specified styling</done>
</task>

<task type="auto">
  <name>Task 3: Wire analyze() + mock/live toggle + UI smoke test</name>
  <files>app.py, resumematch/ui/components.py, tests/test_ui_smoke.py, README.md</files>
  <action>
    - In app.py: on Analyze click, read the two text areas, call `analyze(resume, job, mock=use_mock)` inside a spinner, store the Analysis in `st.session_state`, and render the three components into the white results container. Handle empty inputs (inline validation) and analysis errors (friendly inline message, never a raw traceback).
    - Mock/live control: detect a key via `resumematch.config` (getenv without raising). If absent → force mock, show an inline notice ("Free mode — add ANTHROPIC_API_KEY for a live analysis"). If present → a toggle defaulting to mock, letting the user opt into a live (~1.5¢) run.
    - `tests/test_ui_smoke.py` (headless, offline, no key): import app module without executing the server (guard Streamlit calls under a `main()` or `if __name__`), and assert the three component builders return non-empty HTML for a mock Analysis. Must not spend API tokens.
    - README.md: add a "Run the app" section (`streamlit run app.py`) and note mock is the default.
    Avoid: making the default `pytest` run launch a live server or hit the API.
  </action>
  <verify>`.venv/bin/python -m pytest -q` passes (incl. new UI smoke test); grep confirms app.py calls `analyze(` with a `mock=` argument</verify>
  <done>AC-2 and AC-4 satisfied: Analyze runs the pipeline in-app (mock by default), toggle behaves safely, tests green offline</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>The full ResumeMatch Streamlit UI: dark hero with inputs, and a white results section with the fit-score gauge, gap analysis, and git-diff rewrites — running in free mock mode.</what-built>
  <how-to-verify>
    1. Run: `.venv/bin/streamlit run app.py`
    2. Visit the URL Streamlit prints (usually http://localhost:8501)
    3. Confirm the dark hero: big headline, soft green/cyan + violet glows, two inputs (prefilled), Analyze button
    4. Click Analyze (mock mode) and confirm the white results section shows: a green→cyan score gauge, gap-analysis rows with must/nice chips + met/partial/missing colors + mono evidence, and the git-diff rewrite card (red − / green +, traffic-light dots)
    5. Resize to a narrow width — confirm nothing overflows horizontally
    6. Confirm it matches the intent of docs/DESIGN.md
  </how-to-verify>
  <resume-signal>Type "approved" to continue, or describe what to adjust (I'll classify it as intent/spec/code before fixing)</resume-signal>
</task>

</tasks>

<boundaries>

## DO NOT CHANGE
- `resumematch/analyzer.py`, `resumematch/schemas.py`, `resumematch/prompts.py`, `resumematch/llm.py`, `resumematch/mocks.py`, `resumematch/embeddings.py` — the engine's public API is stable; the UI consumes it read-only.
- `.paul/**` (PAUL-managed).
- `tests/test_smoke.py` (existing engine tests stay green).

## SCOPE LIMITS
- Streamlit + injected CSS only — no separate React/FastAPI frontend (that's a Phase 4 option if chosen later).
- No Langfuse, no pgvector, no job-search APIs (later phases).
- No PDF/DOCX upload — paste-in text only.
- Do not enable live calls by default — mock is the default; live is opt-in and only when a key exists.
</boundaries>

<verification>
Before declaring plan complete:
- [ ] `.venv/bin/streamlit run app.py` boots with no traceback
- [ ] `.venv/bin/python -m pytest -q` passes (engine + UI smoke tests)
- [ ] Mock Analyze renders gauge + gap analysis + git-diff rewrites
- [ ] Design matches docs/DESIGN.md (dark→white, gradient gauge, diff signature, mono evidence)
- [ ] Accessibility floor: focus-visible outlines, contrast, reduced-motion respected
- [ ] Human-verify checkpoint approved
- [ ] All acceptance criteria (AC-1..AC-5) met
</verification>

<success_criteria>
- Free, demoable Streamlit app realizing the dark/white design direction
- Engine consumed read-only; no API changes
- Mock default keeps it zero-cost; live is a safe opt-in
- Tests green offline; no secrets or tokens spent
</success_criteria>

<output>
After completion, create `.paul/phases/01-mvp-core/01-02-SUMMARY.md`
(This is the last plan in Phase 1 — UNIFY will trigger the phase transition: evolve PROJECT.md, mark Phase 1 complete in ROADMAP.md, and the phase git commit.)
</output>
