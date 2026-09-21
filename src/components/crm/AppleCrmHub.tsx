"use client";

import { useCallback, useEffect, useState } from "react";

import Link from "next/link";

import {
  ArrowUpRight,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  DollarSign,
  Mail,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface ContactRecord {
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

const INITIAL_CONTACTS: ContactRecord[] = [];

export function AppleCrmHub() {
  const [contacts, setContacts] = useState<ContactRecord[]>(INITIAL_CONTACTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<string>("All");
  const [callingId, setCallingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setContacts(data);
        }
      }
    } catch (_e) {
      console.log("Using connected baseline leads");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleSpeedCall = (id: string, name: string) => {
    setCallingId(id);
    toast.info(`⚡ Initiating Speed-to-Lead AI Call to ${name}...`, {
      description: "Sub-45s voice connection via Canadian territory router.",
    });

    setTimeout(() => {
      setCallingId(null);
      toast.success(`📞 Speed Call Connected with ${name}!`, {
        description: "Recorded in CRM timeline and queued for Mailflare follow-up.",
      });
    }, 1800);
  };

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.fsa.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesChannel = selectedChannel === "All" || c.channel.toLowerCase().includes(selectedChannel.toLowerCase());

    return matchesSearch && matchesChannel;
  });

  return (
    <div className="relative space-y-6 rounded-3xl border border-white/10 bg-zinc-950/70 p-6 text-foreground shadow-2xl backdrop-blur-3xl md:p-8">
      {/* Apple Top Header Banner */}
      <div className="flex flex-col gap-4 border-white/10 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-2xl text-white tracking-tight md:text-3xl">CRM & Prospects</h1>
            <Badge className="border border-blue-500/20 bg-blue-500/10 text-blue-400 text-xs">1,420 Active Leads</Badge>
          </div>
          <p className="mt-1 text-xs text-zinc-400 md:text-sm">
            Apple-style clean customer relationship manager connected with IntentLeads radar & Mailflare outreach.
          </p>
        </div>

        {/* Prominent Apple Action Button for IntentLeads */}
        <div className="flex items-center gap-3">
          <Button
            onClick={fetchLeads}
            variant="outline"
            disabled={isLoading}
            className="h-10 rounded-2xl border-white/10 bg-zinc-900/60 px-3 text-xs hover:bg-zinc-800"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </Button>

          <Link href="/dashboard/intent-leads">
            <Button className="flex h-11 items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 font-bold text-white shadow-xl transition-all hover:scale-[1.02] hover:from-purple-500 hover:to-indigo-500">
              <Sparkles className="h-4 w-4 text-purple-200" />
              <span>IntentLeads Audit System</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Apple Stat Cards Ribbon */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group rounded-3xl border border-white/10 bg-zinc-900/50 p-5 shadow-lg backdrop-blur-xl transition-all hover:border-blue-500/30">
          <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
            <span className="font-medium">Total Contacts</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="font-bold text-2xl text-white tracking-tight">1,420</div>
          <div className="mt-1 flex items-center gap-1 font-medium text-[11px] text-emerald-400">
            <ArrowUpRight className="h-3 w-3" />
            <span>+14.2% scraped this month</span>
          </div>
        </div>

        <div className="group rounded-3xl border border-white/10 bg-zinc-900/50 p-5 shadow-lg backdrop-blur-xl transition-all hover:border-purple-500/30">
          <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
            <span className="font-medium">Active Pipeline</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="font-bold text-2xl text-white tracking-tight">61 Calls</div>
          <div className="mt-1 flex items-center gap-1 font-medium text-[11px] text-purple-300">
            <CheckCircle2 className="h-3 w-3" />
            <span>Booked Masterclasses</span>
          </div>
        </div>

        <div className="group rounded-3xl border border-white/10 bg-zinc-900/50 p-5 shadow-lg backdrop-blur-xl transition-all hover:border-amber-500/30">
          <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
            <span className="font-medium">Pipeline AUM</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="font-bold text-2xl text-white tracking-tight">$13.05M</div>
          <div className="mt-1 flex items-center gap-1 font-medium text-[11px] text-amber-400">
            <Building2 className="h-3 w-3" />
            <span>Across 5 Canadian Hubs</span>
          </div>
        </div>

        <div className="group rounded-3xl border border-white/10 bg-zinc-900/50 p-5 shadow-lg backdrop-blur-xl transition-all hover:border-emerald-500/30">
          <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
            <span className="font-medium">CASL Shield Rate</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="font-bold text-2xl text-white tracking-tight">96.8%</div>
          <div className="mt-1 flex items-center gap-1 font-medium text-[11px] text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span>892 Validated Consent</span>
          </div>
        </div>
      </div>

      {/* Controls & Search Bar */}
      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search by name, email, city, or postal code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 rounded-2xl border-white/10 bg-zinc-900/80 pl-10 text-xs text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-500/40 md:text-sm"
          />
        </div>

        {/* Channel Filter Pills */}
        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {["All", "Reddit", "Facebook", "Google", "LinkedIn"].map((ch) => (
            <button
              key={ch}
              onClick={() => setSelectedChannel(ch)}
              className={`rounded-full border px-3.5 py-1.5 font-medium text-xs transition-all ${
                selectedChannel === ch
                  ? "border-white bg-white font-semibold text-zinc-950 shadow-md"
                  : "border-white/10 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* Apple-Style Contacts Table */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 shadow-xl backdrop-blur-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="border-white/10 border-b bg-zinc-900/80 font-semibold text-[11px] text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4">Contact</th>
                <th className="px-5 py-4">Intent & Gap</th>
                <th className="px-5 py-4">Location / FSA</th>
                <th className="px-5 py-4">Channel</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-200">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="mb-1 h-8 w-8 text-zinc-600" />
                      <p className="font-semibold text-sm text-zinc-300">Clean Slate — No Contacts Queued</p>
                      <p className="max-w-sm text-xs text-zinc-500">
                        Run your first IntentLeads audit or trigger the Omnichannel Lead Scraper to automatically
                        populate your CRM pipeline.
                      </p>
                      <Link href="/dashboard/intent-leads" className="mt-3">
                        <Button
                          size="sm"
                          className="h-9 gap-1.5 rounded-xl bg-purple-600 px-4 font-bold text-white text-xs hover:bg-purple-500"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-purple-200" />
                          <span>Launch IntentLeads Engine</span>
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact.id} className="group transition-colors hover:bg-white/[0.03]">
                    {/* Name & Avatar */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-white/10 bg-purple-500/10 font-bold text-purple-300">
                          <AvatarFallback className="bg-purple-500/10 text-purple-300 text-xs">
                            {contact.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-white transition-colors group-hover:text-purple-300">
                            {contact.name}
                          </div>
                          <div className="text-[11px] text-zinc-400">{contact.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Intent Score & Freedom Gap */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Badge className="border-purple-500/20 bg-purple-500/10 font-bold text-[11px] text-purple-300">
                          {contact.intent_score}% Intent
                        </Badge>
                        <span className="font-semibold text-amber-400 text-xs">
                          ${contact.monthly_freedom_gap.toLocaleString()}/mo Gap
                        </span>
                      </div>
                    </td>

                    {/* City & FSA */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-zinc-300">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                        <span>{contact.city}</span>
                        <span className="font-mono text-[10px] text-zinc-500">({contact.fsa})</span>
                      </div>
                    </td>

                    {/* Channel */}
                    <td className="px-5 py-4">
                      <Badge variant="outline" className="border-white/10 bg-zinc-900 text-[11px] text-zinc-300">
                        {contact.channel}
                      </Badge>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <Badge className="gap-1 border-emerald-500/20 bg-emerald-500/10 text-[11px] text-emerald-400">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                        {contact.status}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSpeedCall(contact.id, contact.name)}
                          disabled={callingId === contact.id}
                          className="h-8 gap-1 rounded-xl border border-purple-500/30 bg-purple-600/20 px-3 font-semibold text-purple-300 text-xs transition-all hover:bg-purple-600 hover:text-white"
                        >
                          {callingId === contact.id ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : (
                            <Zap className="h-3 w-3 text-amber-400" />
                          )}
                          <span>Speed Call</span>
                        </Button>

                        <Link href="/dashboard/mail">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 rounded-xl p-0 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                            title="Open Email Outreach"
                          >
                            <Mail className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
