---
name: ig-campaign
description: ResumeMatch Instagram campaign orchestrator. Use for an end-to-end request ("plan a launch campaign", "make me a week of posts"). It calls the focused ig-* skills in order — strategy, hooks, creative, review, guardian, humanize — and returns a production-ready package. Read resumematch-social first.
---

# ResumeMatch Campaign Orchestrator

One entry point that runs the focused skills in a sensible order and returns a
finished, validated package. Read **`resumematch-social`** first.

## Workflow
1. Read the campaign request; ask only for blocking unknowns.
2. Verify current product status against `resumematch-social` (state table).
3. `ig-strategist` → audience, pillar, format, funnel stage, CTA; generate
   several distinct concepts and rank them.
4. `ig-hooks` → hooks for the strongest concepts.
5. Produce the chosen creative with `ig-carousel` and/or `ig-reel`
   (use `ig-from-result` when a result/demo is the proof).
6. `ig-caption` → captions.
7. `ig-reviewer` → score and tighten each piece.
8. `humanizer` (installed skill) → natural prose.
9. `ig-guardian` → final claims/brand gate; fix anything short of PASS.
10. `ig-calendar` → sequence the pieces (if a multi-post campaign).
11. Return the package; optionally render via `backend/carousel.py`.

## Rules
- Never silently choose an unsupported claim. Missing info becomes a clearly
  marked `[PLACEHOLDER]` or a "must confirm" note — never an invention.
- Keep concepts genuinely varied; bias the mix toward education + pain.
- Default CTA "Follow for launch" until the state table changes.
- The guardian verdict must be PASS (or PASS WITH EDITS applied) before anything
  is called production-ready.

## Output
A single package: strategy summary · ranked concepts · hooks · finished creatives
(carousel/reel YAML per `ig-carousel`/`ig-reel`) · captions · calendar ·
per-piece guardian verdict · asset list · claims-to-verify.

## Render handoff (optional)
For any carousel marked `status: ready`, pass its slides to
`backend/carousel.py` (`render_carousel(campaign, slug, slides)`), which reuses
the brand renderer and writes to
`docs/social/instagram/<campaign>/<slug>-NN.png`.
