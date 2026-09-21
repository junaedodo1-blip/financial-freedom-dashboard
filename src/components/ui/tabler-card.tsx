"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TablerCardProps extends React.HTMLAttributes<HTMLDivElement> {
  statusColor?: "emerald" | "blue" | "amber" | "rose" | "indigo" | "purple";
  headerTitle?: string;
  headerDescription?: string;
  headerAction?: React.ReactNode;
  footerContent?: React.ReactNode;
}

export function TablerCard({
  children,
  className,
  statusColor,
  headerTitle,
  headerDescription,
  headerAction,
  footerContent,
  ...props
}: TablerCardProps) {
  const statusColors = {
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    indigo: "bg-indigo-500",
    purple: "bg-purple-500",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/70 bg-card text-card-foreground shadow-xs transition-all hover:shadow-md",
        className
      )}
      {...props}
    >
      {statusColor && (
        <div className={cn("absolute top-0 left-0 right-0 h-1", statusColors[statusColor])} />
      )}

      {(headerTitle || headerAction) && (
        <div className="flex items-center justify-between border-b border-border/40 px-5 py-4">
          <div>
            {headerTitle && <h3 className="font-semibold text-base tracking-tight">{headerTitle}</h3>}
            {headerDescription && (
              <p className="text-muted-foreground text-xs">{headerDescription}</p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      <div className="p-5">{children}</div>

      {footerContent && (
        <div className="border-t border-border/40 bg-muted/20 px-5 py-3 text-xs text-muted-foreground">
          {footerContent}
        </div>
      )}
    </div>
  );
}
