"use client";

import { motion } from "framer-motion";
import { Clock, ShieldCheck, Target, Gauge } from "lucide-react";
import { Card } from "@/components/ui/card";

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
    <section id="why" className="scroll-mt-20 border-y border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Why use it</span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            The unfair advantage for every application
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card className="h-full p-6">
                <b.icon className="size-6" style={{ color: "var(--brand-b)" }} />
                <h3 className="mt-4 font-display font-semibold">{b.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{b.body}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-3 gap-4 max-w-2xl mx-auto text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-display text-3xl sm:text-4xl font-bold brand-text">{s.value}</div>
              <div className="mt-1 text-xs sm:text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
