"use client";

import { motion } from "framer-motion";
import { Reveal, CountUp, EASE } from "./anim";

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

const railStyle: React.CSSProperties = { writingMode: "vertical-rl", transform: "rotate(180deg)" };

export default function About() {
  return (
    <section id="about" className="relative py-28 md:py-40 border-t" style={{ borderColor: "var(--border)" }}>
      {/* vertical side rail */}
      <div
        className="hidden lg:flex flex-col justify-between items-center absolute left-6 top-32 bottom-32 text-[11px] tracking-[0.2em] uppercase"
        style={{ color: "var(--text-secondary)" }}
        aria-hidden
      >
        <span style={railStyle}>Interior Architect</span>
        <span style={railStyle}>Highlights</span>
        <span className="tabular-nums">02</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:pl-16">
        {/* section label */}
        <Reveal>
          <div className="flex items-center gap-4 mb-12 md:mb-16">
            <span className="text-xs tracking-[0.25em] uppercase" style={{ color: "var(--text-secondary)" }}>Section</span>
            <span className="h-px w-12" style={{ background: "var(--border)" }} />
            <span className="text-xs tabular-nums tracking-[0.2em]" style={{ color: "var(--accent)" }}>02</span>
          </div>
        </Reveal>

        {/* heading + side note */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-16 mb-14 md:mb-20">
          <Reveal className="md:flex-1">
            <h2
              className="font-[family-name:var(--font-space)] font-bold leading-[0.9] tracking-tight text-balance"
              style={{ color: "var(--text-primary)", fontSize: "clamp(3rem, 9vw, 6rem)" }}
            >
              AHMED SHAHDAN
            </h2>
          </Reveal>
          <Reveal delay={0.12} className="md:w-72 md:pt-4 shrink-0">
            <p className="text-sm leading-relaxed" style={{ color: "var(--accent)" }}>
              Interior architect · AKOI Studio, based in Malé, Maldives. Specialising in
              spatial design, fit-out and bespoke interior architecture across residential
              and hospitality work.
            </p>
          </Reveal>
        </div>

        {/* big statement with one emphasized link */}
        <Reveal>
          <p
            className="font-[family-name:var(--font-space)] font-medium leading-[1.15] tracking-tight max-w-5xl text-pretty mb-24 md:mb-32"
            style={{ color: "#808080", fontSize: "clamp(1.6rem, 4.2vw, 3rem)" }}
          >
            I design interiors where spatial planning, light and material come together
            quietly — spaces that feel effortless to live and work in. Have a space in mind?{" "}
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="underline underline-offset-[6px] decoration-2 cursor-pointer transition-colors"
              style={{ color: "var(--text-primary)", textDecorationColor: "var(--accent)" }}
            >
              Let&rsquo;s talk.
            </button>
          </p>
        </Reveal>

        {/* figures */}
        <div
          className="grid grid-cols-3 gap-4 py-10 md:py-12 mb-24 md:mb-32"
          style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
        >
          {figures.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.1}>
              <CountUp
                to={f.to}
                suffix={f.suffix}
                className="block font-[family-name:var(--font-space)] text-5xl md:text-7xl font-bold tracking-tight mb-2 text-[var(--accent)]"
              />
              <span className="text-xs tracking-[0.12em] uppercase" style={{ color: "var(--text-secondary)" }}>
                {f.label}
              </span>
            </Reveal>
          ))}
        </div>

        {/* experience + education */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <div>
            <Reveal>
              <p className="text-xs tracking-[0.2em] uppercase mb-8" style={{ color: "var(--text-secondary)" }}>Experience</p>
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
                        <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full align-middle" style={{ background: "var(--accent)" }} />
                      )}
                    </p>
                    <p className="text-sm mt-1" style={{ color: "var(--accent)" }}>{exp.company}</p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{exp.location}</p>
                  </div>
                  <span className="text-xs shrink-0 tabular-nums pt-1" style={{ color: "var(--text-secondary)" }}>{exp.period}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <Reveal>
              <p className="text-xs tracking-[0.2em] uppercase mb-8" style={{ color: "var(--text-secondary)" }}>Education</p>
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
                    <p className="text-sm font-medium transition-colors duration-300 text-[var(--text-primary)] group-hover:text-[var(--accent)]">{edu.degree}</p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{edu.school}</p>
                  </div>
                  <span className="text-xs shrink-0 tabular-nums pt-0.5" style={{ color: "var(--accent)" }}>{edu.year}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
