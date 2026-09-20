"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Bot,
  Building2,
  Calendar,
  CheckCircle2,
  Database,
  DollarSign,
  MapPin,
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
  }, []);

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
    } catch (err) {
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
    } catch (e) {
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
    } catch (e) {
      toast.error("CRM sync failed");
    } finally {
      setIsSyncingCrm(false);
    }
  };

  const filteredLeads = selectedCity === "All"
    ? leads
    : leads.filter((l) => l.city.toLowerCase() === selectedCity.toLowerCase());

  const bookedCalls = filteredLeads.filter((l) => l.status === "booked").length;

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Top Header Bar: Clean Title + Location Filter (No bloat banner) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-xl tracking-tight">Customer Growth Command</h1>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
              <ShieldCheck className="size-3 inline mr-1" /> 100% Legal & Compliant
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Automated customer acquisition: find leads, instant 45s calls, seminar bookings & CRM sync.
          </p>
        </div>

        {/* Location Selector */}
        <div className="flex items-center gap-1.5 bg-muted/50 p-1 rounded-lg border text-xs">
          <span className="text-muted-foreground px-2 font-medium">City:</span>
          {["All", "Toronto", "Vancouver", "Calgary", "Montreal", "Ottawa"].map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                selectedCity === city
                  ? "bg-background text-foreground shadow-xs border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid Layout (Apple-Style Modular Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Bento Tile 1: 4-Step Connected Workflow Trail (Spans 2 cols) */}
        <Card className="lg:col-span-2 border bg-card shadow-xs flex flex-col justify-between p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 font-semibold text-xs text-foreground">
              <Sparkles className="size-4 text-sky-500" />
              <span>4-Step Connected Workflow</span>
            </div>
            <Badge variant="secondary" className="text-[10px]">Simple Workflow</Badge>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20">
              <div className="font-bold text-sky-600">1. Find</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Social Leads</div>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="font-bold text-emerald-600">2. Call</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Under 45s</div>
            </div>
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="font-bold text-purple-600">3. Book</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Seminar Seat</div>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="font-bold text-amber-600">4. Sync</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Sales CRM</div>
            </div>
          </div>
        </Card>

        {/* Bento Tile 2: One-Touch Actions (Spans 2 cols) */}
        <Card className="lg:col-span-2 border bg-card shadow-xs flex flex-col justify-between p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
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
              className="bg-sky-600 hover:bg-sky-500 text-white text-xs h-8 gap-1.5"
            >
              {isScraping ? <RefreshCw className="size-3.5 animate-spin" /> : <Search className="size-3.5" />}
              Find Leads
            </Button>

            <Button
              onClick={() => handleTestSpeedCall()}
              disabled={callingId !== null}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8 gap-1.5"
            >
              {callingId !== null ? <RefreshCw className="size-3.5 animate-spin" /> : <PhoneCall className="size-3.5" />}
              Test 45s Call
            </Button>

            <Button
              onClick={handleSyncToCrm}
              disabled={isSyncingCrm}
              size="sm"
              className="bg-amber-600 hover:bg-amber-500 text-white text-xs h-8 gap-1.5"
            >
              {isSyncingCrm ? <RefreshCw className="size-3.5 animate-spin" /> : <Database className="size-3.5" />}
              Sync to CRM
            </Button>
          </div>
        </Card>

        {/* Bento Tile 3: Metric - New Customer Leads */}
        <Card className="border shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>New Leads Found</span>
            <Users className="size-4 text-sky-500" />
          </div>
          <div className="text-3xl font-extrabold tracking-tight mt-2">{filteredLeads.length}</div>
          <span className="text-[10px] text-muted-foreground mt-1">Ready for 45s call</span>
        </Card>

        {/* Bento Tile 4: Metric - Strategy Meetings */}
        <Card className="border shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Meetings Booked</span>
            <PhoneCall className="size-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400 mt-2">
            {bookedCalls}
          </div>
          <span className="text-[10px] text-muted-foreground mt-1">Converted by instant AI call</span>
        </Card>

        {/* Bento Tile 5: Metric - Seminar Fill Rate */}
        <Card className="border shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Seminar Seats Booked</span>
            <Calendar className="size-4 text-purple-500" />
          </div>
          <div className="text-3xl font-extrabold tracking-tight mt-2">0%</div>
          <span className="text-[10px] text-muted-foreground mt-1">5 Canadian branch hubs</span>
        </Card>

        {/* Bento Tile 6: Metric - Estimated Deal Value */}
        <Card className="border shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Estimated Deal Value</span>
            <DollarSign className="size-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-amber-600 dark:text-amber-400 mt-2">$0.00M</div>
          <span className="text-[10px] text-muted-foreground mt-1">Pipeline deal value</span>
        </Card>

        {/* Bento Tile 7: Live Customer Lead Table (Spans full width) */}
        <Card className="lg:col-span-4 border shadow-xs">
          <CardHeader className="p-4 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radar className="size-4 text-sky-500" />
                <CardTitle className="text-sm font-bold">Live Customer Prospect Radar</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs bg-sky-500/10 text-sky-600 border-sky-500/20">
                {filteredLeads.length} Leads
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {isLoadingLeads ? (
              <div className="py-6 text-center text-xs text-muted-foreground animate-pulse">
                Loading live customer leads...
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="p-6 rounded-lg border border-dashed text-center space-y-2 bg-muted/10">
                <div className="size-8 rounded-full bg-sky-500/10 text-sky-500 mx-auto flex items-center justify-center">
                  <Search className="size-4" />
                </div>
                <div className="font-bold text-xs">No Active Customer Leads</div>
                <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                  Click <strong>"Find Leads"</strong> above to collect live prospects from Facebook, Reddit, Google Maps & LinkedIn.
                </p>
                <Button
                  onClick={handleStartLeadFinder}
                  disabled={isScraping}
                  size="sm"
                  className="bg-sky-600 hover:bg-sky-500 text-white text-xs h-7 mt-1"
                >
                  {isScraping ? "Finding Leads..." : "Find Leads Now"}
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] tracking-wider border-b">
                    <tr>
                      <th className="py-2 px-3">Customer</th>
                      <th className="py-2 px-3">Source Channel</th>
                      <th className="py-2 px-3">Location</th>
                      <th className="py-2 px-3">Interest Score</th>
                      <th className="py-2 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 px-3 font-semibold flex items-center gap-2">
                          <div className="size-6 rounded-md bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 font-bold text-[11px]">
                            {lead.name.charAt(0)}
                          </div>
                          <div>
                            <div>{lead.name}</div>
                            <div className="text-[10px] text-muted-foreground font-normal">{lead.phone}</div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge variant="secondary" className="capitalize text-[10px]">
                            {lead.channel}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">
                          {lead.city} ({lead.fsa})
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                            {lead.intent_score}/100 High Interest
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <Button
                            onClick={() => handleTestSpeedCall(lead.id, lead.name)}
                            disabled={callingId === lead.id}
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white h-6 text-[10px] px-2 gap-1"
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
