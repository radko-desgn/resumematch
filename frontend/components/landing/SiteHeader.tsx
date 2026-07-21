"use client";

import { ThemeToggle } from "../theme-toggle";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "#how", label: "How it works" },
  { href: "#why", label: "Why use it" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="size-6 rounded-md brand-gradient" />
          <span className="font-display font-semibold tracking-tight">ResumeMatch</span>
        </a>

        <nav className="hidden md:flex items-center gap-7">
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
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href="#analyze">Analyze now</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
