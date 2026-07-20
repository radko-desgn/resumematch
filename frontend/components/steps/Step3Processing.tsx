"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useWizard } from "@/lib/store";
import { Button } from "@/components/ui/button";

const STAGES = [
  "Parsing your CV…",
  "Extracting job requirements…",
  "Embedding & semantic matching…",
  "Scoring compatibility…",
  "Writing tailored rewrites…",
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
    const id = setInterval(() => setStage((s) => Math.min(STAGES.length - 1, s + 1)), 1200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (status === "done") next();
  }, [status, next]);

  if (status === "error") {
    return (
      <div className="flex flex-col items-center text-center py-12">
        <AlertTriangle className="size-10 text-missing mb-4" />
        <h2 className="font-display text-2xl font-semibold mb-2">Analysis failed</h2>
        <p className="text-muted-foreground max-w-md mb-6">{error}</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={back}>Back</Button>
          <Button
            onClick={() => {
              started.current = false;
              setStage(0);
              analyze();
            }}
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const progress = Math.min(96, ((stage + 1) / STAGES.length) * 100);

  return (
    <div className="flex flex-col items-center text-center py-10">
      {/* radar / scan */}
      <div className="relative mb-8 h-40 w-40">
        {[60, 44, 28].map((r, i) => (
          <span
            key={r}
            className="absolute inset-0 m-auto rounded-full border border-border"
            style={{ width: r * 2, height: r * 2 }}
            aria-hidden
          />
        ))}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, color-mix(in srgb, var(--brand-b) 55%, transparent) 60deg, transparent 90deg)",
            borderRadius: "9999px",
            maskImage: "radial-gradient(circle, black 62%, transparent 63%)",
            WebkitMaskImage: "radial-gradient(circle, black 62%, transparent 63%)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2.2, ease: "linear", repeat: Infinity }}
          aria-hidden
        />
        <span className="absolute inset-0 m-auto h-2.5 w-2.5 rounded-full brand-gradient" style={{ boxShadow: "0 0 18px var(--brand-b)" }} />
      </div>

      <h2 className="font-display text-2xl font-semibold mb-2">Analyzing your match</h2>
      <motion.p key={stage} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-sm text-muted-foreground mb-6">
        {STAGES[stage]}
      </motion.p>

      <div className="w-full max-w-md h-2 rounded-full bg-muted overflow-hidden">
        <motion.div className="h-full brand-gradient" animate={{ width: `${progress}%` }} transition={{ ease: "easeOut" }} />
      </div>
    </div>
  );
}
