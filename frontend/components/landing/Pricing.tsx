"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Loader2, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCredits } from "@/lib/credits";
import { useAuthGate } from "@/components/auth/AuthGate";
import { Feature, Pack, PACKS } from "@/lib/packs";
import { cn } from "@/lib/utils";

function FeatureRow({ feature, dark }: { feature: Feature; dark?: boolean }) {
  const { state, text } = feature;
  const Icon = state === "credit" ? Zap : state === "locked" ? Lock : Check;

  // On the black card everything inverts, so tone is expressed with opacity
  // rather than a second colour — the palette stays monochrome either way.
  const tone =
    state === "locked"
      ? dark
        ? "text-background/40"
        : "text-muted-foreground"
      : dark
        ? "text-background"
        : "text-foreground";

  return (
    <li className="flex gap-2.5 text-sm leading-relaxed">
      <Icon
        className={cn(
          "size-4 shrink-0 mt-[3px]",
          state === "credit" && (dark ? "text-background" : "text-foreground"),
          state === "included" && (dark ? "text-background/70" : "text-met"),
          state === "locked" && (dark ? "text-background/35" : "text-muted-foreground/70")
        )}
        aria-hidden
      />
      <span className={tone}>{text}</span>
    </li>
  );
}

function PackCard({ pack, index }: { pack: Pack; index: number }) {
  const { purchase, signedIn } = useCredits();
  const { promptSignIn } = useAuthGate();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dark = Boolean(pack.featured);

  async function onBuy() {
    if (pack.id === "free") {
      document.getElementById("analyze")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (!signedIn) {
      promptSignIn("Credits are tied to your account, so you'll need to sign in first.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await purchase(pack.id);
      setDone(true);
      setTimeout(() => setDone(false), 4000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setBusy(false);
    }
  }

  const granted = pack.grants.unlimited
    ? "Pro unlocked"
    : `${pack.grants.scans} scan${pack.grants.scans === 1 ? "" : "s"} added`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={cn(
        "relative flex flex-col rounded-2xl border p-6 sm:p-7",
        dark
          ? "border-foreground bg-foreground text-background shadow-2xl lg:-my-3 lg:py-10"
          : "border-border bg-background"
      )}
    >
      <span
        className={cn(
          "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]",
          dark ? "bg-background text-foreground" : "bg-muted text-muted-foreground"
        )}
      >
        {pack.hotBadge && <span aria-hidden>🔥</span>}
        {pack.badge}
      </span>

      <h3 className={cn("mt-4 font-display text-xl", dark && "text-background")}>{pack.name}</h3>
      <p className={cn("mt-1.5 text-sm leading-relaxed", dark ? "text-background/60" : "text-muted-foreground")}>
        {pack.blurb}
      </p>

      {/* note on its own line: at 4-up the columns are too narrow to keep
          "one-time payment" from wrapping mid-phrase beside the price */}
      <div className="mt-5">
        <div className="font-display text-4xl tracking-tight">{pack.price}</div>
        <div className={cn("mt-1 text-xs", dark ? "text-background/55" : "text-muted-foreground")}>
          {pack.priceNote}
        </div>
      </div>

      <ul className={cn("mt-6 mb-7 flex-1 space-y-3 border-t pt-6", dark ? "border-background/15" : "border-border")}>
        {pack.features.map((f) => (
          <FeatureRow key={f.text} feature={f} dark={dark} />
        ))}
      </ul>

      <Button
        onClick={onBuy}
        disabled={busy}
        variant={dark ? "invert" : pack.id === "free" ? "outline" : "default"}
        className="w-full"
      >
        {busy ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Starting checkout…
          </>
        ) : done ? (
          <>
            <Check className="size-4" /> {granted}
          </>
        ) : (
          <>
            {pack.cta} <ArrowRight />
          </>
        )}
      </Button>

      {error && <p className="mt-2 text-center text-xs text-missing">{error}</p>}

      {pack.id !== "free" && !error && (
        <p className={cn("mt-2.5 text-center text-[11px]", dark ? "text-background/45" : "text-muted-foreground")}>
          Demo: checkout is simulated — no card, no charge.
        </p>
      )}
    </motion.div>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-16 border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <div className="max-w-2xl">
          <span className="eyebrow text-muted-foreground">Pricing</span>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.05]">
            Pay for the scans you actually need
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            The free check is always free. Credits only get spent when you ask for the deep AI analysis.
          </p>
        </div>

        <div className="mt-12 sm:mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:items-start">
          {PACKS.map((p, i) => (
            <PackCard key={p.id} pack={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
