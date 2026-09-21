// Shared primitives for the dotted 3D thought-orbs. Ported from inkform
// (PlotterLab's HalftoneSphere lineage): honestly 3D — rotated,
// depth-shaded, z-sorted. Depth is carried by dot size and ink weight
// alone. Plain 2D canvas fills only: no ctx.filter, no SVG filters, so
// every mode renders identically in Chrome, Safari and Firefox.

export interface Dot {
  x: number;
  y: number;
  z: number;
  r: number;
  /** Ink value: 0 = darkest ink on paper. Mirrored on dark themes. */
  white: number;
  a?: number;
}

/** A stroked edge between two projected points (the `connecting` web). */
export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** Ink value, same convention as `Dot.white`. */
  white: number;
  a?: number;
  w: number;
}

/**
 * One rendered instant: a complete, final set of draw instructions.
 * `dots` is already z-sorted into draw order and radius-clamped; `lines`
 * are drawn first. Nothing here needs further interpretation, which is what
 * makes a frame portable to any 2D renderer.
 */
export interface OrbFrame {
  dots: Dot[];
  lines: Line[];
}

export type Projector = (x: number, y: number, z: number) => [number, number, number];

export function lerp(a: number, b: number, f: number): number {
  return a + (b - a) * f;
}

export function frac(x: number): number {
  return x - Math.floor(x);
}

/** Value noise on a 2D lattice — smooth, deterministic, cheap. */
export function vnoise(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  let fx = x - xi;
  let fy = y - yi;
  fx = fx * fx * (3 - 2 * fx);
  fy = fy * fy * (3 - 2 * fy);
  const a = hashD(xi, yi);
  const b = hashD(xi + 1, yi);
  const c = hashD(xi, yi + 1);
  const d = hashD(xi + 1, yi + 1);
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}

/** Deterministic hash in [0, 1). */
export function hashD(a: number, b: number): number {
  const h = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return h - Math.floor(h);
}

/** Stable directions on a unit sphere (Fibonacci lattice). */
export function fibDir(i: number, n: number): [number, number, number] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (2 * (i + 0.5)) / n;
  const rad = Math.sqrt(1 - y * y);
  const a = i * golden;
  return [rad * Math.cos(a), y, rad * Math.sin(a)];
}

/** Shortest signed angular distance, wrapped to (-π, π]. */
export function angleDelta(a: number, b: number): number {
  return Math.atan2(Math.sin(a - b), Math.cos(a - b));
}

/** Shared spin + tilt + orthographic projection. */
export function makeProj(yaw: number, tilt: number, cx: number, cy: number, scale: number): Projector {
  const st = Math.sin(tilt);
  const ct = Math.cos(tilt);
  const sy = Math.sin(yaw);
  const cyw = Math.cos(yaw);
  return (x, y, z) => {
    const x1 = x * cyw + z * sy;
    const z1 = -x * sy + z * cyw;
    const y1 = y * ct - z1 * st;
    const z2 = y * st + z1 * ct;
    return [cx + x1 * scale, cy - y1 * scale, z2];
  };
}

/**
 * Painter: z-sort far→near, matte grayscale dots. On dark substrates the
 * ink value is mirrored (1 - white) so near dots read bright — the same
 * depth language on an inverted substrate.
 */
export function paint(ctx: CanvasRenderingContext2D, dots: Dot[], dark: boolean, color = "amber"): void {
  for (const d of dots) {
    const alpha = d.a ?? 1;
    const w = Math.min(1, Math.max(0, d.white));
    const intensity = dark ? 1 - w : w;

    if (color === "cyan") {
      const r = Math.round(lerp(34, 6, intensity));
      const g = Math.round(lerp(211, 182, intensity));
      const b = Math.round(lerp(238, 212, intensity));
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha * (0.5 + intensity * 0.5)})`;
    } else if (color === "emerald") {
      const r = Math.round(lerp(52, 16, intensity));
      const g = Math.round(lerp(211, 185, intensity));
      const b = Math.round(lerp(153, 129, intensity));
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha * (0.5 + intensity * 0.5)})`;
    } else if (color === "violet") {
      const r = Math.round(lerp(167, 139, intensity));
      const g = Math.round(lerp(139, 92, intensity));
      const b = Math.round(lerp(250, 246, intensity));
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha * (0.5 + intensity * 0.5)})`;
    } else if (color === "rainbow") {
      const hue = Math.round((d.z + 1) * 180 + d.x * 5) % 360;
      ctx.fillStyle = `hsla(${hue}, 90%, ${dark ? 65 : 45}%, ${alpha})`;
    } else {
      // Default Vibrant Gold / Amber Glow
      const r = Math.round(lerp(251, 245, intensity));
      const g = Math.round(lerp(191, 158, intensity));
      const b = Math.round(lerp(36, 11, intensity));
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha * (0.55 + intensity * 0.45)})`;
    }

    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Stroke pass for edge-based modes. Runs before `paint` so nodes sit on top. */
export function paintLines(ctx: CanvasRenderingContext2D, lines: Line[], dark: boolean, color = "amber"): void {
  for (const l of lines) {
    const alpha = l.a ?? 1;
    const w = Math.min(1, Math.max(0, l.white));
    const intensity = dark ? 1 - w : w;
    let r = 245;
    let g = 158;
    let b = 11;
    if (color === "cyan") { r = 34; g = 211; b = 238; }
    else if (color === "emerald") { r = 52; g = 211; b = 153; }
    else if (color === "violet") { r = 167; g = 139; b = 250; }

    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.75})`;
    ctx.lineWidth = l.w;
    ctx.beginPath();
    ctx.moveTo(l.x1, l.y1);
    ctx.lineTo(l.x2, l.y2);
    ctx.stroke();
  }
}

export function finalizeFrame(dots: Dot[], lines: Line[], rMin = 0.3): OrbFrame {
  const visible: Dot[] = [];
  for (const d of dots) {
    if ((d.a ?? 1) < 0.02) continue;
    d.r = Math.max(rMin, d.r);
    visible.push(d);
  }
  visible.sort((a, b) => a.z - b.z);
  return { dots: visible, lines: lines.filter((l) => (l.a ?? 1) >= 0.02) };
}

/** Paint a finished frame. Lines first, so nodes sit on top of their edges. */
export function paintFrame(ctx: CanvasRenderingContext2D, frame: OrbFrame, dark: boolean, color = "amber"): void {
  if (frame.lines.length) paintLines(ctx, frame.lines, dark, color);
  paint(ctx, frame.dots, dark, color);
}

/**
 * Dot radii were tuned for a 300pt frame; sub-linear scaling keeps small
 * spinners legible. Lower pow = radii shrink less with size.
 */
export function radiusScale(size: number, pow: number): number {
  return (size / 300) ** pow;
}
