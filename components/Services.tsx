"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Home, Hammer, ChefHat, PenTool, Hotel, Lightbulb } from "lucide-react";
import { Reveal, MaskReveal } from "./anim";

const services = [
  {
    icon: Lightbulb,
    title: "Conceptual",
    desc: "Early-stage concept development, mood and spatial narratives, and visualisation that give a project its direction before a wall goes up.",
  },
  {
    icon: Home,
    title: "Residential Design",
    desc: "Homes, apartments and villas designed around how you live — spatial planning, light, and material palettes that feel effortless day to day.",
  },
  {
    icon: PenTool,
    title: "Bespoke Design",
    desc: "One-off furniture and custom joinery crafted for a specific space — considered details, honest materials, and pieces made to last.",
  },
  {
    icon: Hotel,
    title: "Hospitality",
    desc: "Resorts, restaurants and lobbies shaped around guest experience — atmosphere, flow, and a strong sense of place rooted in the islands.",
  },
  {
    icon: Hammer,
    title: "Interior Fit-Out",
    desc: "End-to-end fit-out delivery from joinery and finishes to on-site coordination, turning drawings into a fully realised, move-in-ready space.",
  },
  {
    icon: ChefHat,
    title: "Kitchen Fit-Out",
    desc: "Bespoke kitchens engineered for the way you cook — ergonomic layouts, custom cabinetry, and seamless appliance and storage integration.",
  },
];

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const headingYraw = useTransform(scrollYProgress, [0, 1], ["60px", "-60px"]);
  const headingY = reduced ? 0 : headingYraw;

  return (
    <section
      id="services"
      ref={ref}
      className="py-28 md:py-40 border-t"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16 md:mb-24">
          <Reveal className="md:col-span-3 pt-3" delay={0}>
            <p className="text-xs tracking-[0.25em] uppercase" style={{ color: "var(--accent)" }}>
              What I Do
            </p>
          </Reveal>
          <div className="md:col-span-9">
            <motion.h2
              style={{ y: headingY }}
              className="font-[family-name:var(--font-space)] text-5xl md:text-7xl font-bold tracking-tight leading-[0.95] mb-6"
            >
              <MaskReveal text="Services" className="text-[var(--text-primary)]" />
            </motion.h2>
            <Reveal delay={0.15}>
              <p
                className="text-base md:text-lg leading-relaxed max-w-xl text-pretty"
                style={{ color: "var(--text-secondary)" }}
              >
                From first concept to final fit-out — a complete design service across
                residential, hospitality and bespoke work.
              </p>
            </Reveal>
          </div>
        </div>

        {/* editorial index */}
        <div style={{ borderBottom: "1px solid var(--border)" }}>
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className="group relative grid grid-cols-12 gap-4 md:gap-8 items-baseline py-7 md:py-9 border-t overflow-hidden"
                  style={{ borderColor: "var(--border)" }}
                >
                  {/* hover wash */}
                  <span
                    className="absolute inset-0 -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "linear-gradient(to right, rgba(234,92,31,0.06), transparent 60%)" }}
                  />

                  <span className="relative col-span-2 md:col-span-1 font-[family-name:var(--font-space)] text-sm tabular-nums pt-1 transition-colors duration-300 text-[var(--text-muted)] group-hover:text-[var(--accent)]">
                    0{i + 1}
                  </span>

                  <h3 className="relative col-span-10 md:col-span-5 font-[family-name:var(--font-space)] text-2xl md:text-4xl font-semibold leading-tight transition-all duration-300 text-[var(--text-primary)] group-hover:text-[var(--accent)] md:group-hover:translate-x-2">
                    {service.title}
                  </h3>

                  <p
                    className="relative col-start-3 col-span-10 md:col-start-auto md:col-span-5 text-sm leading-relaxed text-pretty"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {service.desc}
                  </p>

                  <div className="relative hidden md:flex md:col-span-1 justify-end pt-1">
                    <Icon
                      size={22}
                      strokeWidth={1.5}
                      className="transition-all duration-300 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 text-[var(--accent)]"
                    />
                  </div>

                  {/* underline that draws across on hover */}
                  <span
                    className="absolute bottom-0 left-0 right-0 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ background: "var(--accent)" }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
