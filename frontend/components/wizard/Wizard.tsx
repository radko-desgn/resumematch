"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useWizard } from "@/lib/store";
import { StepIndicator } from "./StepIndicator";
import { Step1Cv } from "../steps/Step1Cv";
import { Step2Job } from "../steps/Step2Job";
import { Step3Processing } from "../steps/Step3Processing";
import { Step4Results } from "../steps/Step4Results";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "../theme-toggle";

const STEPS = [Step1Cv, Step2Job, Step3Processing, Step4Results];

export function Wizard() {
  const { step, next, back, cvReady, jobReady } = useWizard();
  const Current = STEPS[step - 1];

  return (
    <div className="min-h-screen">
      <header className="mx-auto max-w-2xl px-5 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="size-6 rounded-md brand-gradient" />
          <span className="font-display font-semibold tracking-tight">ResumeMatch</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-2xl px-5 pt-8 pb-24">
        <StepIndicator />

        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {step <= 3 ? <Card className="p-6 sm:p-8">{<Current />}</Card> : <Current />}
            </motion.div>
          </AnimatePresence>
        </div>

        {step === 1 && (
          <div className="mt-6 flex justify-end">
            <Button disabled={!cvReady} onClick={next}>
              Continue <ArrowRight />
            </Button>
          </div>
        )}
        {step === 2 && (
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={back}>
              <ArrowLeft /> Back
            </Button>
            <Button disabled={!jobReady} onClick={next}>
              Analyze <ArrowRight />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
