"use client";

import { useState } from "react";

import { IconSparkles } from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { TablerCard } from "@/components/ui/tabler-card";

export function TwentyCrmHub() {
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  const handleAiAction = (promptText?: string) => {
    const textToUse = promptText || aiPrompt;
    if (!textToUse.trim()) return;

    setIsAiThinking(true);
    setAiResult(null);

    setTimeout(() => {
      setIsAiThinking(false);
      setAiResult(`AI Filter applied: "${textToUse}"`);
      toast.success("AI Filter Applied!");
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6 p-1">
      <TablerCard
        statusColor="blue"
        headerTitle="🤖 AI Contact Assistant"
        headerDescription="Type a command in plain English to filter contacts"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="e.g. 'Show Toronto contacts'..."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="flex-1 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-xs outline-none focus:border-amber-500"
          />
          <Button
            size="sm"
            onClick={() => handleAiAction()}
            disabled={isAiThinking}
            className="bg-amber-500 font-semibold text-black text-xs hover:bg-amber-400"
          >
            <IconSparkles className="mr-1 h-4 w-4" />
            {isAiThinking ? "Thinking..." : "Run AI Filter"}
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="font-semibold text-muted-foreground text-xs">Quick Filters:</span>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => handleAiAction("Toronto Contacts")}
          >
            Find Toronto Leads
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleAiAction("High Intent")}>
            Show High Intent
          </Button>
        </div>

        {aiResult && (
          <div className="mt-3 rounded-md border border-amber-500/20 bg-amber-500/10 p-2.5 font-medium text-amber-400 text-xs">
            {aiResult}
          </div>
        )}
      </TablerCard>
    </div>
  );
}
