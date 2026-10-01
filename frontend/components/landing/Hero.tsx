"use client";

import { Wizard } from "../wizard/Wizard";
import { RotatingText } from "./RotatingText";
import { Button } from "@/components/ui/button";
import { COMING_SOON, INSTAGRAM_URL } from "@/lib/config";

const ROTATING = [
  "Analyze & Score your fit",
  "Highlight your Pain Points",
  "Compare against Job Offers",
  "Generate a Tailored CV",
];

export function Hero() {
  return (
    <section id="top" className="bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-6xl px-5 pt-12 pb-16 sm:pt-16 sm:pb-24 text-center">
        {/* entrances are CSS (.mk-rise / .mk-line in globals.css), not framer-motion:
            server-rendered at opacity 0, the text couldn't paint until hydration,
            which held mobile LCP back by seconds */}
        <div className="mk-rise">
          <div className="flex items-center justify-center gap-3 text-white/50">
            <span className="h-px w-8 bg-white/25" />
            <span className="eyebrow">{COMING_SOON ? "Coming soon" : "AI Job-Match Analyzer"}</span>
            <span className="h-px w-8 bg-white/25" />
          </div>

          <h1 className="mx-auto mt-6 max-w-4xl font-display text-[2.1rem] leading-[1.08] sm:text-[3.4rem] sm:leading-[1.06]">
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="block mk-line [--mk-delay:80ms]">
                AI platform to
              </span>
            </span>{" "}

            {/* same mask reveal as the fixed lines, staggered between them */}
            <span className="block overflow-hidden pb-[0.08em] my-1 sm:my-1.5">
              <span className="block mk-line [--mk-delay:150ms]">
                <RotatingText phrases={ROTATING} />
              </span>
            </span>{" "}

            <span className="block overflow-hidden pb-[0.08em]">
              <span className="block mk-line [--mk-delay:220ms]">
                for your next job application.
              </span>
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-[15px] sm:text-lg text-white/60 leading-relaxed">
            Upload your CV, link any job post, get instant match insights, and automatically
            generate an ATS-optimized CV tailored specifically for the role.
          </p>
        </div>

        {/* the wizard — primary focal point */}
        {COMING_SOON ? (
          <div
            id="analyze"
            className="mk-rise [--mk-from:24px] [--mk-dur:550ms] [--mk-delay:150ms] relative mt-10 sm:mt-14 scroll-mt-20"
          >
            {/* the real scanner, shown but inert so visitors can see it's a
                genuine product while it's not yet open to the public */}
            <div
              className="pointer-events-none select-none opacity-25 blur-[3px]"
              aria-hidden
              {...({ inert: "" } as Record<string, unknown>)}
            >
              <Wizard />
            </div>

            {/* coming-soon overlay */}
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0A0A0A]/85 p-8 text-center shadow-2xl backdrop-blur-sm">
                <span className="eyebrow text-white/45">Launching soon</span>
                <h2 className="mt-3 font-display text-2xl leading-tight">
                  The scanner is almost ready.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  Match your CV to any job offer on another level. Follow along and
                  you&apos;ll know the day it goes live.
                </p>
                <Button asChild variant="invert" size="lg" className="mt-6 w-full">
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                    Follow for launch
                  </a>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div
            id="analyze"
            className="mk-rise [--mk-from:24px] [--mk-dur:550ms] [--mk-delay:150ms] mt-10 sm:mt-14 scroll-mt-20"
          >
            <Wizard />
          </div>
        )}
      </div>
    </section>
  );
}
