import { Analysis, CvInput, JobInput } from "./types";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getHealth(): Promise<{ ok: boolean; has_key: boolean; email_provider: boolean }> {
  const res = await fetch(`${API}/api/health`);
  if (!res.ok) throw new Error("health check failed");
  return res.json();
}

/** Build the branded PDF server-side and trigger a browser download. */
export async function downloadReportPdf(analysis: Analysis): Promise<void> {
  const res = await fetch(`${API}/api/report/pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ analysis }),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Could not build the PDF");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resumematch-report.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function emailReport(
  email: string,
  analysis: Analysis
): Promise<{ sent: boolean; simulated: boolean; detail: string }> {
  const res = await fetch(`${API}/api/report/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, analysis }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.detail || "Could not send the email");
  return body;
}

export async function runAnalyze(cv: CvInput, job: JobInput, mock: boolean): Promise<Analysis> {
  const fd = new FormData();
  fd.append("cv_kind", cv.kind);
  fd.append("job_kind", job.kind);
  fd.append("mock", String(mock));

  if (cv.kind === "text") fd.append("cv_text", cv.text);
  else if (cv.file) fd.append("cv_file", cv.file);

  if (job.kind === "text") fd.append("job_text", job.text);
  else if (job.kind === "url") fd.append("job_url", job.url);
  else if (job.file) fd.append("job_file", job.file);

  const res = await fetch(`${API}/api/analyze`, { method: "POST", body: fd });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      msg = body.detail || msg;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  return res.json();
}
