"use client";

import { motion } from "framer-motion";
import { Lock, Check, AlertTriangle, Sparkles, RotateCcw } from "lucide-react";
import { useWizard } from "@/lib/store";
import { Gauge } from "../wizard/Gauge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Analysis } from "@/lib/types";

function verdictColor(v: string) {
  const s = v.toLowerCase();
  if (s.includes("strong")) return "var(--met)";
  if (s.includes("weak")) return "var(--missing)";
  return "var(--partial)";
}

function ReportBody({ a }: { a: Analysis }) {
  const gaps = [
    ...a.score.critical_gaps,
    ...a.score.requirements
      .filter((r) => r.status !== "met")
      .map((r) => `${r.requirement} (${r.status.replace("-", " ")})`),
  ];
  const recs = [
    ...a.score.quick_wins,
    ...a.rewrite.rewritten_bullets.filter((b) => b.changed).map((b) => `Reword: “${b.rewritten}”`),
  ];
  return (
    <div className="grid gap-4">
      <Card className="p-5">
        <h3 className="font-display font-semibold mb-2">Executive summary</h3>
        <p className="text-sm text-muted-foreground">{a.score.summary}</p>
      </Card>
      <Card className="p-5">
        <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
          <Check className="size-4 text-met" /> What's strong
        </h3>
        <ul className="space-y-2">
          {a.score.key_strengths.map((s, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="mt-1.5 size-1.5 rounded-full shrink-0" style={{ background: "var(--met)" }} />
              {s}
            </li>
          ))}
        </ul>
      </Card>
      <Card className="p-5">
        <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
          <AlertTriangle className="size-4 text-missing" /> Gaps to address
        </h3>
        <ul className="space-y-2">
          {gaps.map((g, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="mt-1.5 size-1.5 rounded-full shrink-0" style={{ background: "var(--missing)" }} />
              {g}
            </li>
          ))}
        </ul>
      </Card>
      <Card className="p-5">
        <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="size-4" style={{ color: "var(--violet)" }} /> Recommendations
        </h3>
        <ul className="space-y-2">
          {recs.map((r, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="mt-1.5 size-1.5 rounded-full shrink-0" style={{ background: "var(--violet)" }} />
              {r}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export function Step4Results() {
  const { analysis, tier, setTier, reset } = useWizard();
  if (!analysis) return null;
  const { score } = analysis;

  return (
    <div>
      {/* Score header — shown to everyone */}
      <Card className="p-6 mb-6">
        <div className="flex flex-wrap items-center gap-6">
          <Gauge score={score.overall_fit_score} />
          <div className="min-w-0">
            <div className="font-display text-xl font-semibold" style={{ color: verdictColor(score.verdict) }}>
              {score.verdict}
            </div>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">{score.summary}</p>
          </div>
        </div>
      </Card>

      {tier === "paid" ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <ReportBody a={analysis} />
        </motion.div>
      ) : (
        <div className="relative">
          <div className="pointer-events-none select-none blur-[7px] opacity-60" aria-hidden>
            <ReportBody a={analysis} />
          </div>
          {/* Lock overlay + CTA */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <Card className="p-7 max-w-sm text-center shadow-lg">
              <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-foreground">
                <Lock className="size-5 text-background" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-1">Unlock the full analysis</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Executive summary, strengths, every gap, and tailored CV rewrites for this job.
              </p>
              <Button size="lg" className="w-full" onClick={() => setTier("paid")}>
                Unlock Full Analysis — $10
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">Demo: unlock is simulated (no charge).</p>
            </Card>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Button variant="ghost" onClick={reset}>
          <RotateCcw className="size-4" /> Start over
        </Button>
      </div>
    </div>
  );
}
