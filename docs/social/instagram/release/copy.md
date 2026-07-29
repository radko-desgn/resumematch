# Launch / "RELEASED" — carousel + reel

On-brand (black background, white logo, green ONLY as the meaning accent chip).
Distinct from the coming-soon set through the **message** — it's released, first
scan free — not through off-brand colours. Product is live at resumematch.pro.
Rendered via `backend/post_release.py` (carousel) and
`backend/post_release_reel.py` (reel).

## Carousel (4 slides — `release-01..04.png`, 1080×1350)
1. The wait is over — **It's [released].** / Your first scan is free. *(released = green chip)*
2. No account. No catch. — **Your first scan is [free].** / Paste your CV and a job post. See your fit in ~15 seconds.
3. What you get — **Met, partial, missing.** *(+ labelled demo result card)*
4. It's live · free to try — **Scan your CV [free].** / resumematch.pro · @resumematch.pro

## Carousel caption (~110 words)
It's released. ResumeMatch is live — and your first scan is free.

Paste your CV and a job post and see how you actually stack up against that exact role: a real match score, every requirement marked met, partial, or missing, and the evidence behind each one pulled straight from your CV. Nothing invented.

No account, no catch. It takes about 15 seconds.

Try it free: resumematch.pro

**Short:** ResumeMatch is released — and your first scan is free. See how your CV fits a specific job before you apply. resumematch.pro

**Hashtags:** #jobsearch #resumetips #careeradvice #jobhunting #cv #jobseekers #ats

## Reel (`release-reel.mp4`, 1080×1920, 9:16, ~15s, 30fps)
Black background throughout, green as the accent chip — same identity as the carousel.
- **0–3s** The wait is over → **It's [released].**
- **3–6s** No account. No catch. → **Your first scan is [free].**
- **6–10s** See the fit · example → **68%** + SQL met · A/B testing partial · Looker missing (labelled example)
- **10–15s** Now live · free to try → **Scan your CV [free].** → resumematch.pro · @resumematch.pro

### Reel caption
It's released — and your first scan is free. See how your CV fits a specific job before you apply: met, partial, and missing, from real evidence. Try it → resumematch.pro

**Hashtags:** #jobsearch #resumetips #jobhunting #cv #careeradvice #jobseekers

**Audio:** add a subtle upbeat trending track in the IG app on upload.

## Boost plan (ig-boost)
- **Reel first** (most reach). Objective **Traffic** → resumematch.pro. ~€5–8/day, 4–5 days. Placement Reels + Stories.
- **Carousel** as the feed companion. Objective Traffic; feed + Explore.
- Audience: job seekers 22–45; interests LinkedIn / Indeed / Résumé / Career; English-speaking (paying markets UK / Ireland / Australia / Canada). Same-cost clusters together.
- Track link clicks + landings on resumematch.pro + free scans run.

## Claims audit (ig-guardian): PASS
Released / live / free scan are accurate. No waitlist, no invented users/stats. The 68% + statuses is labelled **example**. Real handle @resumematch.pro. No banned phrases; no em dashes in captions.

## Reproduce
`python -m backend.post_release` · `python -m backend.post_release_reel`
