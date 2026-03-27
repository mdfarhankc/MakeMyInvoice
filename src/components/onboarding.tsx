"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileText, Printer, Users, Settings, Keyboard, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ONBOARDING_KEY = "invoicer_onboarded";

const steps = [
  {
    icon: FileText,
    title: "Create Invoices",
    desc: "Fill in your details, add line items, and generate professional invoices in seconds.",
  },
  {
    icon: Printer,
    title: "Download as PDF",
    desc: "Export pixel-perfect PDFs ready to send to your clients.",
  },
  {
    icon: Users,
    title: "Client Directory",
    desc: "Save client info for quick auto-fill when creating new invoices.",
  },
  {
    icon: Settings,
    title: "Customize Everything",
    desc: "Set your currency, invoice numbering format, and preferred theme.",
  },
  {
    icon: Keyboard,
    title: "Keyboard Shortcuts",
    desc: "Press N for new invoice, / to search, D for dashboard, T for theme, and ? for help.",
  },
];

export function Onboarding() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const done = localStorage.getItem(ONBOARDING_KEY);
    if (!done) setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setVisible(false);
  }

  function next() {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      dismiss();
    }
  }

  if (!visible) return null;

  const current = steps[step];

  return (
    <>
      <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm" />
      <div className="fixed inset-0 z-[71] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative w-full max-w-sm rounded-2xl border bg-popover p-6 shadow-2xl"
        >
          {/* Close */}
          <button onClick={dismiss} className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <current.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-1.5 text-lg font-semibold">{current.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{current.desc}</p>
            </motion.div>
          </AnimatePresence>

          {/* Progress + navigation */}
          <div className="mt-6 flex items-center justify-between">
            {/* Dots */}
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${i === step ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/20"}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {step < steps.length - 1 && (
                <button onClick={dismiss} className="text-xs text-muted-foreground hover:text-foreground">
                  Skip
                </button>
              )}
              <Button size="sm" className="gap-1.5" onClick={next}>
                {step === steps.length - 1 ? "Get Started" : "Next"}
                {step < steps.length - 1 && <ArrowRight className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
