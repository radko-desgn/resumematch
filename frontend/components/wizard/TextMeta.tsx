"use client";

import { Check, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function TextMeta({ value, min, onFill }: { value: string; min: number; onFill: () => void }) {
  const len = value.trim().length;
  const ready = len >= min;
  return (
    <div className="mt-2.5 flex items-center justify-between gap-3">
      <span className={cn("inline-flex items-center gap-1.5 text-xs", ready ? "text-met" : "text-muted-foreground")}>
        {ready ? <Check className="size-3.5" /> : null}
        {ready ? "Looks good" : `${len}/${min} characters`}
      </span>
      <button
        type="button"
        onClick={onFill}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <Wand2 className="size-3.5" /> Try a sample
      </button>
    </div>
  );
}
