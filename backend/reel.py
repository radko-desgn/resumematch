"""Record a vertical 'how it works' reel of the live app.

Screen-captures the real product through the actual wizard — add CV, add job,
watch the analysis, see the score — at 1080x1920 (9:16) with a caption bar, so
it reads as an explainer. No AI video, no credits: it's the real app.

Playwright records webm; the bundled ffmpeg transcodes to Instagram-friendly
mp4 (H.264 + yuv420p).

    python -m backend.reel            # -> docs/social/reel.mp4
"""

from __future__ import annotations

import subprocess
from pathlib import Path

import httpx
import imageio_ffmpeg

OUT_DIR = Path(__file__).parent.parent / "docs" / "social"
import os
SITE = os.environ.get("REEL_SITE", "https://resumematches.vercel.app")
API = os.environ.get("REEL_API", "https://resumematch-api-40kl.onrender.com")

# Mobile CSS viewport (<640 -> Tailwind mobile layout), 9:16, recorded at 2x
# so the file is a crisp 1080x1920.
VW, VH = 540, 960

# Matched to the demo engine's canned persona so the result reads coherently on
# camera (a real key would analyse whatever you paste; the free demo is fixed).
CV = (
    "Jordan Rivera — Backend / Platform Engineer\n"
    "4 years building and operating Python web services at scale.\n"
    "Shipped a FastAPI service handling 3M requests/day.\n"
    "Migrated reporting to PostgreSQL, 4x faster queries.\n"
    "Automated deploys with GitHub Actions and Docker.\n"
    "Side project: RSS summariser using an open-source LLM."
)
JOB = (
    "AI Engineer — Applied LLM Platform (Remote). "
    "Requirements: 3+ years Python, production APIs, PostgreSQL, Docker & CI/CD. "
    "Nice to have: RAG / embeddings, and Kubernetes experience."
)

CAPTION_JS = """
(text) => {
  let bar = document.getElementById('reel-cap');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'reel-cap';
    Object.assign(bar.style, {
      position: 'fixed', top: '0', left: '0', right: '0', zIndex: '2147483647',
      padding: '18px 22px', textAlign: 'center',
      font: '700 26px/1.25 Montserrat, Inter, sans-serif', color: '#fff',
      background: 'linear-gradient(rgba(10,10,10,.92), rgba(10,10,10,.72))',
      letterSpacing: '-.01em', pointerEvents: 'none',
      transition: 'opacity .3s', opacity: '0',
    });
    document.body.appendChild(bar);
  }
  bar.textContent = text;
  bar.style.opacity = text ? '1' : '0';
}
"""


def _warm() -> None:
    """Wake the free-tier backend and load the embedding model, so the reel's
    scan resolves in ~1s instead of a 30-60s cold start that would pad the
    recording. Repeats until a scan comes back quickly (warm) or we give up."""
    import time

    try:
        httpx.get(f"{API}/api/health", timeout=90)
    except Exception:
        return
    for i in range(4):
        try:
            t0 = time.time()
            httpx.post(
                f"{API}/api/analyze",
                data={"cv_kind": "text", "job_kind": "text", "mock": "true", "full": "false",
                      "cv_text": CV, "job_text": JOB, "email": f"warmup{i}@example.com"},
                timeout=120,
            )
            dt = time.time() - t0
            print(f"  warm-up scan {i}: {dt:.1f}s")
            if dt < 4:
                return  # backend is hot
        except Exception:
            return


def record() -> Path:
    from playwright.sync_api import sync_playwright

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    _warm()

    with sync_playwright() as p:
        browser = p.chromium.launch()
        # Record at the viewport's own size (Playwright places the page at its
        # CSS pixels inside the video canvas rather than scaling to fill it, so
        # a mismatched canvas leaves black bars). We record at 540x960 mobile
        # layout, then upscale to 1080x1920 in ffmpeg.
        ctx = browser.new_context(
            viewport={"width": VW, "height": VH},
            device_scale_factor=2,
            record_video_dir=str(OUT_DIR),
            record_video_size={"width": VW, "height": VH},
        )
        pg = ctx.new_page()
        cap = lambda t: pg.evaluate(CAPTION_JS, t)  # noqa: E731

        pg.goto(SITE, wait_until="domcontentloaded")
        pg.wait_for_timeout(2500)

        # Hook (over the hero)
        cap("Know if your CV fits — before you apply")
        pg.wait_for_timeout(2600)

        # Step 1 — CV
        cap("1 · Add your CV")
        pg.click("a[href='#analyze']")
        pg.wait_for_timeout(1200)
        pg.fill("#analyze textarea", CV)
        pg.wait_for_timeout(2600)
        pg.click("#analyze button:has-text('Continue')")
        pg.wait_for_timeout(900)

        # Step 2 — job + email
        cap("2 · Paste the job post")
        pg.fill("#analyze textarea", JOB)
        pg.wait_for_timeout(2400)
        pg.fill("#free-scan-email", "maria@example.com")
        pg.wait_for_timeout(1200)

        # Step 3 — analyze
        cap("AI reads both and matches them")
        pg.click("#analyze button:has-text('Get my score')")
        pg.wait_for_timeout(4800)  # the processing animation

        # Step 4 — result
        try:
            pg.wait_for_selector("#analyze button:has-text('Start over')", timeout=60000)
        except Exception:
            pass
        cap("Your match score — instantly")
        pg.wait_for_timeout(1200)
        pg.evaluate("document.querySelector('#analyze')?.scrollIntoView({block:'start'})")
        pg.wait_for_timeout(4200)
        cap("")
        pg.wait_for_timeout(600)

        ctx.close()  # finalises the webm
        video_path = Path(pg.video.path())
        browser.close()

    mp4 = OUT_DIR / "reel.mp4"
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    subprocess.run(
        [ffmpeg, "-y", "-i", str(video_path),
         "-vf", "scale=1080:1920:flags=lanczos",
         "-c:v", "libx264", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
         "-r", "30", str(mp4)],
        check=True, capture_output=True,
    )
    video_path.unlink(missing_ok=True)
    return mp4


if __name__ == "__main__":
    out = record()
    print(f"wrote {out} ({out.stat().st_size // 1024} KB)")
