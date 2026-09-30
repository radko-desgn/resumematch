"use client";

import { useWipe } from "@/lib/useWipe";

const QA = [
  {
    q: "How do I get the most accurate match score?",
    a: "Paste the full text or upload a clean PDF/DOCX rather than a low-resolution screenshot. The more complete the CV and job description, the sharper the gap analysis.",
  },
  {
    q: "What's free vs. paid?",
    a: "You choose before we scan. The free quick check gives you the overall match percentage and a verdict, and never costs a credit. The deep AI analysis costs 1 scan credit and adds the executive summary, pain points, missing keywords, every gap with its evidence, and a branded PDF you can download. Credits start at €3.99 for a single pass, or €9.99 for six scans plus a tailored-CV credit. You can start free and upgrade afterwards. Payments are handled securely by Stripe.",
  },
  {
    q: "Will it invent experience to make me look good?",
    a: "Never. Rewrites only rephrase what's already in your CV to match the job's language — no fabricated skills, tools, or metrics. Every judgment cites evidence from your resume.",
  },
  {
    q: "Does it work for any role or industry?",
    a: "Yes. It reads the requirements from whatever job you give it and matches them against your CV, so it works across roles and fields.",
  },
  {
    q: "What happens to my data?",
    a: "Your CV and the job text are used only to run the analysis for your session — they aren't part of any training set.",
  },
];

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
