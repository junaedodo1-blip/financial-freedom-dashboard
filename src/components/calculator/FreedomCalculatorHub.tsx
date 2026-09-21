"use client";

import type React from "react";
import { useState } from "react";

import {
  IconBuildingBank,
  IconCalculator,
  IconCheck,
  IconCurrencyDollar,
  IconRefresh,
  IconTrendingUp,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TablerCard } from "@/components/ui/tabler-card";
import { ThinkingOrb } from "@/components/ui/thinking-orbs/ThinkingOrb";

export function FreedomCalculatorHub() {
  const [monthlyIncome, setMonthlyIncome] = useState("15000");
  const [monthlyExpenses, setMonthlyExpenses] = useState("9500");
  const [targetIncome, setTargetIncome] = useState("18000");
  const [city, setCity] = useState("Toronto");
  const [isCalculating, setIsCalculating] = useState(false);

  const [calculationResult, setCalculationResult] = useState<{
    freedom_gap: number;
    months_to_freedom: number;
  }>({
    freedom_gap: 3000,
    months_to_freedom: 36,
  });

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    const inc = parseFloat(monthlyIncome) || 0;
    const exp = parseFloat(monthlyExpenses) || 0;
    const tgt = parseFloat(targetIncome) || 0;

    const gap = Math.max(tgt - (inc - exp), 0);
    const months = gap > 0 ? Math.min(Math.round(gap / 100), 60) : 12;

    setTimeout(() => {
      setIsCalculating(false);
      setCalculationResult({
        freedom_gap: gap,
        months_to_freedom: months,
      });
      toast.success("Gap Calculated!", {
        description: `Your monthly gap is $${gap.toLocaleString()}.`,
      });
    }, 200);
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Input Card */}
      <TablerCard
        statusColor="emerald"
        headerTitle="Freedom Calculator"
        headerDescription="Find your monthly money gap in 3 simple steps."
      >
        <form onSubmit={handleCalculate} className="space-y-4">
          <div>
            <label className="mb-1 block font-medium text-muted-foreground text-xs">Branch City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="Toronto">Toronto</option>
              <option value="Vancouver">Vancouver</option>
              <option value="Calgary">Calgary</option>
              <option value="Montreal">Montreal</option>
              <option value="Ottawa">Ottawa</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block font-medium text-muted-foreground text-xs">Money Earned Per Month ($)</label>
            <div className="relative">
              <IconCurrencyDollar className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="pl-8 text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-medium text-muted-foreground text-xs">Money Spent Per Month ($)</label>
            <div className="relative">
              <IconCurrencyDollar className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(e.target.value)}
                className="pl-8 text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-medium text-muted-foreground text-xs">
              Goal Monthly Passive Income ($)
            </label>
            <div className="relative">
              <IconCurrencyDollar className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                value={targetIncome}
                onChange={(e) => setTargetIncome(e.target.value)}
                className="pl-8 text-xs"
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={isCalculating} className="w-full font-medium text-xs" size="sm">
            {isCalculating ? (
              <IconRefresh className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <IconCalculator className="mr-2 h-4 w-4" />
            )}
            Calculate Gap
          </Button>
        </form>
      </TablerCard>

      {/* Result Card */}
      <TablerCard
        statusColor="blue"
        headerTitle="Your Gap Result"
        headerDescription={`Calculated for ${city} branch.`}
        headerAction={
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <ThinkingOrb state="solving" size={28} color="emerald" />
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">AI Solved</span>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-center">
            <span className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">Monthly Gap</span>
            <div className="mt-1 font-bold text-3xl text-emerald-600 dark:text-emerald-400">
              ${calculationResult.freedom_gap.toLocaleString()} / mo
            </div>
            <p className="mt-2 text-muted-foreground text-xs">
              Time to Freedom: <strong className="text-foreground">{calculationResult.months_to_freedom} Months</strong>
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between rounded-md border border-border/40 bg-background p-2.5">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <IconBuildingBank className="h-4 w-4 text-blue-500" /> Assigned Branch
              </span>
              <span className="font-semibold">{city}</span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border/40 bg-background p-2.5">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <IconTrendingUp className="h-4 w-4 text-emerald-500" /> Target Plan
              </span>
              <span className="font-semibold">{city} Asset Strategy</span>
            </div>
          </div>

          <Button
            onClick={() =>
              toast.success("Coach Meeting Booked!", {
                description: `Assigned coach in ${city}.`,
              })
            }
            className="w-full text-xs"
            variant="outline"
            size="sm"
          >
            <IconCheck className="mr-1.5 h-4 w-4 text-emerald-500" /> Book Strategy Call
          </Button>
        </div>
      </TablerCard>
    </div>
  );
}
