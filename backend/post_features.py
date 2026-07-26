"""Render the 'features intro' Instagram carousel.

Reuses the Coming Soon post's design system (backend/coming_soon.py). Copy only
differs. Output to its own folder.

    python -m backend.post_features   # -> docs/social/features/slide-1..3.png
"""

from __future__ import annotations

from pathlib import Path

from backend.coming_soon import W, H, HEAD, _logo, _page

OUT_DIR = Path(__file__).parent.parent / "docs" / "social" / "features"


SLIDE_1 = _page(
    1,
    "Meet ResumeMatch",
    f'<span style="{HEAD}">AI that never <span class="hl">invents</span>.</span>',
    "It measures your real CV against a real job post. Every judgment is backed by evidence, never made up.",
    lede_class="wide",
)

SLIDE_2 = _page(
    2,
    "How it works",
    f'<span style="{HEAD}">See where you <span class="hl">stand</span>.</span>',
    "It reads the job's requirements, matches each against your CV, and scores your fit from 0 to 100, with every criterion marked met or missing.",
    lede_class="wide",
)

SLIDE_3 = _page(
    3,
    "One click",
    f'<span style="{HEAD}">A CV tuned to the <span class="hl met">role</span>.</span>',
    "Generate an ATS-ready CV that reorders and rewords what you already have. It never invents experience you don't have.",
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
