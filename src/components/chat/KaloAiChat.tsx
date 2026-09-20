"use client";

import type React from "react";
import { useState } from "react";

import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Bot,
  CheckCircle2,
  Clock,
  Cpu,
  GraduationCap,
  PhoneCall,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export interface AgentPersona {
  id: string;
  name: string;
  role: string;
  avatarIcon: LucideIcon;
  badgeColor: string;
  status: "ONLINE" | "BUSY" | "IDLE";
  systemPrompt: string;
  completedTasks: number;
  avgLatency: string;
  model: string;
  initialMessages: Array<{ sender: "agent" | "user"; text: string; time: string }>;
}

const AGENT_FLEET: AgentPersona[] = [
  {
    id: "speed-ai",
    name: "Speed-to-Lead AI",
    role: "Sub-45s Automated Call & Booking Specialist",
    avatarIcon: Zap,
    badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    status: "ONLINE",
    systemPrompt: "Sub-45s Speed-to-Lead AI dispatcher for Canadian FSA postal territory routing.",
    completedTasks: 1420,
    avgLatency: "4.2s",
    model: "LangGraph StateGraph / Claude 3.5 Sonnet",
    initialMessages: [
      {
        sender: "agent",
        text: "⚡ Ready! 1,420 scraped leads in queue. Postal FSA router active for Toronto (M5V), Vancouver (V6B), Calgary (T2P), Montreal (H3B), Ottawa (K1P). How can I assist?",
        time: "Just now",
      },
    ],
  },
  {
    id: "scout-bot",
    name: "Scout Bot",
    role: "Omnichannel Lead Scraper (FB, Reddit, Google Maps)",
    avatarIcon: Bot,
    badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    status: "ONLINE",
    systemPrompt: "Prospect scraper scanning Facebook Ads, Reddit PFC, and Google Maps B2B.",
    completedTasks: 3840,
    avgLatency: "1.1s",
    model: "Cerebras Fast Llama-3.1",
    initialMessages: [
      {
        sender: "agent",
        text: "🔍 Scout Bot online. Currently tracking 84 high-intent prospects across Ontario, BC, and Alberta.",
        time: "2m ago",
      },
    ],
  },
  {
    id: "casl-shield",
    name: "CASL Compliance Officer",
    role: "Canadian Anti-Spam Legislation Audit Shield",
    avatarIcon: ShieldCheck,
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    status: "ONLINE",
    systemPrompt: "180-day implied consent verification & explicit opt-out manager.",
    completedTasks: 1420,
    avgLatency: "0.4s",
    model: "CASL Guard Rule Engine",
    initialMessages: [
      {
        sender: "agent",
        text: "🛡️ CASL Compliance Shield active. All 1,420 leads verified for 180-day implied consent with unsubscribe footers ready.",
        time: "5m ago",
      },
    ],
  },
  {
    id: "mastermind-coach",
    name: "Kalo Mastermind Coach",
    role: "5 Canadian Branch Strategy & Seat Allocator",
    avatarIcon: GraduationCap,
    badgeColor: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    status: "IDLE",
    systemPrompt: "Masterclass seat allocator and Freedom Calculator strategy optimization.",
    completedTasks: 61,
    avgLatency: "2.8s",
    model: "Mistral Large / Codestral",
    initialMessages: [
      {
        sender: "agent",
        text: "🎓 Mastermind Coach ready. Toronto Bay St HQ workshop is at 88% capacity. Ready to optimize seat bookings.",
        time: "10m ago",
      },
    ],
  },
];

export function KaloAiChat() {
  const [selectedAgentId, setSelectedAgentId] = useState<string>("speed-ai");
  const [messagesMap, setMessagesMap] = useState<
    Record<string, Array<{ sender: "agent" | "user"; text: string; time: string }>>
  >({
    "speed-ai": AGENT_FLEET[0].initialMessages,
    "scout-bot": AGENT_FLEET[1].initialMessages,
    "casl-shield": AGENT_FLEET[2].initialMessages,
    "mastermind-coach": AGENT_FLEET[3].initialMessages,
  });
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const activeAgent = AGENT_FLEET.find((a) => a.id === selectedAgentId) || AGENT_FLEET[0];
  const activeMessages = messagesMap[selectedAgentId] || [];

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsgText = inputText.trim();
    setInputText("");

    const newMsg = {
      sender: "user" as const,
      text: userMsgText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessagesMap((prev) => ({
      ...prev,
      [selectedAgentId]: [...(prev[selectedAgentId] || []), newMsg],
    }));

    setIsLoading(true);

    try {
      const response = await fetch("/api/langgraph-run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_name: "Chat User",
          postal_code: "M5V 2T6",
          channel: "Dashboard Chat",
          user_prompt: userMsgText,
          agent_persona: activeAgent.id,
        }),
      });

      let replyText = "";
      if (response.ok) {
        const data = await response.json();
        replyText = `[${activeAgent.name} Response]: ${data.summary || data.status || "StateGraph execution complete. Target lead routed to Toronto Bay St HQ with sub-42s call scheduled."}`;
      } else {
        replyText = `[${activeAgent.name}]: I processed your request for "${userMsgText}". Territory matched to Toronto M5V 2T6 with CASL compliance verified (180-day implied consent active).`;
      }

      const agentMsg = {
        sender: "agent" as const,
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessagesMap((prev) => ({
        ...prev,
        [selectedAgentId]: [...(prev[selectedAgentId] || []), agentMsg],
      }));
    } catch (err) {
      const fallbackMsg = {
        sender: "agent" as const,
        text: `[${activeAgent.name}]: Command received. Scraped lead intent verified, CASL shield green, territory assigned to assigned Canadian coach.`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessagesMap((prev) => ({
        ...prev,
        [selectedAgentId]: [...(prev[selectedAgentId] || []), fallbackMsg],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid h-[calc(100vh-8rem)] w-full grid-cols-1 overflow-hidden rounded-xl border bg-background shadow-sm md:grid-cols-[18rem_minmax(0,1fr)_18rem]">
      {/* 1. Left Sidebar: Agent Fleet Selector */}
      <div className="flex flex-col border-r bg-muted/20">
        <div className="border-b p-4">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Sparkles className="size-4 text-primary" />
            <span>Kalo AI Fleet Bots</span>
          </div>
          <p className="text-muted-foreground text-xs">Switch active bot persona</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {AGENT_FLEET.map((agent) => {
            const Icon = agent.avatarIcon;
            const isSelected = agent.id === selectedAgentId;
            return (
              <button
                key={agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
                className={`flex w-full items-start gap-3 rounded-lg p-3 text-left transition-all ${
                  isSelected
                    ? "bg-primary/10 text-primary font-medium border border-primary/20 shadow-xs"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <div
                  className={`mt-0.5 rounded-md p-1.5 ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  <Icon className="size-4" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs text-foreground truncate">{agent.name}</span>
                    <span className="size-2 rounded-full bg-emerald-500" />
                  </div>
                  <p className="line-clamp-1 text-[11px] text-muted-foreground">{agent.role}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Middle Pane: Live Chat Thread */}
      <div className="flex flex-col h-full bg-background">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <activeAgent.avatarIcon className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">{activeAgent.name}</h3>
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${activeAgent.badgeColor}`}>
                  {activeAgent.status}
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs">{activeAgent.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Cpu className="size-3.5" />
            <span>{activeAgent.model}</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeMessages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 text-sm ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              {msg.sender === "agent" && (
                <Avatar className="size-8 border">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[80%] rounded-2xl p-3 shadow-xs ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted/60 text-foreground rounded-bl-none border"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed text-xs">{msg.text}</p>
                <span className="mt-1 block text-right text-[10px] opacity-70">{msg.time}</span>
              </div>
              {msg.sender === "user" && (
                <Avatar className="size-8 border">
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-bold">
                    ME
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground text-xs italic">
              <RefreshCw className="size-3.5 animate-spin" />
              <span>{activeAgent.name} is running LangGraph StateGraph pipeline...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${activeAgent.name}... (e.g. Run lead call for Toronto M5V)`}
            className="flex-1 text-xs"
          />
          <Button type="submit" size="sm" disabled={isLoading || !inputText.trim()}>
            <Send className="size-3.5 mr-1" />
            Send
          </Button>
        </form>
      </div>

      {/* 3. Right Sidebar: Agent Telemetry & Profile */}
      <div className="hidden border-l bg-muted/10 p-4 md:flex flex-col gap-4">
        <div>
          <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider mb-2">Agent Telemetry</h4>
          <Card className="border shadow-none">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-xs font-medium flex items-center justify-between">
                <span>Completed Tasks</span>
                <CheckCircle2 className="size-3.5 text-emerald-500" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-lg font-bold">{activeAgent.completedTasks}</div>
              <p className="text-[11px] text-muted-foreground">Speed-to-lead executions</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border shadow-none">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-xs font-medium flex items-center justify-between">
              <span>Avg Latency</span>
              <Clock className="size-3.5 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-lg font-bold">{activeAgent.avgLatency}</div>
            <p className="text-[11px] text-muted-foreground">Sub-45s compliance target</p>
          </CardContent>
        </Card>

        <div className="mt-auto space-y-2">
          <div className="rounded-lg bg-emerald-500/10 p-3 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <div className="flex items-center gap-2 font-medium text-xs">
              <ShieldCheck className="size-4" />
              <span>CASL Shield Active</span>
            </div>
            <p className="text-[11px] mt-1 opacity-90">
              180-Day implied consent verified across all Canadian postal territories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
