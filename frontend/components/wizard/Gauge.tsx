"use client";

import { motion } from "framer-motion";

export function Gauge({ score, size = 220 }: { score: number; size?: number }) {
  const R = 90;
  const len = Math.PI * R;
  const s = Math.max(0, Math.min(100, Math.round(score)));
  const off = len * (1 - s / 100);
  return (
    <div style={{ width: size }} className="relative shrink-0">
      <svg viewBox="0 0 220 132" className="w-full" role="img" aria-label={`Match score ${s} of 100`}>
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent-a)" />
            <stop offset="100%" stopColor="var(--accent-b)" />
          </linearGradient>
        </defs>
        <path d="M 20 110 A 90 90 0 0 1 200 110" fill="none" stroke="var(--border)" strokeWidth="16" strokeLinecap="round" />
        <motion.path
          d="M 20 110 A 90 90 0 0 1 200 110"
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={len}
          initial={{ strokeDashoffset: len }}
          animate={{ strokeDashoffset: off }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-1 text-center">
        <div className="font-display text-5xl leading-none">{s}</div>
        <div className="text-xs text-muted-foreground mt-1">/ 100 match</div>
      </div>
    </div>
  );
}
