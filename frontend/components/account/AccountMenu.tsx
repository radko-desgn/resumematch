"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { SettingsPanel } from "./SettingsPanel";
import { HistoryPanel } from "./HistoryPanel";

/**
 * Signed-in account control for the header: an avatar button that opens a
 * dropdown (history, settings, sign out). History and Settings open slide-out
 * side panels; sign-out is immediate.
 */
export function AccountMenu({ inverted }: { inverted?: boolean }) {
  const { email, signOut } = useAuth();
  const [menu, setMenu] = useState(false);
  const [panel, setPanel] = useState<null | "history" | "settings">(null);
  const ref = useRef<HTMLDivElement>(null);

  // Close the dropdown on an outside click or Escape.
  useEffect(() => {
    if (!menu) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenu(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  const initial = (email?.[0] ?? "?").toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setMenu((v) => !v)}
        aria-label="Account"
        aria-expanded={menu}
        className={cn(
          "flex size-9 items-center justify-center rounded-full font-display text-sm transition-colors",
          inverted
            ? "bg-white text-foreground hover:bg-white/90"
            : "bg-foreground text-background hover:bg-foreground/90"
        )}
      >
        {initial}
      </button>

      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 z-[75] mt-2 w-60 overflow-hidden rounded-2xl border border-border bg-background text-foreground shadow-2xl"
          >
            <div className="border-b border-border px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Signed in as</p>
              <p className="mt-0.5 truncate text-sm font-medium">{email}</p>
            </div>
            <nav className="p-1.5">
              <MenuItem icon={Clock} label="Scan history" onClick={() => { setMenu(false); setPanel("history"); }} />
              <MenuItem icon={Settings} label="Settings" onClick={() => { setMenu(false); setPanel("settings"); }} />
              <MenuItem icon={LogOut} label="Log out" onClick={() => { setMenu(false); signOut(); }} />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <HistoryPanel open={panel === "history"} onClose={() => setPanel(null)} />
      <SettingsPanel open={panel === "settings"} onClose={() => setPanel(null)} />
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Clock;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-muted"
    >
      <Icon className="size-4 text-muted-foreground" />
      {label}
    </button>
  );
}
