"use client";

import { useEffect, useMemo, useRef } from "react";
import { animate } from "framer-motion";

/**
 * Counts up to a numeric value when scrolled into view.
 * `value` may carry non-numeric decoration ("~30s", "100%") — the digits are
 * animated and the surrounding characters are preserved.
 *
 * The real value is what's server-rendered, so crawlers, no-JS and reduced
 * motion all read "100%", never a stray "0%". Only a stat that starts below
 * the fold is reset to zero and counted; the digits are written straight to
 * the DOM so the count doesn't re-render React 60 times a second.
 */
export function CountUp({ value }: { value: string }) {
  const numRef = useRef<HTMLSpanElement>(null);

  const parsed = useMemo(() => {
    const m = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
    if (!m) return null;
    return {
      prefix: m[1],
      num: parseFloat(m[2]),
      digits: m[2],
      suffix: m[3],
      decimals: (m[2].split(".")[1] || "").length,
    };
  }, [value]);

  useEffect(() => {
    const el = numRef.current;
    if (!el || !parsed || parsed.num === 0) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    const show = (n: number) => (el.textContent = n.toFixed(parsed.decimals));
    show(0);
    let controls: ReturnType<typeof animate> | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        controls = animate(0, parsed.num, { duration: 1.1, ease: [0.2, 0.7, 0.2, 1], onUpdate: show });
      },
      { rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      controls?.stop();
      el.textContent = parsed.digits;
    };
  }, [parsed]);

  if (!parsed) return <span>{value}</span>;

  return (
    <span>
      {parsed.prefix}
      <span ref={numRef}>{parsed.digits}</span>
      {parsed.suffix}
    </span>
  );
}
