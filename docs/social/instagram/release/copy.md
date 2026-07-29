# Launch / "It's live" — carousel + reel

Produced via the ig-* skills against the updated (LIVE) shared context. Product is
live at resumematch.pro, so the CTA is now **"Try your free check"** (no longer
"follow for launch"). Rendered with the brand system:
`backend/post_release.py` (carousel) and `backend/post_release_reel.py` (reel).

## Carousel (4 slides — `release-01..04.png`, 1080×1350)
1. Now live — **Know if your CV fits.** / Before you apply. Free to try.
2. What it does — **Your CV vs the exact job.** / Scored from real evidence in your CV. Nothing invented.
3. See the gaps — **Met, partial, missing.** / Every requirement, checked before you apply. *(+ demo result card, labelled)*
4. It's live — **See your match.** / CTA: Free check · resumematch.pro · @resumematch.pro

### Carousel caption (~110 words, humanized)
It's live. ResumeMatch checks your CV against the exact job before you apply, and shows you where you actually stand.

You get a real match score, every requirement marked met, partial, or missing, and the evidence behind each one, pulled straight from your CV. Nothing invented, just what's already there, made clear.

The quick check is free, no account needed. Paste your CV and a job post and see your fit in about 15 seconds.

Try it: resumematch.pro

**Short:** ResumeMatch is live. See how your CV fits a specific job before you apply — met, partial, and missing, from real evidence. Free to try: resumematch.pro

**Hashtags:** #jobsearch #resumetips #careeradvice #jobhunting #cv #jobseekers #ats

## Reel (`release-reel.mp4`, 1080×1920, 9:16, ~15s, 30fps)
Beat-by-beat (text-driven, safe-zone aware):
- **0–3s** Hook: *Good CV. Wrong job.*
- **3–6s** Problem: *You apply. Silence.* / Same CV for every role.
- **6–10s** Product (example): *68%* + SQL met · A/B testing partial · Looker missing / Every requirement, before you apply. **Labelled "example."**
- **10–15s** CTA: *Now live · free to try* → **See your match.** → resumematch.pro · @resumematch.pro

### Reel caption
Good CV, wrong job? Now you can check before you apply. ResumeMatch scores your CV against the exact role and shows what's met, partial, and missing — from real evidence. Free to try → resumematch.pro

**Hashtags:** #jobsearch #resumetips #jobhunting #cv #careeradvice #jobseekers

**Audio:** add a subtle trending track in the IG app on upload (the visuals are muted-friendly; keep the audio low-key, on brand).

## Boost plan (ig-boost) — now with a real destination
The product is live, so you can boost for **Traffic / conversions**, not just follows.
- **Reel first.** Reels get the most reach and are the strongest boost format. Objective: **Traffic** (to resumematch.pro) or Reach/Engagement. ~€5–8/day for 4–5 days. Placement: **Reels + Stories** (it's 9:16).
- **Carousel** as the feed companion. Objective: Traffic or profile visits; placement feed + Explore.
- Audience: job seekers, age 22–45, interests LinkedIn / Indeed / Résumé / Career / Job interview; English-speaking (for paying markets: UK / Ireland / Australia / Canada, per earlier). Keep same-cost country clusters together.
- Watch: **link clicks + landing on resumematch.pro + free scans run** (not just profile visits — there's a real product now).

## Claims audit (ig-guardian): PASS
- CTA "Try your free check at resumematch.pro" is accurate — the product and the free quick check are live.
- No waitlist. No invented users, testimonials, statistics, or outcomes.
- The 68% + met/partial/missing is an **example**, labelled as such in both the carousel (demo card) and the reel (eyebrow "example").
- Requirement→evidence and met/partial/missing are real capabilities. Handle is the real @resumematch.pro. No banned phrases; no em dashes in captions.

## Reproduce
`python -m backend.post_release` · `python -m backend.post_release_reel`
