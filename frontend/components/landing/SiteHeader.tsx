"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreditBadge } from "./CreditBadge";
import { useAuth } from "@/lib/auth";
import { useAuthGate } from "@/components/auth/AuthGate";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  const { session, email, signOut } = useAuth();
  const { promptSignIn } = useAuthGate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll(); // respect a restored scroll position on load
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock background scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-border bg-background/80 backdrop-blur-md shadow-sm text-foreground"
            : "bg-[#0A0A0A] text-white" // seamless with the dark hero
        )}
      >
        <div
          className={cn(
            "mx-auto max-w-6xl px-5 flex items-center justify-between transition-all duration-300",
            scrolled ? "h-14" : "h-20"
          )}
        >
          {/* logo crossfades black/white with the header state */}
          <a href="#top" className="relative block" aria-label="ResumeMatch home" onClick={() => setOpen(false)}>
            <Image
              src="/logo-white.png"
              alt="ResumeMatch"
              width={1476}
              height={261}
              priority
              className={cn("w-auto transition-all duration-300", scrolled ? "h-[22px] opacity-0" : "h-[26px] opacity-100")}
            />
            <Image
              src="/logo-black.png"
              alt=""
              aria-hidden
              width={1476}
              height={261}
              className={cn(
                "absolute inset-0 w-auto transition-all duration-300",
                scrolled ? "h-[22px] opacity-100" : "h-[26px] opacity-0"
              )}
            />
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={cn(
                  "text-sm transition-colors",
                  scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"
                )}
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <CreditBadge inverted={!scrolled} />
            {session ? (
              <>
                <a
                  href="/reset-password"
                  className={cn(
                    "hidden text-sm transition-colors sm:inline",
                    scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"
                  )}
                  title={email || undefined}
                >
                  Password
                </a>
                <Button
                  size="sm"
                  variant={scrolled ? "outline" : "invert"}
                  className="hidden sm:inline-flex"
                  onClick={() => signOut()}
                  title={email || undefined}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant={scrolled ? "default" : "invert"}
                className="hidden sm:inline-flex"
                onClick={() => promptSignIn()}
              >
                Sign in
              </Button>
            )}
            <button
              className="md:hidden inline-flex size-11 items-center justify-center rounded-full hover:bg-current/10"
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

              <div className="mt-8 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Your credits</span>
                <CreditBadge onNavigate={() => setOpen(false)} />
              </div>

              {session ? (
                <>
                  <p className="mt-4 truncate text-xs text-muted-foreground">{email}</p>
                  <Button asChild variant="outline" className="mt-2 w-full">
                    <a href="/reset-password" onClick={() => setOpen(false)}>Change password</a>
                  </Button>
                  <Button variant="ghost" className="mt-2 w-full" onClick={() => { signOut(); setOpen(false); }}>
                    Sign out
                  </Button>
                </>
              ) : (
                <Button className="mt-4 w-full" onClick={() => { setOpen(false); promptSignIn(); }}>
                  Sign in
                </Button>
              )}
              <Button asChild variant="ghost" className="mt-2 w-full">
                <a href="#analyze" onClick={() => setOpen(false)}>Get Started</a>
              </Button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
