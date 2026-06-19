"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, MapPin } from "lucide-react";
import GlassBackdrop from "./GlassBackdrop";

const lines = ["INTERIOR", "ARCHITECTURE", "&", "DESIGN"];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col justify-end overflow-hidden" style={{ background: "var(--background)" }}>
      <motion.div style={{ y }} className="absolute inset-0">
        <GlassBackdrop />
        <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: "linear-gradient(to top, var(--background), transparent)" }} />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 px-6 md:px-10 pb-20 max-w-7xl mx-auto w-full">
        <motion.p initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-xs font-medium tracking-[0.35em] uppercase mb-8"
          style={{ color: "var(--accent)" }}>
          Portfolio — AKOI Studio
        </motion.p>

        <h1 className="flex flex-col leading-[0.9] mb-2">
          {lines.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }} animate={{ y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className="block font-[family-name:var(--font-space)] text-[clamp(42px,8.5vw,116px)] font-bold tracking-tight"
                style={{ color: line === "&" ? "var(--accent)" : "var(--text-primary)" }}>
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mt-12 pt-8 border-t"
          style={{ borderColor: "var(--border)" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex items-center gap-2">
            <MapPin size={14} style={{ color: "var(--accent)" }} />
            <span className="tracking-wider uppercase text-xs" style={{ color: "var(--text-muted)" }}>Malé, Maldives</span>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="text-sm max-w-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Interior architecture, fit-out and bespoke spatial design — a selected portfolio of built and conceptual work.
          </motion.p>

          <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            whileHover={{ y: 4 }} whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
            className="group flex items-center gap-2 text-xs tracking-[0.15em] uppercase cursor-pointer"
            style={{ color: "var(--accent)" }}>
            View work
            <ArrowDown size={14} className="transition-transform duration-300 group-hover:translate-y-1" />
          </motion.button>
        </div>
      </motion.div>

      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ delay: 1.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "left", background: "var(--accent)" }}
        className="absolute bottom-0 left-0 right-0 h-px" />
    </section>
  );
}
