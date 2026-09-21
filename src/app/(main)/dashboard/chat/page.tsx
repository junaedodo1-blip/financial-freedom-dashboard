"use client";

import { useState } from "react";

import { BookOpen, Cpu, HardDrive, MessageSquare } from "lucide-react";

import { OpenNotebookBrainHub } from "@/components/brain/OpenNotebookBrainHub";
import { KaloAiChat } from "@/components/chat/KaloAiChat";
import { PaperclipCockpitHub } from "@/components/fleet/PaperclipCockpitHub";
import { LightMemHub } from "@/components/memory/LightMemHub";
import { Button } from "@/components/ui/button";

export default function DashboardChatPage() {
  const [activeTab, setActiveTab] = useState<"chat" | "brain" | "memory" | "cockpit">("chat");

  return (
    <div className="flex h-[calc(100vh-65px)] flex-col gap-3 overflow-hidden p-3 md:p-4">
      {/* Sub-tab Navigation */}
      <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-bold text-2xl tracking-tight">
            <MessageSquare className="h-6 w-6 text-primary" />
            AI Agent Workspace
          </h1>
          <p className="text-muted-foreground text-sm">
            Unified autonomous Paperclip AI fleet, Open-Notebook knowledge brain, and LightMem context engine.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-muted p-1">
          <Button
            variant={activeTab === "chat" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("chat")}
            className="flex items-center gap-1 font-semibold text-xs"
          >
            <MessageSquare className="h-3.5 w-3.5 text-blue-400" />
            AI Fleet Chat
          </Button>
          <Button
            variant={activeTab === "brain" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("brain")}
            className="flex items-center gap-1 font-semibold text-xs"
          >
            <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
            Notebook Brain
          </Button>
          <Button
            variant={activeTab === "memory" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("memory")}
            className="flex items-center gap-1 font-semibold text-xs"
          >
            <HardDrive className="h-3.5 w-3.5 text-purple-400" />
            LightMem Memory
          </Button>
          <Button
            variant={activeTab === "cockpit" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("cockpit")}
            className="flex items-center gap-1 font-semibold text-xs"
          >
            <Cpu className="h-3.5 w-3.5 text-amber-400" />
            Agent Cockpit
          </Button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === "chat" && (
        <div className="min-h-0 flex-1">
          <KaloAiChat />
        </div>
      )}
      {activeTab === "brain" && (
        <div className="min-h-0 flex-1">
          <OpenNotebookBrainHub />
        </div>
      )}
      {activeTab === "memory" && (
        <div className="min-h-0 flex-1">
          <LightMemHub />
        </div>
      )}
      {activeTab === "cockpit" && (
        <div className="min-h-0 flex-1">
          <PaperclipCockpitHub />
        </div>
      )}
    </div>
  );
}
