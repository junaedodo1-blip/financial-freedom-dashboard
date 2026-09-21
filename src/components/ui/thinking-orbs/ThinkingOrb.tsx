"use client";

import { useEffect, useRef } from "react";
import { MODE_DRAWS } from "./engine/registry";
import { resolvePreset } from "./presets";
import { useResolvedDark } from "./theme";
import type { ThinkingOrbProps } from "./types";

interface ExtendedOrbProps extends ThinkingOrbProps {
  color?: "amber" | "cyan" | "emerald" | "violet" | "rainbow";
}

const LABELS: Record<string, string> = {
  working: "Working…",
  searching: "Searching…",
  solving: "Solving…",
  listening: "Listening…",
  connecting: "Connecting…",
  weaving: "Weaving…",
  composing: "Composing…",
  breathing: "Thinking…",
  shaping: "Shaping…",
};

export function ThinkingOrb({
  state = "working",
  size = 64,
  theme = "auto",
  speed = 1.2,
  paused = false,
  color = "amber",
  style,
  "aria-label": ariaLabel,
  ...rest
}: ExtendedOrbProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const dark = useResolvedDark(theme, ref);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = Math.min(2, (typeof devicePixelRatio !== "undefined" && devicePixelRatio) || 1);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { mode, speed: baseSpeed, opts } = resolvePreset(state, size);
    const draw = MODE_DRAWS[mode];
    const effSpeed = baseSpeed * speed;

    const frame = (tSec: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      draw(ctx, size, tSec, dark, opts, color);
    };

    let raf = 0;
    let running = true;

    const loop = () => {
      frame((performance.now() / 1000) * effSpeed);
      if (running && !paused) {
        raf = requestAnimationFrame(loop);
      }
    };

    // Start live rAF loop immediately
    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
    };
  }, [state, size, dark, speed, paused, color]);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label={ariaLabel ?? LABELS[state]}
      style={{ width: size, height: size, display: "block", ...style }}
      {...rest}
    />
  );
}
