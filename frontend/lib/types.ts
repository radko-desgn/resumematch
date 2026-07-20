// Mirrors the Python Analysis schema (resumematch/schemas.py).

export interface Requirement {
  requirement: string;
  type: "must-have" | "nice-to-have";
  status: "met" | "partially-met" | "missing";
  evidence: string | null;
  note: string;
}

export interface ScoreResult {
  overall_fit_score: number;
  verdict: string;
  summary: string;
  requirements: Requirement[];
  key_strengths: string[];
  critical_gaps: string[];
  quick_wins: string[];
}

export interface RewrittenBullet {
  original: string;
  rewritten: string;
  changed: boolean;
  rationale: string;
  keywords_added: string[];
}

export interface RewriteResult {
  rewritten_bullets: RewrittenBullet[];
  tailored_summary: string;
}

export interface Analysis {
  score: ScoreResult;
  rewrite: RewriteResult;
  requirement_matches: { requirement: string; best_chunk: string; score: number }[];
  _meta?: { cv_chars: number; job_chars: number; mock: boolean };
}

// ---- Wizard input model ----
export type CvKind = "text" | "file" | "image";
export type JobKind = "text" | "url" | "file" | "image";

export interface CvInput {
  kind: CvKind;
  text: string;
  file: File | null;
}
export interface JobInput {
  kind: JobKind;
  text: string;
  url: string;
  file: File | null;
}
