"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "#how", label: "How it works" },
  { href: "#why", label: "Why use it" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center" onClick={() => setOpen(false)} aria-label="ResumeMatch home">
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
            <a key={n.href} href={n.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background px-5 py-4">
          <nav className="flex flex-col">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base border-b border-border last:border-0"
              >
                {n.label}
              </a>
            ))}
            <Button asChild className="mt-4 w-full">
              <a href="#analyze" onClick={() => setOpen(false)}>Analyze now</a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
