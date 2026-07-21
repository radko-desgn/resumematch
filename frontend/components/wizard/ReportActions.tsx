"use client";

import { useState } from "react";
import { Download, Loader2, Mail, Check, AlertTriangle } from "lucide-react";
import { Analysis } from "@/lib/types";
import { downloadReportPdf, emailReport } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function ReportActions({ analysis }: { analysis: Analysis }) {
  const [downloading, setDownloading] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "info" | "err"; text: string } | null>(null);

  async function onDownload() {
    setDownloading(true);
    setMsg(null);
    try {
      await downloadReportPdf(analysis);
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "Download failed" });
    } finally {
      setDownloading(false);
    }
  }

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setMsg(null);
    try {
      const r = await emailReport(email, analysis);
      setMsg({ kind: r.sent ? "ok" : "info", text: r.detail });
    } catch (err) {
      setMsg({ kind: "err", text: err instanceof Error ? err.message : "Could not send" });
    } finally {
      setSending(false);
    }
  }

  return (
    <Card className="p-5 mt-4">
      <h3 className="font-display font-semibold">Take your report with you</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        A branded PDF with your score, gaps, and the suggested rewrites.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button onClick={onDownload} disabled={downloading} className="w-full sm:w-auto">
          {downloading ? <Loader2 className="animate-spin" /> : <Download />}
          {downloading ? "Building PDF…" : "Download PDF"}
        </Button>

        <form onSubmit={onEmail} className="flex flex-1 flex-col gap-2 sm:flex-row">
          <Input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            aria-label="Email address"
          />
          <Button type="submit" variant="outline" disabled={sending || !email} className="w-full sm:w-auto">
            {sending ? <Loader2 className="animate-spin" /> : <Mail />}
            {sending ? "Sending…" : "Email it"}
          </Button>
        </form>
      </div>

      {msg && (
        <p
          className={`mt-3 flex items-start gap-2 text-xs ${
            msg.kind === "ok" ? "text-met" : msg.kind === "err" ? "text-missing" : "text-muted-foreground"
          }`}
        >
          {msg.kind === "ok" ? <Check className="size-4 shrink-0" /> : <AlertTriangle className="size-4 shrink-0" />}
          {msg.text}
        </p>
      )}
    </Card>
  );
}
