"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "#how", label: "How it works" },
  { href: "#why", label: "Why use it" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  // lock background scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
          <a href="#top" aria-label="ResumeMatch home" onClick={() => setOpen(false)}>
            <Image
              src="/logo-black.png"
              alt="ResumeMatch"
              width={1476}
              height={261}
              priority
              className="h-[26px] w-auto"
            />
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <a href="#analyze">Analyze now</a>
            </Button>
            <button
              className="md:hidden inline-flex size-11 items-center justify-center rounded-full hover:bg-foreground/5"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {/* mobile slide-out drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-black/50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed right-0 top-0 z-[70] h-dvh w-[82%] max-w-xs bg-background p-6 shadow-2xl md:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between">
                <Image src="/logo-black.png" alt="ResumeMatch" width={1476} height={261} className="h-[24px] w-auto" />
                <button
                  className="inline-flex size-11 items-center justify-center rounded-full hover:bg-foreground/5"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                >
                  <X className="size-5" />
                </button>
              </div>

              <nav className="mt-8 flex flex-col">
                {NAV.map((n) => (
                  <a
                    key={n.href}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="border-b border-border py-4 text-base last:border-0"
                  >
                    {n.label}
                  </a>
                ))}
              </nav>

              <Button asChild className="mt-8 w-full">
                <a href="#analyze" onClick={() => setOpen(false)}>Analyze now</a>
              </Button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
