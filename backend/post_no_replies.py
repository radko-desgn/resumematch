"""Render the 'why you get no replies' Instagram carousel.

Reuses the exact style of the Coming Soon post (backend/coming_soon.py): same
centered layout, monochrome palette, highlight chips, logo, rings and dots.
Only the copy changes. Output goes to its own folder.

    python -m backend.post_no_replies   # -> docs/social/why-no-replies/slide-1..3.png
"""

from __future__ import annotations

from pathlib import Path

# Reuse the last post's design system verbatim.
from backend.coming_soon import W, H, HEAD, _logo, _page

OUT_DIR = Path(__file__).parent.parent / "docs" / "social" / "why-no-replies"


SLIDE_1 = _page(
    1,
    "Sound familiar?",
    f'<span style="{HEAD}">Dozens of CVs.<br><span class="hl">Silence</span>.</span>',
    "You're applying blindly, and it's quietly costing you.",
)

SLIDE_2 = _page(
    2,
    "Here's why",
    f'<span style="{HEAD}">A robot reads it <span class="hl">first</span>.</span>',
    "Most CVs are ranked by software before a human ever sees them. Miss the job's keywords and you're filtered out, with no reply and no reason.",
    lede_class="wide",
)

SLIDE_3 = _page(
    3,
    "The shift",
    f'<span style="{HEAD}">Check the <span class="hl met">fit</span> first.</span>',
    "Match your CV to the job before you apply, and see exactly what's missing. Your first check is free.",
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
            page.wait_for_timeout(600)  # webfonts
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
