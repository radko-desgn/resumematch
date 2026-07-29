"""Launch reel — a punchy 9:16 brand reel (text + motion), ~14s.

Not a screen recording: an animated, on-brand text reel
(hook -> problem -> product proof -> CTA) rendered at native 1080x1920 so text
stays crisp, with all content inside Instagram's safe zone. Playwright records
webm; the bundled ffmpeg transcodes to an IG-friendly mp4 (H.264, 30fps).

    python -m backend.post_release_reel
    # -> docs/social/instagram/release/release-reel.mp4
"""

from __future__ import annotations

import subprocess
from pathlib import Path

import imageio_ffmpeg

from backend.coming_soon import _logo

OUT_DIR = Path(__file__).parent.parent / "docs" / "social" / "instagram" / "release"
W, H = 1080, 1920
DURATION_MS = 14300  # recording length; last scene holds to the end

HTML = f"""<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  * {{ margin:0; box-sizing:border-box; }}
  html,body {{ width:{W}px; height:{H}px; background:#0A0A0A; overflow:hidden; }}
  body {{ font-family:Inter,sans-serif; color:#fff; position:relative; }}
  .logo {{ position:absolute; top:130px; left:0; right:0; text-align:center; }}
  .logo img {{ height:44px; }}
  .stage {{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center; }}
  .scene {{ position:absolute; width:920px; text-align:center;
            opacity:0; transform:translateY(30px);
            transition:opacity .5s ease, transform .5s ease; }}
  .scene.on {{ opacity:1; transform:none; }}
  h1 {{ font-family:Montserrat,sans-serif; font-weight:800; letter-spacing:-.02em;
        font-size:118px; line-height:1.06; }}
  .sub {{ margin-top:36px; font-size:42px; color:rgba(255,255,255,.62); line-height:1.4; }}
  .eyebrow {{ font-size:28px; letter-spacing:.32em; text-transform:uppercase;
              color:rgba(255,255,255,.45); margin-bottom:34px; }}
  .hl {{ background:#fff; color:#0A0A0A; border-radius:16px; padding:.02em .2em; }}
  .hl.met {{ background:#12935C; color:#fff; }}
  .score {{ font-family:Montserrat,sans-serif; font-weight:800; font-size:210px; line-height:1; }}
  .score i {{ font-style:normal; font-size:74px; color:rgba(255,255,255,.5); }}
  .rows {{ margin:44px auto 0; width:600px; text-align:left; }}
  .row {{ display:flex; justify-content:space-between; align-items:center;
          font-size:40px; padding:16px 0; border-bottom:1px solid rgba(255,255,255,.1); }}
  .tag {{ font-size:28px; font-weight:700; padding:7px 20px; border-radius:12px; }}
  .cta {{ display:inline-block; margin-top:40px; background:#fff; color:#0A0A0A;
          font-family:Montserrat,sans-serif; font-weight:800; font-size:52px;
          padding:24px 50px; border-radius:100px; }}
  .bib {{ margin-top:30px; font-size:38px; color:rgba(255,255,255,.5); }}
</style></head><body>
  <div class="logo"><img src="{_logo()}"></div>
  <div class="stage">
    <div class="scene" id="s1"><h1>Good CV.<br><span class="hl">Wrong</span> job.</h1></div>
    <div class="scene" id="s2"><h1>You apply.<br><span class="hl">Silence.</span></h1><div class="sub">Same CV for every role.</div></div>
    <div class="scene" id="s3">
      <div class="eyebrow">See the fit &middot; example</div>
      <div class="score">68<i>%</i></div>
      <div class="rows">
        <div class="row"><span>SQL</span><span class="tag" style="color:#12935C;background:rgba(18,147,92,.16)">met</span></div>
        <div class="row"><span>A/B testing</span><span class="tag" style="color:#C79A3E;background:rgba(199,154,62,.16)">partial</span></div>
        <div class="row"><span>Looker</span><span class="tag" style="color:#D64545;background:rgba(214,69,69,.16)">missing</span></div>
      </div>
      <div class="sub">Every requirement, before you apply.</div>
    </div>
    <div class="scene" id="s4">
      <div class="eyebrow">Now live &middot; free to try</div>
      <h1>See your <span class="hl met">match</span>.</h1>
      <div class="cta">resumematch.pro</div>
      <div class="bib">@resumematch.pro</div>
    </div>
  </div>
<script>
  // [id, fade-in ms, fade-out ms] — last scene holds past the recording end.
  const T = [["s1",200,3000],["s2",3200,6200],["s3",6400,10400],["s4",10600,99000]];
  for (const [id,inMs,outMs] of T) {{
    setTimeout(()=>document.getElementById(id).classList.add("on"), inMs);
    setTimeout(()=>document.getElementById(id).classList.remove("on"), outMs);
  }}
</script></body></html>"""


def record() -> Path:
    from playwright.sync_api import sync_playwright

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(
            viewport={"width": W, "height": H},
            device_scale_factor=1,
            record_video_dir=str(OUT_DIR),
            record_video_size={"width": W, "height": H},
        )
        pg = ctx.new_page()
        pg.set_content(HTML, wait_until="networkidle")
        pg.evaluate("document.fonts.ready")  # ensure webfonts are painted
        pg.wait_for_timeout(DURATION_MS)
        ctx.close()  # finalises the webm
        video_path = Path(pg.video.path())
        browser.close()

    mp4 = OUT_DIR / "release-reel.mp4"
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    subprocess.run(
        [ffmpeg, "-y", "-i", str(video_path),
         "-c:v", "libx264", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
         "-r", "30", str(mp4)],
        check=True, capture_output=True,
    )
    video_path.unlink(missing_ok=True)
    return mp4


if __name__ == "__main__":
    out = record()
    print(f"wrote {out} ({out.stat().st_size // 1024} KB)")
