"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

/**
 * Counts up to a numeric value when scrolled into view.
 * `value` may carry non-numeric decoration ("~30s", "100%") — the digits are
 * animated and the surrounding characters are preserved.
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  // Memoised so the effect below doesn't re-run (and restart the animation)
  // on every render caused by setN.
  const parsed = useMemo(() => {
    const m = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
    if (!m) return null;
    return {
      prefix: m[1],
      num: parseFloat(m[2]),
      suffix: m[3],
      decimals: (m[2].split(".")[1] || "").length,
    };
  }, [value]);

  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || !parsed) return;
    const controls = animate(0, parsed.num, {
      duration: 1.1,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: setN,
    });
    return () => controls.stop();
  }, [inView, parsed]);

  if (!parsed) return <span ref={ref}>{value}</span>;

  return (
    <span ref={ref}>
      {parsed.prefix}
      {n.toFixed(parsed.decimals)}
      {parsed.suffix}
    </span>
  );
}
