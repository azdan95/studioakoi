"use client";

import { motion } from "framer-motion";
import { Reveal, CountUp, EASE } from "./anim";
import GlassText from "./GlassText";

const figures = [
  { to: 6, suffix: "+", label: "Years experience" },
  { to: 11, suffix: "", label: "Software tools" },
  { to: 5, suffix: "", label: "Selected projects" },
];

const experience = [
  { role: "Draughtsman", company: "Group-X Associates", period: "2024 — Present", location: "Malé, Maldives", current: true },
  { role: "Graphic Designer", company: "Jungle Juice Events", period: "2019 — 2022", location: "Wellington, NZ", current: false },
  { role: "Internship", company: "Group-X Associates", period: "2016 — 2017", location: "Wellington", current: false },
];

const education = [
  { degree: "BA, Architectural Studies — Interior Architecture", school: "Victoria University of Wellington", year: "2022" },
  { degree: "Diploma in Architecture", school: "Maldives Polytechnic", year: "2016" },
  { degree: "International Baccalaureate", school: "Overseas School of Colombo", year: "2013" },
];

export default function About() {
  return (
    <section
      id="about"
      className="py-28 md:py-40 border-t"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* intro */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-20 md:mb-28">
          <div className="md:col-span-5">
            <Reveal>
              <p className="text-xs tracking-[0.25em] uppercase mb-5" style={{ color: "var(--accent)" }}>
                About
              </p>
            </Reveal>
            <GlassText lines={["AHMED", "SHAHDAN"]} ariaLabel="Ahmed Shahdan" className="mb-5" />
            <Reveal delay={0.2}>
              <p className="text-sm tracking-[0.08em]" style={{ color: "var(--accent)" }}>
                Interior Architect · AKOI Studio — Malé, Maldives
              </p>
            </Reveal>
          </div>

          <div className="md:col-span-7 space-y-5">
            <Reveal delay={0.1}>
              <p
                className="text-xl md:text-2xl leading-snug font-[family-name:var(--font-space)] text-pretty"
                style={{ color: "var(--text-primary)" }}
              >
                I design interiors where spatial planning, light and material come together
                quietly — spaces that feel effortless to live and work in.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-sm leading-relaxed text-pretty" style={{ color: "var(--text-secondary)" }}>
                I hold a Bachelor of Architectural Studies with a specialization in interior
                architecture from Victoria University of Wellington, with a strong foundation
                in design principles and architectural concepts.
              </p>
            </Reveal>
            <Reveal delay={0.28}>
              <p className="text-sm leading-relaxed text-pretty" style={{ color: "var(--text-secondary)" }}>
                Based in Malé, Maldives, I bring a perspective shaped by island living, coral
                architecture, and the intersection of tradition and contemporary design — and
                a habit of communicating complex ideas clearly across diverse teams and clients.
              </p>
            </Reveal>
          </div>
        </div>

        {/* figures — unboxed, counting up */}
        <div
          className="grid grid-cols-3 gap-4 py-10 md:py-12 mb-20 md:mb-28"
          style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
        >
          {figures.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.1} className="text-center">
              <CountUp
                to={f.to}
                suffix={f.suffix}
                className="block font-[family-name:var(--font-space)] text-5xl md:text-7xl font-bold tracking-tight mb-2 text-[var(--accent)]"
              />
              <span className="text-xs tracking-[0.12em] uppercase" style={{ color: "var(--text-muted)" }}>
                {f.label}
              </span>
            </Reveal>
          ))}
        </div>

        {/* experience + education */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <div>
            <Reveal>
              <p className="text-xs tracking-[0.2em] uppercase mb-8" style={{ color: "var(--text-muted)" }}>
                Experience
              </p>
            </Reveal>
            <div style={{ borderBottom: "1px solid var(--border)" }}>
              {experience.map((exp, i) => (
                <motion.div
                  key={exp.role + exp.company}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }}
                  className="group flex items-start justify-between gap-6 py-5 border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div>
                    <p className="text-base font-medium transition-colors duration-300 text-[var(--text-primary)] group-hover:text-[var(--accent)]">
                      {exp.role}
                      {exp.current && (
                        <span
                          className="ml-2 inline-block w-1.5 h-1.5 rounded-full align-middle"
                          style={{ background: "var(--accent)" }}
                        />
                      )}
                    </p>
                    <p className="text-sm mt-1" style={{ color: "var(--accent)" }}>{exp.company}</p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{exp.location}</p>
                  </div>
                  <span className="text-xs shrink-0 tabular-nums pt-1" style={{ color: "var(--text-muted)" }}>
                    {exp.period}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <Reveal>
              <p className="text-xs tracking-[0.2em] uppercase mb-8" style={{ color: "var(--text-muted)" }}>
                Education
              </p>
            </Reveal>
            <div style={{ borderBottom: "1px solid var(--border)" }}>
              {education.map((edu, i) => (
                <motion.div
                  key={edu.degree}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }}
                  className="group flex items-start justify-between gap-6 py-5 border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div>
                    <p className="text-sm font-medium transition-colors duration-300 text-[var(--text-primary)] group-hover:text-[var(--accent)]">
                      {edu.degree}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{edu.school}</p>
                  </div>
                  <span className="text-xs shrink-0 tabular-nums pt-0.5" style={{ color: "var(--accent)" }}>
                    {edu.year}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
