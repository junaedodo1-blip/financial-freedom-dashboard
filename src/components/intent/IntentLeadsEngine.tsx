"use client";

import React, { useState } from "react";

import {
  Bot,
  Building,
  Check,
  CheckCircle2,
  CornerDownLeft,
  Filter,
  Lightbulb,
  MapPin,
  PhoneCall,
  RefreshCw,
  Search,
  ShieldCheck,
  Sliders,
  SlidersHorizontal,
  Sparkles,
  Tag,
  TrendingUp,
  Wand2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export interface IntentLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  channel: string;
  city: string;
  fsa: string;
  intent_score: number;
  monthly_freedom_gap: number;
  status: string;
  notes: string;
  created_at: string;
}

export function IntentLeadsEngine() {
  const [minIntentScore, setMinIntentScore] = useState(80);
  const [minFreedomGap, setMinFreedomGap] = useState(1500);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["facebook", "reddit", "google_maps", "linkedin"]);
  const [selectedCities, setSelectedCities] = useState<string[]>([
    "Toronto",
    "Vancouver",
    "Calgary",
    "Montreal",
    "Ottawa",
  ]);
  const [keywords, setKeywords] = useState<string>("tax shelter, passive income, holdco, masterclass");
  const [caslVerifiedOnly, setCaslVerifiedOnly] = useState(true);

  // AI Agent Box State
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);

  const [searchResults, setSearchResults] = useState<IntentLead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [callingLeadId, setCallingLeadId] = useState<string | null>(null);

  const handleChannelToggle = (channel: string) => {
    setSelectedChannels((prev) => (prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]));
  };

  const handleCityToggle = (city: string) => {
    setSelectedCities((prev) => (prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]));
  };

  const handleSearchIntentLeads = async () => {
    setIsLoading(true);
    setHasSearched(true);

    try {
      const kwList = keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

      const res = await fetch("/api/intent-leads/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          min_intent_score: minIntentScore,
          target_channels: selectedChannels,
          min_freedom_gap: minFreedomGap,
          target_cities: selectedCities,
          keywords: kwList,
          casl_verified_only: caslVerifiedOnly,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.leads || []);
        toast.success(`Found ${data.matches_count || 0} matching high-intent leads!`, {
          description: `Filtered by intent score >= ${minIntentScore}%, freedom gap >= $${minFreedomGap}/mo`,
        });
      } else {
        toast.error("Failed to query intent leads engine");
      }
    } catch (err) {
      toast.error("Error executing intent leads search");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAiAutoConfigure = async (presetPrompt?: string) => {
    const promptToUse = presetPrompt || aiPrompt;
    if (!promptToUse.trim() || isAiThinking) return;

    setIsAiThinking(true);
    setAiRecommendation(null);

    const lower = promptToUse.toLowerCase();

    // AI Intent Consultant Rule Engine & NLP Parser
    let recScore = 80;
    let recGap = 1500;
    let recChannels = ["facebook", "reddit", "google_maps", "linkedin"];
    let recCities = ["Toronto", "Vancouver", "Calgary", "Montreal", "Ottawa"];
    let recKw = "tax shelter, passive income, holdco, masterclass";
    let rationale = "";

    if (lower.includes("tech") || lower.includes("toronto") || lower.includes("gta")) {
      recScore = 85;
      recGap = 2500;
      recChannels = ["linkedin", "facebook", "reddit"];
      recCities = ["Toronto"];
      recKw = "corporate tax, holdco, dividend strategy, secondary income";
      rationale = "Configured for GTA High-Earner Tech Professionals seeking corporate tax sheltering & HoldCo setup.";
    } else if (lower.includes("calgary") || lower.includes("energy") || lower.includes("business owner")) {
      recScore = 90;
      recGap = 3500;
      recChannels = ["google_maps", "linkedin"];
      recCities = ["Calgary"];
      recKw = "small business tax, holdco, capital gains, passive cashflow";
      rationale = "Configured for Alberta Business Owners & Dental/Medical practices seeking HoldCo tax reduction.";
    } else if (lower.includes("vancouver") || lower.includes("bc") || lower.includes("real estate")) {
      recScore = 80;
      recGap = 3000;
      recChannels = ["reddit", "facebook"];
      recCities = ["Vancouver"];
      recKw = "capital gains, real estate tax, dividend yield, passive cashflow";
      rationale = "Configured for BC Real Estate & r/PersonalFinanceCanada investors seeking passive cashflow.";
    } else if (lower.includes("montreal") || lower.includes("quebec") || lower.includes("french")) {
      recScore = 85;
      recGap = 2000;
      recChannels = ["google_maps", "facebook"];
      recCities = ["Montreal"];
      recKw = "liberté financière, revenu passif, atelier, fiscalité";
      rationale = "Configured for Greater Montreal Area professionals seeking French language wealth masterclasses.";
    } else {
      recScore = 82;
      recGap = 2000;
      recChannels = ["facebook", "reddit", "google_maps", "linkedin"];
      recCities = ["Toronto", "Vancouver", "Calgary", "Montreal", "Ottawa"];
      recKw = "tax shelter, passive income, holdco, financial freedom";
      rationale = `Custom intent profile configured for: "${promptToUse}" across 5 Canadian branch territories.`;
    }

    // Apply AI recommendations to state
    setMinIntentScore(recScore);
    setMinFreedomGap(recGap);
    setSelectedChannels(recChannels);
    setSelectedCities(recCities);
    setKeywords(recKw);
    setAiRecommendation(rationale);

    // Call FastAPI backend to log & confirm
    try {
      await fetch("/api/langgraph-run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospect_name: "Intent AI Consultant",
          postal_code: "M5V 2T6",
          channel: "Intent AI Box",
          user_prompt: promptToUse,
        }),
      });
    } catch (e) {
      // Ignore fallback
    }

    setIsAiThinking(false);

    toast.success("🤖 AI Intent Agent Auto-Configured Settings!", {
      description: rationale,
    });

    // Auto-run search
    setTimeout(() => {
      handleSearchIntentLeads();
    }, 300);
  };

  const triggerSpeedCall = async (lead: IntentLead) => {
    setCallingLeadId(lead.id);
    try {
      const res = await fetch("/api/simulate-speed-to-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospect_name: lead.name,
          prospect_phone: lead.phone,
          city: lead.city,
          channel: lead.channel,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`⚡ Sub-42s Speed Call Triggered for ${lead.name}!`, {
          description: `Assigned to ${data.assigned_branch} (${data.assigned_coach}). SMS Dispatched.`,
        });
      }
    } catch (err) {
      toast.error("Speed call simulation failed");
    } finally {
      setCallingLeadId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border bg-gradient-to-r from-primary/10 via-background to-background p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary animate-pulse" />
            <h2 className="font-semibold text-lg tracking-tight">ciel/intentleads Intent Characteristics Engine</h2>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
              ciel/intentleads v2.0
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs mt-1">
            Configure custom intent characteristics or use the **AI Intent Advisor** to auto-surface high-intent
            prospects across Canada.
          </p>
        </div>
        <Button onClick={handleSearchIntentLeads} disabled={isLoading} size="sm" className="gap-2 shadow-xs">
          {isLoading ? <RefreshCw className="size-4 animate-spin" /> : <Search className="size-4" />}
          Apply & Find High-Intent Leads
        </Button>
      </div>

      {/* 2. AI Intent Consultant Agent Box */}
      <Card className="border border-primary/30 bg-gradient-to-br from-primary/5 via-background to-background shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-primary p-2 text-primary-foreground shadow-xs">
                <Bot className="size-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <span>AI Intent Consultant Agent</span>
                  <Badge
                    variant="outline"
                    className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]"
                  >
                    ACTIVE ADVISOR
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  Describe your target client profile or campaign needs in plain text. The AI will auto-select optimal
                  intent characteristics.
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAiAutoConfigure();
            }}
            className="flex gap-2"
          >
            <Input
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. 'I want high-income tech engineers in Toronto needing corporate tax shelters...'"
              className="flex-1 text-xs bg-background"
            />
            <Button type="submit" disabled={isAiThinking || !aiPrompt.trim()} size="sm" className="gap-1.5 shrink-0">
              {isAiThinking ? <RefreshCw className="size-3.5 animate-spin" /> : <Wand2 className="size-3.5" />}
              Auto-Configure Settings
            </Button>
          </form>

          {/* Quick Preset Suggestion Pills */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1 font-medium text-foreground">
              <Lightbulb className="size-3 text-amber-500" />
              Presets:
            </span>
            {[
              "GTA Tech Professionals & HoldCo Tax Shelters",
              "Calgary Business Owners & Practice Tax Minimization",
              "BC Real Estate & Dividend Yield Investors",
              "Montreal Bilingual Freedom Coaching Leads",
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setAiPrompt(preset);
                  handleAiAutoConfigure(preset);
                }}
                className="rounded-full border bg-background px-2.5 py-0.5 text-foreground hover:bg-primary/10 hover:border-primary/40 transition-all text-[11px]"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* AI Recommendation Rationale */}
          {aiRecommendation && (
            <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 text-xs text-primary flex items-start gap-2 animate-in fade-in duration-300">
              <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-primary" />
              <div>
                <span className="font-semibold">AI Recommendation Applied:</span> {aiRecommendation}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3. Left Column: Intent Characteristics Controls */}
        <Card className="lg:col-span-5 border shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-primary" />
              <span>Intent Characteristics Setup</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Customize intent thresholds, channels, and intent signals on the fly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 text-xs">
            {/* Min Intent Score Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-medium">
                <label className="text-foreground">Minimum Intent Score:</label>
                <Badge variant="secondary" className="font-bold text-xs">
                  {minIntentScore}%
                </Badge>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={minIntentScore}
                onChange={(e) => setMinIntentScore(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>50% (Broad)</span>
                <span>80% (Recommended)</span>
                <span>100% (Strict)</span>
              </div>
            </div>

            {/* Min Freedom Gap */}
            <div className="space-y-1.5">
              <label className="font-medium text-foreground block">Minimum Monthly Freedom Gap ($/mo):</label>
              <Input
                type="number"
                value={minFreedomGap}
                onChange={(e) => setMinFreedomGap(Number(e.target.value))}
                className="h-8 text-xs"
                placeholder="1500"
              />
            </div>

            {/* Target Channels */}
            <div className="space-y-2">
              <label className="font-medium text-foreground block">Target Omnichannel Sources:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "facebook", label: "Facebook Ads" },
                  { id: "reddit", label: "Reddit r/PersonalFinance" },
                  { id: "google_maps", label: "Google Maps B2B" },
                  { id: "linkedin", label: "LinkedIn GTA" },
                ].map((ch) => {
                  const isChecked = selectedChannels.includes(ch.id);
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => handleChannelToggle(ch.id)}
                      className={`flex items-center gap-2 rounded-lg border p-2 text-left transition-all ${
                        isChecked
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-input bg-background text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <div
                        className={`size-3.5 rounded-sm border flex items-center justify-center ${isChecked ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground"}`}
                      >
                        {isChecked && <Check className="size-3" />}
                      </div>
                      <span className="text-[11px] truncate">{ch.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Cities */}
            <div className="space-y-2">
              <label className="font-medium text-foreground block">Target Canadian Territories:</label>
              <div className="flex flex-wrap gap-1.5">
                {["Toronto", "Vancouver", "Calgary", "Montreal", "Ottawa"].map((city) => {
                  const isSelected = selectedCities.includes(city);
                  return (
                    <Badge
                      key={city}
                      variant={isSelected ? "default" : "outline"}
                      className="cursor-pointer text-[11px] px-2 py-0.5"
                      onClick={() => handleCityToggle(city)}
                    >
                      {city}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Intent Keywords */}
            <div className="space-y-1.5">
              <label className="font-medium text-foreground flex items-center gap-1.5">
                <Tag className="size-3.5 text-primary" />
                <span>Intent Signal Keywords (comma-separated):</span>
              </label>
              <Input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="h-8 text-xs"
                placeholder="tax shelter, passive income, holdco"
              />
            </div>

            {/* CASL Compliance Shield Toggle */}
            <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/20">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-500" />
                <div>
                  <span className="font-medium text-xs block text-foreground">CASL Shield Audit</span>
                  <span className="text-[10px] text-muted-foreground">180-day implied consent verified</span>
                </div>
              </div>
              <Checkbox
                checked={caslVerifiedOnly}
                onCheckedChange={(checked) => setCaslVerifiedOnly(Boolean(checked))}
              />
            </div>

            <Button onClick={handleSearchIntentLeads} disabled={isLoading} className="w-full gap-2">
              {isLoading ? <RefreshCw className="size-4 animate-spin" /> : <Filter className="size-4" />}
              Execute Intent Characteristics Query
            </Button>
          </CardContent>
        </Card>

        {/* 4. Right Column: High-Intent Results & Speed-to-Lead Trigger */}
        <Card className="lg:col-span-7 border shadow-xs flex flex-col">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <TrendingUp className="size-4 text-primary" />
                  <span>Matching High-Intent Prospects</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  {hasSearched
                    ? `Found ${searchResults.length} matching prospects`
                    : "Run query above to surface leads"}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs font-bold px-2 py-0.5">
                {searchResults.length} Prospects
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-1 overflow-y-auto min-h-[350px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-48 gap-2 text-muted-foreground text-xs">
                <RefreshCw className="size-6 animate-spin text-primary" />
                <span>Scanning omnichannel sources with ciel/intentleads rules...</span>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 gap-3 text-center p-6 border rounded-xl border-dashed bg-muted/10">
                <Search className="size-8 text-muted-foreground opacity-50" />
                <div>
                  <h4 className="font-medium text-xs text-foreground">No leads matched current characteristics</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Click "Apply & Find High-Intent Leads" or ask the AI Intent Consultant above to auto-configure
                    settings.
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={handleSearchIntentLeads} className="text-xs gap-1.5">
                  <Zap className="size-3 text-amber-500 fill-amber-500" />
                  Run Fresh Scrape
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {searchResults.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border p-3.5 hover:border-primary/40 transition-all bg-card"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-foreground">{lead.name}</span>
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                          {lead.intent_score}% Intent
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {lead.channel}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3 text-primary" />
                          {lead.city} ({lead.fsa})
                        </span>
                        <span>
                          Freedom Gap: <strong className="text-foreground">${lead.monthly_freedom_gap}/mo</strong>
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-1 italic">{lead.notes}</p>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => triggerSpeedCall(lead)}
                      disabled={callingLeadId === lead.id}
                      className="gap-1.5 h-8 text-xs shrink-0"
                    >
                      {callingLeadId === lead.id ? (
                        <RefreshCw className="size-3.5 animate-spin" />
                      ) : (
                        <Zap className="size-3.5 fill-amber-400 text-amber-400" />
                      )}
                      Speed Call AI
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
