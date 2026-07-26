# ResumeMatch Instagram marketing system

A reusable set of Claude Code **skills** and **commands** for producing
ResumeMatch social content that stays aligned with the product, the brand, and
the no-invention promise. Built on the repo's existing Playwright render pipeline
and the installed general skills (`copywriting`, `social`, `hook-generator`,
`humanizer`, `ad-creative`, `launch`, `content-strategy`, `brand-guidelines`).

## Start here

**[`skills/resumematch-social/SKILL.md`](skills/resumematch-social/SKILL.md)** is
the canonical shared context: product truth, the **current product-state table**
(what's live vs mocked/simulated), tone, content pillars, brand rules, CTA rules,
privacy rules, and acceptable/unacceptable copy. Every other skill reads it
first. Update the state table there whenever the product changes — the CTAs and
the claims guardian key off it.

> Current reality baked in: live AI is **mocked** on the deploy, payments are
> **simulated**, there is **no waitlist**, Google login is in **testing**, there
> is **no custom domain**, legal pages are **draft**. The only accurate primary
> CTA right now is **"Follow for launch."**

## Skills (`.claude/skills/`)

| Skill | Does |
|---|---|
| `resumematch-social` | Shared context / product truth (read first) |
| `ig-strategist` | Decide what to make: pillar, funnel stage, format, CTA, risks |
| `ig-hooks` | 15–30 hooks grouped + ranked (Template A) |
| `ig-carousel` | Full slide-by-slide carousel package (Template B), renderer-ready |
| `ig-reel` | Timed 15–30s reel script + shot list (Template C) |
| `ig-caption` | Caption + short + founder-voice + hashtags + alt text |
| `ig-reviewer` | Score/critique/revise an existing post (Template D) |
| `ig-boost` | Paid-promotion decision + test structure |
| `ig-from-result` | Turn a demo/sanitised analysis into privacy-safe content |
| `ig-calendar` | Balanced content calendar (Template E) |
| `ig-guardian` | Final claims/brand gate: PASS / PASS WITH EDITS / BLOCKED |
| `ig-campaign` | Orchestrator: runs the above in order into one package |

## Commands (`.claude/commands/`)

`/instagram-strategy` · `/instagram-hooks` · `/instagram-carousel` ·
`/instagram-reel` · `/instagram-caption` · `/instagram-review` ·
`/instagram-calendar` · `/instagram-boost-review` · `/instagram-from-result` ·
`/instagram-launch-campaign`

Each takes free-text `$ARGUMENTS` and delegates to the matching skill. Examples
are in each command file.

## Recommended workflow

```
/instagram-strategy  → pick the concept
/instagram-hooks     → hooks for it
/instagram-carousel  (or a reel)   → the creative
/instagram-caption   → the caption
/instagram-review    → tighten it
   (humanizer runs on the prose)
   (ig-guardian is the final gate — nothing ships without PASS)
```

Or run **`/instagram-launch-campaign`** to do the whole loop at once.

## Rendering carousels

The creative from `ig-carousel` is structured data, not scattered strings. Render
it on-brand with the shared visual system:

```python
from backend.carousel import render_carousel
slides = [
    {"eyebrow": "The problem",
     "headline_html": 'Your CV may be <span style="font-size:90px" class="hl">good</span>.',
     "lede": "And still wrong for this specific job.", "lede_class": "wide"},
    # ...
]
res = render_carousel("launch", "cv-good-still-wrong", slides)
print(res.paths, res.warnings)   # warnings flags any text overflow/clipping
```

Output: `docs/social/instagram/<campaign>/<slug>-NN.png` (1080×1350). Wrap the key
word of each headline in `<span class="hl">` (white chip) or `class="hl met"`
(green), and size headlines with `font-size:90px` to match the set. The renderer
checks each slide for clipping and reports it.

3-slide launch posts also have dedicated scripts: `backend/coming_soon.py`,
`backend/post_no_replies.py`, `backend/post_features.py`,
`backend/post_early_access.py`.

## Guardrails (enforced by the skills)

No invented testimonials, users, outcomes, or stats · no "waitlist" · no "live"
for mocked features · prices from `frontend/lib/packs.ts` · demo data always
labelled · one supported CTA per post · humanize, then re-check claims.
