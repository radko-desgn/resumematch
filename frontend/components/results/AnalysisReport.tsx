"use client";

import { AlertTriangle, Check, Sparkles } from "lucide-react";
import { Gauge } from "../wizard/Gauge";
import { CopyButton } from "../wizard/CopyButton";
import { Card } from "@/components/ui/card";
import { Analysis } from "@/lib/types";

/**
 * Presentational analysis view — the score header, coverage chips, and (when
 * `full`) the strengths / gaps / recommendations breakdown.
 *
 * Extracted from Step4Results so the wizard result and a reviewed history scan
 * render from exactly the same code and can't drift apart. Pure props, no
 * wizard/credits context, so it works anywhere.
 */

function CoverageChips({ a }: { a: Analysis }) {
  const reqs = a.score.requirements;
  const must = reqs.filter((r) => r.type === "must-have");
  const mustMet = must.filter((r) => r.status === "met").length;
  const met = reqs.filter((r) => r.status === "met").length;
  const chip =
    "inline-flex items-baseline gap-2 rounded-full border border-foreground/20 bg-foreground/[0.04] px-3.5 py-1.5 text-xs";
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
      <span className={chip}>
        <span className="font-semibold uppercase tracking-[0.08em] text-muted-foreground">Must-haves</span>
        <span className="font-display text-sm">{mustMet}/{must.length}</span>
      </span>
      <span className={chip}>
        <span className="font-semibold uppercase tracking-[0.08em] text-muted-foreground">Requirements</span>
        <span className="font-display text-sm">{met}/{reqs.length}</span>
      </span>
    </div>
  );
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
    ...a.rewrite.rewritten_bullets.filter((b) => b.changed).map((b) => b.rewritten),
  ];
  return (
    <div className="mt-4 grid gap-4">
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

      {recs.length > 0 && (
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-display font-semibold flex items-center gap-2">
              <Sparkles className="size-4" /> Recommendations
            </h3>
            <CopyButton text={recs.join("\n")} label="Copy all" />
          </div>
          <ul className="divide-y divide-border">
            {recs.map((r, i) => (
              <li key={i} className="py-2.5 text-sm first:pt-0 last:pb-0">{r}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

export function AnalysisReport({ analysis, full }: { analysis: Analysis; full: boolean }) {
  const { score } = analysis;
  return (
    <div>
      <Card className="p-6">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:gap-8 sm:text-left">
          <Gauge score={score.overall_fit_score} />
          <div className="min-w-0 flex-1">
            <div className="font-display text-2xl capitalize">{score.verdict}</div>
            <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground">{score.summary}</p>
            <CoverageChips a={analysis} />
          </div>
        </div>
      </Card>
      {full && <ReportBody a={analysis} />}
    </div>
  );
}
