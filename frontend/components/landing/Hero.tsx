"use client";

import { motion } from "framer-motion";
import { Wizard } from "../wizard/Wizard";

export function Hero() {
  return (
    <section id="top" className="bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-6xl px-5 pt-14 pb-12 sm:pt-20 sm:pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-center gap-3 text-white/50">
            <span className="h-px w-8 bg-white/25" />
            <span className="eyebrow">AI Job-Match Analyzer</span>
            <span className="h-px w-8 bg-white/25" />
          </div>

          <h1 className="mx-auto mt-6 max-w-3xl font-display text-[2.4rem] leading-[1.05] sm:text-6xl sm:leading-[1.02]">
            Know if your CV fits,
            <br className="hidden sm:block" /> before you apply.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-[15px] sm:text-lg text-white/60 leading-relaxed">
            Drop in your CV and a job post. Get a match score, an evidence-backed gap
            analysis, and tailored rewrite suggestions — in seconds, with nothing made up.
          </p>
        </motion.div>

        {/* the wizard — primary focal point */}
        <motion.div
          id="analyze"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="mt-10 sm:mt-14 scroll-mt-20"
        >
          <Wizard />
        </motion.div>
      </div>
    </section>
  );
}
