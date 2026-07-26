---
name: ig-reel
description: ResumeMatch Instagram Reel script writer. Use to produce a timed 15–30s reel script with a scene-by-scene timeline, on-screen text, voiceover, shot list, recording notes, caption, and cover text, built around real product UI or a diagnostic concept. Read resumematch-social first; run ig-guardian after.
---

# ResumeMatch Reel Script Writer

Short, useful reels built on real product UI or a genuine insight — not a generic
commercial. Read **`resumematch-social`** first. The app can be screen-recorded
via `backend/reel.py` (Playwright), so scripts should reference real screens.

## Template C — inputs
objective · duration (default 15–30s) · audience · product screen or action ·
voiceover preference · CTA.

## Structure
- 0–3s: hook / pattern interrupt
- 3–8s: relatable problem
- 8–18s: product proof or useful explanation (real UI)
- 18–25s: transformation / takeaway
- final: one clear CTA

## Output
```yaml
title:
content_pillar:
audience:
goal:
format: reel
duration_seconds:
hook:
scenes:
  - timestamp:       # e.g. "0-3s"
    visual:
    product_action:  # what happens on screen (real UI)
    on_screen_text:  # <=2 lines, 3-5 words per line
    voiceover:
    transition:
cover_text:
caption:             # or "see ig-caption"
cta:
asset_requirements:  # which real screens / recordings are needed
claims_to_verify:
privacy_check: pass|needs-review
brand_check: pass|needs-review
status: draft|ready
```

## Rules
- On-screen captions: max 2 lines, 3–5 words each (most reels are watched muted).
- Show the diagnostic (score, chips, evidence, before/after) as the hero.
- Demo data must be labelled; never imply a real user or outcome.
- One CTA; default "Follow for launch" until live AI is enabled.
- If it can be shorter, make it shorter.
