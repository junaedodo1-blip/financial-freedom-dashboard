"use client";

import { useState } from "react";

import {
  Award,
  CheckCircle2,
  Flame,
  Layers,
  Lightbulb,
  Plus,
  Rocket,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Wand2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface IntentProspect {
  id: string;
  name: string;
  title: string;
  company: string;
  city: string;
  fsa: string;
  branch: string;
  intent_topic: string;
  channel: string;
  intent_score: number;
  casl_days_remaining: number;
  est_tax_savings: string;
  tech_stack: string[];
}

export function EmailOutreachAgentHub() {
  // Mode Selection: Standard Campaign vs Hyper-Personalized Prospect Mode
  const [copyMode, setCopyMode] = useState<"standard" | "hyper_personalized">("standard");

  // Standard Campaign Copy State
  const [selectedFramework, setSelectedFramework] = useState<"PAS" | "AIDA" | "BAB">("PAS");
  const [subjectLine, setSubjectLine] = useState("2026 HoldCo Tax Sheltering & Capital Gains Review");
  const [emailBody, setEmailBody] = useState(
    "Hi [First_Name],\n\nNoticed [Company_Name] is scaling fast in [City]. Many Canadian executives in your bracket miss out on $150k+ annually in tax sheltering via HoldCo Section 85 rollovers.\n\nWe prepared a custom 3-minute tax shelter calculation for [Company_Name]. Would you be open to reviewing the numbers over a 7-minute strategy call?\n\nBest,\nMarcus Vance | Kalo Advisory Team",
  );
  const [subjectScore, setSubjectScore] = useState(94);
  const [selectedAudience, setSelectedAudience] = useState("Scraped Intent Leads (GTA & Vancouver)");
  const [isLaunching, setIsLaunching] = useState(false);
  const [isSendingPersonalized, setIsSendingPersonalized] = useState(false);

  // IntentLeads Audit Prospects
  const [prospects] = useState<IntentProspect[]>([
    {
      id: "prospect_101",
      name: "Marcus Vance",
      title: "VP Finance & Operations",
      company: "TechNorth Canada",
      city: "Toronto",
      fsa: "M5V 2T6",
      branch: "Toronto Bay St HQ",
      intent_topic: "Corporate Tax Shelters & Section 85 Rollovers",
      channel: "Reddit r/PersonalFinanceCanada",
      intent_score: 96,
      casl_days_remaining: 142,
      est_tax_savings: "$184,000 / year",
      tech_stack: ["Shopify Plus", "Salesforce", "Google Workspace"],
    },
    {
      id: "prospect_102",
      name: "Elena Rostova",
      title: "Founder & CEO",
      company: "Pacific Retail Group",
      city: "Vancouver",
      fsa: "V6B 2Z6",
      branch: "Vancouver Burrard Hub",
      intent_topic: "Secondary Passive Income & Capital Gains",
      channel: "Google Maps B2B Scraping",
      intent_score: 91,
      casl_days_remaining: 118,
      est_tax_savings: "$145,000 / year",
      tech_stack: ["Klaviyo", "Shopify", "NetSuite"],
    },
    {
      id: "prospect_103",
      name: "Dr. Robert Sterling",
      title: "Medical Clinic Director",
      company: "Sterling Health Corp",
      city: "Calgary",
      fsa: "T2P 1E5",
      branch: "Calgary Downtown Hub",
      intent_topic: "HoldCo Dividend Extraction & Retained Earnings",
      channel: "LinkedIn GTA / Western Radar",
      intent_score: 98,
      casl_days_remaining: 165,
      est_tax_savings: "$210,000 / year",
      tech_stack: ["JaneApp", "QuickBooks Online", "Google Workspace"],
    },
  ]);

  const [selectedProspectId, setSelectedProspectId] = useState("prospect_101");
  const selectedProspect = prospects.find((p) => p.id === selectedProspectId) || prospects[0];

  // Sequence State
  const [sequenceSteps, _setSequenceSteps] = useState([
    {
      day: 1,
      type: "Initial Outreach",
      subject: "2026 HoldCo Tax Sheltering & Capital Gains Review",
      framework: "PAS (Problem-Agitate-Solve)",
      status: "Active",
    },
    {
      day: 3,
      type: "Value & Case Study Follow-up",
      subject: "Re: 2026 HoldCo Tax Sheltering (Case Study: $184k saved)",
      framework: "Social Proof & ROI",
      status: "Active",
    },
    {
      day: 7,
      type: "Final Advisory Call Request",
      subject: "Quick question regarding [Company_Name]'s tax year-end",
      framework: "Direct CTA",
      status: "Active",
    },
  ]);

  // AI Copy Generation for Standard Campaign
  const handleGenerateAiCopy = () => {
    toast.loading("🤖 AI Agent writing high-converting campaign copy...", { id: "ai-copy" });
    setTimeout(() => {
      if (selectedFramework === "PAS") {
        setSubjectLine("Urgent: 2026 Canadian HoldCo Tax Deadline");
        setEmailBody(
          "Hi [First_Name],\n\nProblem: Operating directly under personal name or single Corp exposes up to 53.5% in passive income taxes in Ontario & BC.\n\nAgitation: CRA rule changes for 2026 make early-year dividend extraction significantly more expensive without a HoldCo structure.\n\nSolution: Kalo AI automated Section 85 rollover shelters profits immediately. Want to see your branch calculation?",
        );
        setSubjectScore(96);
      } else if (selectedFramework === "AIDA") {
        setSubjectLine("Exclusive: Tax Shelter Strategy for [Company_Name]");
        setEmailBody(
          "Hi [First_Name],\n\nAttention: Top 5% Canadian earners are saving $140k+ this fiscal year.\n\nInterest: Our automated AI system mapped [Company_Name]'s FSA postal zone to available branch advisors.\n\nDesire: Imagine eliminating capital gains friction on private asset sales.\n\nAction: Reserve a 7-minute seat with our Bay St team today.",
        );
        setSubjectScore(92);
      } else {
        setSubjectLine("Before & After: [Company_Name] Tax Efficiency");
        setEmailBody(
          "Hi [First_Name],\n\nBefore: Paying maximum marginal rate on corporate retained earnings.\n\nAfter: Holding assets inside a tax-sheltered HoldCo structure with 0% current tax drag.\n\nBridge: We set up the entire architecture in under 5 business days.",
        );
        setSubjectScore(98);
      }
      toast.success("✨ AI Campaign Copy & CASL Shield Applied!", { id: "ai-copy" });
    }, 800);
  };

  // Generate Hyper-Personalized Prospect Email using IntentLeads Audit Data
  const handleGenerateHyperPersonalized = (prospect: IntentProspect) => {
    toast.loading(`✨ AI Crafting Hyper-Personalized Email for ${prospect.name}...`, { id: "hyper" });
    setTimeout(() => {
      setSubjectLine(`Section 85 Tax Shelter calculation for ${prospect.company} (${prospect.city})`);
      setEmailBody(
        `Hi ${prospect.name.split(" ")[0]},\n\nNoticed ${prospect.company} is growing rapidly in ${prospect.city} (${prospect.fsa}). Based on your recent activity around ${prospect.intent_topic}, operating without a tax-sheltered HoldCo structure is exposing up to ${prospect.est_tax_savings} in unnecessary CRA tax drag.\n\nOur ${prospect.branch} team prepared a confidential 3-minute tax shelter audit for ${prospect.company}. Would you be open to a quick 7-minute strategy call this week?\n\nBest regards,\nMarcus Vance | Senior Advisory Lead\nKalo Systems Canada (${prospect.branch})`,
      );
      setSubjectScore(98);
      toast.success(`🎯 Hyper-Personalized Email Generated for ${prospect.name}!`, { id: "hyper" });
    }, 700);
  };

  // Send Single Hyper-Personalized Prospect Email
  const handleSendHyperPersonalizedNow = () => {
    setIsSendingPersonalized(true);
    toast.loading(`🚀 Sending Hyper-Personalized Email to ${selectedProspect.name}...`, { id: "send-hyper" });
    setTimeout(() => {
      setIsSendingPersonalized(false);
      toast.success(`🎉 Sent Hyper-Personalized Email to ${selectedProspect.name} (${selectedProspect.company})!`, {
        description: `Dispatched under CASL Shield via marcus.bayst@kalo.ca. Implied consent verified (${selectedProspect.casl_days_remaining} days remaining).`,
        id: "send-hyper",
      });
    }, 1200);
  };

  const handleLaunchCampaign = () => {
    setIsLaunching(true);
    toast.loading("🚀 Launching AI Outreach Campaign...", { id: "launch" });
    setTimeout(() => {
      setIsLaunching(false);
      toast.success("🎯 Campaign Launched Successfully!", {
        description: `Dispatched Sequence to 892 CASL-verified prospects via connected Mailflare inboxes.`,
        id: "launch",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6 text-foreground">
      {/* Top Glass Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-purple-950/60 via-zinc-950 to-zinc-950 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge className="rounded-full border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 font-semibold text-purple-300 text-xs">
                <Zap className="mr-1 h-3.5 w-3.5 text-purple-400" />
                Autonomous Outreach Agent v4.2
              </Badge>
              <Badge className="flex items-center gap-1 rounded-full border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 font-semibold text-emerald-400 text-xs">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                CASL 2026 Compliant
              </Badge>
            </div>
            <h2 className="flex items-center gap-2 font-bold text-2xl text-white tracking-tight">
              <Sparkles className="h-6 w-6 text-purple-400" />⚡ Email Outreach Agent Studio
            </h2>
            <p className="max-w-2xl text-muted-foreground text-xs leading-relaxed md:text-sm">
              Design multi-step email marketing sequences, generate hyper-personalized prospect emails from IntentLeads
              audits, and dispatch targeted campaigns.
            </p>
          </div>

          <Button
            size="lg"
            onClick={handleLaunchCampaign}
            disabled={isLaunching}
            className="shrink-0 gap-2 rounded-xl bg-white px-5 py-3 font-bold text-black text-xs shadow-xl transition-all hover:scale-[1.02] hover:bg-zinc-200"
          >
            <Rocket className={`h-4 w-4 text-purple-600 ${isLaunching ? "animate-bounce" : ""}`} />
            <span>{isLaunching ? "Launching..." : "Launch AI Campaign"}</span>
          </Button>
        </div>
      </div>

      {/* Main Suite Tabs */}
      <Tabs defaultValue="composer" className="space-y-6">
        <TabsList className="grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-zinc-950/70 p-1 backdrop-blur-xl md:grid-cols-4">
          <TabsTrigger value="composer" className="flex items-center gap-2 rounded-lg font-semibold text-xs">
            <Wand2 className="h-3.5 w-3.5 text-purple-400" />
            <span>AI Copy & Frameworks</span>
          </TabsTrigger>
          <TabsTrigger value="sequence" className="flex items-center gap-2 rounded-lg font-semibold text-xs">
            <Layers className="h-3.5 w-3.5 text-blue-400" />
            <span>Sequence Builder</span>
          </TabsTrigger>
          <TabsTrigger value="deliverability" className="flex items-center gap-2 rounded-lg font-semibold text-xs">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Deliverability & Warmup</span>
          </TabsTrigger>
          <TabsTrigger value="launch" className="flex items-center gap-2 rounded-lg font-semibold text-xs">
            <Target className="h-3.5 w-3.5 text-amber-400" />
            <span>Audience & Launch</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: AI Copy & Frameworks (Includes Hyper-Personalized Prospect Mode) */}
        <TabsContent value="composer" className="space-y-4">
          {/* Mode Switcher Banner */}
          <div className="flex flex-col justify-between gap-3 rounded-xl border border-white/10 bg-zinc-950/70 p-3.5 backdrop-blur-xl sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="font-semibold text-xs text-zinc-200">Outreach Copy Generator Mode:</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={copyMode === "standard" ? "default" : "outline"}
                onClick={() => setCopyMode("standard")}
                className={`h-8 px-3 font-semibold text-xs ${
                  copyMode === "standard"
                    ? "bg-primary text-primary-foreground"
                    : "border-white/10 text-muted-foreground"
                }`}
              >
                Standard Campaign Mode (PAS/AIDA/BAB)
              </Button>
              <Button
                size="sm"
                variant={copyMode === "hyper_personalized" ? "default" : "outline"}
                onClick={() => {
                  setCopyMode("hyper_personalized");
                  handleGenerateHyperPersonalized(selectedProspect);
                }}
                className={`h-8 gap-1.5 px-3 font-semibold text-xs ${
                  copyMode === "hyper_personalized"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                    : "border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                }`}
              >
                <Target className="h-3.5 w-3.5 text-purple-400" />🎯 Hyper-Personalized IntentLeads Prospect Mode
              </Button>
            </div>
          </div>

          {/* Hyper-Personalized Prospect Inspector Card */}
          {copyMode === "hyper_personalized" && (
            <Card className="border border-purple-500/30 bg-gradient-to-br from-purple-950/20 via-zinc-950 to-zinc-950 shadow-2xl backdrop-blur-xl">
              <CardHeader className="pb-3">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2 font-bold text-base text-purple-300">
                      <Target className="h-4 w-4 text-purple-400" />
                      Select IntentLeads Prospect to Hyper-Personalize
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Uses scraped intent signals, company tech stack, and FSA postal routing to generate 1-on-1
                      personal copy.
                    </CardDescription>
                  </div>
                  <Badge className="self-start border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs sm:self-auto">
                    Intent Audit Verified
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Prospect Dropdown */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground text-xs">
                    Select Target Prospect from Audit
                  </label>
                  <select
                    value={selectedProspectId}
                    onChange={(e) => {
                      setSelectedProspectId(e.target.value);
                      const p = prospects.find((item) => item.id === e.target.value);
                      if (p) handleGenerateHyperPersonalized(p);
                    }}
                    className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-zinc-100 focus:ring-2 focus:ring-purple-500"
                  >
                    {prospects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.title} at {p.company} - {p.city} {p.fsa}) | Intent: {p.intent_topic} (Score:{" "}
                        {p.intent_score})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Prospect Intent Signals Card */}
                <div className="space-y-3 rounded-xl border border-white/10 bg-zinc-900/60 p-4 text-xs">
                  <div className="flex items-center justify-between border-white/10 border-b pb-2">
                    <span className="font-bold text-sm text-white">
                      {selectedProspect.name} • {selectedProspect.title} ({selectedProspect.company})
                    </span>
                    <span className="font-semibold text-emerald-400">
                      {selectedProspect.est_tax_savings} Est. Savings
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-muted-foreground md:grid-cols-3">
                    <div>
                      Channel: <span className="font-medium text-zinc-200">{selectedProspect.channel}</span>
                    </div>
                    <div>
                      City & FSA:{" "}
                      <span className="font-medium text-zinc-200">
                        {selectedProspect.city} ({selectedProspect.fsa})
                      </span>
                    </div>
                    <div>
                      CASL Consent:{" "}
                      <span className="font-semibold text-emerald-400">
                        {selectedProspect.casl_days_remaining} Days Valid
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-white/10 border-t pt-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-muted-foreground">Tech Stack:</span>
                      {selectedProspect.tech_stack.map((t, idx) => (
                        <span
                          key={idx}
                          className="rounded-full border border-white/10 bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleGenerateHyperPersonalized(selectedProspect)}
                      className="h-7 gap-1 bg-purple-600 text-white text-xs hover:bg-purple-500"
                    >
                      <Wand2 className="h-3 w-3" />
                      Regenerate Copy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Copywriting Studio Editor */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Editor */}
            <Card className="border border-white/10 bg-zinc-950/60 shadow-xl backdrop-blur-xl lg:col-span-8">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 font-bold text-base text-white">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    {copyMode === "hyper_personalized"
                      ? `Hyper-Personalized Copy for ${selectedProspect.name}`
                      : "AI Copywriting Studio"}
                  </CardTitle>
                  {copyMode === "standard" && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-muted-foreground">Framework:</span>
                      {(["PAS", "AIDA", "BAB"] as const).map((fw) => (
                        <Button
                          key={fw}
                          size="sm"
                          variant={selectedFramework === fw ? "default" : "outline"}
                          onClick={() => setSelectedFramework(fw)}
                          className={`h-7 rounded-lg px-2.5 text-xs ${
                            selectedFramework === fw
                              ? "border-purple-500 bg-purple-600 text-white"
                              : "border-white/10 text-muted-foreground hover:text-white"
                          }`}
                        >
                          {fw}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
                <CardDescription className="text-xs">
                  {copyMode === "hyper_personalized"
                    ? `Personalized specifically using ${selectedProspect.company}'s scraped intent data & postal routing.`
                    : "Generate conversion-tested outreach using PAS, AIDA, or BAB frameworks."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-muted-foreground text-xs">Subject Line</label>
                    <Badge className="border-emerald-500/20 bg-emerald-500/10 text-[10px] text-emerald-400">
                      Subject Score: {subjectScore}/100 🔥 High Open Rate
                    </Badge>
                  </div>
                  <Input
                    value={subjectLine}
                    onChange={(e) => setSubjectLine(e.target.value)}
                    className="bg-background font-medium text-xs text-zinc-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground text-xs">Email Body Copy</label>
                  <textarea
                    rows={8}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background p-3 font-sans text-xs text-zinc-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>

                <div className="flex flex-col justify-between gap-3 pt-2 sm:flex-row sm:items-center">
                  {copyMode === "hyper_personalized" ? (
                    <Button
                      size="sm"
                      onClick={handleSendHyperPersonalizedNow}
                      disabled={isSendingPersonalized}
                      className="gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-emerald-600 px-4 py-2 font-bold text-white text-xs shadow-lg hover:opacity-95"
                    >
                      <Send className={`h-3.5 w-3.5 ${isSendingPersonalized ? "animate-spin" : ""}`} />
                      <span>
                        {isSendingPersonalized
                          ? "Sending Email..."
                          : `🚀 Send Personal Email to ${selectedProspect.name} Now`}
                      </span>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateAiCopy}
                      className="gap-1.5 border-white/10 text-xs"
                    >
                      <Wand2 className="h-3.5 w-3.5 text-purple-400" />
                      Regenerate with {selectedFramework}
                    </Button>
                  )}

                  <Button
                    size="sm"
                    onClick={() => toast.success("Copy saved to campaign sequence!")}
                    className="gap-1.5 bg-purple-600 text-white text-xs hover:bg-purple-500"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Save Step to Sequence
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Right Quality & Compliance Sidebar */}
            <div className="space-y-4 lg:col-span-4">
              <Card className="border border-white/10 bg-zinc-950/60 shadow-xl backdrop-blur-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-1.5 font-semibold text-xs text-zinc-200">
                    <Award className="h-4 w-4 text-emerald-400" />
                    Deliverability & Spam Audit
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between rounded-lg bg-muted/40 p-2">
                    <span className="text-muted-foreground">Spam Trigger Words</span>
                    <span className="font-semibold text-emerald-400">0 Detected (Safe)</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted/40 p-2">
                    <span className="text-muted-foreground">CASL Unsubscribe Footer</span>
                    <span className="font-semibold text-emerald-400">Auto-Attached</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted/40 p-2">
                    <span className="text-muted-foreground">Estimated Open Rate</span>
                    <span className="font-semibold text-purple-400">48.5% - 56.2%</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted/40 p-2">
                    <span className="text-muted-foreground">Reply Propensity</span>
                    <span className="font-semibold text-blue-400">High (14.8%)</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-purple-500/20 bg-gradient-to-br from-purple-950/30 via-zinc-950 to-zinc-950 shadow-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-1.5 font-semibold text-purple-300 text-xs">
                    <Lightbulb className="h-4 w-4 text-purple-400" />
                    Hyper-Personalization Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-xs leading-relaxed">
                  Mentioning the prospect&apos;s specific FSA postal code ({selectedProspect.fsa}) and exact CRA tax
                  savings bracket ({selectedProspect.est_tax_savings}) boosts 1-on-1 strategy call booking rates by
                  3.8x.
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Sequence Builder */}
        <TabsContent value="sequence" className="space-y-4">
          <Card className="border border-white/10 bg-zinc-950/60 shadow-xl backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="flex items-center gap-2 font-bold text-base text-white">
                  <Layers className="h-4 w-4 text-blue-400" />
                  Multi-Touch Campaign Sequence Flow
                </CardTitle>
                <CardDescription className="text-xs">
                  Configure multi-day automated follow-up steps with intelligent trigger branching.
                </CardDescription>
              </div>
              <Button size="sm" variant="outline" className="gap-1 border-white/10 text-xs">
                <Plus className="h-3 w-3" />
                Add Step
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {sequenceSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-zinc-900/50 p-4 transition-all hover:bg-zinc-900/80"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/20 font-bold text-purple-300 text-xs">
                    Day {step.day}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="flex items-center gap-2 font-semibold text-white text-xs">
                        <span>
                          Step {index + 1}: {step.type}
                        </span>
                        <Badge variant="outline" className="border-white/10 font-normal text-[10px]">
                          {step.framework}
                        </Badge>
                      </h4>
                      <Badge className="border-emerald-500/20 bg-emerald-500/10 text-[10px] text-emerald-400">
                        {step.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Subject: <span className="font-medium text-zinc-200">{step.subject}</span>
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Deliverability & Warmup */}
        <TabsContent value="deliverability" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="border border-white/10 bg-zinc-950/60 shadow-xl backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between font-medium text-muted-foreground text-xs">
                  <span>SPF / DKIM / DMARC</span>
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl text-emerald-400">100% Validated</div>
                <p className="mt-1 text-muted-foreground text-xs">DNS records verified across 3 domains</p>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-zinc-950/60 shadow-xl backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between font-medium text-muted-foreground text-xs">
                  <span>Blacklist Health</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl text-white">0 Blacklists</div>
                <p className="mt-1 text-muted-foreground text-xs">Checked Spamhaus, Barracuda & MXToolbox</p>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-zinc-950/60 shadow-xl backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between font-medium text-muted-foreground text-xs">
                  <span>Automated Warmup Ramp</span>
                  <Flame className="h-4 w-4 text-amber-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl text-amber-400">Day 18 / 30</div>
                <p className="mt-1 text-muted-foreground text-xs">Current daily sending limit: 95 emails/inbox</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Audience & Launch */}
        <TabsContent value="launch" className="space-y-4">
          <Card className="border border-white/10 bg-zinc-950/60 shadow-xl backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-bold text-base text-white">
                <Target className="h-4 w-4 text-amber-400" />
                Target Audience & Campaign Dispatcher
              </CardTitle>
              <CardDescription className="text-xs">
                Select prospect audience segment and launch automated multi-inbox outreach.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground text-xs">Select Target Lead Segment</label>
                <select
                  value={selectedAudience}
                  onChange={(e) => setSelectedAudience(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-zinc-100"
                >
                  <option>Scraped Intent Leads (GTA & Vancouver) — 892 prospects</option>
                  <option>Reddit r/PersonalFinanceCanada High Earners — 340 prospects</option>
                  <option>Canadian Workshop RSVP Leads — 210 prospects</option>
                  <option>Twenty CRM Qualified Prospects — 142 prospects</option>
                </select>
              </div>

              <div className="space-y-2.5 rounded-xl border border-white/10 bg-zinc-900/50 p-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CASL Implied Consent Verified:</span>
                  <span className="font-semibold text-emerald-400">892 / 892 (100%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Connected Sending Inboxes:</span>
                  <span className="font-semibold text-blue-400">3 Active Business Inboxes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Daily Warmup Cap:</span>
                  <span className="font-semibold text-zinc-200">285 Emails / Day</span>
                </div>
              </div>

              <Button
                size="lg"
                onClick={handleLaunchCampaign}
                disabled={isLaunching}
                className="w-full gap-2 rounded-xl bg-white py-5 font-bold text-black text-sm shadow-xl transition-all hover:scale-[1.01] hover:bg-zinc-200"
              >
                <Rocket className={`h-4 w-4 text-purple-600 ${isLaunching ? "animate-bounce" : ""}`} />
                <span>{isLaunching ? "Launching Campaign..." : "Start Automated Campaign Dispatch"}</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
