"use client";

import { useState } from "react";

import {
  IconBuildingBank,
  IconCalculator,
  IconChartBar,
  IconCurrencyDollar,
  IconInfoCircle,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";

import { FreedomCalculatorHub } from "@/components/calculator/FreedomCalculatorHub";
import { Button } from "@/components/ui/button";
import { TablerCard } from "@/components/ui/tabler-card";

export default function FinanceDashboardPage() {
  const [activeTab, setActiveTab] = useState<"calculator" | "analytics">("calculator");

  return (
    <div className="flex h-full flex-col gap-4 p-4 md:p-6">
      {/* Tabler Header Bar */}
      <div className="flex flex-col gap-3 border-border/60 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <IconBuildingBank className="h-6 w-6 text-emerald-500" />
            Freedom & Finance
          </h1>
          <p className="text-muted-foreground text-xs">Simple calculator and asset overview.</p>
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
          <Button
            variant={activeTab === "calculator" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("calculator")}
            className="flex items-center gap-1.5 font-medium text-xs"
          >
            <IconCalculator className="h-3.5 w-3.5" />
            Freedom Calculator
          </Button>
          <Button
            variant={activeTab === "analytics" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("analytics")}
            className="flex items-center gap-1.5 font-medium text-xs"
          >
            <IconChartBar className="h-3.5 w-3.5" />
            AUM & Revenue Analytics
          </Button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === "calculator" ? (
        <FreedomCalculatorHub />
      ) : (
        <div className="space-y-4">
          {/* Clean Slate Metrics Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <TablerCard statusColor="emerald">
              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground text-xs">Pipeline AUM</span>
                <IconBuildingBank className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="mt-2 font-bold text-2xl">$0.00</div>
              <p className="mt-1 text-[11px] text-muted-foreground">0 client profiles</p>
            </TablerCard>

            <TablerCard statusColor="blue">
              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground text-xs">Monthly Revenue</span>
                <IconCurrencyDollar className="h-4 w-4 text-blue-500" />
              </div>
              <div className="mt-2 font-bold text-2xl">$0.00</div>
              <p className="mt-1 text-[11px] text-muted-foreground">0 bookings</p>
            </TablerCard>

            <TablerCard statusColor="amber">
              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground text-xs">Active Accounts</span>
                <IconUsers className="h-4 w-4 text-amber-500" />
              </div>
              <div className="mt-2 font-bold text-2xl">0</div>
              <p className="mt-1 text-[11px] text-muted-foreground">Clean baseline</p>
            </TablerCard>

            <TablerCard statusColor="purple">
              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground text-xs">Growth Rate</span>
                <IconTrendingUp className="h-4 w-4 text-purple-500" />
              </div>
              <div className="mt-2 font-bold text-2xl">0.0%</div>
              <p className="mt-1 text-[11px] text-muted-foreground">Ready for data</p>
            </TablerCard>
          </div>

          {/* Branch Baseline Table */}
          <TablerCard
            headerTitle="Branch Revenue Overview"
            headerDescription="Clean slate metrics across all locations."
          >
            <div className="divide-y divide-border/40 text-xs">
              {["Toronto", "Vancouver", "Calgary", "Montreal", "Ottawa"].map((branch) => (
                <div key={branch} className="flex items-center justify-between py-2.5">
                  <span className="font-medium">{branch} Branch</span>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">0 Strategy Calls</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">$0.00 AUM</span>
                  </div>
                </div>
              ))}
            </div>
          </TablerCard>

          {/* Data Explanation Card */}
          <TablerCard
            statusColor="indigo"
            headerTitle="How AUM & Revenue Are Calculated"
            headerDescription="Clean explanation of data sources."
          >
            <div className="space-y-3 text-muted-foreground text-xs">
              <div className="flex items-start gap-2.5">
                <IconInfoCircle className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                <div>
                  <strong className="text-foreground">Pipeline AUM (Assets Under Management):</strong>
                  <p className="mt-0.5">
                    Calculated by taking each client profile in your CRM and multiplying their Monthly Freedom Gap by
                    300 (Gap × 12 months × 25 years). As you add real clients, this number automatically updates.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 border-border/30 border-t pt-3">
                <IconCurrencyDollar className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <div>
                  <strong className="text-foreground">Revenue Analytics:</strong>
                  <p className="mt-0.5">
                    Calculated directly from confirmed strategy call bookings and workshop seat reservations. Starts at
                    $0.00 until your first booking is made.
                  </p>
                </div>
              </div>
            </div>
          </TablerCard>
        </div>
      )}
    </div>
  );
}
