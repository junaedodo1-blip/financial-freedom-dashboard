"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  IconActivity,
  IconArrowRight,
  IconBolt,
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandReddit,
  IconCheck,
  IconFlame,
  IconLock,
  IconMapPin,
  IconPlayerPlay,
  IconRadar,
  IconShieldCheck,
  IconSparkles,
  IconTarget,
  IconUserCheck,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { TablerCard } from "@/components/ui/tabler-card";

const MAX_LEAD_LIMIT = 10;

interface ScraperChannel {
  id: string;
  name: string;
  icon: any;
  platform: string;
  count: number;
  status: "active" | "idle" | "running";
}

export function AppleIntentLeadsHub() {
  const [selectedCity, setSelectedCity] = useState("Toronto");
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [intentThreshold, setIntentThreshold] = useState(80);
  const [currentLeadCount, setCurrentLeadCount] = useState(0);
  const [channels, setChannels] = useState<ScraperChannel[]>([
    { id: "fb", name: "Facebook Groups", icon: IconBrandFacebook, platform: "Facebook", count: 0, status: "idle" },
    { id: "reddit", name: "Reddit Posts", icon: IconBrandReddit, platform: "Reddit", count: 0, status: "idle" },
    { id: "gmaps", name: "Google Businesses", icon: IconMapPin, platform: "Google Maps", count: 0, status: "idle" },
    { id: "linkedin", name: "LinkedIn People", icon: IconBrandLinkedin, platform: "LinkedIn", count: 0, status: "idle" },
  ]);

  useEffect(() => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setCurrentLeadCount(data.length);
        }
      })
      .catch(() => {});
  }, []);

  const isLimitReached = currentLeadCount >= MAX_LEAD_LIMIT;

  const handleRunAllScrapers = async () => {
    if (isLimitReached) {
      toast.error(`🔒 Maximum limit of ${MAX_LEAD_LIMIT} leads reached!`, {
        description: "Admin cap active. Contact admin to increase limit.",
      });
      return;
    }

    setIsRunningAll(true);
    setChannels((prev) => prev.map((c) => ({ ...c, status: "running" })));

    toast.info("⚡ Searching...", {
      description: `Searching Facebook, Reddit, Google, and LinkedIn in ${selectedCity}...`,
    });

    try {
      const res = await fetch("/api/scrapers/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: selectedCity,
          current_count: currentLeadCount,
          intent_threshold: intentThreshold,
        }),
      });

      if (res.status === 429) {
        toast.error(`🔒 Maximum limit of ${MAX_LEAD_LIMIT} leads reached!`);
        setIsRunningAll(false);
        setChannels((prev) => prev.map((c) => ({ ...c, status: "idle" })));
        return;
      }

      if (res.ok) {
        setTimeout(() => {
          setIsRunningAll(false);
          setChannels((prev) =>
            prev.map((c) => ({
              ...c,
              status: "active",
              count: 0,
            }))
          );
          toast.success("🎯 Search Complete!");
        }, 1500);
      }
    } catch (_err) {
      setIsRunningAll(false);
      setChannels((prev) => prev.map((c) => ({ ...c, status: "idle" })));
      toast.error("Search failed");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-1">
      {/* Simple Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
            <IconRadar className="h-3.5 w-3.5" />
            FIND LEADS
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Find Leads</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Search social media and business sites to find new people to call.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/crm">
            <Button size="sm" variant="outline" className="text-xs">
              <IconUserCheck className="h-4 w-4 mr-1.5" />
              Open CRM
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={handleRunAllScrapers}
            disabled={isRunningAll || isLimitReached}
            className={`font-semibold text-xs ${
              isLimitReached
                ? "bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-700"
                : "bg-amber-500 text-black hover:bg-amber-400"
            }`}
          >
            {isLimitReached ? (
              <>
                <IconLock className="h-4 w-4 mr-1 text-amber-400" />
                10/10 Limit Reached
              </>
            ) : (
              <>
                <IconPlayerPlay className={`h-4 w-4 mr-1.5 ${isRunningAll ? "animate-spin" : ""}`} />
                {isRunningAll ? "Searching..." : "⚡ Start Lead Search"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Admin Limiter Notice Banner */}
      {isLimitReached && (
        <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs font-semibold text-amber-400">
          <div className="flex items-center gap-2">
            <IconLock className="h-4 w-4 text-amber-400" />
            <span>🔒 Maximum Lead Limit Active: 10/10 Leads Found. Admin lock active.</span>
          </div>
          <span className="text-[10px] text-amber-300 font-normal font-mono">MAX_LEAD_LIMIT = 10</span>
        </div>
      )}

      {/* Search Controls */}
      <TablerCard statusColor="purple" headerTitle="⚙️ Search Options">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Select City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full rounded-lg border border-border/60 bg-muted/30 p-2 text-xs font-semibold outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="Toronto">Toronto</option>
              <option value="Vancouver">Vancouver</option>
              <option value="Calgary">Calgary</option>
              <option value="Montreal">Montreal</option>
              <option value="Ottawa">Ottawa</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Min. Intent Score
              </label>
              <span className="text-xs font-bold text-amber-500">{intentThreshold}/100</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={intentThreshold}
              onChange={(e) => setIntentThreshold(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Admin Lead Limiter
            </label>
            <div className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-xs font-semibold text-amber-400">
              <span className="flex items-center gap-1.5">
                <IconLock className="h-4 w-4" />
                Limit Active
              </span>
              <span>{currentLeadCount} / {MAX_LEAD_LIMIT} Max</span>
            </div>
          </div>
        </div>
      </TablerCard>

      {/* Simple Platforms Grid */}
      <div>
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
          <IconBolt className="h-4 w-4 text-purple-500" />
          Where We Search
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((ch) => {
            const IconComp = ch.icon;
            return (
              <TablerCard key={ch.id} statusColor={ch.status === "running" ? "amber" : "purple"}>
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-purple-500/10 p-2.5 text-purple-500">
                    <IconComp className="h-6 w-6" />
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      ch.status === "running"
                        ? "bg-amber-500/20 text-amber-400 animate-pulse"
                        : "bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    {ch.status === "running" ? "Searching..." : "Ready"}
                  </span>
                </div>

                <h3 className="mt-3 font-semibold text-sm">{ch.name}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Searches {ch.platform} in {selectedCity}.
                </p>

                <div className="mt-3 flex items-baseline justify-between border-t border-border/40 pt-2.5">
                  <span className="text-xs text-muted-foreground font-medium">Found</span>
                  <span className="text-lg font-bold">{ch.count}</span>
                </div>
              </TablerCard>
            );
          })}
        </div>
      </div>

      {/* Live Stream Card */}
      <TablerCard
        headerTitle="📡 Live Lead Stream"
        headerDescription="New leads will show up here in real time"
      >
        <div className="py-10 text-center text-muted-foreground">
          <IconRadar className="mx-auto h-8 w-8 opacity-30 animate-spin" />
          <p className="mt-2 text-xs font-semibold">
            {isLimitReached ? "🔒 10/10 Lead Limit Reached" : "Ready to search"}
          </p>
          <p className="text-[11px] text-muted-foreground max-w-xs mx-auto mt-1">
            {isLimitReached
              ? "Maximum cap of 10 leads reached. Admin lock is active."
              : "Click 'Start Lead Search' above to find new people."}
          </p>
        </div>
      </TablerCard>
    </div>
  );
}
