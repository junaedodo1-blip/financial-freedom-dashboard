"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  IconActivity,
  IconArrowUpRight,
  IconChartBar,
  IconBuilding,
  IconCalendarEvent,
  IconCurrencyDollar,
  IconGlobe,
  IconMapPin,
  IconPhoneCall,
  IconRadar,
  IconShieldCheck,
  IconTarget,
  IconTrendingUp,
  IconUserCheck,
  IconUsers,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { TablerCard } from "@/components/ui/tabler-card";

export function RealDashboardAnalyticsHub() {
  const [loading, setLoading] = useState(false);
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
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <IconTrendingUp className="h-3.5 w-3.5" />
            ANALYTICS
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Analytics &amp; Numbers</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Simple view of your leads, calls, and sales numbers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/crm">
            <Button size="sm" variant="outline" className="text-xs">
              <IconUsers className="h-4 w-4 mr-1.5" />
              Open CRM
            </Button>
          </Link>
        </div>
      </div>

      {/* Simple Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <TablerCard statusColor="emerald">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Leads Scraped</span>
          <div className="mt-2 text-2xl font-bold">{metrics.totalLeads}</div>
        </TablerCard>

        <TablerCard statusColor="blue">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Verified Calls</span>
          <div className="mt-2 text-2xl font-bold">{metrics.caslVerified}%</div>
        </TablerCard>

        <TablerCard statusColor="purple">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Seats Filled</span>
          <div className="mt-2 text-2xl font-bold">{metrics.workshopCapacityPct}%</div>
        </TablerCard>

        <TablerCard statusColor="amber">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Calls Made</span>
          <div className="mt-2 text-2xl font-bold">{metrics.bookedCalls}</div>
        </TablerCard>

        <TablerCard statusColor="indigo">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Total Gap</span>
          <div className="mt-2 text-2xl font-bold">{metrics.pipelineAum}</div>
        </TablerCard>
      </div>

      {/* Traffic Table Card */}
      <TablerCard
        headerTitle="🌐 Traffic Overview"
        headerDescription="Clean slate — traffic numbers will update automatically"
      >
        <div className="py-10 text-center text-muted-foreground">
          <IconGlobe className="mx-auto h-8 w-8 opacity-30" />
          <p className="mt-2 text-xs font-semibold">No traffic recorded yet</p>
          <p className="text-[11px] text-muted-foreground max-w-xs mx-auto mt-1">
            Metrics update automatically as people visit your app.
          </p>
        </div>
      </TablerCard>
    </div>
  );
}
