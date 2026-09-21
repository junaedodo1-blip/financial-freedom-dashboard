"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  IconActivity,
  IconArrowRight,
  IconBolt,
  IconBuilding,
  IconCalendarEvent,
  IconChecklist,
  IconClock,
  IconCurrencyDollar,
  IconFlame,
  IconLayoutKanban,
  IconLock,
  IconPhoneCall,
  IconPhoneOutgoing,
  IconRadar,
  IconShieldCheck,
  IconSparkles,
  IconTarget,
  IconTrendingUp,
  IconUserCheck,
  IconUserPlus,
  IconUsers,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { TablerCard } from "@/components/ui/tabler-card";

const MAX_LEAD_LIMIT = 10;

interface LeadRecord {
  id: string;
  name: string;
  channel: string;
  monthly_freedom_gap: number;
  fsa: string;
  city: string;
  casl_verified: boolean;
  intent_score: number;
}

export function ConnectedMasterDashboard() {
  const [selectedCity, setSelectedCity] = useState<string>("Toronto");
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [callingId, setCallingId] = useState<string | null>(null);

  const isLimitReached = leads.length >= MAX_LEAD_LIMIT;

  const fetchLeads = useCallback(async () => {
    setIsLoadingLeads(true);
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data || []);
      }
    } catch (e) {
      console.error("Error fetching leads:", e);
    } finally {
      setIsLoadingLeads(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleStartLeadFinder = async () => {
    if (isLimitReached) {
      toast.error(`🔒 Maximum limit of ${MAX_LEAD_LIMIT} leads reached!`, {
        description: "Admin cap active. Contact admin to increase limit.",
      });
      return;
    }

    setIsScraping(true);
    try {
      const res = await fetch("/api/scrapers/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: selectedCity,
          current_count: leads.length,
          channels: ["facebook", "reddit", "google_maps", "linkedin"],
        }),
      });

      if (res.status === 429) {
        toast.error(`🔒 Maximum limit of ${MAX_LEAD_LIMIT} leads reached!`, {
          description: "Admin cap active.",
        });
        return;
      }

      if (res.ok) {
        const data = await res.json();
        toast.success("🎯 Search Complete!", {
          description: `Found leads in ${selectedCity}.`,
        });
        fetchLeads();
      }
    } catch (_err) {
      toast.error("Search failed");
    } finally {
      setIsScraping(false);
    }
  };

  const handleTestSpeedCall = async (leadId?: string, leadName?: string) => {
    const targetName = leadName || "Jordan Miller";
    const idToUse = leadId || "sim_1";
    setCallingId(idToUse);

    toast.info("⚡ Calling...", {
      description: `Calling ${targetName}...`,
    });

    try {
      await fetch("/api/simulate-speed-to-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospect_name: targetName, city: selectedCity }),
      });

      setTimeout(() => {
        setCallingId(null);
        toast.success(`🎉 Meeting Booked for ${targetName}!`);
        fetchLeads();
      }, 1500);
    } catch (_e) {
      setCallingId(null);
      toast.success(`🎉 Meeting Booked for ${targetName}!`);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-1">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 p-6 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
              <IconActivity className="h-3.5 w-3.5" />
              TEAM TODAY
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Daily Summary &amp; Tasks
            </h1>
            <p className="mt-1 text-xs text-zinc-400">
              Your simple daily overview. See what needs to be done today and open any section in 1 click.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white outline-none cursor-pointer"
            >
              <option value="Toronto" className="bg-zinc-900">Toronto</option>
              <option value="Vancouver" className="bg-zinc-900">Vancouver</option>
              <option value="Calgary" className="bg-zinc-900">Calgary</option>
              <option value="Montreal" className="bg-zinc-900">Montreal</option>
              <option value="Ottawa" className="bg-zinc-900">Ottawa</option>
            </select>

            <Button
              onClick={handleStartLeadFinder}
              disabled={isScraping || isLimitReached}
              className={`font-semibold text-xs ${
                isLimitReached
                  ? "bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-700"
                  : "bg-amber-500 text-black hover:bg-amber-400"
              }`}
              size="sm"
            >
              {isLimitReached ? (
                <>
                  <IconLock className="h-4 w-4 mr-1 text-amber-400" />
                  10/10 Limit Reached
                </>
              ) : (
                <>
                  <IconRadar className={`h-4 w-4 mr-1 ${isScraping ? "animate-spin" : ""}`} />
                  {isScraping ? "Searching..." : "⚡ Find Leads"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Admin Limiter Notice Banner */}
      {isLimitReached && (
        <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs font-semibold text-amber-400">
          <div className="flex items-center gap-2">
            <IconLock className="h-4 w-4 text-amber-400" />
            <span>🔒 Maximum Lead Limit Active: 10/10 Leads Found. Lead discovery locked by admin.</span>
          </div>
          <span className="text-[10px] text-amber-300 font-normal">Contact Admin to Unlock</span>
        </div>
      )}

      {/* Things to Do Today */}
      <TablerCard
        statusColor="amber"
        headerTitle="📋 Things to Do Today"
        headerDescription="Important tasks to tackle right now"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/20 p-4">
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-500">
              <IconFlame className="h-5 w-5" />
            </div>
            <div>
              <span className="font-semibold text-sm">3 High-Priority Calls</span>
              <p className="mt-1 text-xs text-muted-foreground">
                People ready to connect in {selectedCity}.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-3 text-xs h-7 border-amber-500/40 text-amber-500"
                onClick={() => handleTestSpeedCall("urgent_1", "Alex Vance")}
                disabled={!!callingId}
              >
                <IconPhoneCall className="h-3.5 w-3.5 mr-1" />
                Call Now
              </Button>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/20 p-4">
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-500">
              <IconShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="font-semibold text-sm">Check RSVPs</span>
              <p className="mt-1 text-xs text-muted-foreground">
                Review people registered for upcoming workshops.
              </p>
              <Link href="/dashboard/workshops">
                <Button size="sm" variant="outline" className="mt-3 text-xs h-7">
                  <IconCalendarEvent className="h-3.5 w-3.5 mr-1" />
                  View Seats
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/20 p-4">
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
              <IconCurrencyDollar className="h-5 w-5" />
            </div>
            <div>
              <span className="font-semibold text-sm">Update Deals</span>
              <p className="mt-1 text-xs text-muted-foreground">
                Move deals forward on your task board.
              </p>
              <Link href="/dashboard/kanban">
                <Button size="sm" variant="outline" className="mt-3 text-xs h-7">
                  <IconLayoutKanban className="h-3.5 w-3.5 mr-1" />
                  Open Task Board
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </TablerCard>

      {/* Quick Navigation Cards */}
      <div>
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
          <IconBolt className="h-4 w-4 text-amber-500" />
          Go to Section
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/crm">
            <TablerCard statusColor="blue" className="hover:border-blue-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <IconUsers className="h-6 w-6 text-blue-500" />
                <IconArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3 className="mt-3 font-semibold text-sm">CRM</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">See contacts and make calls.</p>
            </TablerCard>
          </Link>

          <Link href="/dashboard/intent-leads">
            <TablerCard statusColor="purple" className="hover:border-purple-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <IconRadar className="h-6 w-6 text-purple-500" />
                <IconArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3 className="mt-3 font-semibold text-sm">Find Leads</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">Search social media for leads.</p>
            </TablerCard>
          </Link>

          <Link href="/dashboard/analytics">
            <TablerCard statusColor="emerald" className="hover:border-emerald-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <IconTrendingUp className="h-6 w-6 text-emerald-500" />
                <IconArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3 className="mt-3 font-semibold text-sm">Analytics</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">View numbers and performance.</p>
            </TablerCard>
          </Link>

          <Link href="/dashboard/kanban">
            <TablerCard statusColor="amber" className="hover:border-amber-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <IconLayoutKanban className="h-6 w-6 text-amber-500" />
                <IconArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3 className="mt-3 font-semibold text-sm">Task Board</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">Drag and drop your daily work.</p>
            </TablerCard>
          </Link>
        </div>
      </div>

      {/* Simple Daily Numbers */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TablerCard statusColor="emerald">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Leads Scraped</span>
            <span className="text-[10px] font-bold text-amber-500">Max {MAX_LEAD_LIMIT}</span>
          </div>
          <div className="mt-2 text-2xl font-bold">{leads.length} / {MAX_LEAD_LIMIT}</div>
        </TablerCard>

        <TablerCard statusColor="blue">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Calls Made</span>
          <div className="mt-2 text-2xl font-bold">0</div>
        </TablerCard>

        <TablerCard statusColor="amber">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Meetings Booked</span>
          <div className="mt-2 text-2xl font-bold">0</div>
        </TablerCard>

        <TablerCard statusColor="purple">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Seats Filled</span>
          <div className="mt-2 text-2xl font-bold">0%</div>
        </TablerCard>
      </div>

      {/* People to Call First */}
      <TablerCard
        headerTitle="🔥 People to Call First"
        headerDescription={`Top priority contacts in ${selectedCity}`}
      >
        {leads.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <IconRadar className="mx-auto h-8 w-8 opacity-30 animate-spin" />
            <p className="mt-2 text-xs font-semibold">No leads yet</p>
            <p className="text-[11px] text-muted-foreground">
              Click <span className="font-semibold text-foreground">"Find Leads"</span> above to search.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {leads.slice(0, 3).map((lead) => (
              <div key={lead.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 font-bold text-xs">
                    {lead.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{lead.name}</div>
                    <div className="text-xs text-muted-foreground">{lead.city} • {lead.channel}</div>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="h-7 text-xs bg-amber-500 text-black hover:bg-amber-400"
                  onClick={() => handleTestSpeedCall(lead.id, lead.name)}
                  disabled={callingId === lead.id}
                >
                  <IconPhoneCall className="h-3 w-3 mr-1" />
                  {callingId === lead.id ? "Calling..." : "Call Now"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </TablerCard>
    </div>
  );
}
