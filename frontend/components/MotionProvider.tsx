"use client";

import { MotionConfig } from "framer-motion";

/**
 * framer-motion ignores prefers-reduced-motion unless told otherwise, and the
 * CSS kill-switch in globals.css can't reach its JS-driven animations. With
 * reducedMotion="user", visitors who ask for less motion get the drawers,
 * modals and step changes as plain fades: no slides, scales or spins.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
