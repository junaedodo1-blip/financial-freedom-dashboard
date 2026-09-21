"use client";

import { useState } from "react";

import { Calendar as CalendarIcon, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WorkshopEngineHub } from "@/components/workshops/WorkshopEngineHub";

import { Calendar } from "./_components/calendar";

export default function CalendarDashboardPage() {
  const [activeTab, setActiveTab] = useState<"calendar" | "workshops">("calendar");

  return (
    <div className="flex h-full flex-col gap-4 p-4 md:p-6">
      {/* Connected Header & Tab Selector */}
      <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-bold text-2xl tracking-tight">
            <CalendarIcon className="h-6 w-6 text-primary" />
            Calendar Workspace
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage physical masterclasses across Canadian branches, strategy call appointments, and team schedules.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-muted p-1">
          <Button
            variant={activeTab === "calendar" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("calendar")}
            className="flex items-center gap-1.5 font-semibold text-xs"
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            Master Calendar
          </Button>
          <Button
            variant={activeTab === "workshops" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("workshops")}
            className="flex items-center gap-1.5 font-semibold text-xs"
          >
            <GraduationCap className="h-3.5 w-3.5 text-amber-400" />
            Canadian Workshop Engine
          </Button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === "calendar" ? (
        <div className="min-h-0 flex-1 rounded-lg border bg-background p-2">
          <Calendar />
        </div>
      ) : (
        <div className="min-h-0 flex-1">
          <WorkshopEngineHub />
        </div>
      )}
    </div>
  );
}
