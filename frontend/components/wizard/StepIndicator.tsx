"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWizard } from "@/lib/store";

const STEPS = ["CV", "Job", "Analyze", "Results"];

export function StepIndicator() {
  const { step, goto, status } = useWizard();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="eyebrow text-muted-foreground text-[11px]">Step {step} of 4</span>
        <span className="font-display text-sm">{STEPS[step - 1]}</span>
      </div>
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const done = n < step;
          const active = n === step;
          const clickable = n < step && status !== "processing";
          return (
            <div key={label} className="flex-1">
              <button
                disabled={!clickable}
                onClick={() => clickable && goto(n)}
                className={cn("group flex w-full items-center gap-2", clickable ? "cursor-pointer" : "cursor-default")}
                aria-label={`${label} step`}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all",
                    done && "bg-foreground text-background",
                    active && "border-2 border-foreground text-foreground",
                    !done && !active && "border border-border text-muted-foreground"
                  )}
                >
                  {done ? <Check className="size-3.5" /> : n}
                </span>
                <span
                  className={cn(
                    "hidden sm:block text-sm font-medium transition-colors",
                    active ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              </button>
              <div className={cn("mt-2 h-1 rounded-full transition-all duration-500", n <= step ? "bg-foreground" : "bg-border")} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
