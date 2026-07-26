---
name: ig-hooks
description: ResumeMatch Instagram hook writer. Use to generate strong, specific, non-clickbait hooks (opening lines / slide-1 headlines) grounded in a real job-seeker problem. Composes with the installed hook-generator skill; read resumematch-social first.
---

# ResumeMatch Hook Writer

Generate hooks that stop the scroll without lying. Read **`resumematch-social`**
first; you may also lean on the installed **`hook-generator`** skill for extra
patterns, then filter everything through ResumeMatch's tone and claims rules.

## Template A — inputs
audience · pain point · content pillar · awareness stage · format · desired
emotional effect · prohibited claims (default: the whole state table).

## Rules
- 4–12 words, understandable with no context.
- Based on a genuine job-seeker problem, misconception, or insight.
- No product name in most top-of-funnel hooks.
- No empty clickbait, no fake stats, no fake personal stories, no fake scarcity.
- Vary sentence structure; don't ship ten hooks with the same shape.

## Categories
painful truth · misconception · contrast · question · diagnostic ·
before-vs-after · specific mistake · pattern interrupt · honest contrarian.

## Output
15–30 hooks grouped by category, then a ranked **Top 5**. For each hook:
```yaml
hook:
audience:
pillar:
why_it_works:
generic_risk:      # low | medium | high — how templated it sounds
next_line:         # suggested slide-2 / opening line it sets up
```

## Quality references (directions, not the only allowed hooks)
"Your CV may be good, and still wrong." · "Stop using one CV for every job." ·
"A 72% match can hide one serious gap." · "Tailoring shouldn't mean lying." ·
"A keyword is not evidence." · "Know the gap before you apply."

## Prohibited directions
"Big things are coming." · "The future of resumes is here." · "Our AI changes
everything." · "You won't believe this CV hack." · "Recruiters hate this trick." ·
"Guaranteed interviews." · "Beat the ATS every time."
