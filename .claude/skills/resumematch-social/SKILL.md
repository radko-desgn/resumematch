---
name: resumematch-social
description: Canonical brand, product-truth, tone, and claims context for all ResumeMatch Instagram/social content skills. Load this first (or reference it) before generating any ResumeMatch social copy, hooks, carousels, reels, captions, calendars, or reviews so every output stays aligned with the product, the brand, and the no-invention promise.
---

# ResumeMatch — shared social context

This is the single source of truth every ResumeMatch marketing skill reads
before producing anything. Do not copy product facts into other skills; point
here. The deeper engineering reference is [`PRODUCT.md`](../../../PRODUCT.md);
brand notes are in [`docs/DESIGN.md`](../../../docs/DESIGN.md).

## Product in one line

ResumeMatch compares a person's CV against a specific job post **before they
apply**, and returns an honest, evidence-backed read on how well they fit.

## What it actually returns

Overall match score (0–100) · plain-language verdict · requirement-by-requirement
coverage (met / partial / missing) · evidence quoted from the CV · strengths ·
critical gaps · quick-win recommendations · rewritten CV bullets · a tailored CV
for the role · PDF and DOCX export.

## The core promise (never break this in copy)

**ResumeMatch never invents experience, skills, tools, achievements, or metrics.**
Every judgment cites evidence from the CV. Rewriting improves phrasing and
relevance only; it never fabricates facts. Marketing must preserve this — it is
the differentiator, not a footnote.

## Audience

Job seekers who apply and hear nothing, and don't know why: people reusing one
CV for every role, unsure if they fit, tired of guessing before they hit Apply.
Speak to that frustration first; introduce the product as the resolution.

Emotional transformation to sell:
- Before: "I keep applying and have no idea what's wrong."
- After: "I know exactly how my CV fits this role and what to improve."

## Current product state — VERIFY before every claim

As of the last update, on the **deployed** site (resumematches.vercel.app):

| Thing | State | What copy may say |
|---|---|---|
| AI analysis | **Mocked** on deploy (canned sample scores; real engine exists, needs a key) | Do NOT tell people to "check your real CV now"; the live free check returns a demo sample. Frame as "coming soon" / "follow for launch". |
| Payments | **Simulated** (no Stripe) | Never imply you can buy anything. |
| Email delivery | Not production-configured | Don't promise emailed reports as a live feature. |
| Google sign-in | Works but consent screen in **Testing** (test users only) | Don't promote "sign in with Google" publicly. |
| Custom domain | **Not bought**; lives on vercel.app | Don't print a branded domain. |
| Legal pages | **Draft, noindex** | Don't cite them as final. |
| Waitlist | **Does not exist** | NEVER say "join the waitlist / early-access list / link in bio to sign up". |
| Testimonials / users / results | **None** | NEVER invent any. |
| Launch status | Pre-launch (demo is viewable) | Lead with value; mention launch near the end. |

**The only accurate primary CTA right now:** *Follow @resumematch to know when it
goes live.* If product state changes, update this table first, then the CTAs.

## Never invent

Testimonials, user counts, interview outcomes, conversion rates, success stats,
recruiter endorsements, hiring outcomes, job offers, performance metrics, launch
dates. Synthetic examples must be explicitly labelled **"demo / example."**

## Tone

Direct, intelligent, empathetic, calm, credible, modern, concise, useful,
confident without exaggeration. Write like a knowledgeable friend helping someone
frustrated with their job search.

Avoid: fake urgency/scarcity, emoji spam, corporate jargon, motivational clichés,
manipulative fear, vague claims, exclamation overload, "game-changing",
"revolutionary", "next-generation", "AI-powered" as the main value prop,
clickbait, shaming job seekers, or attacking recruiters/ATS without evidence.

Never open with: "We're excited to announce", "Coming soon", "Introducing
ResumeMatch", "Our revolutionary AI", "Unlock your potential", generic startup
language.

## Content pillars

1. **Job-search pain** — applying with no replies, no feedback, one CV for every role.
2. **Education** — CV quality vs job fit; requirements → evidence; what ATS can/can't do; tailoring honestly.
3. **Product proof** — realistic, privacy-safe demo results (score, chips, evidence, before/after bullet).
4. **Ethical differentiation** — why fabricated skills backfire; tailored ≠ invented.
5. **Founder / build journey** — real, repo-sourced facts only (design decisions, anti-hallucination, scoring). No invented personal stories.
6. **Launch / updates** — used sparingly; value first, update last.

Balance: education + pain should dominate; product posts demonstrate rather than
announce; launch posts are rare.

## Brand & visual rules (for visual direction notes only)

Background `#FFFFFF`, foreground `#0A0A0A`; met/success `#12935C`; missing/gap
`#D64545`. Montserrat (display), Inter (body), JetBrains Mono (scores/labels/
evidence/data). Minimal, high-contrast, generous whitespace, restrained motion,
no decorative gradients. The product UI / diagnostic (score, verdict, status
chips, evidence excerpts, before/after bullets) should be the visual hero.

## CTA rules

One primary CTA per post. It must point at something that exists. Given the
current state, prefer: **"Follow for launch"** / "Follow the build" / "Save this
for your next application." Use "Run a free Quick Check / check your CV" **only
once live AI is enabled** (update the state table first). Never "join the
waitlist."

## Privacy rules

No real user data, CV text, names, employers, or personal data without explicit
permission. Use fictional/sanitised demo content and label it. Strip anything
company-confidential.

## Acceptable vs unacceptable copy

Acceptable:
- "Your CV may be good, and still wrong for this job."
- "A 72% match can still hide one serious gap."
- "Tailoring your CV shouldn't mean inventing experience."
- "The job asks for this. Does your CV prove it?"

Unacceptable:
- "Join the waitlist" (no waitlist).
- "Trusted by thousands of job seekers" (no users).
- "Guaranteed interviews" / "Beat the ATS every time" (unsupported).
- "Our revolutionary AI-powered platform" (jargon, wrong positioning).
- "Check your real CV now" while analysis is mocked (misleading).

## Reusable existing skills to lean on

Compose with the installed skills instead of reimplementing them:
`copywriting`, `social`, `hook-generator`, `humanizer`, `ad-creative`,
`content-strategy`, `launch`, `brand-guidelines`. Run **`humanizer`** on final
prose, then re-check claims.
