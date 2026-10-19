"use client";

import Image from "next/image";
import { useWipe } from "@/lib/useWipe";
import { useReveal } from "@/lib/useReveal";
import { Timer, Funnel, FileSearch, Gauge } from "lucide-react";
import { CountUp } from "./CountUp";

const BENEFITS = [
  { icon: Timer, title: "Save hours", body: "Stop hand-tailoring every application. Get the edits that matter in seconds." },
  { icon: Funnel, title: "Beat the ATS", body: "Mirror the job's real keywords so you clear the automated screeners." },
  { icon: FileSearch, title: "Find your gaps", body: "See exactly which requirements you miss — each one backed by evidence." },
  { icon: Gauge, title: "Instant fit check", body: "One honest score tells you whether a role is worth applying to at all." },
];

const STATS = [
  { value: "~30s", label: "per analysis" },
  { value: "0", label: "fabricated claims" },
  { value: "100%", label: "evidence-cited" },
];

export function Benefits() {
  const wipe = useWipe<HTMLHeadingElement>();
  const reveal = useReveal<HTMLElement>();
  return (
    <section ref={reveal} id="why" className="scroll-mt-16 bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <div className="max-w-2xl">
          <span className="eyebrow text-white/45">Why use it</span>
          <h2 ref={wipe} className="mk-wipe mt-3 font-display text-3xl sm:text-5xl leading-[1.05]">
            An unfair advantage on every application
          </h2>
        </div>

        <div className="mt-12 sm:mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="mk-reveal rounded-2xl border border-white/12 bg-white/[0.03] p-7 transition-colors duration-300 hover:border-white/30 hover:bg-white/[0.06]"
            >
              {/* same tile as How it works, inverted for the black band */}
              <div className="flex size-11 items-center justify-center rounded-xl bg-white text-[#0A0A0A]">
                <b.icon className="size-5" />
              </div>
              <h3 className="mt-5 font-display text-lg">{b.title}</h3>
              <p className="mt-2 text-sm text-white/55 leading-relaxed">{b.body}</p>
            </div>
          ))}
        </div>

        {/* the actual output — a white app window reads strongly on the black band */}
        <div className="mk-reveal [--mk-from:20px] [--mk-dur:500ms] mt-14">
          <Image
            src="/visuals/result-preview.png"
            alt="Example ResumeMatch result: 78% match with evidence-backed requirement coverage and a suggested rewrite"
            width={2040}
            height={1250}
            // eager, not the default lazy: this is the section's payoff visual.
            // The lazy IntersectionObserver was leaving it unloaded — an empty
            // reserved box — instead of showing the app-window mockup.
            loading="eager"
            sizes="(min-width: 768px) 768px, 100vw"
            className="mx-auto w-full max-w-3xl h-auto"
          />
        </div>

        <div className="mt-14 grid grid-cols-3 gap-4 max-w-2xl">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-display text-3xl sm:text-5xl tabular-nums"><CountUp value={s.value} /></div>
              <div className="mt-1.5 text-xs sm:text-sm text-white/50">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
