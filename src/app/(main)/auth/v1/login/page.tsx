import { Bot, ShieldCheck, Sparkles, Zap } from "lucide-react";
import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";

import { LoginForm } from "../../_components/login-form";

export const metadata: Metadata = {
  title: "Kalo Systems - Secure Login",
  description: "Login to Kalo Systems AI Client Acquisition & Financial OS Dashboard",
};

export default function LoginV1() {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      {/* Left Column: Impeccable Branding & Feature Showcase */}
      <div className="relative hidden w-1/2 flex-col justify-between border-r bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-12 text-white lg:flex">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-10 bottom-0 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            <Sparkles className="size-5" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight">Kalo Systems</span>
            <span className="ml-2 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-neutral-300">
              Enterprise v2.2
            </span>
          </div>
        </div>

        {/* Center Hero Content */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <Badge
            variant="outline"
            className="border-primary/40 bg-primary/10 px-3 py-1 text-primary-foreground text-xs"
          >
            ⚡ AI Client Acquisition OS
          </Badge>
          <h1 className="font-extrabold text-4xl text-white leading-tight tracking-tight sm:text-5xl">
            Sub-45s Speed-to-Lead & Autonomous AI Fleet
          </h1>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Powering 5 Canadian branch hubs with FSA postal routing, CASL regulatory compliance shield, and LangGraph
            Multi-Agent orchestration.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
              <Zap className="size-4 shrink-0 text-amber-400" />
              <span className="font-medium text-neutral-200 text-xs">Sub-45s AI Voice Calls</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
              <ShieldCheck className="size-4 shrink-0 text-emerald-400" />
              <span className="font-medium text-neutral-200 text-xs">CASL Audit Shield</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
              <Bot className="size-4 shrink-0 text-blue-400" />
              <span className="font-medium text-neutral-200 text-xs">Paperclip AI Fleet</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
              <Sparkles className="size-4 shrink-0 text-purple-400" />
              <span className="font-medium text-neutral-200 text-xs">ciel/intentleads Engine</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between border-white/10 border-t pt-6 text-neutral-500 text-xs">
          <span>© 2026 Kalo Systems Inc.</span>
          <span>5 Canadian Locations Active</span>
        </div>
      </div>

      {/* Right Column: Impeccable Login Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8 rounded-2xl border bg-card p-8 shadow-xl">
          <div className="space-y-2 text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="size-6" />
            </div>
            <h2 className="font-bold text-2xl text-foreground tracking-tight">Welcome to Kalo Systems</h2>
            <p className="text-muted-foreground text-xs">
              Enter your corporate email and password to access the AI OS.
            </p>
          </div>

          <LoginForm />

          <div className="border-t pt-4 text-center text-muted-foreground text-xs">
            Need workspace access? Contact <span className="font-semibold text-primary">admin@kalosystems.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
