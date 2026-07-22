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
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: "0.5em" }}
          animate={
            reduce
              ? { opacity: 1 }
              : {
                  // "buzz": settle in, then a fast jitter + opacity flicker and a
                  // brief chromatic split before locking to a clean render.
                  opacity: [0, 1, 0.72, 1, 0.9, 1],
                  y: ["0.5em", "0em", "0em", "0em", "0em", "0em"],
                  x: [0, 0, -1.6, 1.4, -0.7, 0],
                  textShadow: [
                    "0 0 0 rgba(0,0,0,0)",
                    "0 0 0 rgba(0,0,0,0)",
                    "1.6px 0 0 rgba(56,232,255,.55), -1.6px 0 0 rgba(255,64,160,.55)",
                    "-1.2px 0 0 rgba(56,232,255,.45), 1.2px 0 0 rgba(255,64,160,.45)",
                    "0.6px 0 0 rgba(56,232,255,.25), -0.6px 0 0 rgba(255,64,160,.25)",
                    "0 0 0 rgba(0,0,0,0)",
                  ],
                }
          }
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: "-0.5em", x: [0, 1.4, -1.2, 0] }}
          transition={{
            duration: reduce ? 0.25 : 0.62,
            times: reduce ? undefined : [0, 0.34, 0.46, 0.58, 0.72, 1],
            ease: [0.2, 0.7, 0.2, 1],
          }}
        >
          {phrases[i]}
        </motion.span>
      </AnimatePresence>

      {/* keeps the current phrase available to screen readers / SEO */}
      <span className="sr-only">{phrases[i]}</span>
    </span>
  );
}
