"use client";

import { useWipe } from "@/lib/useWipe";
import { FAQ_ITEMS as QA } from "@/lib/faq";

/*
 * motion-kit "credits roll": on desktop the title stays pinned while the
 * questions rise into place beside it. Native <details name> gives the
 * one-open-at-a-time accordion and keyboard support; the height animation is
 * CSS (`.mk-acc`) and simply snaps where the browser can't animate to auto.
 */
export function FAQ() {
  const wipe = useWipe<HTMLHeadingElement>();
  return (
    <section id="faq" className="scroll-mt-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <span className="eyebrow text-muted-foreground">FAQ &amp; tips</span>
          <h2 ref={wipe} className="mk-wipe mt-3 font-display text-3xl sm:text-5xl leading-[1.05]">
            Everything you need to know
          </h2>
        </div>
        <div className="border-t border-border">
          {QA.map((item, i) => (
            <details key={item.q} name="faq" open={i === 0} className="mk-acc mk-roll border-b border-border">
              <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 text-left">
                <span className="font-medium">{item.q}</span>
                <span className="mk-plus text-muted-foreground" aria-hidden />
              </summary>
              <p className="pb-5 text-sm text-muted-foreground max-w-2xl">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
