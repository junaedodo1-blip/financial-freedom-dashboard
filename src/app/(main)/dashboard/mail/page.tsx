"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { ExternalLink, Globe, Lock, Mail, Plus, ShieldCheck, Zap } from "lucide-react";

import { EmailOutreachAgentHub } from "@/components/mailflare/EmailOutreachAgentHub";
import { InboxConnectionModal } from "@/components/mailflare/InboxConnectionModal";
import { MailflareHub } from "@/components/mailflare/MailflareHub";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function MailDashboardPage() {
  // LANDING FIRST IN LIVE INBOX BY DEFAULT
  const [activeTab, setActiveTab] = useState<"inbox" | "mailflare" | "outreach_agent">("inbox");
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectedInboxes, setConnectedInboxes] = useState<
    Array<{ email: string; provider: string; domain_age_days: number }>
  >([
    { email: "marcus.bayst@kalo.ca", provider: "Google Workspace Enterprise", domain_age_days: 120 },
    { email: "sarah.vancouver@kalo.ca", provider: "Microsoft Outlook 365", domain_age_days: 90 },
    { email: "outreach.calgary@kalo.ca", provider: "Custom Domain SMTP/IMAP", domain_age_days: 45 },
  ]);

  const fetchInboxesFromBackend = async () => {
    try {
      const res = await fetch("/api/mailflare/inboxes");
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setConnectedInboxes(data);
        }
      }
    } catch (e) {
      console.warn("Could not fetch connected inboxes from backend:", e);
    }
  };

  useEffect(() => {
    fetchInboxesFromBackend();
  }, [fetchInboxesFromBackend]);

  const handleInboxConnected = (newInbox: { email: string; provider: string; domain_age_days: number }) => {
    setConnectedInboxes((prev) => [newInbox, ...prev]);
    fetchInboxesFromBackend();
    setActiveTab("inbox");
  };

  const handleQuickGoogleSignIn = () => {
    setShowConnectModal(true);
  };

  return (
    <div className="flex h-full flex-col gap-6 bg-background p-4 text-foreground md:p-6">
      {/* Emil Kowalski Style Glass Header & Navigation */}
      <div className="flex flex-col gap-4 border-border/40 border-b pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="rounded-full border-primary/20 bg-primary/10 px-2.5 py-0.5 font-semibold text-primary text-xs">
              Enterprise Outreach Engine v4.2
            </Badge>
            <Badge className="flex items-center gap-1 rounded-full border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 font-semibold text-emerald-400 text-xs">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              CASL 2026 Active
            </Badge>
          </div>
          <h1 className="flex items-center gap-2.5 font-bold text-2xl tracking-tight md:text-3xl">
            <Mail className="h-7 w-7 text-primary" />
            Live Business Mailbox & Outreach
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm">
            Sign in to business mailboxes, triage live connected inboxes, run deliverability audits, and launch AI
            marketing agents.
          </p>
        </div>

        {/* Emil Kowalski Segmented Control Tab Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="sm"
            onClick={() => setShowConnectModal(true)}
            className="gap-1.5 rounded-xl bg-white px-3.5 py-2 font-semibold text-black text-xs shadow-lg transition-all hover:scale-[1.02] hover:bg-zinc-200"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Connect Business Inbox</span>
          </Button>

          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-zinc-950/70 p-1 shadow-inner backdrop-blur-xl">
            <Button
              variant={activeTab === "inbox" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("inbox")}
              className={`flex items-center gap-1.5 rounded-lg font-semibold text-xs transition-all ${
                activeTab === "inbox"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mail className="h-3.5 w-3.5 text-blue-400" />
              <span>Live Mailbox ({connectedInboxes.length})</span>
            </Button>

            <Button
              variant={activeTab === "mailflare" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("mailflare")}
              className={`flex items-center gap-1.5 rounded-lg font-semibold text-xs transition-all ${
                activeTab === "mailflare"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Mailflare & Audit</span>
            </Button>

            <Button
              variant={activeTab === "outreach_agent" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("outreach_agent")}
              className={`flex items-center gap-1.5 rounded-lg font-semibold text-xs transition-all ${
                activeTab === "outreach_agent"
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-purple-400" />
              <span>⚡ Email Outreach Agent</span>
            </Button>
          </div>
        </div>
      </div>

      {/* LANDING TAB: Live Connected Inbox */}
      {activeTab === "inbox" && (
        <div className="flex flex-1 flex-col gap-4">
          {/* Emil Kowalski Sign-In Hero Card */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-5 shadow-2xl backdrop-blur-xl md:p-6">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="border-blue-500/20 bg-blue-500/10 text-blue-400 text-xs">
                    Multi-Mailbox OAuth 2.0
                  </Badge>
                  <span className="text-muted-foreground text-xs">• AES-256 Encrypted Connection</span>
                </div>
                <h3 className="flex items-center gap-2 font-bold text-white text-xl tracking-tight">
                  Sign In & Connect Business Mailboxes
                </h3>
                <p className="max-w-2xl text-xs text-zinc-400 leading-relaxed">
                  Connect Google Workspace, Microsoft Outlook 365, or Custom Domain SMTP/IMAP inboxes. Synced emails
                  display live below with automated warmup, deliverability tracking, and CASL shield.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={handleQuickGoogleSignIn}
                  className="gap-2 rounded-xl bg-white px-4 py-2.5 font-bold text-black text-xs shadow-xl transition-all hover:scale-[1.02] hover:bg-zinc-200"
                >
                  <Globe className="h-4 w-4 text-blue-600" />
                  <span>🔐 Sign in with Google (OAuth 2.0)</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowConnectModal(true)}
                  className="gap-2 rounded-xl border-white/15 bg-zinc-900 px-4 py-2.5 font-semibold text-xs text-zinc-200 hover:bg-zinc-800"
                >
                  <Lock className="h-4 w-4 text-purple-400" />
                  <span>Microsoft 365 / Custom SMTP</span>
                </Button>
              </div>
            </div>

            {/* Connected Mailboxes Filter Strip */}
            <div className="mt-5 flex flex-col justify-between gap-3 border-white/10 border-t pt-4 text-xs sm:flex-row sm:items-center">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-zinc-400">Active Connected Mailboxes:</span>
                {connectedInboxes.map((ib, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-900 px-3 py-1 font-semibold text-[11px] text-zinc-200 shadow-xs"
                  >
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    {ib.email}
                  </span>
                ))}
              </div>

              <Button asChild variant="ghost" size="sm" className="gap-1 text-xs text-zinc-400 hover:text-white">
                <Link href="/mail" prefetch={false} target="_blank" rel="noreferrer">
                  <span>Fullscreen Inbox</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Live Inbox Workspace View */}
          <iframe
            src="/mail"
            title="Live Mailbox Workspace"
            className="h-[750px] w-full rounded-2xl border border-border/50 bg-background shadow-xl"
          />
        </div>
      )}

      {/* TAB 2: Mailflare & Audit */}
      {activeTab === "mailflare" && (
        <div className="min-h-0 flex-1">
          <MailflareHub />
        </div>
      )}

      {/* TAB 3: ⚡ Email Outreach Agent */}
      {activeTab === "outreach_agent" && (
        <div className="min-h-0 flex-1">
          <EmailOutreachAgentHub />
        </div>
      )}

      {/* Connection Modal */}
      <InboxConnectionModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onConnected={handleInboxConnected}
      />
    </div>
  );
}
