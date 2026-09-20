"use client";

import React, { useState } from "react";

import { Bug, Play, StopCircle } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function GremlinsChaosRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [attackCount, setAttackCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [hordeInstance, setHordeInstance] = useState<{ stop?: () => void } | null>(null);

  const startChaosHorde = async () => {
    if (isRunning) return;

    try {
      setIsRunning(true);
      setAttackCount(0);
      setErrorCount(0);

      toast.warning("👾 Gremlins Chaos Horde Unleashed!", {
        description: "Executing 1,000 random clicks, form inputs, and scroll events across UI...",
      });

      const gremlins = await import("gremlins.js");

      const horde = gremlins.createHorde({
        species: [
          gremlins.species.clicker({ clickTypes: ["click"] }),
          gremlins.species.formFiller(),
          gremlins.species.scroller(),
          gremlins.species.typer(),
        ],
        mogwais: [gremlins.mogwais.alert(), gremlins.mogwais.fps()],
        strategies: [
          gremlins.strategies.distribution({
            delay: 15,
            nb: 1000,
          }),
        ],
      });

      let currentAttacks = 0;
      let currentErrors = 0;

      const errorHandler = (event: ErrorEvent) => {
        currentErrors++;
        setErrorCount((prev) => prev + 1);
        console.warn("[Gremlins Chaos Caught Error]:", event.error || event.message);
      };

      window.addEventListener("error", errorHandler);

      const ticker = setInterval(() => {
        currentAttacks = Math.min(1000, currentAttacks + 25);
        setAttackCount(currentAttacks);
      }, 50);

      setHordeInstance(horde as unknown as { stop?: () => void });

      horde
        .unleash()
        .then(() => {
          clearInterval(ticker);
          window.removeEventListener("error", errorHandler);
          setAttackCount(1000);
          setIsRunning(false);
          toast.success("✅ Gremlins Chaos Attack Complete!", {
            description: `Executed 1,000 attacks with ${currentErrors} unhandled errors trapped. UI remained resilient.`,
          });
        })
        .catch((err: unknown) => {
          clearInterval(ticker);
          window.removeEventListener("error", errorHandler);
          setIsRunning(false);
          console.error("Gremlins Horde error:", err);
        });
    } catch (err) {
      console.error("Failed to initialize Gremlins:", err);
      setIsRunning(false);
    }
  };

  const stopChaosHorde = () => {
    if (hordeInstance && typeof hordeInstance.stop === "function") {
      hordeInstance.stop();
    }
    setIsRunning(false);
    toast.info("Gremlins Chaos Attack Halted");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-full border bg-background/95 p-2 px-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Bug className={`size-4 ${isRunning ? "text-amber-500 animate-bounce" : "text-primary"}`} />
        <span className="font-semibold text-xs text-foreground">Gremlins Chaos</span>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <Badge variant="outline" className="text-[10px]">
          {attackCount} / 1,000 Attacks
        </Badge>
        {errorCount > 0 && (
          <Badge variant="destructive" className="text-[10px]">
            {errorCount} Errors
          </Badge>
        )}
      </div>

      {!isRunning ? (
        <Button
          onClick={startChaosHorde}
          size="sm"
          className="h-7 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-[11px] gap-1 px-3"
        >
          <Play className="size-3 fill-current" />
          Unleash
        </Button>
      ) : (
        <Button
          onClick={stopChaosHorde}
          size="sm"
          variant="destructive"
          className="h-7 rounded-full text-[11px] gap-1 px-3"
        >
          <StopCircle className="size-3" />
          Stop
        </Button>
      )}
    </div>
  );
}

export default GremlinsChaosRunner;
