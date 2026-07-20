"use client";

import * as React from "react";
import { Analysis, CvInput, JobInput } from "./types";
import { runAnalyze } from "./api";

export type Tier = "free" | "paid";
export type Status = "idle" | "processing" | "done" | "error";

interface WizardState {
  step: number; // 1..4
  cv: CvInput;
  job: JobInput;
  tier: Tier;
  status: Status;
  analysis: Analysis | null;
  error: string | null;
  mock: boolean;
  setCv: (patch: Partial<CvInput>) => void;
  setJob: (patch: Partial<JobInput>) => void;
  setTier: (t: Tier) => void;
  goto: (s: number) => void;
  next: () => void;
  back: () => void;
  reset: () => void;
  analyze: () => Promise<void>;
  cvReady: boolean;
  jobReady: boolean;
}

const WizardCtx = React.createContext<WizardState | null>(null);

export function useWizard() {
  const ctx = React.useContext(WizardCtx);
  if (!ctx) throw new Error("useWizard must be used within WizardProvider");
  return ctx;
}

const emptyCv: CvInput = { kind: "text", text: "", file: null };
const emptyJob: JobInput = { kind: "text", text: "", url: "", file: null };

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = React.useState(1);
  const [cv, setCvState] = React.useState<CvInput>(emptyCv);
  const [job, setJobState] = React.useState<JobInput>(emptyJob);
  const [tier, setTier] = React.useState<Tier>("free");
  const [status, setStatus] = React.useState<Status>("idle");
  const [analysis, setAnalysis] = React.useState<Analysis | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const mock = true; // free build; live requires a key on the backend

  const setCv = (patch: Partial<CvInput>) => setCvState((c) => ({ ...c, ...patch }));
  const setJob = (patch: Partial<JobInput>) => setJobState((j) => ({ ...j, ...patch }));

  const cvReady =
    (cv.kind === "text" && cv.text.trim().length > 30) ||
    (cv.kind !== "text" && cv.file !== null);
  const jobReady =
    (job.kind === "text" && job.text.trim().length > 30) ||
    (job.kind === "url" && /^https?:\/\/.+/.test(job.url.trim())) ||
    ((job.kind === "file" || job.kind === "image") && job.file !== null);

  const goto = (s: number) => setStep(Math.min(4, Math.max(1, s)));
  const next = () => goto(step + 1);
  const back = () => goto(step - 1);
  const reset = () => {
    setCvState(emptyCv);
    setJobState(emptyJob);
    setAnalysis(null);
    setTier("free");
    setStatus("idle");
    setError(null);
    setStep(1);
  };

  const analyze = React.useCallback(async () => {
    setStatus("processing");
    setError(null);
    try {
      const result = await runAnalyze(cv, job, mock);
      setAnalysis(result);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
      setStatus("error");
    }
  }, [cv, job, mock]);

  const value: WizardState = {
    step, cv, job, tier, status, analysis, error, mock,
    setCv, setJob, setTier, goto, next, back, reset, analyze, cvReady, jobReady,
  };
  return <WizardCtx.Provider value={value}>{children}</WizardCtx.Provider>;
}
