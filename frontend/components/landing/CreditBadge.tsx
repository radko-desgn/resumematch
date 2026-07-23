"use client";

import { motion } from "framer-motion";
import { Infinity as InfinityIcon, Zap } from "lucide-react";
import { useCredits } from "@/lib/credits";
import { cn } from "@/lib/utils";

/**
 * Live credit counter. Renders a stable placeholder until the balance has been
 * read from storage, so the server and client markup match and the number
 * doesn't flicker from 0 on every load.
 */
export function CreditBadge({
  inverted,
  className,
  onNavigate,
}: {
  inverted?: boolean;
  className?: string;
  /** Lets the mobile drawer close itself when the badge is tapped. */
  onNavigate?: () => void;
}) {
  const { scans, unlimited, hydrated } = useCredits();

  const label = unlimited ? "Unlimited" : `${scans} Credit${scans === 1 ? "" : "s"}`;

  return (
    <a
      href="#pricing"
      onClick={onNavigate}
      title="Credits are spent on deep AI analyses. Click to top up."
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium tabular-nums transition-colors",
        inverted
          ? "border-white/25 text-white/85 hover:border-white/50 hover:text-white"
          : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
        className
      )}
    >
      {unlimited ? (
        <InfinityIcon className="size-3.5" aria-hidden />
      ) : (
        <Zap className="size-3.5" aria-hidden />
      )}
      <motion.span
        // a brief pop on change is the only feedback a header badge can give
        key={label}
        initial={hydrated ? { scale: 0.85, opacity: 0.5 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {hydrated ? label : "0 Credits"}
      </motion.span>
    </a>
  );
}
