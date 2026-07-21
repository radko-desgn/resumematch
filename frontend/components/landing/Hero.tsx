"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Wizard } from "../wizard/Wizard";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full opacity-40 blur-[110px]"
        style={{ background: "radial-gradient(circle, var(--brand-a), transparent 65%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-[460px] w-[460px] rounded-full opacity-40 blur-[110px]"
        style={{ background: "radial-gradient(circle, var(--violet), transparent 65%)" }}
      />

      <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-mono uppercase tracking-widest text-muted-foreground">
            <Sparkles className="size-3.5" style={{ color: "var(--brand-b)" }} />
            AI job-match analyzer
          </span>
          <h1 className="mt-6 font-display font-bold tracking-tight text-4xl sm:text-6xl leading-[1.03]">
            Know if your CV fits
            <br />
            <span className="brand-text">before you apply.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg text-muted-foreground">
            Drop in your CV and a job post. Get a match score, an evidence-backed gap analysis,
            and tailored rewrite suggestions — in seconds, with nothing made up.
          </p>
        </motion.div>

        {/* The wizard — primary focal point */}
        <motion.div
          id="analyze"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="mt-12 scroll-mt-20"
        >
          <Wizard />
        </motion.div>
      </div>
    </section>
  );
}
