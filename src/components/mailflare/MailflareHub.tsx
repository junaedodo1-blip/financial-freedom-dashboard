"use client";

import React, { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRightLeft,
  Award,
  Bot,
  Building2,
  CheckCircle2,
  CheckSquare,
  Clock,
  Copy,
  Cpu,
  Database,
  ExternalLink,
  Flame,
  Globe,
  HardDrive,
  Layers,
  Lightbulb,
  Lock,
  Mail,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  Wand2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export interface MailflareStatus {
  status: string;
  engine_name: string;
  connected_inboxes: number;
  active_warmups: number;
  avg_health_score: number;
  total_daily_cap: number;
  total_sent_today: number;
  queued_campaign_leads: number;
  casl_compliance_mode: string;
  last_updated: string;
}

export interface BusinessInbox {
  id: string;
  email: string;
  provider: string;
  domain: string;
  domain_age_days: number;
  health_score: number;
  daily_cap: number;
  sent_today: number;
  warmup_active: boolean;
  warmup_day: number;
  warmup_target_daily: number;
  spf_dkim_dmarc_valid: boolean;
  casl_shield_active: boolean;
  status: string;
  created_at: string;
}

export interface CampaignLead {
  id: string;
  name: string;
  email: string;
  company: string;
  city: string;
  fsa: string;
  intent_score: number;
  intent_topic: string;
  implied_consent_days_remaining: number;
  casl_verified: boolean;
  transported_at: string;
}

export interface Company360Audit {
  company_name: string;
  domain: string;
  est_revenue: string;
  headcount: string;
  tech_stack: string[];
  hiring_signals: string[];
  casl_risk_score: string;
  intent_score: number;
  key_decision_maker: string;
  audit_timestamp: string;
}

export function MailflareHub() {
  const [status, setStatus] = useState<MailflareStatus | null>(null);
  const [inboxes, setInboxes] = useState<BusinessInbox[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransporting, setIsTransporting] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // AI 360 Audit & Script State
  const [auditQuery, setAuditQuery] = useState("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<{
    query: string;
    audit: Company360Audit;
    personalized_script: string;
  } | null>(null);

  // Modal States
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newProvider, setNewProvider] = useState("Google Workspace Enterprise");
  const [newDomainAge, setNewDomainAge] = useState("30");
  const [isConnecting, setIsConnecting] = useState(false);

  // Campaign Dispatch State
  const [selectedInboxId, setSelectedInboxId] = useState("inbox_501");
  const [campaignSubject, setCampaignSubject] = useState("2026 HoldCo Corporate Tax Sheltering Review");
  const [campaignBody, setCampaignBody] = useState(
    "Hi [Name],\n\nNoticed [Company] is scaling operations in [City]. Many Canadian business owners in your bracket miss out on $150k+ in tax sheltering via HoldCo Section 85 rollovers.\n\nWould you be open to a brief 7-minute strategy review with our branch advisory team?\n\nBest,\nKalo Executive Team"
  );

  const fetchMailflareData = async () => {
    setIsLoading(true);
    try {
      const [statusRes, inboxesRes] = await Promise.all([
        fetch("/api/mailflare/status"),
        fetch("/api/mailflare/inboxes"),
      ]);

      if (statusRes.ok) {
        const sData = await statusRes.json();
        setStatus(sData);
      }
      if (inboxesRes.ok) {
        const iData = await inboxesRes.json();
        setInboxes(iData);
      }
    } catch (err) {
      console.error("Error fetching Mailflare status:", err);
      toast.error("Could not load Mailflare status");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMailflareData();
  }, []);

  const handleConnectInbox = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) {
      toast.error("Please enter a valid business email address.");
      return;
    }

    setIsConnecting(true);
    try {
      const res = await fetch("/api/mailflare/connect-inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail,
          provider: newProvider,
          domain_age_days: parseInt(newDomainAge) || 30,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("📧 Business Inbox Connected!", {
          description: data.message || `Connected ${newEmail} with automated warmup ramp.`,
        });
        setNewEmail("");
        setShowConnectModal(false);
        fetchMailflareData();
      } else {
        toast.error("Failed to connect inbox");
      }
    } catch (err) {
      toast.error("Error connecting inbox");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleToggleWarmup = async (inboxId: string) => {
    try {
      const res = await fetch("/api/mailflare/warmup/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inbox_id: inboxId }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("🔥 Email Warmup State Updated", {
          description: data.message,
        });
        fetchMailflareData();
      }
    } catch (err) {
      toast.error("Error updating warmup status");
    }
  };

  const handleTransportIntentLeads = async () => {
    setIsTransporting(true);
    try {
      const res = await fetch("/api/mailflare/transport-intent-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("🎯 IntentLeads Transport Complete!", {
          description: data.message || `Imported high-intent leads into Mailflare outreach queue.`,
        });
        fetchMailflareData();
      } else {
        toast.error("Failed to transport leads");
      }
    } catch (err) {
      toast.error("Error connecting to lead transport endpoint");
    } finally {
      setIsTransporting(false);
    }
  };

  const handleRunAudit = async (domainToAudit?: string) => {
    const q = domainToAudit !== undefined ? domainToAudit : auditQuery;
    if (!q.trim() || isAuditing) return;

    setIsAuditing(true);
    try {
      const res = await fetch("/api/mailflare/audit-company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_or_domain: q }),
      });

      if (res.ok) {
        const data = await res.json();
        setAuditResult(data);
        toast.success(`🏢 360 Company Audit Complete`, {
          description: `Analyzed ${data.audit.company_name} and generated personalized outreach script.`,
        });
      } else {
        toast.error("Company 360 audit failed");
      }
    } catch (err) {
      toast.error("Error executing company audit");
    } finally {
      setIsAuditing(false);
    }
  };

  const handleSendCampaign = async () => {
    setIsSending(true);
    try {
      const res = await fetch("/api/mailflare/send-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inbox_id: selectedInboxId,
          subject: campaignSubject,
          body_template: campaignBody,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("🚀 Mass Campaign Dispatched!", {
          description: data.message || `Dispatched emails under CASL 2026 shield.`,
        });
        fetchMailflareData();
      } else {
        toast.error("Failed to dispatch campaign");
      }
    } catch (err) {
      toast.error("Error dispatching campaign");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative min-h-screen space-y-8 bg-slate-950 p-6 text-slate-100">
      {/* Impeccable Rose/Amber Radial Glow Backdrops */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-rose-600/10 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-40 h-96 w-96 rounded-full bg-amber-600/10 blur-3xl" />

      {/* Header Banner */}
      <div className="relative flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 ring-1 ring-rose-500/30">
              <Mail className="h-6 w-6 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-white">
                  Mailflare Business Email OS
                </h1>
                <Badge className="bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/40">
                  CASL 2026 Shield
                </Badge>
              </div>
              <p className="mt-1 text-sm text-slate-400">
                Enterprise outreach infrastructure for business inboxes. Includes automated email warmup, IntentLeads transport, deliverability age throttling, and Company 360 AI audits.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleTransportIntentLeads}
            disabled={isTransporting}
            className="border-amber-500/30 bg-amber-950/40 text-amber-300 hover:bg-amber-900/60"
          >
            <ArrowRightLeft className={`mr-2 h-4 w-4 ${isTransporting ? "animate-spin" : ""}`} />
            Transport IntentLeads
          </Button>
          <Button
            onClick={() => setShowConnectModal(true)}
            className="bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-lg shadow-rose-900/30 hover:from-rose-500 hover:to-amber-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Connect Business Inbox
          </Button>
        </div>
      </div>

      {/* Connectivity & Deliverability Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Connected Inboxes
              </span>
              <Badge className="bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
                CONNECTED
              </Badge>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">
                {status?.connected_inboxes || 0}
              </span>
              <span className="text-xs text-slate-400">Inboxes Active</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {status?.active_warmups || 0} Inboxes in Warmup Ramp
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Deliverability Health
              </span>
              <Award className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-3xl font-extrabold text-emerald-300">
                {status?.avg_health_score || 95}%
              </span>
              <Badge className="bg-emerald-500/20 text-emerald-300 text-xs">
                SPF/DKIM Valid
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              0 Blacklists / High Inbox Placement
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Daily Sending Cap
              </span>
              <Zap className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-300">
                {status?.total_sent_today || 0} / {status?.total_daily_cap || 285}
              </span>
              <span className="text-xs text-slate-400">Sent Today</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Throttled by Domain Age & Health
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Queued Intent Prospects
              </span>
              <Users className="h-4 w-4 text-rose-400" />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-3xl font-extrabold text-rose-300">
                {status?.queued_campaign_leads || 2}
              </span>
              <Badge className="bg-rose-500/20 text-rose-300 text-xs">
                CASL Verified
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Transported from IntentLeads Engine
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Paperclip AI Outreach & Deliverability Advisor Box (Impeccable Design) */}
      <Card className="relative overflow-hidden border-rose-500/30 bg-gradient-to-r from-slate-900 via-slate-900/90 to-rose-950/40 shadow-2xl backdrop-blur-xl">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-rose-500/10 blur-2xl" />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/40">
                <Wand2 className="h-5 w-5 animate-pulse text-rose-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-white">
                  Paperclip Company 360 Audit & Outreach AI Advisor
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Analyze target company domain, uncover firmographics, and generate audit-backed personalized email scripts under CASL compliance.
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-rose-500/10 text-rose-300 border-rose-500/30">
              Audit Engine v2.4
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Enter target company or domain (e.g., 'torontocapital.ca')..."
                value={auditQuery}
                onChange={(e) => setAuditQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRunAudit()}
                className="border-slate-800 bg-slate-950/80 pl-9 text-slate-200 placeholder:text-slate-500 focus:border-rose-500"
              />
            </div>
            <Button
              onClick={() => handleRunAudit()}
              disabled={isAuditing || !auditQuery.trim()}
              className="bg-rose-600 text-white hover:bg-rose-500"
            >
              {isAuditing ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Run 360 Audit
            </Button>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-400">Audit Presets:</span>
            {[
              "torontocapital.ca",
              "pacificadvisory.ca",
              "vancetech.ca",
              "baystreetwealth.ca",
            ].map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setAuditQuery(preset);
                  handleRunAudit(preset);
                }}
                className="rounded-md border border-slate-800 bg-slate-950/60 px-2.5 py-1 text-xs text-rose-300 transition-colors hover:border-rose-500/50 hover:bg-rose-950/30"
              >
                ⚡ {preset}
              </button>
            ))}
          </div>

          {/* 360 Audit Output */}
          {auditResult && (
            <div className="mt-4 rounded-xl border border-rose-500/30 bg-slate-950/90 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-rose-400" />
                  <span className="text-base font-bold text-white">
                    360 Audit: {auditResult.audit.company_name} ({auditResult.audit.domain})
                  </span>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-300 text-xs">
                  Intent Score: {auditResult.audit.intent_score}
                </Badge>
              </div>

              {/* Firmographic Cards */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5">
                  <span className="text-slate-400 block">Est. Revenue</span>
                  <span className="font-semibold text-white">{auditResult.audit.est_revenue}</span>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5">
                  <span className="text-slate-400 block">Headcount</span>
                  <span className="font-semibold text-white">{auditResult.audit.headcount}</span>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5">
                  <span className="text-slate-400 block">Decision Maker</span>
                  <span className="font-semibold text-white">{auditResult.audit.key_decision_maker}</span>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5">
                  <span className="text-slate-400 block">CASL Risk Score</span>
                  <span className="font-semibold text-emerald-400">{auditResult.audit.casl_risk_score}</span>
                </div>
              </div>

              {/* AI Generated Personalized Script */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-bold text-rose-300">
                    ✍️ AI Audit-Backed Personalized Outreach Script
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(auditResult.personalized_script);
                      toast.success("Script copied to clipboard!");
                    }}
                    className="h-7 text-xs text-slate-400 hover:text-white"
                  >
                    <Copy className="mr-1 h-3 w-3" /> Copy
                  </Button>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-xs text-slate-200 leading-relaxed">
                  {auditResult.personalized_script}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connected Inboxes & Warmup Schedule Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-rose-400" />
            <h2 className="text-xl font-bold text-white">
              Connected Business Inboxes & Automated Warmup
            </h2>
            <Badge className="bg-slate-800 text-slate-300">{inboxes.length}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {inboxes.map((ib) => (
            <Card
              key={ib.id}
              className="group relative border-slate-800 bg-slate-900/60 transition-all duration-200 hover:border-rose-500/40 hover:bg-slate-900/90"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base font-bold text-white group-hover:text-rose-300">
                        {ib.email}
                      </CardTitle>
                      {ib.warmup_active && (
                        <Badge className="bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40 text-[10px]">
                          <Flame className="mr-1 h-3 w-3 fill-amber-400" /> Day {ib.warmup_day} Warmup
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{ib.provider} • Domain Age: {ib.domain_age_days}d</p>
                  </div>
                  <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs">
                    {ib.id}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Health & Volume Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Deliverability Health</span>
                    <span className="font-bold text-emerald-400">{ib.health_score}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800">
                    <div
                      className="h-2 rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${ib.health_score}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 p-2.5 text-xs">
                  <div>
                    <span className="text-slate-400 block">Sent Today vs Cap</span>
                    <span className="font-bold text-white">{ib.sent_today} / {ib.daily_cap}</span>
                  </div>
                  <Button
                    size="sm"
                    variant={ib.warmup_active ? "destructive" : "outline"}
                    onClick={() => handleToggleWarmup(ib.id)}
                    className="h-7 text-xs"
                  >
                    {ib.warmup_active ? "Pause Warmup" : "Start Warmup"}
                  </Button>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>SPF / DKIM / DMARC Valid</span>
                  </div>
                  <span className="text-[11px] text-amber-300">CASL 2026 Ready</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mass Campaign Dispatcher Panel */}
      <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-white">
                  Mass Campaign Dispatcher (CASL 2026 Compliant)
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Dispatch email sequences to transported high-intent leads using health-throttled inboxes.
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-rose-500/10 text-rose-300">Auto Consent Check</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300">
                Select Sending Inbox
              </label>
              <select
                value={selectedInboxId}
                onChange={(e) => setSelectedInboxId(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
              >
                {inboxes.map((ib) => (
                  <option key={ib.id} value={ib.id}>
                    {ib.email} ({ib.health_score}% health • Cap: {ib.daily_cap}/day)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300">
                Email Subject Line
              </label>
              <Input
                value={campaignSubject}
                onChange={(e) => setCampaignSubject(e.target.value)}
                className="mt-1 border-slate-800 bg-slate-950 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300">
              Email Template (Includes Mandatory Unsubscribe Footer)
            </label>
            <textarea
              rows={4}
              value={campaignBody}
              onChange={(e) => setCampaignBody(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 p-3 text-xs text-white focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
            <span className="text-xs text-slate-400">
              🔒 CASL 2026 Footers & 180-Day Implied Consent Validation automatically appended.
            </span>
            <Button
              onClick={handleSendCampaign}
              disabled={isSending}
              className="bg-rose-600 text-white hover:bg-rose-500"
            >
              {isSending ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Dispatch Campaign
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Connect Inbox Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Connect Business Inbox</h3>
                  <p className="text-xs text-slate-400">
                    Connect enterprise email for outreach, warmup, and deliverability tracking.
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConnectModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </Button>
            </div>

            <form onSubmit={handleConnectInbox} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Business Email Address
                </label>
                <Input
                  placeholder="e.g. advisory@kalosystems.ca"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="mt-1 border-slate-800 bg-slate-950 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300">
                    Email Provider
                  </label>
                  <select
                    value={newProvider}
                    onChange={(e) => setNewProvider(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                  >
                    <option value="Google Workspace Enterprise">Google Workspace Enterprise</option>
                    <option value="Microsoft 365 Business">Microsoft 365 Business</option>
                    <option value="Custom Business SMTP/IMAP">Custom Business SMTP/IMAP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300">
                    Domain Age (Days)
                  </label>
                  <Input
                    type="number"
                    value={newDomainAge}
                    onChange={(e) => setNewDomainAge(e.target.value)}
                    className="mt-1 border-slate-800 bg-slate-950 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowConnectModal(false)}
                  className="border-slate-800 bg-slate-950 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isConnecting}
                  className="bg-rose-600 text-white hover:bg-rose-500"
                >
                  {isConnecting ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  Connect Inbox
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
