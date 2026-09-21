"use client";

import { useState } from "react";

import { CheckSquare, Kanban as KanbanIcon, ListTodo } from "lucide-react";

import { Button } from "@/components/ui/button";

import { initialBoard } from "../kanban/_components/data";
import { Kanban } from "../kanban/_components/kanban";
import { tasks } from "./_components/data";
import { Tasks } from "./_components/tasks";

export default function TasksDashboardPage() {
  const [activeTab, setActiveTab] = useState<"list" | "kanban">("list");

  return (
    <div className="flex h-full flex-col gap-4 p-4 md:p-6">
      {/* Sub-tab Navigation */}
      <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-bold text-2xl tracking-tight">
            <CheckSquare className="h-6 w-6 text-primary" />
            Execution & Tasks Board
          </h1>
          <p className="text-muted-foreground text-sm">
            Track lead follow-up actions, Speed-to-Lead tasks, and autonomous agent execution milestones.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-muted p-1">
          <Button
            variant={activeTab === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("list")}
            className="flex items-center gap-1.5 font-semibold text-xs"
          >
            <ListTodo className="h-3.5 w-3.5" />
            Task Table View
          </Button>
          <Button
            variant={activeTab === "kanban" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("kanban")}
            className="flex items-center gap-1.5 font-semibold text-xs"
          >
            <KanbanIcon className="h-3.5 w-3.5 text-indigo-400" />
            Kanban Board View
          </Button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === "list" ? (
        <div className="min-h-0 flex-1 rounded-lg border bg-background p-4">
          <Tasks data={tasks} />
        </div>
      ) : (
        <div className="min-h-0 flex-1" data-content-padding="false">
          <Kanban initialBoard={initialBoard} />
        </div>
      )}
    </div>
  );
}
