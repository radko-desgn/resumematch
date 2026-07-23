"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const QA = [
  {
    q: "How do I get the most accurate match score?",
    a: "Paste the full text or upload a clean PDF/DOCX rather than a low-resolution screenshot. The more complete the CV and job description, the sharper the gap analysis.",
  },
  {
    q: "What's free vs. paid?",
    a: "You choose before we scan. The free quick check gives you the overall match percentage and a verdict, and never costs a credit. The deep AI analysis costs 1 scan credit and adds the executive summary, pain points, missing keywords, every gap with its evidence, and a branded PDF you can download or have emailed. Credits start at $3.99 for a single pass, or $9.99 for six scans plus a tailored-CV credit. You can start free and upgrade afterwards. In this demo, checkout is simulated — no card, no charge.",
  },
  {
    q: "Will it invent experience to make me look good?",
    a: "Never. Rewrites only rephrase what's already in your CV to match the job's language — no fabricated skills, tools, or metrics. Every judgment cites evidence from your resume.",
  },
  {
    q: "Does it work for any role or industry?",
    a: "Yes. It reads the requirements from whatever job you give it and matches them against your CV, so it works across roles and fields.",
  },
  {
    q: "What happens to my data?",
    a: "Your CV and the job text are used only to run the analysis for your session — they aren't part of any training set.",
  },
];

function Item({ q, a, open, onClick }: { q: string; a: string; open: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-border">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between gap-4 py-5 text-left cursor-pointer"
        aria-expanded={open}
      >
        <span className="font-medium">{q}</span>
        <Plus className={cn("size-5 shrink-0 text-muted-foreground transition-transform", open && "rotate-45")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-muted-foreground max-w-2xl">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-20 sm:py-24 scroll-mt-16">
      <div>
        <span className="eyebrow text-muted-foreground">FAQ &amp; tips</span>
        <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.05]">
          Everything you need to know
        </h2>
      </div>
      <div className="mt-10">
        {QA.map((item, i) => (
          <Item key={i} q={item.q} a={item.a} open={open === i} onClick={() => setOpen(open === i ? null : i)} />
        ))}
      </div>
    </section>
  );
}
