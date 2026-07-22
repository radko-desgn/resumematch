"use client";

import { motion } from "framer-motion";
import { Clock, ShieldCheck, Target, Gauge } from "lucide-react";
import { CountUp } from "./CountUp";

const BENEFITS = [
  { icon: Clock, title: "Save hours", body: "Stop hand-tailoring every application. Get the edits that matter in seconds." },
  { icon: ShieldCheck, title: "Beat the ATS", body: "Mirror the job's real keywords so you clear the automated screeners." },
  { icon: Target, title: "Find your gaps", body: "See exactly which requirements you miss — each one backed by evidence." },
  { icon: Gauge, title: "Instant fit check", body: "One honest score tells you whether a role is worth applying to at all." },
];

const STATS = [
  { value: "~30s", label: "per analysis" },
  { value: "0", label: "fabricated claims" },
  { value: "100%", label: "evidence-cited" },
];

export function Benefits() {
  return (
    <section id="why" className="scroll-mt-16 bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <div className="max-w-2xl">
          <span className="eyebrow text-white/45">Why use it</span>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.05]">
            An unfair advantage on every application
          </h2>
        </div>

        <div className="mt-12 sm:mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="rounded-2xl border border-white/12 bg-white/[0.03] p-7 transition-colors duration-300 hover:border-white/30 hover:bg-white/[0.06]"
            >
              <b.icon className="size-6 text-white" />
              <h3 className="mt-5 font-display text-lg">{b.title}</h3>
              <p className="mt-2 text-sm text-white/55 leading-relaxed">{b.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-3 gap-4 max-w-2xl">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-display text-3xl sm:text-5xl"><CountUp value={s.value} /></div>
              <div className="mt-1.5 text-xs sm:text-sm text-white/50">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
