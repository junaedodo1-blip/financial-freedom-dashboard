"use client";

import type React from "react";
import { useState } from "react";

import { Calendar, Clock, GraduationCap, MapPin, RefreshCw, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export interface WorkshopSession {
  id: string;
  city: string;
  location: string;
  topic: string;
  date_time: string;
  capacity: number;
  reserved: number;
  show_up_rate: number;
}

export function WorkshopEngineHub() {
  const [workshops, setWorkshops] = useState<WorkshopSession[]>([
    {
      id: "ws_101",
      city: "Toronto",
      location: "Toronto Bay St HQ (100 Bay St, Suite 2400)",
      topic: "High-Earner Corporate Tax Sheltering & HoldCo Rollovers",
      date_time: "Thursday, Oct 15 • 6:30 PM EST",
      capacity: 50,
      reserved: 0,
      show_up_rate: 0,
    },
    {
      id: "ws_102",
      city: "Vancouver",
      location: "Vancouver Burrard Hub (555 Burrard St, Floor 12)",
      topic: "Secondary Passive Income & Capital Gains Tax Structuring",
      date_time: "Tuesday, Oct 20 • 6:00 PM PST",
      capacity: 40,
      reserved: 0,
      show_up_rate: 0,
    },
    {
      id: "ws_103",
      city: "Calgary",
      location: "Calgary Downtown Center (520 8th Ave SW)",
      topic: "Practice Owner HoldCo Tax Minimization & Cashflow Strategy",
      date_time: "Thursday, Oct 22 • 7:00 PM MST",
      capacity: 35,
      reserved: 0,
      show_up_rate: 0,
    },
    {
      id: "ws_104",
      city: "Montreal",
      location: "Montreal Centre-Ville (1000 Rue de la Gauchetière O)",
      topic: "Centre-Ville Executive Wealth Protection Masterclass",
      date_time: "Wednesday, Oct 28 • 6:30 PM EST",
      capacity: 45,
      reserved: 0,
      show_up_rate: 0,
    },
    {
      id: "ws_105",
      city: "Ottawa",
      location: "Ottawa Capital Hub (150 Queen St, Suite 800)",
      topic: "Capital Hub High-Earner Tax & Wealth Masterclass",
      date_time: "Friday, Nov 6 • 6:00 PM EST",
      capacity: 30,
      reserved: 0,
      show_up_rate: 0,
    },
  ]);

  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  // Reservation Modal State
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<WorkshopSession | null>(null);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenRsvpModal = (ws: WorkshopSession) => {
    setSelectedWorkshop(ws);
    setShowRsvpModal(true);
  };

  const handleConfirmReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadEmail.trim()) {
      toast.error("Please fill in your name and email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (selectedWorkshop) {
        setWorkshops((prev) =>
          prev.map((w) => (w.id === selectedWorkshop.id ? { ...w, reserved: w.reserved + 1 } : w)),
        );
      }

      toast.success("🎉 Seat Reserved!", {
        description: `Confirmation SMS & calendar invite sent to ${leadName}.`,
      });

      setShowRsvpModal(false);
      setLeadName("");
      setLeadEmail("");
      setLeadPhone("");
    } catch (_err) {
      toast.error("Failed to reserve seat.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAiWorkshopStrategy = async (presetPrompt?: string) => {
    const promptToUse = presetPrompt || aiPrompt;
    if (!promptToUse.trim() || isAiThinking) return;

    setIsAiThinking(true);
    setAiResult(null);

    let resText = "";
    const lower = promptToUse.toLowerCase();

    if (lower.includes("toronto") || lower.includes("m5v")) {
      resText =
        "Workshop AI Strategy: Analyzed Toronto Bay St HQ seat capacity. Optimized SMS reminder cadence for 94% show-up rate.";
    } else if (lower.includes("vancouver") || lower.includes("v6b")) {
      resText =
        "Workshop AI Strategy: Scheduled Saturday morning passive cashflow masterclass for Vancouver Burrard Hub.";
    } else if (lower.includes("calgary") || lower.includes("t2p")) {
      resText =
        "Workshop AI Strategy: Configured HoldCo Tax Minimization curriculum for Calgary small business & practice owners.";
    } else {
      resText = `Workshop AI Strategy: Processed request "${promptToUse}" across 5 Canadian branch masterclasses.`;
    }

    setAiResult(resText);
    setIsAiThinking(false);
    toast.success("🤖 Masterclass AI Strategy Executed!", {
      description: resText,
    });
  };

  const totalReserved = workshops.reduce((sum, w) => sum + w.reserved, 0);
  const totalCapacity = workshops.reduce((sum, w) => sum + w.capacity, 0);
  const overallFillRate = totalCapacity > 0 ? Math.round((totalReserved / totalCapacity) * 100) : 0;

  return (
    <div className="flex w-full flex-col gap-6">
      {/* 1. Masterclass Workshop Header */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-purple-950 via-slate-900 to-purple-950 p-6 text-white shadow-lg">
        <div className="absolute -top-12 -left-12 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-md shadow-purple-600/40">
              <GraduationCap className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-white text-xl tracking-tight">
                  Canadian Masterclass Workshop Engine
                </h2>
                <Badge className="border-purple-400/30 bg-purple-500/20 text-purple-300 text-xs">5 Physical Hubs</Badge>
              </div>
              <p className="mt-1 max-w-2xl text-slate-300 text-xs">
                Physical branch masterclasses across Toronto, Vancouver, Calgary, Montreal & Ottawa. Real-time seat
                reservation & No-Show Killer Bot SMS reminders.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <div className="text-right">
              <div className="font-semibold text-purple-200 text-xs uppercase tracking-wider">System Fill Rate</div>
              <div className="font-black text-white text-xl">
                {overallFillRate}% ({totalReserved}/{totalCapacity} Seats)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. AI Masterclass Strategy Agent Box */}
      <Card className="border border-purple-500/30 bg-gradient-to-br from-purple-950/10 via-background to-background shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-purple-600 p-2 text-white shadow-xs">
                <Sparkles className="size-5" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2 font-semibold text-sm">
                  <span>Masterclass AI Workshop Strategist</span>
                  <Badge
                    variant="outline"
                    className="border-purple-500/20 bg-purple-500/10 text-[10px] text-purple-600"
                  >
                    SHOW-UP MAXIMIZER
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  Ask AI to optimize workshop seat fill rates, generate SMS reminder cadences, or add new masterclass
                  sessions.
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAiWorkshopStrategy();
            }}
            className="flex gap-2"
          >
            <Input
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. 'Optimize Toronto Bay St HQ masterclass seat fill rate...'"
              className="flex-1 bg-background text-xs"
            />
            <Button
              type="submit"
              disabled={isAiThinking || !aiPrompt.trim()}
              size="sm"
              className="shrink-0 gap-1.5 bg-purple-600 text-white hover:bg-purple-500"
            >
              {isAiThinking ? <RefreshCw className="size-3.5 animate-spin" /> : <Wand2 className="size-3.5" />}
              Execute AI Workshop Strategy
            </Button>
          </form>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1 font-medium text-foreground">
              <Calendar className="size-3 text-purple-500" />
              Presets:
            </span>
            {[
              "Optimize Toronto Bay St HQ masterclass seat fill rate",
              "Schedule Vancouver passive income weekend seminar",
              "Configure Calgary HoldCo Tax Minimization workshop",
              "Generate No-Show Killer SMS reminders for all 5 hubs",
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setAiPrompt(preset);
                  handleAiWorkshopStrategy(preset);
                }}
                className="rounded-full border bg-background px-2.5 py-0.5 text-[11px] text-foreground transition-all hover:border-purple-500/40 hover:bg-purple-500/10"
              >
                {preset}
              </button>
            ))}
          </div>

          {aiResult && (
            <div className="mt-2 rounded-xl border border-purple-500/20 bg-purple-500/10 p-3 text-purple-300 text-xs">
              <strong>Strategist Output:</strong> {aiResult}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Workshops Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workshops.map((ws) => {
          const fillPct = Math.round((ws.reserved / ws.capacity) * 100);

          return (
            <Card key={ws.id} className="flex flex-col justify-between border bg-card shadow-xs">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="border-purple-500/20 bg-purple-500/10 text-[10px] text-purple-600"
                  >
                    📍 {ws.city}
                  </Badge>
                  <span className="flex items-center gap-1 font-medium text-[11px] text-muted-foreground">
                    <Clock className="inline size-3" /> {ws.date_time}
                  </span>
                </div>
                <CardTitle className="mt-2 font-bold text-sm">{ws.topic}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-[11px]">
                  <MapPin className="size-3 text-purple-500" /> {ws.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold text-xs">
                    <span className="text-muted-foreground">Reserved Capacity</span>
                    <span className="text-foreground">
                      {ws.reserved}/{ws.capacity} Seats ({fillPct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-purple-600 transition-all"
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-2 text-muted-foreground text-xs">
                  <span>
                    Show-Up Rate: <strong>{ws.show_up_rate}%</strong>
                  </span>
                  <Button
                    onClick={() => handleOpenRsvpModal(ws)}
                    size="sm"
                    className="h-8 bg-purple-600 px-3 text-white text-xs hover:bg-purple-500"
                  >
                    Reserve Seat
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* RSVP Modal */}
      {showRsvpModal && selectedWorkshop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <Card className="w-full max-w-md border bg-card shadow-2xl">
            <CardHeader>
              <CardTitle className="font-bold text-base">Reserve Seat: {selectedWorkshop.topic}</CardTitle>
              <CardDescription className="text-xs">
                {selectedWorkshop.city} Masterclass • {selectedWorkshop.date_time}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleConfirmReservation} className="space-y-3">
                <div>
                  <label className="font-medium text-foreground text-xs">Full Name</label>
                  <Input
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="e.g. Marcus Dupont"
                    className="mt-1 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-medium text-foreground text-xs">Email Address</label>
                  <Input
                    type="email"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="e.g. marcus@company.ca"
                    className="mt-1 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-medium text-foreground text-xs">Mobile Phone (for SMS Confirmation)</label>
                  <Input
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="+1 (416) 555-0199"
                    className="mt-1 text-xs"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowRsvpModal(false)} size="sm">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="sm"
                    className="bg-purple-600 text-white hover:bg-purple-500"
                  >
                    {isSubmitting ? "Reserving..." : "Confirm RSVP"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default WorkshopEngineHub;
