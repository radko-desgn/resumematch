"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

/**
 * Monochrome score dial. The value arc is solid ink on a hairline track — the
 * number carries the meaning, the arc just gives it shape.
 */
export function Gauge({ score }: { score: number }) {
  const R = 88;
  const CIRC = 2 * Math.PI * R;
  const SWEEP = 0.75; // three-quarter dial
  const track = CIRC * SWEEP;
  const s = Math.max(0, Math.min(100, Math.round(score)));

  const progress = useMotionValue(0);
  const dashoffset = useTransform(progress, (v) => track * (1 - v / 100));
  const rounded = useTransform(progress, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(progress, s, { duration: 1.2, ease: [0.2, 0.7, 0.2, 1] });
    return () => controls.stop();
  }, [s, progress]);

  return (
    <div className="relative w-[168px] shrink-0 sm:w-[204px]" aria-label={`Match score ${s} of 100`} role="img">
      <svg viewBox="0 0 200 200" className="w-full -rotate-[135deg]">
        <circle
          cx="100"
          cy="100"
          r={R}
          fill="none"
          stroke="currentColor"
          className="text-foreground/12"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${track} ${CIRC}`}
        />
        <motion.circle
          cx="100"
          cy="100"
          r={R}
          fill="none"
          stroke="currentColor"
          className="text-foreground"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${track} ${CIRC}`}
          style={{ strokeDashoffset: dashoffset }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex items-start leading-none">
          <motion.span className="font-display text-[64px] tracking-[-0.04em]">{rounded}</motion.span>
          <span className="mt-2 ml-1 font-display text-2xl text-foreground/35">%</span>
        </div>
        <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          match
        </span>
      </div>
    </div>
  );
}
