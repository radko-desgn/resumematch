"use client";

import { Zap } from "lucide-react";
import { useWizard } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { mock, setMock, hasKey } = useWizard();
  const live = !mock;
  const disabled = !hasKey;

  return (
    <div className={cn("rounded-xl border p-3.5 flex items-start justify-between gap-4", live ? "border-foreground" : "border-border")}>
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Zap className="size-4" />
          Live analysis
          {live && (
            <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold text-background">
              ~1.5¢ per run
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {disabled
            ? "No API key on the server — free demo mode only."
            : live
              ? "Real AI analysis of your CV, billed to your Anthropic key."
              : "Free demo mode — sample results, no API cost."}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={live}
        aria-label="Toggle live analysis"
        disabled={disabled}
        onClick={() => setMock(!mock)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors mt-0.5",
          live ? "bg-foreground" : "bg-border",
          disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-all",
            live ? "left-[22px]" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}
