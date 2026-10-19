"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Cycles through phrases without ever shifting layout.
 *
 * Every phrase is rendered invisibly into the SAME grid cell, so the box is
 * sized to the widest *and* tallest phrase. That matters on mobile: phrases are
 * allowed to wrap (no nowrap, which used to overflow narrow screens), and
 * because the sizers account for the tallest wrapped phrase, swapping text
 * never changes the height either.
 *
 * The sizers draw their phrase with ::before (from data-text) rather than as
 * text nodes, so they size the box without becoming part of the heading's text:
 * crawlers and AI readers see "…to Analyze & Score your fit for…", not all four
 * phrases run together.
 *
 * It only rotates while it's on screen and the tab is visible: scrolled past
 * the hero, there's nothing to watch and no reason to keep re-rendering.
 *
 * Reduced motion is handled by <MotionProvider> (reducedMotion="user"), which
 * drops the slide and keeps the fade. Branching on useReducedMotion() here
 * rendered different styles on the server and client (a hydration mismatch).
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
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let onScreen = true;
    const io = new IntersectionObserver(([entry]) => (onScreen = entry.isIntersecting));
    if (ref.current) io.observe(ref.current);
    const id = setInterval(() => {
      if (onScreen && !document.hidden) setI((v) => (v + 1) % phrases.length);
    }, intervalMs);
    return () => {
      clearInterval(id);
      io.disconnect();
    };
  }, [phrases.length, intervalMs]);

  return (
    <span ref={ref} className={cn("grid text-balance", className)}>
      {/* sizers — reserve the largest box across all phrases */}
      {phrases.map((p) => (
        <span
          key={p}
          aria-hidden
          data-text={p}
          className="invisible col-start-1 row-start-1 before:content-[attr(data-text)]"
        />
      ))}

      <span className="relative col-start-1 row-start-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={i}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, y: "0.55em" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-0.55em" }}
            transition={{ duration: 0.42, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {phrases[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
