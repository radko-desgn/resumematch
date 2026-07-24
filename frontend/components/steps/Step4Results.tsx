"use client";

import { motion } from "framer-motion";
import { Lock, Check, RotateCcw, Zap } from "lucide-react";
import { useWizard } from "@/lib/store";
import { useCredits } from "@/lib/credits";
import { useAuthGate } from "@/components/auth/AuthGate";
import { ENTRY_PRICE } from "@/lib/packs";
import { ReportActions } from "../wizard/ReportActions";
import { AnalysisReport } from "../results/AnalysisReport";
import { TailoredCv } from "../wizard/TailoredCv";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function Step4Results() {
  const { analysis, tier, upgrade, reset } = useWizard();
  const { canScan, signedIn, refresh } = useCredits();
  const { promptSignIn } = useAuthGate();
  if (!analysis) return null;

  return (
    <div>
      <AnalysisReport analysis={analysis} full={tier === "paid"} />

      {tier === "paid" ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <TailoredCv />
          <ReportActions analysis={analysis} />
        </motion.div>
      ) : (
        <Card className="p-7 text-center">
          <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-foreground">
            <Lock className="size-5 text-background" />
          </div>
          <h3 className="font-display text-lg mb-1">That&apos;s your score. Want the why?</h3>
          <p className="mx-auto mb-5 max-w-sm text-sm text-muted-foreground">
            The full report adds an executive summary, every gap with the evidence behind it,
            tailored CV rewrites, and a branded PDF you can keep.
          </p>
          <ul className="mx-auto mb-6 max-w-xs space-y-2 text-left">
            {["Executive summary", "Strengths & every gap, with evidence", "One-click tailored ATS CV (.pdf/.docx)", "Branded PDF report + email"].map((t) => (
              <li key={t} className="flex gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-met" />
                {t}
              </li>
            ))}
          </ul>
          {!signedIn ? (
            <Button size="lg" className="w-full sm:w-auto"
              onClick={() => promptSignIn("Deep analysis costs 1 credit, so it needs an account.")}>
              <Zap className="size-4" /> Sign in to unlock
            </Button>
          ) : canScan ? (
            <Button size="lg" className="w-full sm:w-auto" onClick={() => { upgrade(); void refresh(); }}>
              <Zap className="size-4" /> Unlock Deep AI Analysis — 1 credit
            </Button>
          ) : (
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href="#pricing">Unlock Deep AI Analysis starting at {ENTRY_PRICE}</a>
            </Button>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            {canScan
              ? "We'll re-run the deeper analysis on the same inputs."
              : "Demo: checkout is simulated — no card, no charge."}
          </p>
        </Card>
      )}

      <div className="mt-8 flex justify-center">
        <Button variant="ghost" onClick={reset}>
          <RotateCcw className="size-4" /> Start over
        </Button>
      </div>
    </div>
  );
}
