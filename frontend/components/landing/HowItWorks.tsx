"use client";

import { motion } from "framer-motion";
import { FileUp, Briefcase, Radar, BarChart3, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

const STEPS = [
  { icon: FileUp, title: "Add your CV", body: "Upload a PDF/DOCX, paste the text, or drop a screenshot — OCR reads it." },
  { icon: Briefcase, title: "Add the job", body: "Paste a link, a PDF, the text, or a screenshot of the offer." },
  { icon: Radar, title: "AI analyzes", body: "We parse both, extract requirements, and match them semantically." },
  { icon: BarChart3, title: "Get your match", body: "A score, an evidence-backed gap analysis, and tailored rewrites." },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-5 py-24 scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">How it works</span>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
          From raw CV to a real match in 4 steps
        </h2>
        <p className="mt-4 text-muted-foreground">
          No account, no setup. Paste, click, and read your fit.
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Card className="relative h-full p-6 transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl brand-gradient text-primary-foreground">
                  <s.icon className="size-5" />
                </div>
                <span className="font-mono text-sm text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="mt-4 font-display font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
              {i < STEPS.length - 1 && (
                <ArrowRight className="hidden lg:block absolute -right-3.5 top-10 size-5 text-border" />
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
