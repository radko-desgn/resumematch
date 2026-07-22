"use client";

import { motion } from "framer-motion";
import { Wizard } from "../wizard/Wizard";
import { RotatingText } from "./RotatingText";

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
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-center gap-3 text-white/50">
            <span className="h-px w-8 bg-white/25" />
            <span className="eyebrow">AI Job-Match Analyzer</span>
            <span className="h-px w-8 bg-white/25" />
          </div>

          <h1 className="mx-auto mt-6 max-w-4xl font-display text-[2.1rem] leading-[1.08] sm:text-[3.4rem] sm:leading-[1.06]">
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: 0.08, ease: [0.2, 0.7, 0.2, 1] }}
              >
                AI platform to
              </motion.span>
            </span>

            {/* same mask reveal as the fixed lines, staggered between them */}
            <span className="block overflow-hidden pb-[0.08em] my-1 sm:my-1.5">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.2, 0.7, 0.2, 1] }}
              >
                <RotatingText phrases={ROTATING} />
              </motion.span>
            </span>

            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
              >
                for your next job application.
              </motion.span>
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-[15px] sm:text-lg text-white/60 leading-relaxed">
            Upload your CV, link any job post, get instant match insights, and automatically
            generate an ATS-optimized CV tailored specifically for the role.
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
