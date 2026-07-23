"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { FileDown, Loader2, Lock, Sparkles, AlertTriangle, FileText } from "lucide-react";
import { useWizard } from "@/lib/store";
import { useCredits } from "@/lib/credits";
import { ENTRY_PRICE } from "@/lib/packs";
import { generateTailoredCv, downloadTailoredCv } from "@/lib/api";
import { TailoredCV } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/** Markdown → styled elements (no typography plugin needed). */
const MD = {
  h1: (p: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="font-display text-xl mb-0.5" {...p} />
  ),
  h2: (p: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-5 mb-2 border-b border-border pb-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground" {...p} />
  ),
  p: (p: React.HTMLAttributes<HTMLParagraphElement>) => <p className="my-1.5 text-sm leading-relaxed" {...p} />,
  ul: (p: React.HTMLAttributes<HTMLUListElement>) => <ul className="my-1.5 space-y-1.5" {...p} />,
  li: (p: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="relative pl-4 text-sm leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:size-1 before:rounded-full before:bg-foreground/40" {...p} />
  ),
  strong: (p: React.HTMLAttributes<HTMLElement>) => <strong className="font-semibold" {...p} />,
};

export function TailoredCv() {
  const { analysis, mock } = useWizard();
  const { canGenerateCv, spendCv, cvs, unlimited } = useCredits();
  const [cv, setCv] = useState<TailoredCV | null>(null);
  const [busy, setBusy] = useState(false);
  const [exporting, setExporting] = useState<"pdf" | "docx" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const source = analysis?._source;

  async function onGenerate() {
    if (!source) return;
    // Charge once per job, not per attempt: a regenerate is a retry of
    // something already paid for.
    if (!cv && !spendCv()) return;
    setBusy(true);
    setError(null);
    try {
      const gaps = analysis?.score.critical_gaps ?? [];
      setCv(await generateTailoredCv(source.cv, source.job, mock, gaps));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setBusy(false);
    }
  }

  async function onExport(format: "pdf" | "docx") {
    if (!cv) return;
    setExporting(format);
    setError(null);
    try {
      await downloadTailoredCv(cv.markdown, format);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed");
    } finally {
      setExporting(null);
    }
  }

  if (!source) return null;

  return (
    <Card className="mt-4 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display font-semibold flex items-center gap-2">
            <FileText className="size-4" /> Tailored CV
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            An ATS-friendly CV rewritten for this job — reordered and reworded, never invented.
            {!cv && (unlimited ? " Unlimited on Pro." : ` Costs 1 CV credit — you have ${cvs}.`)}
          </p>
        </div>
        {!cv &&
          (canGenerateCv ? (
            <Button onClick={onGenerate} disabled={busy} className="w-full sm:w-auto">
              {busy ? <Loader2 className="animate-spin" /> : <Sparkles />}
              {busy ? "Writing your CV…" : "Generate tailored CV"}
            </Button>
          ) : (
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <a href="#pricing">
                <Lock className="size-4" /> Needs a CV credit — from {ENTRY_PRICE}
              </a>
            </Button>
          ))}
      </div>

      {error && (
        <p className="mt-3 flex items-start gap-2 text-xs text-missing">
          <AlertTriangle className="size-4 shrink-0" /> {error}
        </p>
      )}

      {cv && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* what changed */}
          {(cv.keywords_used.length > 0 || cv.changes.length > 0) && (
            <div className="mt-4 rounded-xl bg-muted p-4">
              {cv.keywords_used.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-muted-foreground mr-1">Keywords surfaced:</span>
                  {cv.keywords_used.map((k) => (
                    <span key={k} className="rounded-full border border-border bg-card px-2 py-0.5 text-[11px]">
                      {k}
                    </span>
                  ))}
                </div>
              )}
              {cv.changes.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {cv.changes.map((c, i) => (
                    <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-foreground/40" />
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* live preview — styled like a document */}
          <div className="mt-4 max-h-[460px] overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-inner">
            <ReactMarkdown components={MD}>{cv.markdown}</ReactMarkdown>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => onExport("pdf")} disabled={exporting !== null} className="w-full sm:w-auto">
              {exporting === "pdf" ? <Loader2 className="animate-spin" /> : <FileDown />} Download .pdf
            </Button>
            <Button variant="outline" onClick={() => onExport("docx")} disabled={exporting !== null} className="w-full sm:w-auto">
              {exporting === "docx" ? <Loader2 className="animate-spin" /> : <FileDown />} Download .docx
            </Button>
            <Button variant="ghost" onClick={onGenerate} disabled={busy} className="w-full sm:w-auto">
              {busy ? <Loader2 className="animate-spin" /> : <Sparkles />} Regenerate
            </Button>
          </div>
        </motion.div>
      )}
    </Card>
  );
}
