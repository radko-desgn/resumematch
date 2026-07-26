---
name: ig-carousel
description: ResumeMatch Instagram carousel writer. Use to produce complete, slide-by-slide carousel copy plus caption, visual direction, alt text, and a claims-to-verify list. Output is renderer-ready (see backend/carousel.py). Read resumematch-social first; run humanizer + ig-guardian after.
---

# ResumeMatch Carousel Writer

Write a full carousel that's useful even if nobody taps the CTA. Read
**`resumematch-social`** first.

## Template B — inputs
objective · audience · topic · slide count (4–8, default 6) · available product
proof · CTA · launch status.

## Default 6-slide structure (adapt as the concept needs)
1. Hook (see `ig-hooks`)
2. Clarify the problem
3. The overlooked reason
4. Evidence / product proof (demo data, labelled)
5. The useful takeaway / transformation
6. CTA

For product-led posts you may reveal earlier; for education/pain lead longer.

## Per slide
```yaml
- slide:            # number
  headline:         # one idea, mobile-sized
  body:             # 1–2 short lines, no paragraph walls
  visual:           # what's shown (product UI / diagram / type)
  product_ui:       # the diagnostic element, if any (score, chips, evidence, before/after)
  alt_text:         # accessibility description
```

## Also output (the package)
```yaml
title:
content_pillar:
audience:
funnel_stage:
goal:
format: carousel
slide_count:
hook:
slides: [...]
caption:            # or "see ig-caption"
cta:
cover_layout:       # brief note
slug:               # kebab-case, for filenames
asset_requirements:
claims_to_verify:
privacy_check: pass|needs-review
brand_check: pass|needs-review
status: draft|ready
```

## Rules
- One core idea per slide; strong hierarchy; short lines.
- No unsupported claims; label any demo data as "demo / example."
- Highlight-chip accent (the rendered style) works on ONE key word per headline.
- Keep the headline scale consistent across slides (the renderer uses one size).
- Default CTA "Follow for launch" until the state table says otherwise.

## Renderer handoff
The rendered style is centered, monochrome, one chipped key word + a supporting
line per slide. Map: eyebrow = slide role, headline_html = the line (wrap the key
word in `<span class="hl">`, or `hl met` for green), lede = body. See
`backend/carousel.py` and pass slides as structured data — never hard-code
scattered strings.
