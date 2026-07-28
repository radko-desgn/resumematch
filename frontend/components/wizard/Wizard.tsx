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
import { PlanChoice } from "./PlanChoice";

const STEPS = [Step1Cv, Step2Job, Step3Processing, Step4Results];

export function Wizard() {
  const { step, next, back, cvReady } = useWizard();
  const Current = STEPS[step - 1];

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-black/10 bg-white text-black text-left shadow-2xl p-5 sm:p-9">
      <StepIndicator />

      <div className="mt-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Current />
          </motion.div>
        </AnimatePresence>
      </div>

      {step === 1 && (
        <div className="mt-6 flex justify-end">
          <Button disabled={!cvReady} onClick={next} className="w-full sm:w-auto">
            Continue <ArrowRight />
          </Button>
        </div>
      )}
      {step === 2 && (
        <>
          <div className="mt-6">
            <PlanChoice />
          </div>
          <div className="mt-6">
            <Button variant="outline" onClick={back} className="w-full sm:w-auto">
              <ArrowLeft /> Back
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
