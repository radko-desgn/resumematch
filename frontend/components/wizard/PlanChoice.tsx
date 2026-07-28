"use client";

import { ArrowRight, Check, Infinity as InfinityIcon, Lock, Zap } from "lucide-react";
import { useWizard } from "@/lib/store";
import { FreeScanEmail } from "./FreeScanEmail";
import { useCredits } from "@/lib/credits";
import { useAuthGate } from "@/components/auth/AuthGate";
import { ENTRY_PRICE } from "@/lib/packs";
import { Button } from "@/components/ui/button";

const FREE = [
  "Instant percentage match gauge",
  "Simple heuristic chart preview",
];
const PAID = [
  "Full algorithm: deep score breakdown",
  "Pain points & missing keywords",
  "Strengths & every gap, with evidence",
  "Actionable ATS recommendations",
  "Branded PDF + email delivery",
];

function Ticks({ items, dim }: { items: string[]; dim?: boolean }) {
  return (
    <ul className="mt-4 mb-5 space-y-2 flex-1">
      {items.map((t) => (
        <li key={t} className="flex gap-2 text-sm">
          <Check className={`size-4 shrink-0 mt-0.5 ${dim ? "text-muted-foreground" : "text-met"}`} />
          <span className={dim ? "text-muted-foreground" : undefined}>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function PlanChoice() {
  const { startScan, jobReady, freeEmail, freeConsent, setFreeEmail, setFreeConsent } = useWizard();
  const { scans, unlimited, canScan, hydrated, signedIn } = useCredits();
  const { promptSignIn } = useAuthGate();

  // No client-side deduction any more: the backend spends the credit as part
  // of serving the analysis, so the balance can't drift from what was charged
  // and a tampered client gains nothing.
  function runPaid() {
    startScan("paid");
  }

  return (
    <div>
      <h3 className="font-display text-lg">Choose your report</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Pick what you need — we only run the deeper analysis if you go full.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {/* Free — no credit touched */}
        <div className="rounded-2xl border border-border p-5 flex flex-col">
          <div className="flex items-baseline justify-between">
            <span className="font-display text-base">Free Quick Check</span>
            <span className="font-display text-xl">€0</span>
          </div>
          <Ticks items={FREE} dim />
          {signedIn ? (
            // Already identified — no need to ask for an address again.
            <Button
              variant="outline"
              className="w-full"
              disabled={!jobReady}
              onClick={() => startScan("free")}
            >
              Get my score <ArrowRight />
            </Button>
          ) : (
            <FreeScanEmail
              email={freeEmail}
              consent={freeConsent}
              onEmail={setFreeEmail}
              onConsent={setFreeConsent}
              onSubmit={() => startScan("free")}
              disabled={!jobReady}
            />
          )}
        </div>

        {/* Paid — costs one scan credit */}
        <div className="relative rounded-2xl border-2 border-foreground p-5 flex flex-col">
          <span className="absolute -top-2.5 left-5 rounded-full bg-foreground px-2.5 py-0.5 text-[10px] font-semibold text-background">
            FULL AI DEEP ANALYSIS
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-display text-base">Deep Analysis</span>
            <span className="inline-flex items-center gap-1 font-display text-xl">
              {unlimited ? (
                <>
                  <InfinityIcon className="size-4" aria-hidden /> Pro
                </>
              ) : (
                <>
                  <Zap className="size-4" aria-hidden /> 1 credit
                </>
              )}
            </span>
          </div>
          <Ticks items={PAID} />

          {!signedIn ? (
            <Button
              className="w-full"
              disabled={!jobReady}
              onClick={() => promptSignIn("Deep analysis costs 1 credit, so it needs an account.")}
            >
              <Lock className="size-4" /> Sign in to continue
            </Button>
          ) : canScan || !hydrated ? (
            <Button className="w-full" disabled={!jobReady || !hydrated} onClick={runPaid}>
              <Zap className="size-4" /> Run deep analysis
            </Button>
          ) : (
            <Button asChild className="w-full">
              <a href="#pricing">
                <Lock className="size-4" /> Get credits from {ENTRY_PRICE}
              </a>
            </Button>
          )}

          <p className="mt-2.5 text-center text-[11px] text-muted-foreground">
            {!signedIn
              ? "Credits are saved to your account."
              : unlimited
                ? "Pro Career Pass — unlimited scans."
                : canScan
                  ? `${scans} scan credit${scans === 1 ? "" : "s"} left — this uses one.`
                  : "You have 0 scan credits. Checkout is simulated — no charge."}
          </p>
        </div>
      </div>

      {!jobReady && (
        <p className="mt-4 text-xs text-muted-foreground">Add the job offer above to continue.</p>
      )}
    </div>
  );
}
