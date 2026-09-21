"use client";

import { useState } from "react";

import { Banknote, Calculator, LineChart } from "lucide-react";

import { FreedomCalculatorHub } from "@/components/calculator/FreedomCalculatorHub";
import { Button } from "@/components/ui/button";

import { BalanceDistributionCard } from "./_components/balance-distribution-card";
import { IncomeBreakdown } from "./_components/income-breakdown";
import { OverviewKpis } from "./_components/overview-kpis";
import { TransactionsOverviewCard } from "./_components/transactions-overview-card";

export default function FinanceDashboardPage() {
  const [activeTab, setActiveTab] = useState<"calculator" | "analytics">("calculator");

  return (
    <div className="flex h-full flex-col gap-4 p-4 md:p-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-bold text-2xl tracking-tight">
            <Banknote className="h-6 w-6 text-emerald-500" />
            Freedom & Finance Hub
          </h1>
          <p className="text-muted-foreground text-sm">
            Calculate client monthly freedom gaps, projected passive income timelines, and branch AUM growth.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-muted p-1">
          <Button
            variant={activeTab === "calculator" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("calculator")}
            className="flex items-center gap-1.5 font-semibold text-xs"
          >
            <Calculator className="h-3.5 w-3.5 text-emerald-400" />
            Freedom Calculator Engine
          </Button>
          <Button
            variant={activeTab === "analytics" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("analytics")}
            className="flex items-center gap-1.5 font-semibold text-xs"
          >
            <LineChart className="h-3.5 w-3.5" />
            AUM & Revenue Analytics
          </Button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === "calculator" ? (
        <div className="min-h-0 flex-1">
          <FreedomCalculatorHub />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-6">
              <OverviewKpis />
            </div>
            <div className="xl:col-span-6">
              <IncomeBreakdown />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <TransactionsOverviewCard />
            </div>
            <div className="xl:col-span-5">
              <BalanceDistributionCard />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
