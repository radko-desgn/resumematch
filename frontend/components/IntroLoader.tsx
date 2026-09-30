/*
 * First-visit intro (motion-kit `intro-draw`): the mark draws itself — the P,
 * then the check — on the hero's black, then the layer fades into the page.
 *
 * It is server-rendered and pure CSS, so it is on screen from the first paint
 * and never waits for JS. INTRO_SCRIPT decides whether it plays: once per
 * browser session, never with reduced motion, and never without JS (no
 * `data-intro` attribute → the layer stays display:none).
 *
 * The hero is deliberately NOT delayed behind it: text painted under the layer
 * still counts for LCP, so the page loads at full speed and the layer fades
 * onto a settled hero (delaying it cost ~1.4s of LCP on first visits).
 *
 * The paths are traced from public/mark-*.png in its own 253×261 grid.
 */

export const INTRO_SCRIPT = `try{var h=document.documentElement;h.dataset.intro=sessionStorage.getItem("rm-intro")||matchMedia("(prefers-reduced-motion: reduce)").matches?"seen":"play";sessionStorage.setItem("rm-intro","1")}catch(e){}`;

export function IntroLoader() {
  return (
    <div className="mk-intro" aria-hidden="true">
      <svg viewBox="-8 -8 269 277" width="72" height="74" fill="none" stroke="currentColor" strokeWidth="13" strokeLinecap="round">
        <path className="mk-intro-p" pathLength={1} d="M18.5 241.5V19.5H137A60.5 60.5 0 0 1 137 140.5H101.5" />
        <path className="mk-intro-check" pathLength={1} strokeLinejoin="round" d="M57 183.5L108 234.5Q122 248.5 136 234.5L232.5 138" />
      </svg>
    </div>
  );
}
