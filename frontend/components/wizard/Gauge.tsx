"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

export function Gauge({ score, size = 220 }: { score: number; size?: number }) {
  const R = 90;
  const len = Math.PI * R;
  const s = Math.max(0, Math.min(100, Math.round(score)));
  const off = len * (1 - s / 100);

  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  useEffect(() => {
    const controls = animate(count, s, { duration: 1.2, ease: [0.2, 0.7, 0.2, 1] });
    return () => controls.stop();
  }, [s, count]);

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
          transition={{ duration: 1.2, ease: [0.2, 0.7, 0.2, 1] }}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-1 text-center">
        <motion.span className="font-display text-5xl leading-none">{rounded}</motion.span>
        <div className="text-xs text-muted-foreground mt-1">/ 100 match</div>
      </div>
    </div>
  );
}
