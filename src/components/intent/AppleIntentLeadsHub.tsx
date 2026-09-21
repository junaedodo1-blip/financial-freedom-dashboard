"use client";

import type React from "react";
import { useState } from "react";

import Link from "next/link";

import { ArrowLeft, Bot, MapPin, RefreshCw, Search, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface IntentLeadItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  channel: string;
  city: string;
  fsa: string;
  intent_score: number;
  monthly_freedom_gap: number;
  casl_verified: boolean;
  notes: string;
  tags: string[];
}

const INITIAL_INTENT_LEADS: IntentLeadItem[] = [
  {
    id: "intent-1",
    name: "Marcus Vance",
    phone: "+1 (416) 555-0192",
    email: "marcus.vance@baystinvest.ca",
    channel: "Reddit r/PersonalFinanceCanada",
    city: "Toronto",
    fsa: "M5V 2T6",
    intent_score: 94,
    monthly_freedom_gap: 4200,
    casl_verified: true,
    notes: "Scraped intent: Inquired about Section 85 HoldCo tax roll-overs and high-earner tax deduction strategies.",
    tags: ["High Tax Bracket", "HoldCo Candidate", "Toronto Bay St"],
  },
  {
    id: "intent-2",
    name: "Elena Rostova",
    phone: "+1 (604) 555-0144",
    email: "elena.r@vancouversecurities.com",
    channel: "Facebook Lead Ads",
    city: "Vancouver",
    fsa: "V6B 2Z6",
    intent_score: 88,
    monthly_freedom_gap: 6500,
    casl_verified: true,
    notes: "Scraped intent: Implied consent active (142 days remaining). Interested in Vancouver Burrard Masterclass.",
    tags: ["CASL Verified", "Vancouver Hub", "Corporate Rollover"],
  },
  {
    id: "intent-3",
    name: "David Chen",
    phone: "+1 (403) 555-0188",
    email: "david.chen@calgaryenergy.ca",
    channel: "Google Maps B2B",
    city: "Calgary",
    fsa: "T2P 1E5",
    intent_score: 91,
    monthly_freedom_gap: 8200,
    casl_verified: true,
    notes: "Scraped intent: Sub-45s Speed-to-Lead AI call connected. Booked strategy call with Calgary coach.",
    tags: ["Energy Exec", "Calgary Downtown", "Speed Call Connected"],
  },
  {
    id: "intent-4",
    name: "Sarah Jenkins",
    phone: "+1 (514) 555-0122",
    email: "s.jenkins@montreallaw.ca",
    channel: "LinkedIn GTA",
    city: "Montreal",
    fsa: "H3B 4W5",
    intent_score: 85,
    monthly_freedom_gap: 3800,
    casl_verified: true,
    notes: "Scraped intent: Reserved seat #42 at Montreal Centre-Ville Executive Tax Masterclass.",
    tags: ["Legal Partner", "Montreal Hub", "Workshop Reserved"],
  },
];

export function AppleIntentLeadsHub() {
  const [minIntentScore, setMinIntentScore] = useState(80);
  const [minFreedomGap, setMinFreedomGap] = useState(2000);
  const [auditQuery, setAuditQuery] = useState("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [callingId, setCallingId] = useState<string | null>(null);

  const handleRunAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditQuery.trim() || isAuditing) return;

    setIsAuditing(true);
    toast.info(`⚡ Running IntentLeads 360 AI Audit for "${auditQuery}"...`, {
      description: "Scraping intent signals across FB Ads, Reddit, Google B2B & LinkedIn.",
    });

    setTimeout(() => {
      setIsAuditing(false);
      toast.success(`🎯 IntentLeads Audit Complete for ${auditQuery}!`, {
        description: "Surfaced 4 high-intent prospect profiles verified under CASL 2026 Shield.",
      });
    }, 1200);
  };

  const handleSpeedCall = (id: string, name: string) => {
    setCallingId(id);
    toast.info(`⚡ Speed-to-Lead AI Dispatcher calling ${name}...`);

    setTimeout(() => {
      setCallingId(null);
      toast.success(`📞 Speed Call Connected with ${name}!`);
    }, 1500);
  };

  const filteredLeads = INITIAL_INTENT_LEADS.filter(
    (l) => l.intent_score >= minIntentScore && l.monthly_freedom_gap >= minFreedomGap,
  );

  return (
    <div className="relative space-y-6 rounded-3xl border border-white/10 bg-zinc-950/70 p-6 text-foreground shadow-2xl backdrop-blur-3xl md:p-8">
      {/* Apple Header & Navigation */}
      <div className="flex flex-col gap-4 border-white/10 border-b pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/crm">
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 rounded-2xl border-white/10 bg-zinc-900/80 px-3 text-xs text-zinc-300 hover:bg-zinc-800"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to CRM</span>
              </Button>
            </Link>

            <h1 className="flex items-center gap-2 font-bold text-2xl text-white tracking-tight md:text-3xl">
              <Sparkles className="h-6 w-6 text-purple-400" />
              IntentLeads AI Engine
            </h1>
          </div>
          <p className="mt-1 text-xs text-zinc-400 md:text-sm">
            Apple-style intent intelligence studio. Target high-intent prospects based on intent signals, CASL
            compliance, and tax sheltering needs.
          </p>
        </div>

        <Badge className="flex items-center gap-1.5 self-start border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-purple-300 text-xs md:self-auto">
          <Bot className="h-3.5 w-3.5 text-purple-400" />
          <span>ciel/intentleads v2.4 Active</span>
        </Badge>
      </div>

      {/* 360 Company Intent Audit Search Bar */}
      <form onSubmit={handleRunAudit} className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Run 360 Intent Audit for any target company (e.g., RBC Capital, Bay St Law, Vancouver Tech)..."
            value={auditQuery}
            onChange={(e) => setAuditQuery(e.target.value)}
            disabled={isAuditing}
            className="h-12 rounded-2xl border-white/10 bg-zinc-900/90 pl-11 text-xs text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-500/50 md:text-sm"
          />
        </div>

        <Button
          type="submit"
          disabled={isAuditing || !auditQuery.trim()}
          className="h-12 shrink-0 gap-2 rounded-2xl bg-purple-600 px-6 font-bold text-white shadow-xl transition-all hover:scale-[1.02] hover:bg-purple-500"
        >
          {isAuditing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          <span>Audit Intent</span>
        </Button>
      </form>

      {/* Interactive Control Sliders */}
      <div className="grid grid-cols-1 gap-4 rounded-3xl border border-white/10 bg-zinc-900/40 p-5 backdrop-blur-xl md:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between font-semibold text-xs text-zinc-300">
            <span>Minimum Intent Score Target</span>
            <span className="font-bold font-mono text-purple-300">{minIntentScore}% Intent</span>
          </div>
          <input
            type="range"
            min="60"
            max="95"
            value={minIntentScore}
            onChange={(e) => setMinIntentScore(Number(e.target.value))}
            className="h-2 w-full cursor-pointer rounded-lg bg-zinc-800 accent-purple-500"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between font-semibold text-xs text-zinc-300">
            <span>Minimum Monthly Freedom Gap</span>
            <span className="font-bold font-mono text-amber-400">${minFreedomGap.toLocaleString()}/mo</span>
          </div>
          <input
            type="range"
            min="1000"
            max="10000"
            step="500"
            value={minFreedomGap}
            onChange={(e) => setMinFreedomGap(Number(e.target.value))}
            className="h-2 w-full cursor-pointer rounded-lg bg-zinc-800 accent-amber-500"
          />
        </div>
      </div>

      {/* Live Intent Radar Cards Grid */}
      <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
        {filteredLeads.map((lead) => (
          <div
            key={lead.id}
            className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-zinc-900/50 p-6 shadow-xl backdrop-blur-2xl transition-all hover:border-purple-500/30"
          >
            <div>
              {/* Header Info */}
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-lg text-white transition-colors group-hover:text-purple-300">
                    {lead.name}
                  </h3>
                  <p className="text-xs text-zinc-400">{lead.email}</p>
                </div>

                <Badge className="border-purple-500/20 bg-purple-500/10 px-2.5 py-1 font-bold text-purple-300 text-xs">
                  {lead.intent_score}% Intent Score
                </Badge>
              </div>

              {/* Location & Freedom Gap */}
              <div className="mb-4 flex flex-wrap items-center gap-3 text-xs">
                <span className="flex items-center gap-1 font-medium text-blue-400">
                  <MapPin className="h-3.5 w-3.5" />
                  {lead.city} ({lead.fsa})
                </span>

                <span className="font-semibold text-amber-400">
                  ${lead.monthly_freedom_gap.toLocaleString()}/mo Freedom Gap
                </span>

                <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  CASL Verified
                </span>
              </div>

              {/* Notes */}
              <p className="mb-4 rounded-2xl border border-white/5 bg-zinc-950/60 p-3 text-xs text-zinc-300 leading-relaxed">
                {lead.notes}
              </p>

              {/* Tags */}
              <div className="mb-5 flex flex-wrap items-center gap-1.5">
                {lead.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-full border border-white/5 bg-zinc-800 px-2.5 py-0.5 font-medium text-[10px] text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between border-white/5 border-t pt-4">
              <span className="text-[11px] text-zinc-500">{lead.channel}</span>

              <Button
                onClick={() => handleSpeedCall(lead.id, lead.name)}
                disabled={callingId === lead.id}
                className="h-9 gap-1.5 rounded-xl bg-purple-600 px-4 font-bold text-white text-xs shadow-md hover:bg-purple-500"
              >
                {callingId === lead.id ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Zap className="h-3.5 w-3.5 text-amber-300" />
                )}
                <span>1-Click Speed Call</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
