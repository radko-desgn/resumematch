"use client";

import * as React from "react";
import { Analysis, CvInput, JobInput } from "./types";
import { getHealth, runAnalyze } from "./api";

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
  hasKey: boolean;
  /** True when the server has an email provider configured (report delivery). */
  emailConfigured: boolean;
  /** Email for an anonymous free scan (unused when signed in). */
  freeEmail: string;
  freeConsent: boolean;
  setFreeEmail: (v: string) => void;
  setFreeConsent: (v: boolean) => void;
  setMock: (m: boolean) => void;
  setCv: (patch: Partial<CvInput>) => void;
  setJob: (patch: Partial<JobInput>) => void;
  setTier: (t: Tier) => void;
  goto: (s: number) => void;
  next: () => void;
  back: () => void;
  reset: () => void;
  analyze: () => Promise<void>;
  /** Pick a plan and immediately start the scan. */
  startScan: (t: Tier) => void;
  /** Upgrade after a free scan — re-runs the analysis with rewrites. */
  upgrade: () => void;
  cvReady: boolean;
  jobReady: boolean;
}

const WizardCtx = React.createContext<WizardState | null>(null);

export function useWizard() {
  const ctx = React.useContext(WizardCtx);
  if (!ctx) throw new Error("useWizard must be used within WizardProvider");
  return ctx;
}

/** Mirrors validation.MIN_CHARS on the server, so the client never says
 *  "Looks good" about text the API will refuse to score. */
export const MIN_TEXT_CHARS = 100;

const emptyCv: CvInput = { kind: "text", text: "", file: null };
const emptyJob: JobInput = { kind: "text", text: "", url: "", file: null };

// Persist the wizard across full-page redirects (Google sign-in, Stripe
// checkout, an email-confirm tab) so a free-scan visitor who signs in or buys
// credits doesn't lose their CV, job, and result. Files can't be stored, but the
// analysis carries the resolved text (_source), so a restored session can still
// run the deep scan.
const STORE_KEY = "rm-wizard-v1";
const STORE_MAX_AGE = 2 * 60 * 60 * 1000; // 2 hours

export function WizardProvider({
  children,
  initialAnalysis = null,
  initialTier = "free",
  initialStep = 1,
}: {
  children: React.ReactNode;
  /** Seed state — used by the /preview/results design page. */
  initialAnalysis?: Analysis | null;
  initialTier?: Tier;
  initialStep?: number;
}) {
  const [step, setStep] = React.useState(initialStep);
  const [cv, setCvState] = React.useState<CvInput>(emptyCv);
  const [job, setJobState] = React.useState<JobInput>(emptyJob);
  const [tier, setTier] = React.useState<Tier>(initialTier);
  const [status, setStatus] = React.useState<Status>(initialAnalysis ? "done" : "idle");
  const [analysis, setAnalysis] = React.useState<Analysis | null>(initialAnalysis);
  const [error, setError] = React.useState<string | null>(null);
  // Free demo mode is the DEFAULT so nobody spends money by accident.
  const [mock, setMock] = React.useState(true);
  const [freeEmail, setFreeEmail] = React.useState("");
  const [freeConsent, setFreeConsent] = React.useState(false);
  const [hasKey, setHasKey] = React.useState(false);
  const [emailConfigured, setEmailConfigured] = React.useState(false);

  // Only the real wizard persists; the /preview design page seeds its own state.
  const persist = initialAnalysis === null;

  React.useEffect(() => {
    getHealth()
      .then((h) => {
        setHasKey(Boolean(h.has_key));
        setEmailConfigured(Boolean(h.email_provider));
      })
      .catch(() => {
        setHasKey(false);
        setEmailConfigured(false);
      });
  }, []);

  // Restore a saved session once on mount (client only) — this is exactly what
  // an effect is for: syncing with an external store (localStorage) unavailable
  // during SSR. The one-time sets are intentional.
  /* eslint-disable react-hooks/set-state-in-effect */
  React.useEffect(() => {
    if (!persist) return;
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      if (!s || Date.now() - (s.ts || 0) > STORE_MAX_AGE) {
        localStorage.removeItem(STORE_KEY);
        return;
      }
      const saved: Analysis | null = s.analysis ?? null;
      // Prefer the resolved text from the analysis so a restored session runs
      // the deep scan even if the original input was an uploaded file.
      if (saved?._source) {
        setCvState({ kind: "text", text: saved._source.cv, file: null });
        setJobState({ kind: "text", text: saved._source.job, url: "", file: null });
      } else {
        if (s.cv?.text) setCvState({ kind: "text", text: s.cv.text, file: null });
        if (s.job) {
          setJobState({
            kind: s.job.kind === "url" ? "url" : "text",
            text: s.job.text || "",
            url: s.job.url || "",
            file: null,
          });
        }
      }
      if (saved) {
        setAnalysis(saved);
        setStatus("done");
      }
      if (s.tier === "free" || s.tier === "paid") setTier(s.tier);
      if (typeof s.step === "number") setStep(Math.min(4, Math.max(1, s.step)));
    } catch {
      /* ignore corrupt/unavailable storage */
    }
  }, [persist]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Save on meaningful changes.
  React.useEffect(() => {
    if (!persist) return;
    if (step === 1 && !analysis && !cv.text && !job.text) return; // nothing to save
    try {
      localStorage.setItem(
        STORE_KEY,
        JSON.stringify({
          ts: Date.now(),
          step,
          tier,
          analysis,
          cv: { kind: cv.kind, text: cv.text },
          job: { kind: job.kind, text: job.text, url: job.url },
        })
      );
    } catch {
      /* storage full or disabled — non-fatal */
    }
  }, [persist, step, tier, analysis, cv, job]);

  const setCv = (patch: Partial<CvInput>) => setCvState((c) => ({ ...c, ...patch }));
  const setJob = (patch: Partial<JobInput>) => setJobState((j) => ({ ...j, ...patch }));

  const cvReady =
    (cv.kind === "text" && cv.text.trim().length >= MIN_TEXT_CHARS) ||
    (cv.kind !== "text" && cv.file !== null);
  const jobReady =
    (job.kind === "text" && job.text.trim().length >= MIN_TEXT_CHARS) ||
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
    setMock(true); // always fall back to free mode on reset
    if (persist) {
      try {
        localStorage.removeItem(STORE_KEY);
      } catch {
        /* ignore */
      }
    }
  };

  const analyze = React.useCallback(async () => {
    setStatus("processing");
    setError(null);
    try {
      // Free tier skips the rewrite call entirely (cheaper per scan).
      const result = await runAnalyze(cv, job, mock, tier === "paid", {
        email: freeEmail,
        marketingConsent: freeConsent,
      });
      setAnalysis(result);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
      setStatus("error");
    }
  }, [cv, job, mock, tier, freeEmail, freeConsent]);

  const startScan = (t: Tier) => {
    setTier(t);
    setAnalysis(null);
    setStep(3);
  };

  const upgrade = () => {
    setTier("paid");
    setAnalysis(null);
    setStep(3); // re-runs the scan, now with rewrites
  };

  const value: WizardState = {
    step, cv, job, tier, status, analysis, error, mock, hasKey, emailConfigured, setMock,
    freeEmail, freeConsent, setFreeEmail, setFreeConsent,
    setCv, setJob, setTier, goto, next, back, reset, analyze, startScan, upgrade,
    cvReady, jobReady,
  };
  return <WizardCtx.Provider value={value}>{children}</WizardCtx.Provider>;
}
