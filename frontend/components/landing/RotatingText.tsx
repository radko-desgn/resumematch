"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Cycles through phrases without ever shifting layout.
 *
 * An invisible "sizer" renders the longest phrase to reserve the exact box the
 * text needs; the animated phrase is absolutely positioned inside it. That way
 * neither width nor height changes as phrases swap, so the headline never
 * reflows or pushes the page around.
 */
export function RotatingText({
  phrases,
  intervalMs = 2800,
  className = "",
}: {
  phrases: string[];
  intervalMs?: number;
  className?: string;
}) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const longest = phrases.reduce((a, b) => (b.length > a.length ? b : a), "");

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % phrases.length), intervalMs);
    return () => clearInterval(id);
  }, [phrases.length, intervalMs]);

  return (
    <span className={`relative inline-block align-top ${className}`}>
      {/* reserves the box — never visible, never read out */}
      <span className="invisible whitespace-nowrap" aria-hidden="true">
        {longest}
      </span>

      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={i}
          className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: "0.55em" }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: "-0.55em" }}
          transition={{ duration: 0.42, ease: [0.2, 0.7, 0.2, 1] }}
        >
          {phrases[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
