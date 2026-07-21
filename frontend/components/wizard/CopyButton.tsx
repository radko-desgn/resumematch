"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-foreground/5 transition-colors cursor-pointer shrink-0"
      aria-label={label}
    >
      {copied ? <Check className="size-3.5 text-met" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : label}
    </button>
  );
}
