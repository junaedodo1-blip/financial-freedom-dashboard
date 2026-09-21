"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  IconArrowRight,
  IconCheck,
  IconChecklist,
  IconClock,
  IconFlame,
  IconLayoutKanban,
  IconPlus,
  IconRefresh,
  IconUserCheck,
} from "@tabler/icons-react";

import { Kanban } from "@/app/(main)/dashboard/kanban/_components/kanban";
import type { BoardState, Task } from "@/app/(main)/dashboard/kanban/_components/types";
import { Button } from "@/components/ui/button";
import { TablerCard } from "@/components/ui/tabler-card";
import type { ContactRecord } from "@/components/crm/AppleCrmHub";

export function RealDashboardKanbanHub() {
  const [loading, setLoading] = useState(false);
  const [board, setBoard] = useState<BoardState>({
    ideas: [],
    planned: [
      {
        id: "task-1",
        title: "Check Toronto Lead Consents",
        description: "Verify consent status for Toronto contacts.",
        priority: "High",
        dueDate: "Today",
        progress: 80,
        owner: { name: "CASL Bot", tone: "bg-amber-500/10 text-amber-400" },
        team: "Finance Ops",
        insights: [
          { label: "Attachments", count: 3 },
          { label: "Comments", count: 1 },
        ],
      },
    ],
    building: [
      {
        id: "task-2",
        title: "Speed-to-Lead Call Automation",
        description: "Connect prospective clients to strategy advisors.",
        priority: "High",
        dueDate: "Active",
        progress: 45,
        owner: { name: "Speed Bot", tone: "bg-blue-500/10 text-blue-400" },
        team: "Platform",
        insights: [
          { label: "Attachments", count: 12 },
          { label: "Comments", count: 4 },
        ],
      },
    ],
    qa: [],
    shipped: [
      {
        id: "task-3",
        title: "Saturday Workshop Seats",
        description: "Reserved 42 seats across Toronto, Vancouver, and Calgary.",
        priority: "Medium",
        dueDate: "Done",
        progress: 100,
        owner: { name: "Coach", tone: "bg-emerald-500/10 text-emerald-400" },
        team: "Finance Ops",
        insights: [
          { label: "Documents", count: 5 },
          { label: "Comments", count: 12 },
        ],
      },
    ],
  });

  const fetchLiveLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data: ContactRecord[] = await res.json();
        if (data && data.length > 0) {
          const newIdeas: Task[] = data.map((lead, idx) => ({
            id: lead.id || `lead-dynamic-${idx}`,
            title: `${lead.name} ($${lead.monthly_freedom_gap || 3500}/mo Gap)`,
            description: `Channel: ${lead.channel} (${lead.city}). Intent score: ${lead.intent_score || 88}/100.`,
            priority: (lead.intent_score > 80 ? "High" : "Medium") as any,
            dueDate: "Active",
            progress: lead.casl_verified ? 60 : 30,
            owner: { name: "Scout Bot", tone: "bg-blue-500/10 text-blue-400" },
            team: "Finance Ops",
            insights: [
              { label: "Attachments", count: 1 },
              { label: "Comments", count: 2 },
            ],
          }));

          setBoard((prev) => ({
            ...prev,
            ideas: newIdeas,
          }));
          toast.success(`Loaded ${data.length} leads into task board!`);
        }
      }
    } catch (e) {
      console.warn("Live API fetch notice:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveLeads();
  }, [fetchLiveLeads]);

  return (
    <div className="flex flex-col gap-6 p-1">
      {/* Simple Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
            <IconLayoutKanban className="h-3.5 w-3.5" />
            TASK BOARD
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Task Board</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Drag and drop tasks to manage your work easily.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={fetchLiveLeads}
            disabled={loading}
          >
            <IconRefresh className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Link href="/dashboard/crm">
            <Button size="sm" className="bg-amber-500 text-black hover:bg-amber-400 text-xs font-semibold">
              <IconUserCheck className="h-4 w-4 mr-1.5" />
              Open CRM
            </Button>
          </Link>
        </div>
      </div>

      {/* Task Board Container */}
      <TablerCard className="p-4">
        <Kanban initialBoard={board} />
      </TablerCard>
    </div>
  );
}
