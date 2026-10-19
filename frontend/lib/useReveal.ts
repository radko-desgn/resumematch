"use client";

import { useEffect, useRef } from "react";

/**
 * Rises each `.mk-reveal` block inside the returned ref in once, the first
 * time it scrolls into view (styles in globals.css under `.mk-reveal`).
 *
 * Like useWipe: blocks already on screen (or above it) at mount are left
 * alone, and reduced motion / no-JS get the static page. Blocks that enter in
 * the same observer batch — a row of cards on desktop — stagger by 70ms; a
 * block that enters alone, as each card does in a phone's single column,
 * starts immediately instead of waiting out its index.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>(".mk-reveal")).filter(
      (el) => el.getBoundingClientRect().top >= window.innerHeight
    );
    if (!items.length) return;

    for (const el of items) el.dataset.reveal = "wait";
    const io = new IntersectionObserver(
      (entries) => {
        let k = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.style.setProperty("--mk-delay", `${k++ * 70}ms`);
          el.dataset.reveal = "play";
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    for (const el of items) io.observe(el);

    return () => {
      io.disconnect();
      for (const el of items) {
        delete el.dataset.reveal;
        el.style.removeProperty("--mk-delay");
      }
    };
  }, []);

  return ref;
}
