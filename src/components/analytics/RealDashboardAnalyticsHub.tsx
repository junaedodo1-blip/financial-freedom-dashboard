"use client";

import { useCallback, useEffect, useState } from "react";

import Link from "next/link";

import { IconGlobe, IconTrendingUp, IconUsers } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { TablerCard } from "@/components/ui/tabler-card";

export function RealDashboardAnalyticsHub() {
  const [_loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    caslVerified: 0,
    workshopCapacityPct: 0,
    bookedCalls: 0,
    pipelineAum: "$0.00",
  });

  const fetchLiveMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/branches");
      if (res.ok) {
        const branches = await res.json();
        if (branches && branches.length > 0) {
          const totalCalls = branches.reduce((acc: number, b: any) => acc + (b.daily_calls || 0), 0);
          setMetrics((prev) => ({
            ...prev,
            bookedCalls: totalCalls,
          }));
        }
      }
    } catch (e) {
      console.warn("Analytics fetch notice:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveMetrics();
  }, [fetchLiveMetrics]);

  return (
    <div className="flex flex-col gap-6 p-1">
      {/* Simple Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-400 text-xs">
            <IconTrendingUp className="h-3.5 w-3.5" />
            ANALYTICS
          </div>
          <h1 className="mt-2 font-bold text-2xl tracking-tight">Analytics &amp; Numbers</h1>
          <p className="mt-1 text-muted-foreground text-xs">Simple view of your leads, calls, and sales numbers.</p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/crm">
            <Button size="sm" variant="outline" className="text-xs">
              <IconUsers className="mr-1.5 h-4 w-4" />
              Open CRM
            </Button>
          </Link>
        </div>
      </div>

      {/* Simple Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <TablerCard statusColor="emerald">
          <span className="font-semibold text-[10px] text-muted-foreground uppercase">Leads Scraped</span>
          <div className="mt-2 font-bold text-2xl">{metrics.totalLeads}</div>
        </TablerCard>

        <TablerCard statusColor="blue">
          <span className="font-semibold text-[10px] text-muted-foreground uppercase">Verified Calls</span>
          <div className="mt-2 font-bold text-2xl">{metrics.caslVerified}%</div>
        </TablerCard>

        <TablerCard statusColor="purple">
          <span className="font-semibold text-[10px] text-muted-foreground uppercase">Seats Filled</span>
          <div className="mt-2 font-bold text-2xl">{metrics.workshopCapacityPct}%</div>
        </TablerCard>

        <TablerCard statusColor="amber">
          <span className="font-semibold text-[10px] text-muted-foreground uppercase">Calls Made</span>
          <div className="mt-2 font-bold text-2xl">{metrics.bookedCalls}</div>
        </TablerCard>

        <TablerCard statusColor="indigo">
          <span className="font-semibold text-[10px] text-muted-foreground uppercase">Total Gap</span>
          <div className="mt-2 font-bold text-2xl">{metrics.pipelineAum}</div>
        </TablerCard>
      </div>

      {/* Traffic Table Card */}
      <TablerCard
        headerTitle="🌐 Traffic Overview"
        headerDescription="Clean slate — traffic numbers will update automatically"
      >
        <div className="py-10 text-center text-muted-foreground">
          <IconGlobe className="mx-auto h-8 w-8 opacity-30" />
          <p className="mt-2 font-semibold text-xs">No traffic recorded yet</p>
          <p className="mx-auto mt-1 max-w-xs text-[11px] text-muted-foreground">
            Metrics update automatically as people visit your app.
          </p>
        </div>
      </TablerCard>
    </div>
  );
}
