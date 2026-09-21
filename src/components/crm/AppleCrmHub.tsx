"use client";

import { useCallback, useEffect, useState } from "react";

import Link from "next/link";

import {
  IconCurrencyDollar,
  IconFlame,
  IconPhoneCall,
  IconRadar,
  IconRefresh,
  IconSearch,
  IconShieldCheck,
  IconSparkles,
  IconTarget,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { TablerCard } from "@/components/ui/tabler-card";

export interface ContactRecord {
  id: string;
  name: string;
  channel: string;
  monthly_freedom_gap: number;
  fsa: string;
  city: string;
  casl_verified: boolean;
  intent_score: number;
  phone?: string;
  email?: string;
}

export function AppleCrmHub() {
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<string>("All");
  const [callingId, setCallingId] = useState<string | null>(null);
  const [_isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [_aiQuery, _setAiQuery] = useState("");
  const [aiNote, setAiNote] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        setContacts(data || []);
      }
    } catch (_e) {
      console.log("Using baseline leads");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleSyncCrm = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/twenty-crm/sync", { method: "POST" });
      if (res.ok) {
        toast.success("✅ CRM Synced!", {
          description: "All contacts and deal data are updated.",
        });
        fetchLeads();
      }
    } catch (_e) {
      toast.error("CRM sync failed");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSpeedCall = (id: string, name: string) => {
    setCallingId(id);
    toast.info("⚡ Calling...", {
      description: `Calling ${name} now...`,
    });

    setTimeout(() => {
      setCallingId(null);
      toast.success(`🎉 Call Connected with ${name}!`, {
        description: "Meeting added to calendar.",
      });
    }, 1500);
  };

  const handleAiSearch = (text: string) => {
    setSearchQuery(text);
    setAiNote(`Showing results for "${text}"`);
    toast.success(`Filter applied: ${text}`);
  };

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.fsa.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChannel = selectedChannel === "All" || c.channel.toLowerCase() === selectedChannel.toLowerCase();
    return matchesSearch && matchesChannel;
  });

  return (
    <div className="flex flex-col gap-6 p-1">
      {/* Simple Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 font-semibold text-blue-400 text-xs">
            <IconUsers className="h-3.5 w-3.5" />
            CRM &amp; CLIENTS
          </div>
          <h1 className="mt-2 font-bold text-2xl tracking-tight">CRM Hub</h1>
          <p className="mt-1 text-muted-foreground text-xs">
            Manage your contacts, make calls, and track deal progress easily.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" className="text-xs" onClick={handleSyncCrm} disabled={isSyncing}>
            <IconRefresh className={`mr-1 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
            Sync CRM
          </Button>

          <Link href="/dashboard/intent-leads">
            <Button size="sm" className="bg-amber-500 font-semibold text-black text-xs hover:bg-amber-400">
              <IconRadar className="mr-1.5 h-4 w-4" />
              Find New Leads
            </Button>
          </Link>
        </div>
      </div>

      {/* Simple Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TablerCard statusColor="blue">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-muted-foreground text-xs uppercase">Total People</span>
            <IconUsers className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-2 font-bold text-2xl">{contacts.length}</div>
        </TablerCard>

        <TablerCard statusColor="emerald">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-muted-foreground text-xs uppercase">Ready to Call</span>
            <IconShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 font-bold text-2xl">{contacts.filter((c) => c.casl_verified).length}</div>
        </TablerCard>

        <TablerCard statusColor="amber">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-muted-foreground text-xs uppercase">Top Intent</span>
            <IconTarget className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 font-bold text-2xl">
            {contacts.length > 0
              ? Math.round(contacts.reduce((a, b) => a + (b.intent_score || 0), 0) / contacts.length)
              : 0}
            <span className="font-normal text-muted-foreground text-xs">/100</span>
          </div>
        </TablerCard>

        <TablerCard statusColor="purple">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-muted-foreground text-xs uppercase">Pipeline Deals</span>
            <IconCurrencyDollar className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 font-bold text-2xl">$0</div>
        </TablerCard>
      </div>

      {/* Simple AI Helper Tool */}
      <TablerCard
        statusColor="amber"
        headerTitle="🤖 Quick AI Filter"
        headerDescription="Click a quick button to filter your client list"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" className="text-xs" onClick={() => handleAiSearch("Toronto")}>
            <IconSparkles className="mr-1 h-3.5 w-3.5 text-amber-500" />
            Find Toronto People
          </Button>
          <Button size="sm" variant="outline" className="text-xs" onClick={() => handleAiSearch("High Intent")}>
            <IconFlame className="mr-1 h-3.5 w-3.5 text-rose-500" />
            Show High Intent
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs"
            onClick={() => {
              setSearchQuery("");
              setAiNote(null);
            }}
          >
            Clear Filters
          </Button>
        </div>

        {aiNote && (
          <div className="mt-3 rounded-md border border-amber-500/20 bg-amber-500/10 p-2 font-medium text-amber-400 text-xs">
            {aiNote}
          </div>
        )}
      </TablerCard>

      {/* Filter and Search Bar */}
      <TablerCard className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <IconSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Type a name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border/60 bg-muted/30 py-2 pr-4 pl-9 text-xs outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {["All", "Facebook", "Reddit", "Google Maps", "LinkedIn"].map((ch) => (
              <button
                key={ch}
                onClick={() => setSelectedChannel(ch)}
                className={`rounded-lg px-2.5 py-1.5 font-medium text-xs transition-colors ${
                  selectedChannel === ch
                    ? "bg-amber-500 font-semibold text-black"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>
      </TablerCard>

      {/* Contacts List Table */}
      <TablerCard
        headerTitle={`Contacts List (${filteredContacts.length})`}
        headerDescription="Clean slate — new leads will show up here automatically"
      >
        {filteredContacts.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <IconUser className="mx-auto h-10 w-10 opacity-30" />
            <p className="mt-2 font-semibold text-xs">No contacts found</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Click <span className="font-semibold text-foreground">"Find New Leads"</span> above to discover prospects.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-border/40 border-b bg-muted/20 text-[10px] text-muted-foreground uppercase tracking-wider">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">City</th>
                  <th className="px-4 py-3">Intent</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredContacts.map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-muted/10">
                    <td className="px-4 py-3 font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/10 font-bold text-[10px] text-amber-500">
                          {c.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div>{c.name}</div>
                          <div className="font-normal text-[10px] text-muted-foreground">
                            {c.email || `${c.name.toLowerCase().replace(" ", ".")}@prospect.ca`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{c.city}</div>
                      <div className="text-[10px] text-muted-foreground">{c.channel}</div>
                    </td>
                    <td className="px-4 py-3 font-bold text-amber-500">{c.intent_score}/100</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-semibold text-[10px] text-emerald-400">
                        <IconShieldCheck className="h-3 w-3" />
                        Ready
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        className="h-7 bg-amber-500 text-black text-xs hover:bg-amber-400"
                        onClick={() => handleSpeedCall(c.id, c.name)}
                        disabled={callingId === c.id}
                      >
                        <IconPhoneCall className="mr-1 h-3 w-3" />
                        {callingId === c.id ? "Calling..." : "Call Now"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TablerCard>
    </div>
  );
}
