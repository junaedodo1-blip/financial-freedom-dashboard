"use client";

import React, { useState } from "react";
import {
  Banknote,
  Building2,
  Calculator,
  CheckCircle2,
  DollarSign,
  GraduationCap,
  MapPin,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function FreedomCalculatorHub() {
  const [monthlyIncome, setMonthlyIncome] = useState("15000");
  const [monthlyExpenses, setMonthlyExpenses] = useState("9500");
  const [targetIncome, setTargetIncome] = useState("18000");
  const [city, setCity] = useState("Toronto");

  const [calculationResult, setCalculationResult] = useState<{
    freedom_gap: number;
    months_to_freedom: number;
    recommended_strategy: string;
    suggested_workshop: string;
  } | null>({
    freedom_gap: 3000,
    months_to_freedom: 36,
    recommended_strategy: "High-Yield HoldCo Section 85 Rollover & Tax Sheltering",
    suggested_workshop: "Toronto Bay St HQ Executive Masterclass",
  });

  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    const inc = parseFloat(monthlyIncome) || 0;
    const exp = parseFloat(monthlyExpenses) || 0;
    const tgt = parseFloat(targetIncome) || 0;

    const gap = Math.max(tgt - (inc - exp), 0);
    const months = gap > 0 ? Math.min(Math.round(gap / 80), 60) : 12;

    setTimeout(() => {
      setIsCalculating(false);
      setCalculationResult({
        freedom_gap: gap,
        months_to_freedom: months,
        recommended_strategy: `${city} High-Yield Corporate Tax Sheltering & HoldCo Rollover`,
        suggested_workshop: `${city} Branch Physical Masterclass Session`,
      });
      toast.success("🎯 Freedom Gap Calculation Complete!", {
        description: `Calculated $${gap.toLocaleString()}/mo Freedom Gap. Matched with ${city} branch coach.`,
      });
    }, 400);
  };

  return (
    <div className="relative min-h-screen space-y-8 bg-slate-950 p-6 text-slate-100">
      {/* Impeccable Blue/Emerald Radial Glow Backdrops */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* Header Banner */}
      <div className="relative flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 ring-1 ring-blue-500/30">
              <Banknote className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-white">
                  Freedom Gap Calculator
                </h1>
                <Badge className="bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/40">
                  Embeddable Lead Magnet
                </Badge>
              </div>
              <p className="mt-1 text-sm text-slate-400">
                Interactive financial freedom calculator for high earners ($150k+). Calculates monthly freedom gap and matches prospect with local Canadian branch coaches.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Input Form Card */}
        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-white">
                  Prospect Financial Profile
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Enter monthly income, expenses, and target passive income.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCalculate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Target Branch City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Toronto">Toronto (M5V - Bay St HQ)</option>
                  <option value="Vancouver">Vancouver (V6B - Burrard Hub)</option>
                  <option value="Calgary">Calgary (T2P - Downtown Center)</option>
                  <option value="Montreal">Montreal (H3B - Centre-Ville)</option>
                  <option value="Ottawa">Ottawa (K1P - Capital Hub)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Monthly Active Income ($ CAD)
                </label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className="border-slate-800 bg-slate-950 pl-9 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Monthly Expenses ($ CAD)
                </label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    type="number"
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(e.target.value)}
                    className="border-slate-800 bg-slate-950 pl-9 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Target Passive Freedom Income ($ CAD/month)
                </label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    type="number"
                    value={targetIncome}
                    onChange={(e) => setTargetIncome(e.target.value)}
                    className="border-slate-800 bg-slate-950 pl-9 text-white"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isCalculating}
                className="w-full bg-blue-600 text-white hover:bg-blue-500"
              >
                {isCalculating ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Calculate Freedom Gap
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Output Card */}
        {calculationResult && (
          <Card className="relative overflow-hidden border-blue-500/30 bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 shadow-2xl backdrop-blur-xl">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-500/10 blur-2xl" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-white">
                    Freedom Gap Analysis
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Calculated for {city} high-earner prospect profile.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-xl border border-blue-500/30 bg-slate-950/80 p-5 text-center space-y-2">
                <span className="text-xs uppercase tracking-wider text-slate-400">
                  Monthly Freedom Gap
                </span>
                <div className="text-4xl font-extrabold text-emerald-400">
                  ${calculationResult.freedom_gap.toLocaleString()}{" "}
                  <span className="text-base text-slate-400 font-normal">/ mo</span>
                </div>
                <p className="text-xs text-slate-400">
                  Estimated Timeline to Passive Income Freedom:{" "}
                  <strong className="text-white">{calculationResult.months_to_freedom} Months</strong>
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 space-y-1">
                  <span className="font-bold text-blue-300 flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" /> Recommended Strategy
                  </span>
                  <p className="text-slate-300">{calculationResult.recommended_strategy}</p>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 space-y-1">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5" /> Matched Physical Workshop
                  </span>
                  <p className="text-slate-300">{calculationResult.suggested_workshop}</p>
                </div>
              </div>

              <Button
                onClick={() =>
                  toast.success("Coach Meeting Scheduled!", {
                    description: `Matched lead with senior branch coach in ${city}. SMS invite sent under CASL shield.`,
                  })
                }
                className="w-full bg-emerald-600 text-white hover:bg-emerald-500"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" /> Book Strategy Call with {city} Coach
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
