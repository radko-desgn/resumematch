"""Render the 'Coming Soon / Early Access' Instagram carousel.

Reuses the Coming Soon post's design system (backend/coming_soon.py). Copy only.

    python -m backend.post_early_access   # -> docs/social/early-access/slide-1..3.png
"""

from __future__ import annotations

from pathlib import Path

from backend.coming_soon import W, H, HEAD, _logo, _page

OUT_DIR = Path(__file__).parent.parent / "docs" / "social" / "early-access"


SLIDE_1 = _page(
    1,
    "Launching soon",
    f'<span style="{HEAD}">It\'s almost <span class="hl">here</span>.</span>',
    "ResumeMatch, the honest way to know if your CV fits, is about to launch.",
    lede_class="wide",
)

SLIDE_2 = _page(
    2,
    "Early access",
    f'<span style="{HEAD}">Your first check, <span class="hl met">free</span>.</span>',
    "Sign up for early access and get a free Quick Check, your CV scored against any job, the moment we go live.",
    lede_class="wide",
)

SLIDE_3 = _page(
    3,
    "Don't miss it",
    f'<span style="{HEAD}">Claim your <span class="hl">spot</span>.</span>',
    "Spots are limited before the public launch. Grab the link in bio and get in early.",
    lede_class="wide",
)

SLIDES = [SLIDE_1, SLIDE_2, SLIDE_3]


def render(out_dir: Path = OUT_DIR) -> list[Path]:
    from PIL import Image
    from playwright.sync_api import sync_playwright

    out_dir.mkdir(parents=True, exist_ok=True)
    written: list[Path] = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": W, "height": H}, device_scale_factor=2)
        for i, html in enumerate(SLIDES, start=1):
            page.set_content(html, wait_until="networkidle")
            page.wait_for_timeout(600)
            path = out_dir / f"slide-{i}.png"
            tmp = out_dir / f"_s{i}.png"
            page.screenshot(path=str(tmp))
            Image.open(tmp).resize((W, H), Image.LANCZOS).save(path)
            tmp.unlink(missing_ok=True)
            written.append(path)
        browser.close()
    return written


if __name__ == "__main__":
    if not _logo():
        raise SystemExit("logo asset missing")
    for p_ in render():
        print(f"wrote {p_} ({p_.stat().st_size // 1024} KB)")
