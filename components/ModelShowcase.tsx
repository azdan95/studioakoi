"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const MODEL_SRC = "/forest-model.jpg";

export default function ModelShowcase() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // parallax drift + slow zoom; disabled for reduced-motion
  const yRaw = useTransform(scrollYProgress, [0, 1], ["-16%", "16%"]);
  const scaleRaw = useTransform(scrollYProgress, [0, 0.5, 1], [1.18, 1.06, 1.18]);
  const y = reduced ? "0%" : yRaw;
  const scale = reduced ? 1 : scaleRaw;

  return (
    <section
      ref={ref}
      aria-label="Forest retreat — architectural study model"
      className="relative h-[60vh] md:h-[85vh] overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* atmospheric background image — clip-path wipe on first view, parallax + zoom within */}
      <motion.div
        initial={reduced ? undefined : { clipPath: "inset(0% 0% 100% 0%)" }}
        whileInView={reduced ? undefined : { clipPath: "inset(0% 0% 0% 0%)" }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <motion.div style={{ y, scale }} className="absolute inset-x-0 -top-[20%] h-[140%] origin-center will-change-transform">
          <Image
            src={MODEL_SRC}
            alt="Architectural model of faceted timber retreat pods in a paper-grey forest"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
      </motion.div>

      {/* theme scrim — keeps it integrated in dark mode */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--backdrop-scrim)" }} />

      {/* fade the band into the sections above and below */}
      <div
        className="absolute inset-x-0 top-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, var(--background), transparent)" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to top, var(--background), transparent)" }}
      />

      {/* restrained caption */}
      <div className="absolute bottom-10 left-6 md:bottom-14 md:left-14 max-w-md">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-xs font-medium tracking-[0.3em] uppercase mb-3"
          style={{ color: "var(--accent)" }}
        >
          The Forest Retreat — A Study
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-[family-name:var(--font-space)] text-2xl md:text-3xl font-semibold leading-snug text-balance"
          style={{ color: "var(--text-primary)" }}
        >
          Designing quiet shelters that live lightly within the trees.
        </motion.p>
      </div>
    </section>
  );
}
