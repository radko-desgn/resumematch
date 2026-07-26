"""Generic ResumeMatch carousel renderer.

Turns structured slide data (from the ig-carousel skill) into on-brand
1080x1350 PNGs, reusing the Coming Soon design system so text is never
hard-coded across scattered scripts. It also measures each slide for text
overflow/clipping and reports it.

Output: docs/social/instagram/<campaign>/<slug>-01.png ...

A slide is a dict:
    {
      "eyebrow": "The problem",
      "headline_html": 'Your CV may be <span class="hl">good</span>.',  # chip a key word
      "lede": "Supporting line.",        # optional
      "lede_class": "wide",              # optional ("wide" for longer copy)
      "extra": "",                        # optional raw HTML (e.g. a CTA pill)
    }

    from backend.carousel import render_carousel
    render_carousel("launch", "cv-good-still-wrong", slides)
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from backend.coming_soon import W, H, _logo, _page

OUT_ROOT = Path(__file__).parent.parent / "docs" / "social" / "instagram"


@dataclass
class RenderResult:
    paths: list[Path]
    warnings: list[str]


def render_carousel(campaign: str, slug: str, slides: list[dict],
                    out_root: Path = OUT_ROOT) -> RenderResult:
    """Render a carousel to docs/social/instagram/<campaign>/<slug>-NN.png.

    Never overwrites a different campaign/slug silently — each campaign gets its
    own folder and each carousel its own slug prefix.
    """
    from PIL import Image
    from playwright.sync_api import sync_playwright

    if not _logo():
        raise SystemExit("logo asset missing (backend/assets/logo-white.png)")

    out_dir = out_root / campaign
    out_dir.mkdir(parents=True, exist_ok=True)
    total = len(slides)
    paths: list[Path] = []
    warnings: list[str] = []

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": W, "height": H}, device_scale_factor=2)
        for i, s in enumerate(slides, start=1):
            html = _page(
                i,
                s["eyebrow"],
                s["headline_html"],
                s.get("lede", ""),
                s.get("extra", ""),
                s.get("lede_class", ""),
                total=total,
            )
            page.set_content(html, wait_until="networkidle")
            page.wait_for_timeout(500)

            # Clipping guard: does the centered content column overflow its box?
            overflow = page.evaluate(
                "() => { const m=document.querySelector('.mid');"
                " return Math.max(0, m.scrollHeight - m.clientHeight); }"
            )
            if overflow and overflow > 2:
                warnings.append(f"slide {i}: content overflows by ~{overflow}px (shorten copy)")

            path = out_dir / f"{slug}-{i:02d}.png"
            tmp = out_dir / f"_{slug}-{i:02d}.png"
            page.screenshot(path=str(tmp))
            img = Image.open(tmp)
            if img.size != (W * 2, H * 2):
                warnings.append(f"slide {i}: unexpected raw size {img.size}")
            img.resize((W, H), Image.LANCZOS).save(path)  # crisp 1080x1350
            tmp.unlink(missing_ok=True)
            paths.append(path)
        browser.close()

    return RenderResult(paths=paths, warnings=warnings)


if __name__ == "__main__":
    # Smoke test: a labelled-demo 3-slide sample.
    demo = [
        {"eyebrow": "The problem", "headline_html": 'Your CV may be <span class="hl">good</span>.',
         "lede": "And still wrong for this specific job.", "lede_class": "wide"},
        {"eyebrow": "Why", "headline_html": 'A score needs <span class="hl">evidence</span>.',
         "lede": "64% means nothing until you see what's met and what's missing.", "lede_class": "wide"},
        {"eyebrow": "Do this", "headline_html": 'Know the gap <span class="hl met">first</span>.',
         "lede": "Check the fit before you apply.", "lede_class": "wide"},
    ]
    res = render_carousel("_smoke", "sample", demo)
    for p_ in res.paths:
        print(f"wrote {p_}")
    print("warnings:", res.warnings or "none")
