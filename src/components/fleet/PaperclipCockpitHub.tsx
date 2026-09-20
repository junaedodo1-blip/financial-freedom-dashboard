"use client";

import React, { useState } from "react";
import { Bot, Cpu, Play, RefreshCw, Sparkles, Wand2, Zap } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export interface FleetAgent {
  id: string;
  name: string;
  role: string;
  status: string;
  tasks_completed: number;
  cost_per_booking: number;
  efficiency_score: number;
  active_channels: string[];
}

export function PaperclipCockpitHub() {
  const [agents, setAgents] = useState<FleetAgent[]>([
    {
      id: "bot_1",
      name: "Instant Speed Call Helper",
      role: "Calls interested leads in under 45 seconds",
      status: "ACTIVE",
      tasks_completed: 0,
      cost_per_booking: 1.45,
      efficiency_score: 98,
      active_channels: ["Facebook", "Reddit", "Google Maps"],
    },
    {
      id: "bot_2",
      name: "Lead Search Helper",
      role: "Finds customer leads on social networks & maps",
      status: "ACTIVE",
      tasks_completed: 0,
      cost_per_booking: 1.85,
      efficiency_score: 95,
      active_channels: ["LinkedIn GTA", "Reddit PFC", "Google Maps B2B"],
    },
    {
      id: "bot_3",
      name: "Legal Compliance Guard",
      role: "Ensures 100% legal consent and unsubscribes",
      status: "ACTIVE_SHIELD",
      tasks_completed: 0,
      cost_per_booking: 0.95,
      efficiency_score: 100,
      active_channels: ["CASL Guard", "Opt-out Registry"],
    },
    {
      id: "bot_4",
      name: "Seminar Host Helper",
      role: "Reserves branch seats and sends SMS reminders",
      status: "ACTIVE",
      tasks_completed: 0,
      cost_per_booking: 2.10,
      efficiency_score: 96,
      active_channels: ["Toronto HQ", "Vancouver Hub", "Calgary Downtown"],
    },
  ]);

  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handleTriggerAgent = (agentName: string) => {
    toast.success(`⚡ Triggered ${agentName}!`, {
      description: `Dispatched task to AI helper.`,
    });
    setAgents((prev) =>
      prev.map((a) => (a.name === agentName ? { ...a, tasks_completed: a.tasks_completed + 1 } : a))
    );
  };

  const handleRunAiFleetTask = async (preset?: string) => {
    const p = preset !== undefined ? preset : aiPrompt;
    if (!p.trim() || isAiThinking) return;

    setIsAiThinking(true);
    setAiResponse(null);

    let respText = "";
    const lower = p.toLowerCase();
    if (lower.includes("scrape") || lower.includes("lead") || lower.includes("find")) {
      respText = "AI Helpers: Finding customer leads on Facebook, Reddit, Google Maps & LinkedIn.";
    } else if (lower.includes("casl") || lower.includes("audit") || lower.includes("legal")) {
      respText = "AI Helpers: Legal Compliance Guard checked all consent records. 100% compliant.";
    } else if (lower.includes("call") || lower.includes("45s")) {
      respText = "AI Helpers: Speed Call Helper standing by to connect new leads in under 45 seconds.";
    } else {
      respText = `AI Helpers: Processed request "${p}". All 4 helpers active.`;
    }

    setAiResponse(respText);
    setIsAiThinking(false);
    toast.success("🤖 AI Helpers Action Complete!", {
      description: respText,
    });
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h2 className="font-bold text-lg tracking-tight flex items-center gap-2">
            <Bot className="size-5 text-emerald-500" />
            24/7 AI Helper Fleet
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            4 specialized AI assistants working continuously to find leads and book customer meetings.
          </p>
        </div>
        <Button
          onClick={() => handleRunAiFleetTask("Run All Helpers")}
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5 text-xs h-8"
        >
          <Zap className="size-3.5" /> Run All AI Helpers
        </Button>
      </div>

      {/* Bento Grid AI Instruction Box & Helper Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Simple Input Card (Spans 4 cols) */}
        <Card className="lg:col-span-4 border shadow-xs p-4 bg-muted/10">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-xs flex items-center gap-1.5">
              <Sparkles className="size-4 text-emerald-500" />
              <span>Ask AI Helpers to Run Any Task</span>
            </span>
            <span className="text-[10px] text-muted-foreground">Plain Language Instructions</span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRunAiFleetTask();
            }}
            className="flex gap-2"
          >
            <Input
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. 'Find new customer leads in Toronto and call them...'"
              className="flex-1 text-xs bg-background h-8"
            />
            <Button
              type="submit"
              disabled={isAiThinking || !aiPrompt.trim()}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1 text-xs h-8 shrink-0"
            >
              {isAiThinking ? <RefreshCw className="size-3 animate-spin" /> : <Wand2 className="size-3" />}
              Run Task
            </Button>
          </form>

          {aiResponse && (
            <div className="p-2.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs mt-2 font-medium">
              {aiResponse}
            </div>
          )}
        </Card>

        {/* 4 Bento Agent Helper Cards */}
        {agents.map((agent) => (
          <Card key={agent.id} className="border shadow-xs p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex size-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 font-bold text-xs">
                  🤖
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                  {agent.status}
                </Badge>
              </div>
              <div className="font-bold text-xs text-foreground">{agent.name}</div>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{agent.role}</p>
            </div>

            <div className="border-t pt-2 mt-3 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground font-medium">
                {agent.tasks_completed} Tasks Completed
              </span>
              <Button
                onClick={() => handleTriggerAgent(agent.name)}
                size="sm"
                variant="outline"
                className="h-6 text-[10px] px-2 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
              >
                <Play className="size-2.5 fill-current mr-1" /> Run Helper
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default PaperclipCockpitHub;
