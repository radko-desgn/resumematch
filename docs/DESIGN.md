# ResumeMatch — Design Direction

**Concept:** *Version control for your career.* ResumeMatch rewrites your resume —
that's versioning it. The UI lives in the GitHub visual world of the reference
screenshots, and the signature element treats the bullet rewrites as a **git diff**.

Reference screenshots: GitHub Desktop (dark hero, green/blue glow, rounded app
window + diff panel), GitHub Code Search (dark hero, violet glow), Ratzan Weissman
(full-bleed dark hero → clean white content section).

## Theme: mixed dark → white

Dark, atmospheric hero with soft gradient glows and big bold type, transitioning
to a clean white results section (the law-firm pattern).

## Color tokens

| Token | Hex | Use |
|-------|-----|-----|
| `--ink` | `#0B0D12` | Hero / base dark background |
| `--panel-dark` | `#141821` | App-window cards on dark |
| `--paper` | `#FFFFFF` | Results section background |
| `--paper-alt` | `#F5F6F8` | Subtle light panels / table stripes |
| `--text-dark` | `#E6E9EF` | Primary text on dark |
| `--muted-dark` | `#8B93A7` | Secondary text on dark |
| `--text-light` | `#0B0D12` | Primary text on white |
| `--muted-light` | `#5A6272` | Secondary text on white |
| `--match-a` | `#3FE0A5` | Signature gradient start (green) |
| `--match-b` | `#35C1F1` | Signature gradient end (cyan) |
| `--violet` | `#7C6BF5` | Secondary hero glow, nice-to-have accents |
| `--met` | `#3FE0A5` | Requirement status: met |
| `--partial` | `#F5B944` | Requirement status: partially-met |
| `--missing` | `#F06B6B` | Requirement status: missing |

Signature gradient: `linear-gradient(90deg, #3FE0A5, #35C1F1)`.
Hero glows: large blurred radial gradients (green→cyan top-left, violet top-right)
at low opacity over `--ink`.

## Typography (Google Fonts)

| Role | Face | Notes |
|------|------|-------|
| Display | **Space Grotesk** | Huge, tight tracking, weight 600-700. Hero headline. |
| Body | **Inter** | Neutral, readable. UI + prose. |
| Mono | **JetBrains Mono** | The diff, evidence quotes, data labels, score number. |

Type scale (rough): display 56-72px / h2 28-32px / body 15-16px / caption-mono 13px.

## Layout

```
DARK HERO (--ink + glows)
  ● ● ●  window chrome
  "Does your resume fit the job?"   <- Space Grotesk, huge
  [ paste resume ] [ paste job ]  ( Analyze )
  after analyze: glowing fit-score gauge + verdict

WHITE RESULTS (--paper)
  Gap analysis  ·  must-have / nice-to-have chips
    ▸ requirement — <status> — "quote from resume" (mono)
  Your bullets, rewritten   [rounded app-window]
    141 − Developed REST APIs in Python…       (red)
    146 + Built production Python REST APIs…    (green)
```

## Signature elements

1. **Git-diff rewrites** — bullet before/after rendered as a GitHub diff (red `−` /
   green `+`, line numbers, mono font, rounded window with traffic-light dots).
   Directly echoes reference screenshot #1.
2. **Fit-score gauge** — glowing arc (green→cyan) in the dark hero. Built with the
   `dataviz` skill. The score number set in JetBrains Mono.

## Implementation notes (Streamlit + custom CSS)

- Inject fonts + tokens via `st.markdown(unsafe_allow_html=True)` with a `<style>` block.
- Render hero, diff cards, and gauge as custom HTML blocks (Streamlit widgets for
  the two text areas + Analyze button).
- Dark hero vs white results: wrap each in a full-width container `<div>` with its
  own background; mind Streamlit's default padding.
- Accessibility floor: visible keyboard focus, sufficient contrast on both themes,
  `prefers-reduced-motion` respected for any glow animation.

## Skills to invoke when building the UI

- `frontend-design` — overall aesthetic (already consulted for this brief).
- `theme-factory` — formalize the tokens above into a reusable theme.
- `dataviz` — the fit-score gauge and any gap-analysis charts.
- `image` — hero glow assets / OG image (Phase 4).
