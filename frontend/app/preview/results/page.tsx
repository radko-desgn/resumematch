"use client";

import { useState } from "react";
import Image from "next/image";
import { WizardProvider, Tier } from "@/lib/store";
import { CreditsProvider } from "@/lib/credits";
import { AuthProvider } from "@/lib/auth";
import { AuthGateProvider } from "@/components/auth/AuthGate";
import { Step4Results } from "@/components/steps/Step4Results";
import { EXAMPLE_ANALYSIS } from "@/lib/exampleAnalysis";
import { cn } from "@/lib/utils";

/**
 * Design sandbox for the results screen.
 *
 * Renders the REAL <Step4Results /> against example data, so anything changed
 * here is what users actually get — no parallel copy that can drift. Seeded via
 * WizardProvider's initial state; remounted on tier change with `key`.
 */
export default function ResultsPreviewPage() {
  const [tier, setTier] = useState<Tier>("paid");

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* sandbox toolbar (not part of the product UI) */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-[#0A0A0A]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-center gap-3">
            <Image src="/logo-white.png" alt="ResumeMatch" width={1476} height={261} className="h-[20px] w-auto" />
            <span className="rounded-full border border-white/20 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/60">
              results preview
            </span>
          </div>

          <div className="flex items-center gap-1 rounded-full border border-white/15 p-1">
            {(["free", "paid"] as Tier[]).map((t) => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-colors cursor-pointer",
                  tier === t ? "bg-white text-black" : "text-white/60 hover:text-white"
                )}
              >
                {t} tier
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-10">
        <p className="mb-6 text-sm text-white/45">
          Example data — the real results component, so changes here ship to users.
        </p>

        {/* same panel chrome the wizard uses, so it looks identical to production */}
        <div className="w-full max-w-4xl mx-auto rounded-3xl border border-black/10 bg-white p-5 text-left text-black shadow-2xl sm:p-9">
          {/* Seeded balance, never persisted: the paid preview gets a CV credit
              so the generator renders enabled, while the free preview keeps 0
              so the upsell CTA is the one on screen. */}
          <AuthProvider><AuthGateProvider><CreditsProvider key={tier} initial={tier === "paid" ? { cvs: 1 } : { scans: 0, cvs: 0 }}>
            <WizardProvider initialAnalysis={EXAMPLE_ANALYSIS} initialTier={tier} initialStep={4}>
              <Step4Results />
            </WizardProvider>
          </CreditsProvider></AuthGateProvider></AuthProvider>
        </div>
      </div>
    </div>
  );
}
