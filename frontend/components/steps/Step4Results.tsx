"use client";

import { motion } from "framer-motion";
import { Lock, Check, AlertTriangle, Sparkles, RotateCcw } from "lucide-react";
import { useWizard } from "@/lib/store";
import { Gauge } from "../wizard/Gauge";
import { CopyButton } from "../wizard/CopyButton";
import { ReportActions } from "../wizard/ReportActions";
import { TailoredCv } from "../wizard/TailoredCv";
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
    ...a.score.requirements.filter((r) => r.status !== "met").map((r) => `${r.requirement} (${r.status.replace("-", " ")})`),
  ];
  const recs = [
    ...a.score.quick_wins,
    ...a.rewrite.rewritten_bullets.filter((b) => b.changed).map((b) => b.rewritten),
  ];
  return (
    <div className="grid gap-4">
      <Card className="p-5">
        <h3 className="font-display font-semibold mb-2">Executive summary</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{a.score.summary}</p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
            <Check className="size-4 text-met" /> What&apos;s strong
          </h3>
          <ul className="space-y-2.5">
            {a.score.key_strengths.map((s, i) => (
              <li key={i} className="flex gap-2.5 text-sm">
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
          <ul className="space-y-2.5">
            {gaps.map((g, i) => (
              <li key={i} className="flex gap-2.5 text-sm">
                <span className="mt-1.5 size-1.5 rounded-full shrink-0" style={{ background: "var(--missing)" }} />
                {g}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="font-display font-semibold flex items-center gap-2">
            <Sparkles className="size-4" /> Recommendations
          </h3>
          <CopyButton text={recs.join("\n")} label="Copy all" />
        </div>
        <ul className="divide-y divide-border">
          {recs.map((r, i) => (
            <li key={i} className="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
              <span className="text-sm">{r}</span>
              <CopyButton text={r} />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function CoverageChips({ a }: { a: Analysis }) {
  const reqs = a.score.requirements;
  const must = reqs.filter((r) => r.type === "must-have");
  const mustMet = must.filter((r) => r.status === "met").length;
  const met = reqs.filter((r) => r.status === "met").length;
  const chip = "inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs";
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <span className={chip}>
        <span className="size-1.5 rounded-full" style={{ background: "var(--met)" }} />
        Must-haves {mustMet}/{must.length}
      </span>
      <span className={chip}>
        <span className="size-1.5 rounded-full bg-foreground" />
        Requirements {met}/{reqs.length}
      </span>
    </div>
  );
}

export function Step4Results() {
  const { analysis, tier, upgrade, reset } = useWizard();
  if (!analysis) return null;
  const { score } = analysis;

  return (
    <div>
      {/* Score header — shown to everyone */}
      <Card className="p-6 mb-4">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <Gauge score={score.overall_fit_score} />
          <div className="min-w-0 flex-1">
            <div className="font-display text-xl" style={{ color: verdictColor(score.verdict) }}>
              {score.verdict}
            </div>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-md leading-relaxed">{score.summary}</p>
            <CoverageChips a={analysis} />
          </div>
        </div>
      </Card>

      {tier === "paid" ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <ReportBody a={analysis} />
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
          <Button size="lg" className="w-full sm:w-auto" onClick={upgrade}>
            Unlock Full Analysis & Tailored CV — $10
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Demo: payment is simulated. We&apos;ll re-run the deeper analysis for you.
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
