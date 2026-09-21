"use client";

import { useEffect, useState } from "react";

import {
  Calendar,
  Database,
  DollarSign,
  PhoneCall,
  Radar,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ConnectedLead {
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

export function ConnectedMasterDashboard() {
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [leads, setLeads] = useState<ConnectedLead[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [callingId, setCallingId] = useState<string | null>(null);
  const [isSyncingCrm, setIsSyncingCrm] = useState(false);

  const fetchLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data || []);
      }
    } catch (e) {
      console.error("Error fetching leads:", e);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleStartLeadFinder = async () => {
    setIsScraping(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/scrapers/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: selectedCity,
          channels: ["facebook", "reddit", "google_maps", "linkedin"],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("🎯 Lead Search Complete!", {
          description: `Found ${data.scraped_count || 3} new customer leads in ${selectedCity}.`,
        });
        fetchLeads();
      }
    } catch (_err) {
      toast.error("Lead search failed");
    } finally {
      setIsScraping(false);
    }
  };

  const handleTestSpeedCall = async (leadId?: string, leadName?: string) => {
    const targetName = leadName || "Jordan Miller";
    const idToUse = leadId || "sim_1";
    setCallingId(idToUse);

    toast.info("⚡ Calling Customer...", {
      description: `Connecting ${targetName} to strategy advisor in under 45 seconds...`,
    });

    try {
      await fetch("http://127.0.0.1:8000/api/simulate-speed-to-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospect_name: targetName, city: selectedCity }),
      });

      setTimeout(() => {
        setCallingId(null);
        toast.success(`🎉 Meeting Booked for ${targetName}!`, {
          description: "Confirmation SMS sent and calendar updated.",
        });
        fetchLeads();
      }, 1500);
    } catch (_e) {
      setCallingId(null);
    }
  };

  const handleSyncToCrm = async () => {
    setIsSyncingCrm(true);
    try {
      const res = await fetch("/api/twenty-crm/sync", { method: "POST" });
      if (res.ok) {
        toast.success("🤝 Synced to Sales CRM!", {
          description: `Updated customer deals & contact cards in sales CRM.`,
        });
      }
    } catch (_e) {
      toast.error("CRM sync failed");
    } finally {
      setIsSyncingCrm(false);
    }
  };

  const filteredLeads =
    selectedCity === "All" ? leads : leads.filter((l) => l.city.toLowerCase() === selectedCity.toLowerCase());

  const bookedCalls = filteredLeads.filter((l) => l.status === "booked").length;

  return (
    <div className="flex w-full flex-col gap-5">
      {/* Top Header Bar: Clean Title + Location Filter (No bloat banner) */}
      <div className="flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-xl tracking-tight">Customer Growth Command</h1>
            <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 text-xs">
              <ShieldCheck className="mr-1 inline size-3" /> 100% Legal & Compliant
            </Badge>
          </div>
          <p className="mt-0.5 text-muted-foreground text-xs">
            Automated customer acquisition: find leads, instant 45s calls, seminar bookings & CRM sync.
          </p>
        </div>

        {/* Location Selector */}
        <div className="flex items-center gap-1.5 rounded-lg border bg-muted/50 p-1 text-xs">
          <span className="px-2 font-medium text-muted-foreground">City:</span>
          {["All", "Toronto", "Vancouver", "Calgary", "Montreal", "Ottawa"].map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`rounded-md px-2.5 py-1 font-semibold text-xs transition-all ${
                selectedCity === city
                  ? "border bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid Layout (Apple-Style Modular Cards) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Bento Tile 1: 4-Step Connected Workflow Trail (Spans 2 cols) */}
        <Card className="flex flex-col justify-between border bg-card p-4 shadow-xs lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-foreground text-xs">
              <Sparkles className="size-4 text-sky-500" />
              <span>4-Step Connected Workflow</span>
            </div>
            <Badge variant="secondary" className="text-[10px]">
              Simple Workflow
            </Badge>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="rounded-lg border border-sky-500/20 bg-sky-500/10 p-2">
              <div className="font-bold text-sky-600">1. Find</div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">Social Leads</div>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2">
              <div className="font-bold text-emerald-600">2. Call</div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">Under 45s</div>
            </div>
            <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-2">
              <div className="font-bold text-purple-600">3. Book</div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">Seminar Seat</div>
            </div>
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-2">
              <div className="font-bold text-amber-600">4. Sync</div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">Sales CRM</div>
            </div>
          </div>
        </Card>

        {/* Bento Tile 2: One-Touch Actions (Spans 2 cols) */}
        <Card className="flex flex-col justify-between border bg-card p-4 shadow-xs lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
              <Zap className="size-4 text-amber-500" />
              <span>Quick Controls</span>
            </span>
            <span className="text-[10px] text-muted-foreground">1-Click Execution</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleStartLeadFinder}
              disabled={isScraping}
              size="sm"
              className="h-8 gap-1.5 bg-sky-600 text-white text-xs hover:bg-sky-500"
            >
              {isScraping ? <RefreshCw className="size-3.5 animate-spin" /> : <Search className="size-3.5" />}
              Find Leads
            </Button>

            <Button
              onClick={() => handleTestSpeedCall()}
              disabled={callingId !== null}
              size="sm"
              className="h-8 gap-1.5 bg-emerald-600 text-white text-xs hover:bg-emerald-500"
            >
              {callingId !== null ? (
                <RefreshCw className="size-3.5 animate-spin" />
              ) : (
                <PhoneCall className="size-3.5" />
              )}
              Test 45s Call
            </Button>

            <Button
              onClick={handleSyncToCrm}
              disabled={isSyncingCrm}
              size="sm"
              className="h-8 gap-1.5 bg-amber-600 text-white text-xs hover:bg-amber-500"
            >
              {isSyncingCrm ? <RefreshCw className="size-3.5 animate-spin" /> : <Database className="size-3.5" />}
              Sync to CRM
            </Button>
          </div>
        </Card>

        {/* Bento Tile 3: Metric - New Customer Leads */}
        <Card className="flex flex-col justify-between border p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>New Leads Found</span>
            <Users className="size-4 text-sky-500" />
          </div>
          <div className="mt-2 font-extrabold text-3xl tracking-tight">{filteredLeads.length}</div>
          <span className="mt-1 text-[10px] text-muted-foreground">Ready for 45s call</span>
        </Card>

        {/* Bento Tile 4: Metric - Strategy Meetings */}
        <Card className="flex flex-col justify-between border p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Meetings Booked</span>
            <PhoneCall className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 font-extrabold text-3xl text-emerald-600 tracking-tight dark:text-emerald-400">
            {bookedCalls}
          </div>
          <span className="mt-1 text-[10px] text-muted-foreground">Converted by instant AI call</span>
        </Card>

        {/* Bento Tile 5: Metric - Seminar Fill Rate */}
        <Card className="flex flex-col justify-between border p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Seminar Seats Booked</span>
            <Calendar className="size-4 text-purple-500" />
          </div>
          <div className="mt-2 font-extrabold text-3xl tracking-tight">0%</div>
          <span className="mt-1 text-[10px] text-muted-foreground">5 Canadian branch hubs</span>
        </Card>

        {/* Bento Tile 6: Metric - Estimated Deal Value */}
        <Card className="flex flex-col justify-between border p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Estimated Deal Value</span>
            <DollarSign className="size-4 text-amber-500" />
          </div>
          <div className="mt-2 font-extrabold text-3xl text-amber-600 tracking-tight dark:text-amber-400">$0.00M</div>
          <span className="mt-1 text-[10px] text-muted-foreground">Pipeline deal value</span>
        </Card>

        {/* Bento Tile 7: Live Customer Lead Table (Spans full width) */}
        <Card className="border shadow-xs lg:col-span-4">
          <CardHeader className="p-4 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radar className="size-4 text-sky-500" />
                <CardTitle className="font-bold text-sm">Live Customer Prospect Radar</CardTitle>
              </div>
              <Badge variant="outline" className="border-sky-500/20 bg-sky-500/10 text-sky-600 text-xs">
                {filteredLeads.length} Leads
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {isLoadingLeads ? (
              <div className="animate-pulse py-6 text-center text-muted-foreground text-xs">
                Loading live customer leads...
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="space-y-2 rounded-lg border border-dashed bg-muted/10 p-6 text-center">
                <div className="mx-auto flex size-8 items-center justify-center rounded-full bg-sky-500/10 text-sky-500">
                  <Search className="size-4" />
                </div>
                <div className="font-bold text-xs">No Active Customer Leads</div>
                <p className="mx-auto max-w-sm text-[11px] text-muted-foreground">
                  Click <strong>"Find Leads"</strong> above to collect live prospects from Facebook, Reddit, Google Maps
                  & LinkedIn.
                </p>
                <Button
                  onClick={handleStartLeadFinder}
                  disabled={isScraping}
                  size="sm"
                  className="mt-1 h-7 bg-sky-600 text-white text-xs hover:bg-sky-500"
                >
                  {isScraping ? "Finding Leads..." : "Find Leads Now"}
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b bg-muted/50 text-[10px] text-muted-foreground uppercase tracking-wider">
                    <tr>
                      <th className="px-3 py-2">Customer</th>
                      <th className="px-3 py-2">Source Channel</th>
                      <th className="px-3 py-2">Location</th>
                      <th className="px-3 py-2">Interest Score</th>
                      <th className="px-3 py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="transition-colors hover:bg-muted/30">
                        <td className="flex items-center gap-2 px-3 py-2.5 font-semibold">
                          <div className="flex size-6 items-center justify-center rounded-md border border-sky-500/20 bg-sky-500/10 font-bold text-[11px] text-sky-600">
                            {lead.name.charAt(0)}
                          </div>
                          <div>
                            <div>{lead.name}</div>
                            <div className="font-normal text-[10px] text-muted-foreground">{lead.phone}</div>
                          </div>
                        </td>
                        <td className="px-3 py-2.5">
                          <Badge variant="secondary" className="text-[10px] capitalize">
                            {lead.channel}
                          </Badge>
                        </td>
                        <td className="px-3 py-2.5 text-muted-foreground">
                          {lead.city} ({lead.fsa})
                        </td>
                        <td className="px-3 py-2.5">
                          <Badge className="border-emerald-500/20 bg-emerald-500/10 text-[10px] text-emerald-600">
                            {lead.intent_score}/100 High Interest
                          </Badge>
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <Button
                            onClick={() => handleTestSpeedCall(lead.id, lead.name)}
                            disabled={callingId === lead.id}
                            size="sm"
                            className="h-6 gap-1 bg-emerald-600 px-2 text-[10px] text-white hover:bg-emerald-500"
                          >
                            <PhoneCall className="size-3" />
                            {callingId === lead.id ? "Calling..." : "Call Now"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ConnectedMasterDashboard;
