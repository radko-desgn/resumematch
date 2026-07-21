"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Check, Loader2 } from "lucide-react";
import { useWizard } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STAGES = [
  "Parsing your CV",
  "Extracting job requirements",
  "Embedding & semantic matching",
  "Scoring compatibility",
  "Writing tailored rewrites",
];

export function Step3Processing() {
  const { analyze, status, error, next, back } = useWizard();
  const [stage, setStage] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!started.current) {
      started.current = true;
      analyze();
    }
  }, [analyze]);

  useEffect(() => {
    const id = setInterval(() => setStage((s) => Math.min(STAGES.length - 1, s + 1)), 1150);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (status === "done") next();
  }, [status, next]);

  if (status === "error") {
    return (
      <div className="flex flex-col items-center text-center py-10">
        <AlertTriangle className="size-10 text-missing mb-4" />
        <h2 className="font-display text-2xl mb-2">Analysis failed</h2>
        <p className="text-muted-foreground max-w-md mb-6">{error}</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={back}>Back</Button>
          <Button onClick={() => { started.current = false; setStage(0); analyze(); }}>Try again</Button>
        </div>
      </div>
    );
  }

  const progress = Math.min(96, ((stage + 1) / STAGES.length) * 100);

  return (
    <div className="py-6">
      <div className="flex flex-col items-center text-center">
        {/* radar */}
        <div className="relative mb-6 h-28 w-28">
          {[52, 38, 24].map((r) => (
            <span key={r} className="absolute inset-0 m-auto rounded-full border border-border" style={{ width: r * 2, height: r * 2 }} aria-hidden />
          ))}
          <motion.div
            className="absolute inset-0"
            style={{
              background: "conic-gradient(from 0deg, transparent 0deg, color-mix(in srgb, var(--foreground) 45%, transparent) 60deg, transparent 90deg)",
              borderRadius: "9999px",
              maskImage: "radial-gradient(circle, black 60%, transparent 61%)",
              WebkitMaskImage: "radial-gradient(circle, black 60%, transparent 61%)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2.2, ease: "linear", repeat: Infinity }}
            aria-hidden
          />
          <span className="absolute inset-0 m-auto h-2 w-2 rounded-full bg-foreground" style={{ boxShadow: "0 0 16px color-mix(in srgb, var(--foreground) 60%, transparent)" }} />
        </div>
        <h2 className="font-display text-2xl">Analyzing your match</h2>
        <p className="text-sm text-muted-foreground mt-1.5 mb-7">This takes a few seconds — hang tight.</p>
      </div>

      {/* staged checklist */}
      <ul className="mx-auto max-w-sm space-y-1">
        {STAGES.map((label, i) => {
          const done = i < stage;
          const active = i === stage;
          return (
            <li key={label} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors", active && "bg-muted")}>
              <span className="flex size-6 shrink-0 items-center justify-center">
                {done ? (
                  <span className="flex size-6 items-center justify-center rounded-full bg-foreground text-background">
                    <Check className="size-3.5" />
                  </span>
                ) : active ? (
                  <Loader2 className="size-5 animate-spin text-foreground" />
                ) : (
                  <span className="size-2 rounded-full bg-border" />
                )}
              </span>
              <span className={cn("text-sm transition-colors", done ? "text-foreground" : active ? "text-foreground font-medium" : "text-muted-foreground")}>
                {label}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mx-auto mt-7 h-1.5 max-w-sm overflow-hidden rounded-full bg-muted">
        <motion.div className="h-full bg-foreground" animate={{ width: `${progress}%` }} transition={{ ease: "easeOut" }} />
      </div>
    </div>
  );
}
