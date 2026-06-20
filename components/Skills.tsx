"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Reveal, MaskReveal, EASE } from "./anim";

const toolGroups = [
  { label: "Drafting & BIM", tools: ["AutoCAD", "Revit", "Rhino 3D", "Grasshopper 3D"] },
  { label: "3D & Visualisation", tools: ["SketchUp", "3DS Max", "V-Ray", "Blender"] },
  { label: "Graphics & Layout", tools: ["Photoshop", "Illustrator", "InDesign", "Premiere Pro"] },
];

const strengths = [
  "Spatial Planning",
  "Design Communication",
  "Technical Drawing",
  "Client Briefing",
  "3D Visualisation",
  "Team Collaboration",
  "Material Specification",
  "Concept Development",
];

export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const headingYraw = useTransform(scrollYProgress, [0, 1], ["50px", "-50px"]);
  const headingY = reduced ? 0 : headingYraw;

  return (
    <section
      id="skills"
      ref={ref}
      className="py-28 md:py-40 border-t"
      style={{ background: "var(--surface-1)", borderColor: "var(--border)" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16 md:mb-20">
          <Reveal className="md:col-span-3 pt-3">
            <p className="text-xs tracking-[0.25em] uppercase" style={{ color: "var(--accent)" }}>
              Expertise
            </p>
          </Reveal>
          <motion.h2
            style={{ y: headingY }}
            className="md:col-span-9 font-[family-name:var(--font-space)] text-5xl md:text-7xl font-bold tracking-tight leading-[0.95]"
          >
            <MaskReveal text="Skills & Tools" className="text-[var(--text-primary)]" />
          </motion.h2>
        </div>

        {/* tool groups — editorial index, no percentage bars */}
        <div className="mb-20" style={{ borderBottom: "1px solid var(--border)" }}>
          {toolGroups.map((group, gi) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: gi * 0.08, duration: 0.7, ease: EASE }}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-baseline py-8 md:py-10 border-t"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="md:col-span-4">
                <p
                  className="text-xs tracking-[0.2em] uppercase mb-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  {group.label}
                </p>
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: 0.2 + gi * 0.08, duration: 0.7, ease: EASE }}
                  className="block w-10 h-px origin-left"
                  style={{ background: "var(--accent)" }}
                />
              </div>

              <div className="md:col-span-8 flex flex-wrap gap-x-8 gap-y-3">
                {group.tools.map((tool, ti) => (
                  <motion.span
                    key={tool}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: gi * 0.08 + ti * 0.06, duration: 0.5, ease: EASE }}
                    className="font-[family-name:var(--font-space)] text-xl md:text-2xl font-medium transition-colors duration-300 cursor-default text-[var(--text-secondary)] hover:text-[var(--accent)]"
                  >
                    {tool}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* core strengths */}
        <Reveal>
          <p className="text-xs tracking-[0.2em] uppercase mb-6" style={{ color: "var(--text-muted)" }}>
            Core strengths
          </p>
        </Reveal>
        <div className="flex flex-wrap gap-2.5">
          {strengths.map((s, i) => (
            <motion.span
              key={s}
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.05, duration: 0.45, ease: EASE }}
              whileHover={{ y: -4 }}
              className="text-xs font-medium tracking-[0.1em] uppercase px-4 py-2.5 rounded-sm cursor-default transition-colors duration-300 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)]"
              style={{ border: "1px solid var(--border)", background: "var(--background)" }}
            >
              {s}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
