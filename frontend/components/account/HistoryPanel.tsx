"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Clock, Loader2, Trash2 } from "lucide-react";
import { listScans, getScan, deleteScan, ScanSummary } from "@/lib/api";
import { Analysis } from "@/lib/types";
import { AnalysisReport } from "@/components/results/AnalysisReport";
import { SidePanel } from "./SidePanel";

/**
 * Scan history. The list is one panel; opening a scan slides in a wider panel
 * with the full report (the "extend on the side" review), sharing the same
 * AnalysisReport the wizard uses so a revisited scan looks identical.
 */
export function HistoryPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [scans, setScans] = useState<ScanSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [detail, setDetail] = useState<{ tier: string; analysis: Analysis } | null>(null);
  const [detailBusy, setDetailBusy] = useState(false);

  // Load (and reload) the list whenever the panel opens.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    // Keeps any previous list visible while refetching (no null flash), and
    // avoids a synchronous setState in the effect body.
    listScans()
      .then((s) => {
        if (cancelled) return;
        setScans(s);
        setError(null);
      })
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [open]);

  async function review(id: string) {
    setOpenId(id);
    setDetail(null);
    setDetailBusy(true);
    try {
      const full = await getScan(id);
      setDetail({ tier: full.tier, analysis: full.analysis });
    } catch {
      setDetail(null);
    } finally {
      setDetailBusy(false);
    }
  }

  async function remove(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setScans((prev) => prev?.filter((s) => s.id !== id) ?? prev); // optimistic
    try {
      await deleteScan(id);
    } catch {
      listScans().then(setScans).catch(() => {}); // resync on failure
    }
  }

  return (
    <>
      <SidePanel open={open} title="Scan history" onClose={onClose}>
        {error ? (
          <p className="text-sm text-missing">{error}</p>
        ) : scans === null ? (
          <div className="flex justify-center py-10">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : scans.length === 0 ? (
          <div className="py-10 text-center">
            <Clock className="mx-auto mb-3 size-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No scans yet. Run one and it&apos;ll show up here.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {scans.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => review(s.id)}
                  className="group flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left transition-colors hover:border-foreground/30 hover:bg-muted/50"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-foreground font-display text-sm text-background">
                    {s.score ?? "—"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-medium capitalize">{s.verdict ?? "Result"}</span>
                      <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                        {s.tier}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {new Date(s.created_at).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label="Delete scan"
                    onClick={(e) => remove(s.id, e)}
                    onKeyDown={(e) => e.key === "Enter" && remove(s.id, e as unknown as React.MouseEvent)}
                    className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity hover:bg-missing/10 hover:text-missing group-hover:opacity-100"
                  >
                    <Trash2 className="size-4" />
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </SidePanel>

      {/* Reviewed scan — a wider panel layered over the list */}
      <SidePanel
        open={openId !== null}
        title="Reviewing scan"
        onBack={() => setOpenId(null)}
        onClose={() => {
          setOpenId(null);
          onClose();
        }}
        wide
      >
        {detailBusy || !detail ? (
          <div className="flex justify-center py-10">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <AnalysisReport analysis={detail.analysis} full={detail.tier === "paid"} />
        )}
      </SidePanel>
    </>
  );
}
