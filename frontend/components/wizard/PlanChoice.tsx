"use client";

import { ArrowRight, Check, Lock } from "lucide-react";
import { useWizard } from "@/lib/store";
import { Button } from "@/components/ui/button";

const FREE = ["Overall match score", "Fit verdict"];
const PAID = [
  "Everything in the free score",
  "Executive summary",
  "Strengths & every gap, with evidence",
  "One-click tailored ATS CV (.pdf/.docx)",
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
  const { startScan, jobReady } = useWizard();

  return (
    <div>
      <h3 className="font-display text-lg">Choose your report</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Pick what you need — we only run the deeper analysis if you go full.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {/* Free */}
        <div className="rounded-2xl border border-border p-5 flex flex-col">
          <div className="flex items-baseline justify-between">
            <span className="font-display text-base">Free score</span>
            <span className="font-display text-xl">$0</span>
          </div>
          <Ticks items={FREE} dim />
          <Button
            variant="outline"
            className="w-full"
            disabled={!jobReady}
            onClick={() => startScan("free")}
          >
            Get my score <ArrowRight />
          </Button>
        </div>

        {/* Paid */}
        <div className="relative rounded-2xl border-2 border-foreground p-5 flex flex-col">
          <span className="absolute -top-2.5 left-5 rounded-full bg-foreground px-2.5 py-0.5 text-[10px] font-semibold text-background">
            FULL POTENTIAL
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-display text-base">Full report</span>
            <span className="font-display text-xl">$10</span>
          </div>
          <Ticks items={PAID} />
          <Button
            className="w-full"
            disabled={!jobReady}
            onClick={() => startScan("paid")}
          >
            <Lock className="size-4" /> Pay &amp; analyze
          </Button>
          <p className="mt-2.5 text-center text-[11px] text-muted-foreground">
            Demo: payment is simulated — no charge.
          </p>
        </div>
      </div>

      {!jobReady && (
        <p className="mt-4 text-xs text-muted-foreground">Add the job offer above to continue.</p>
      )}
    </div>
  );
}
