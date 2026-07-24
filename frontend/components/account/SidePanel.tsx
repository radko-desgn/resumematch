"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";

/**
 * Right-hand slide-out panel used for account settings and scan history.
 *
 * Supports an optional `onBack` so a panel can drill in (history list → a single
 * reviewed scan) and step back out without closing, which is the "extend on the
 * side" behaviour the account menu drives.
 */
export function SidePanel({
  open,
  title,
  onClose,
  onBack,
  children,
  wide,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  onBack?: () => void;
  children: React.ReactNode;
  /** Wider panel for content like a reviewed report. */
  wide?: boolean;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (onBack ? onBack() : onClose());
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, onBack]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[95] bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={`fixed right-0 top-0 z-[100] flex h-dvh w-full flex-col bg-background shadow-2xl ${
              wide ? "max-w-2xl" : "max-w-md"
            }`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
          >
            <header className="flex items-center gap-3 border-b border-border px-5 py-4">
              {onBack && (
                <button
                  onClick={onBack}
                  aria-label="Back"
                  className="-ml-1 inline-flex size-9 items-center justify-center rounded-full hover:bg-foreground/5"
                >
                  <ArrowLeft className="size-4" />
                </button>
              )}
              <h2 className="flex-1 font-display text-lg">{title}</h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="inline-flex size-9 items-center justify-center rounded-full hover:bg-foreground/5"
              >
                <X className="size-4" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
