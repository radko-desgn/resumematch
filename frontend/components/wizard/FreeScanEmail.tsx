"use client";

import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";

/**
 * Email capture in front of the anonymous free scan.
 *
 * The address is required to run the scan (it's how the one-per-email limit is
 * enforced). Marketing is a SEPARATE, unticked opt-in: under GDPR consent has
 * to be a specific affirmative act, and the service can't be conditional on it,
 * so the button works identically whether or not the box is ticked.
 */
export function FreeScanEmail({
  email,
  consent,
  onEmail,
  onConsent,
  onSubmit,
  disabled,
  error,
}: {
  email: string;
  consent: boolean;
  onEmail: (v: string) => void;
  onConsent: (v: boolean) => void;
  onSubmit: () => void;
  disabled?: boolean;
  error?: string | null;
}) {
  const [touched, setTouched] = useState(false);
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  return (
    <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4">
      <label htmlFor="free-scan-email" className="flex items-center gap-2 text-sm font-medium">
        <Mail className="size-4" /> Where should we send your result?
      </label>
      <p className="mt-1 text-xs text-muted-foreground">
        One free scan per email. No account needed.
      </p>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <Input
          id="free-scan-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => onEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          className="flex-1"
        />
        <Button onClick={onSubmit} disabled={disabled || !valid} className="sm:w-auto">
          Get my score <ArrowRight />
        </Button>
      </div>

      {touched && email.trim() && !valid && (
        <p className="mt-2 text-xs text-missing">That doesn&apos;t look like a valid email address.</p>
      )}
      {error && <p className="mt-2 text-xs text-missing">{error}</p>}

      {/* Separate and unticked on purpose — see the component docstring. */}
      <label className="mt-3 flex cursor-pointer items-start gap-2.5 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => onConsent(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 cursor-pointer accent-foreground"
        />
        <span>
          Send me job-search tips and product updates. Optional — you&apos;ll get your
          scan either way, and you can unsubscribe at any time. See our{" "}
          <Link href="/privacy" target="_blank" className="underline underline-offset-2 hover:no-underline">Privacy Policy</Link>.
        </span>
      </label>
    </div>
  );
}
