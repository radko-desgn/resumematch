"use client";

import { motion } from "framer-motion";
import { FileUp, Briefcase, Radar, BarChart3 } from "lucide-react";

const STEPS = [
  { icon: FileUp, title: "Add your CV", body: "Upload a PDF/DOCX, paste the text, or drop a screenshot — OCR reads it." },
  { icon: Briefcase, title: "Add the job", body: "Paste a link, a PDF, the text, or a screenshot of the offer." },
  { icon: Radar, title: "AI analyzes", body: "We parse both, extract requirements, and match them semantically." },
  { icon: BarChart3, title: "Get your match", body: "A score, an evidence-backed gap analysis, and tailored rewrites." },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-background scroll-mt-16">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="max-w-2xl">
          <span className="eyebrow text-muted-foreground">How it works</span>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.05]">
            From raw CV to a real match in four steps
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">No account, no setup. Paste, click, and read your fit.</p>
        </div>

        <div className="mt-12 sm:mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="bg-background p-7 sm:p-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl bg-foreground text-background">
                  <s.icon className="size-5" />
                </div>
                <span className="font-display text-2xl text-border">0{i + 1}</span>
              </div>
              <h3 className="mt-5 font-display text-lg">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
