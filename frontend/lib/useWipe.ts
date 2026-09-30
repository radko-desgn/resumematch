"use client";

import { useEffect, useRef } from "react";

/**
 * Paints a heading in with a thin bar the first time it scrolls into view
 * (motion-kit `wiper`, styles in globals.css under `.mk-wipe`).
 *
 * Headings already on screen at mount — a restored scroll position, a tall
 * viewport — are left alone, so nothing visible ever blinks out. Reduced
 * motion and no-JS both get the plain heading.
 */
export function useWipe<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.dataset.wipe = "wait";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.wipe = "play";
        io.disconnect();
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      delete el.dataset.wipe;
    };
  }, []);

  return ref;
}
