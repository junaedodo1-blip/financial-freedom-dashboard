"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  MapPin,
  PhoneCall,
  Play,
  RefreshCw,
  ShieldCheck,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PitchDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  city?: string;
}

export function PitchDemoModal({ isOpen, onClose, city = "Toronto" }: PitchDemoModalProps) {
  const [step, setStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isRunning && step < 4) {
      timer = setTimeout(() => {
        setStep((prev) => prev + 1);
      }, 1000);
    } else if (step === 4 && isRunning) {
      setIsRunning(false);
      toast.success("⚡ Live Pitch Demo Complete!", {
        description: "Confirmed Sub-45s strategy call booking for Jordan Miller.",
      });
    }
    return () => clearTimeout(timer);
  }, [isRunning, step]);

  const handleStartDemo = () => {
    setStep(0);
    setIsRunning(true);
  };

  if (!isOpen) return null;

  const steps = [
    { label: "0s: Inbound Lead Scraped", desc: "Jordan Miller (M5V 2T6 - $185k Income) captured" },
    { label: "2s: CASL Shield Verified", desc: "180-Day Implied Consent active (166 days remaining)" },
    { label: "5s: Territory Routed to Coach", desc: `Routed to ${city} Bay St HQ Branch` },
    { label: "12s: 2-Way SMS Sent", desc: "Automated calendar invitation sent to lead" },
    { label: "42s: Strategy Call Booked", desc: "Confirmed Thursday 2:00 PM appointment" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl border border-amber-500/30 bg-slate-900 p-6 shadow-2xl space-y-6 text-slate-100">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-xl bg-slate-800 p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div>
          <Badge className="bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40">
            ⚡ LIVE PITCH GOD MODE
          </Badge>
          <h2 className="mt-2 text-2xl font-extrabold text-white">
            Sub-45s Speed-to-Lead Simulator
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Simulating real-time 5-node LangGraph Multi-Agent pipeline execution.
          </p>
        </div>

        {/* Timeline Steps */}
        <div className="space-y-2.5">
          {steps.map((s, i) => {
            const active = i <= step;
            return (
              <div
                key={i}
                className={`flex items-center justify-between rounded-xl border p-3 transition-all ${
                  active
                    ? "border-amber-500/40 bg-amber-500/10 text-white"
                    : "border-slate-800/60 bg-slate-950/40 text-slate-500"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      active ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {active ? "✓" : i + 1}
                  </div>
                  <div>
                    <div className="text-xs font-bold">{s.label}</div>
                    <div className="text-[10px] text-slate-400">{s.desc}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <Button
            onClick={handleStartDemo}
            disabled={isRunning}
            className="bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
          >
            {isRunning ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin text-slate-950" />
            ) : (
              <Play className="mr-2 h-4 w-4 fill-slate-950" />
            )}
            {isRunning ? "Simulating (42s)..." : "Start Pitch Demo"}
          </Button>

          <Button variant="outline" onClick={onClose} className="border-slate-800 bg-slate-950 text-slate-300">
            Close Demo
          </Button>
        </div>
      </div>
    </div>
  );
}
