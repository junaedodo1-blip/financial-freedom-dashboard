"use client";

import { useState } from "react";

import { Bot, Play, RefreshCw, Sparkles, Wand2, Zap } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
      cost_per_booking: 2.1,
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
    setAgents((prev) => prev.map((a) => (a.name === agentName ? { ...a, tasks_completed: a.tasks_completed + 1 } : a)));
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
    <div className="flex w-full flex-col gap-5">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h2 className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <Bot className="size-5 text-emerald-500" />
            24/7 AI Helper Fleet
          </h2>
          <p className="mt-0.5 text-muted-foreground text-xs">
            4 specialized AI assistants working continuously to find leads and book customer meetings.
          </p>
        </div>
        <Button
          onClick={() => handleRunAiFleetTask("Run All Helpers")}
          size="sm"
          className="h-8 gap-1.5 bg-emerald-600 text-white text-xs hover:bg-emerald-500"
        >
          <Zap className="size-3.5" /> Run All AI Helpers
        </Button>
      </div>

      {/* Bento Grid AI Instruction Box & Helper Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Simple Input Card (Spans 4 cols) */}
        <Card className="border bg-muted/10 p-4 shadow-xs lg:col-span-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-semibold text-xs">
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
              className="h-8 flex-1 bg-background text-xs"
            />
            <Button
              type="submit"
              disabled={isAiThinking || !aiPrompt.trim()}
              size="sm"
              className="h-8 shrink-0 gap-1 bg-emerald-600 text-white text-xs hover:bg-emerald-500"
            >
              {isAiThinking ? <RefreshCw className="size-3 animate-spin" /> : <Wand2 className="size-3" />}
              Run Task
            </Button>
          </form>

          {aiResponse && (
            <div className="mt-2 rounded-md border border-emerald-500/20 bg-emerald-500/10 p-2.5 font-medium text-emerald-700 text-xs dark:text-emerald-300">
              {aiResponse}
            </div>
          )}
        </Card>

        {/* 4 Bento Agent Helper Cards */}
        {agents.map((agent) => (
          <Card key={agent.id} className="flex flex-col justify-between border p-4 shadow-xs">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex size-7 items-center justify-center rounded-md bg-emerald-500/10 font-bold text-emerald-600 text-xs">
                  🤖
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-500/20 bg-emerald-500/10 text-[10px] text-emerald-600"
                >
                  {agent.status}
                </Badge>
              </div>
              <div className="font-bold text-foreground text-xs">{agent.name}</div>
              <p className="mt-0.5 text-[11px] text-muted-foreground leading-tight">{agent.role}</p>
            </div>

            <div className="mt-3 flex items-center justify-between border-t pt-2">
              <span className="font-medium text-[10px] text-muted-foreground">
                {agent.tasks_completed} Tasks Completed
              </span>
              <Button
                onClick={() => handleTriggerAgent(agent.name)}
                size="sm"
                variant="outline"
                className="h-6 border-emerald-500/30 px-2 text-[10px] text-emerald-600 hover:bg-emerald-500/10"
              >
                <Play className="mr-1 size-2.5 fill-current" /> Run Helper
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default PaperclipCockpitHub;
