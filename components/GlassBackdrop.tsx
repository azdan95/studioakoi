"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import HeroGrid from "./HeroGrid";

// warm, soft color fields — heavily blurred + independent squash/stretch → lava-lamp morph
const blobs = [
  { color: "rgba(234,92,31,0.40)",   size: 640, top: "18%", left: "8%",  dur: 26,
    x: [0, 50, -25, 30, 0],  y: [0, -150, 70, -90, 0],  sx: [1, 1.3, 0.85, 1.15, 1], sy: [1, 0.78, 1.28, 0.9, 1] },
  { color: "rgba(224,150,96,0.52)",  size: 760, top: "34%", left: "48%", dur: 34,
    x: [0, -45, 35, -20, 0], y: [0, 120, -110, 60, 0],  sx: [1, 0.85, 1.25, 0.92, 1], sy: [1, 1.26, 0.82, 1.14, 1] },
  { color: "rgba(212,118,86,0.42)",  size: 560, top: "56%", left: "22%", dur: 23,
    x: [0, 40, -35, 25, 0],  y: [0, -120, 90, -50, 0],  sx: [1, 1.22, 0.88, 1.1, 1],  sy: [1, 0.8, 1.2, 0.9, 1] },
  { color: "rgba(120,142,178,0.22)", size: 520, top: "14%", left: "74%", dur: 31,
    x: [0, -30, 28, -18, 0], y: [0, 130, -70, 50, 0],   sx: [1, 0.9, 1.18, 0.94, 1],  sy: [1, 1.18, 0.86, 1.1, 1] },
  { color: "rgba(247,224,198,0.6)",  size: 700, top: "60%", left: "62%", dur: 29,
    x: [0, 30, -40, 18, 0],  y: [0, -110, 100, -60, 0], sx: [1, 1.2, 0.84, 1.12, 1],  sy: [1, 0.84, 1.24, 0.9, 1] },
];

export default function GlassBackdrop() {
  const grainRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // film grain — pre-bake a few noise tiles, cycle them each frame for the "boil"
    const canvas = grainRef.current!;
    const ctx = canvas.getContext("2d")!;
    const TILE = 180;
    const FRAMES = 8;

    const tiles: CanvasPattern[] = [];
    for (let f = 0; f < FRAMES; f++) {
      const t = document.createElement("canvas");
      t.width = t.height = TILE;
      const tctx = t.getContext("2d")!;
      const img = tctx.createImageData(TILE, TILE);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = Math.random() * 46;   // sparse, low alpha → fine grain
      }
      tctx.putImageData(img, 0, 0);
      tiles.push(ctx.createPattern(t, "repeat")!);
    }

    let w = 0, h = 0;
    const resize = () => {
      w = canvas.width  = canvas.parentElement!.clientWidth;
      h = canvas.height = canvas.parentElement!.clientHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    let raf = 0, fi = 0, last = 0;
    const loop = (ts: number) => {
      if (ts - last > 55) {          // ~18fps grain boil
        last = ts;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = tiles[fi % FRAMES];
        fi++;
        ctx.fillRect(0, 0, w, h);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* warm base wash so the gaps between blobs stay warm */}
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(120% 120% at 50% 25%, var(--hero-wash), transparent 62%)" }} />

      {/* drifting warm color fields */}
      {blobs.map((b, i) => (
        <motion.div key={i} aria-hidden
          className="absolute rounded-full"
          style={{
            width: b.size, height: b.size, top: b.top, left: b.left,
            background: `radial-gradient(circle at center, ${b.color}, transparent 68%)`,
            filter: "blur(64px)",
            willChange: "transform",
          }}
          animate={{ x: b.x, y: b.y, scaleX: b.sx, scaleY: b.sy }}
          transition={{ duration: b.dur, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
      ))}

      {/* theme scrim — transparent in light, darkens the warm field in dark mode */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--backdrop-scrim)" }} />

      {/* rotating attractor lines + ripple — sits above the blobs, under the grain */}
      <HeroGrid />

      {/* fine animated film grain — overlays the lines */}
      <canvas ref={grainRef} aria-hidden
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: "overlay", opacity: 0.55 }} />
    </div>
  );
}
