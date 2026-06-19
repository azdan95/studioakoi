"use client";

import { useEffect, useRef } from "react";

const CELL    = 30;
const C2      = 0.16;   // faster propagation for clear ripple rings
const DAMP    = 0.989;  // gentle decay — waves travel far before fading
const BUCKETS = 9;

// Bright → deep orange palette, index 0 = highest amplitude (brightest)
const PALETTE: [number, number, number, number][] = [
  [255, 90,  0,  0.95],  // #FF5A00 — blazing bright
  [245, 72,  0,  0.82],
  [232, 58,  0,  0.68],
  [218, 46,  0,  0.54],
  [202, 36,  0,  0.40],
  [185, 27,  0,  0.28],
  [165, 20,  0,  0.18],
  [142, 14,  0,  0.10],
  [118, 10,  0,  0.04],  // deep ember — barely visible
];

export default function HeroGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raf  = useRef<number>(0);
  const cur  = useRef<Float32Array>(new Float32Array(0));
  const prev = useRef<Float32Array>(new Float32Array(0));
  const rot  = useRef<Float32Array>(new Float32Array(0));  // per-cell rotation angle
  const cols = useRef(0);
  const rows = useRef(0);
  const mx   = useRef(-9999);
  const my   = useRef(-9999);
  const lx   = useRef(-9999);  // last position for velocity calc
  const ly   = useRef(-9999);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d", { alpha: true })!;

    const init = () => {
      const w = canvas.parentElement!.clientWidth;
      const h = canvas.parentElement!.clientHeight;
      canvas.width  = w;
      canvas.height = h;
      cols.current = Math.floor(w / CELL) + 2;
      rows.current = Math.floor(h / CELL) + 2;
      const n = cols.current * rows.current;
      cur.current  = new Float32Array(n);
      prev.current = new Float32Array(n);
      rot.current  = new Float32Array(n);
    };
    init();

    const ro = new ResizeObserver(init);
    ro.observe(canvas.parentElement!);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = e.clientX - rect.left;
      const ny = e.clientY - rect.top;

      // Velocity-based injection: fast movement = strong ripple pulse
      if (lx.current > 0) {
        const dx = nx - lx.current;
        const dy = ny - ly.current;
        const speed = Math.sqrt(dx * dx + dy * dy);

        if (speed > 1.5) {
          const gx = Math.round(nx / CELL);
          const gy = Math.round(ny / CELL);
          const C  = cols.current;
          const R  = rows.current;
          const b  = cur.current;

          if (gy >= 1 && gy < R - 1 && gx >= 1 && gx < C - 1) {
            const amp = Math.min(0.75, speed * 0.045);
            b[gy * C + gx]         = Math.min(1.0, b[gy * C + gx]         + amp);
            b[(gy - 1) * C + gx]   = Math.min(1.0, b[(gy - 1) * C + gx]   + amp * 0.6);
            b[(gy + 1) * C + gx]   = Math.min(1.0, b[(gy + 1) * C + gx]   + amp * 0.6);
            b[gy * C + (gx - 1)]   = Math.min(1.0, b[gy * C + (gx - 1)]   + amp * 0.6);
            b[gy * C + (gx + 1)]   = Math.min(1.0, b[gy * C + (gx + 1)]   + amp * 0.6);
          }
        }
      }

      lx.current = nx;
      ly.current = ny;
      mx.current = nx;
      my.current = ny;
    };

    const onLeave = () => {
      mx.current = -9999;
      lx.current = -9999;
      cur.current.fill(0);
      prev.current.fill(0);
    };

    window.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    const step = () => {
      const C = cols.current;
      const R = rows.current;
      const b = cur.current;
      const p = prev.current;

      // Absorbing boundaries
      for (let c = 0; c < C; c++) { b[c] = 0; b[(R - 1) * C + c] = 0; }
      for (let r = 0; r < R; r++) { b[r * C] = 0; b[r * C + C - 1] = 0; }

      const nxt = p;
      for (let r = 1; r < R - 1; r++) {
        for (let c = 1; c < C - 1; c++) {
          const i   = r * C + c;
          const lap = b[i - C] + b[i + C] + b[i - 1] + b[i + 1] - 4 * b[i];
          nxt[i] = Math.max(-1, Math.min(1, (2 * b[i] - p[i] + C2 * lap) * DAMP));
        }
      }
      cur.current  = nxt;
      prev.current = b;
    };

    const buckets: { x: number; y: number; al: number; ang: number }[][] =
      Array.from({ length: BUCKETS + 1 }, () => []);

    const RADIUS  = 320;   // attractor influence radius (px)
    const EASE    = 0.18;  // rotation easing toward target
    const SWIRL   = 0.6;   // tangential spin so it swirls, not just points
    const HALO_R  = 90;    // static glow radius around cursor (px) — lit when idle
    const HALO_R2 = HALO_R * HALO_R;
    const HALO_PEAK = 0.62;
    const TWO_PI  = Math.PI * 2;

    const render = () => {
      const C = cols.current;
      const R = rows.current;
      const b = cur.current;
      const rt = rot.current;
      const cmx = mx.current;
      const cmy = my.current;
      const { width, height } = canvas;

      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i <= BUCKETS; i++) buckets[i].length = 0;

      for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {
          const i = r * C + c;
          const x = c * CELL;
          const y = r * CELL;

          const dx = cmx - x;
          const dy = cmy - y;
          const d2 = dx * dx + dy * dy;

          // static halo glow around cursor so the grid isn't blank when idle
          let glow = 0;
          if (d2 < HALO_R2) {
            const g = 1 - Math.sqrt(d2) / HALO_R;
            glow = g * g * HALO_PEAK;
          }

          // combine travelling wave with the static halo
          const wave = Math.abs(b[i]);
          const amp  = wave > glow ? wave : glow;
          if (amp < 0.01) continue;

          const e  = amp * amp * (3 - 2 * amp);    // smoothstep
          const bi = Math.min(BUCKETS, 1 + Math.floor(e * BUCKETS));
          // line scales up at peak (bright), shrinks toward zero (faded)
          const al = CELL * (0.28 + e * 0.42);

          // attractor rotation — orient toward cursor with distance falloff + swirl
          const w  = Math.exp(-d2 / (RADIUS * RADIUS));   // 1 near cursor → 0 far
          const dist = Math.sqrt(d2) || 1;
          const ux = dx / dist, uy = dy / dist;
          const tx = w * (ux + SWIRL * -uy) + (1 - w);    // + tangential swirl
          const ty = w * (uy + SWIRL *  ux);
          const target = Math.atan2(ty, tx);

          // ease rotation toward target (shortest angular path)
          let delta = target - rt[i];
          delta = ((delta % TWO_PI) + TWO_PI + Math.PI) % TWO_PI - Math.PI;
          rt[i] += delta * EASE;

          buckets[bi].push({ x, y, al, ang: rt[i] });
        }
      }

      for (let bi = 1; bi <= BUCKETS; bi++) {
        if (!buckets[bi].length) continue;
        const pi = BUCKETS - bi;                    // invert: bi=9 → pi=0 (brightest)
        const [r, g, bv, a] = PALETTE[pi];
        ctx.strokeStyle = `rgba(${r},${g},${bv},${a})`;
        ctx.lineWidth   = 0.35 + (bi / BUCKETS) * 1.3;
        ctx.beginPath();
        for (const { x, y, al, ang } of buckets[bi]) {
          const ca = Math.cos(ang) * al;
          const sa = Math.sin(ang) * al;
          // single line oriented along the attractor angle
          ctx.moveTo(x - ca, y - sa); ctx.lineTo(x + ca, y + sa);
        }
        ctx.stroke();
      }
    };

    const loop = () => {
      step();
      render();
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
