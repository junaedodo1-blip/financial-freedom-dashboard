"use client";

import { useEffect, useState } from "react";

import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bot,
  Building2,
  Flame,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { AnalyticsKpiStrip } from "@/app/(main)/dashboard/analytics/_components/analytics-kpi-strip";
import { RealtimeVisitors } from "@/app/(main)/dashboard/analytics/_components/realtime-visitors";
import { TopPages } from "@/app/(main)/dashboard/analytics/_components/top-pages";
import { TopTrafficSources } from "@/app/(main)/dashboard/analytics/_components/top-traffic-sources";
import { TrafficQuality } from "@/app/(main)/dashboard/analytics/_components/traffic-quality";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "@/styles/flag-icons/flags.css";

export function RealDashboardAnalyticsHub() {
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    caslVerified: 0,
    workshopCapacityPct: 0,
    bookedCalls: 0,
    pipelineAum: "$0.00",
  });

  const fetchLiveMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/branches");
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
      console.warn("Analytics API fetch notice (using clean baseline):", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveMetrics();
  }, [fetchLiveMetrics]);

  return (
    <div className="flex flex-col gap-6">
      {/* Live System Data Ribbon */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-card to-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between font-normal text-muted-foreground text-xs">
              <span>Scraped Lead Radar</span>
              <Users className="h-4 w-4 text-blue-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{metrics.totalLeads.toLocaleString()}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-zinc-400">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>Clean Slate (0.0%)</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-card to-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between font-normal text-muted-foreground text-xs">
              <span>CASL Shield Rate</span>
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">0.0%</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-zinc-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{metrics.caslVerified} Validated</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-card to-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between font-normal text-muted-foreground text-xs">
              <span>Workshop Capacity</span>
              <Building2 className="h-4 w-4 text-amber-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{metrics.workshopCapacityPct}%</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-zinc-400">
              <Flame className="h-3.5 w-3.5" />
              <span>0 Hubs Filled</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-card to-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between font-normal text-muted-foreground text-xs">
              <span>Strategy Calls</span>
              <Bot className="h-4 w-4 text-purple-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{metrics.bookedCalls}</div>
            <div className="mt-1 flex items-center gap-1 text-purple-400 text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>&lt;45s Speed-to-Lead</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-600/10 via-card to-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between font-normal text-muted-foreground text-xs">
              <span>Pipeline AUM</span>
              <Activity className="h-4 w-4 text-emerald-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-emerald-400">{metrics.pipelineAum}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-zinc-400">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>Clean Slate</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Toolbar Header */}
      <div className="flex items-center justify-between rounded-xl border bg-muted/40 p-3">
        <div>
          <h3 className="flex items-center gap-2 font-semibold text-sm">
            <BarChart3 className="h-4 w-4 text-primary" />
            Full Dashboard Analytics & Traffic Insights
          </h3>
          <p className="text-muted-foreground text-xs">
            Real-time conversion breakdown, visitor quality, and top lead acquisition channels.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={fetchLiveMetrics} disabled={loading} className="gap-1.5 text-xs">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Sync Live Data
        </Button>
      </div>

      {/* Template Analytics Widgets connected with Live Data */}
      <AnalyticsKpiStrip />

      <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <TrafficQuality />
        </div>
        <div className="xl:col-span-5">
          <RealtimeVisitors />
        </div>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <TopPages />
        </div>
        <div className="xl:col-span-5">
          <TopTrafficSources />
        </div>
      </div>
    </div>
  );
}
