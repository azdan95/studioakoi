"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";

const projects = [
  {
    id: 1,
    title: "Lagoon Spa Pavilion",
    category: "Hospitality",
    cat: "Hospitality",
    year: "2024",
    location: "Malé, Maldives",
    description: "Overwater spa retreat fusing Maldivian timber craft with a floating pool pavilion. Natural light and ocean ventilation replace mechanical systems throughout.",
    image: "/portfolio/spa-pavilion.png",
    ratio: 1,
  },
  {
    id: 2,
    title: "Event Pavilion",
    category: "Event & Hospitality",
    cat: "Hospitality",
    year: "2023",
    location: "Malé, Maldives",
    description: "An intimate open-air celebration venue with handwoven ceiling lanterns, Persian-inspired rugs, and a canopy of festoon lighting set against a night sky.",
    image: "/portfolio/event-pavilion.png",
    ratio: 1.5,
  },
  {
    id: 3,
    title: "Hotel Lobby & Gallery",
    category: "Commercial Interior",
    cat: "Commercial",
    year: "2023",
    location: "Maldives",
    description: "A warm copper-clad hotel lobby designed as a gallery walk — raw stone, louvred ceilings, and curated art meet at the point of arrival.",
    image: "/portfolio/hotel-lobby.jpg",
    ratio: 1.409,
  },
  {
    id: 4,
    title: "Cultural Centre",
    category: "Institutional",
    cat: "Cultural",
    year: "2022",
    location: "Wellington, NZ",
    description: "A civic cultural space anchored by a mature Japanese maple and a reflective pond. Slatted timber ceilings diffuse daylight across the public concourse.",
    image: "/portfolio/cultural-center.png",
    ratio: 1.5,
  },
  {
    id: 5,
    title: "Forest Retreat Cabins",
    category: "Residential",
    cat: "Residential",
    year: "2022",
    location: "New Zealand",
    description: "Cantilevered angular cabins suspended within a pine forest. Faceted black-steel forms contrast with exposed timber decking and full-height glazing.",
    image: "/portfolio/forest-retreat.jpg",
    ratio: 1.431,
  },
] as const;

type Project = (typeof projects)[number];

// full category set (some are aspirational — shown but disabled when empty)
const CATEGORIES = ["Residential", "Hospitality", "Commercial", "Cultural", "Retail", "Design", "Concept"];

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const map: Record<string, string> = {
    tl: "-top-2 -left-2 border-t border-l",
    tr: "-top-2 -right-2 border-t border-r",
    bl: "-bottom-2 -left-2 border-b border-l",
    br: "-bottom-2 -right-2 border-b border-r",
  };
  return <span className={`pointer-events-none absolute w-4 h-4 ${map[pos]}`} style={{ borderColor: "var(--text-muted)" }} aria-hidden />;
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
      style={{ background: "rgba(20,22,29,0.92)" }} onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full" style={{ aspectRatio: String(project.ratio), maxHeight: "82vh" }}>
          <Image src={project.image} alt={project.title} fill className="object-contain" sizes="100vw" />
        </div>
        <p className="text-sm mt-4" style={{ color: "rgba(245,245,245,0.85)" }}>
          <span className="font-[family-name:var(--font-space)] font-semibold">{project.title}</span>
          <span style={{ color: "rgba(245,245,245,0.5)" }}> — {project.category} · {project.year} · {project.location}</span>
        </p>
        <motion.button onClick={onClose} aria-label="Close"
          whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer"
          style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
          <X size={16} style={{ color: "var(--text-primary)" }} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default function Gallery() {
  const reduced = useReducedMotion();
  const [cat, setCat] = useState("All");
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState<Project | null>(null);

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    projects.forEach((p) => { m[p.cat] = (m[p.cat] || 0) + 1; });
    return m;
  }, []);

  const filtered = useMemo<readonly Project[]>(
    () => (cat === "All" ? projects : projects.filter((p) => p.cat === cat)),
    [cat]
  );
  const N = filtered.length;
  const project = filtered[Math.min(index, N - 1)];

  const selectCat = (c: string) => { setCat(c); setIndex(0); };
  const go = useCallback((dir: number) => setIndex((i) => (i + dir + N) % N), [N]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (active) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, active]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section id="work" className="py-24 md:py-36 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* header */}
        <div className="flex items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase mb-3" style={{ color: "var(--accent)" }}>Selected Work</p>
            <h2 className="font-[family-name:var(--font-space)] text-4xl md:text-6xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Portfolio</h2>
          </div>
          <p className="font-[family-name:var(--font-space)] text-sm tabular-nums shrink-0" style={{ color: "var(--text-secondary)" }}>
            <span style={{ color: "var(--accent)" }}>{pad(index + 1)}</span> / {pad(N)}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* category sidebar */}
          <aside className="lg:w-40 shrink-0">
            <p className="text-[11px] tracking-[0.25em] uppercase mb-5" style={{ color: "var(--text-secondary)" }}>Categories</p>
            <ul className="flex flex-wrap lg:flex-col gap-x-5 gap-y-3">
              {["All", ...CATEGORIES].map((c) => {
                const count = c === "All" ? projects.length : counts[c] || 0;
                const isActive = cat === c;
                const disabled = count === 0;
                return (
                  <li key={c}>
                    <button
                      onClick={() => !disabled && selectCat(c)}
                      disabled={disabled}
                      aria-pressed={isActive}
                      className="group/cat flex items-baseline gap-2 text-sm tracking-wide cursor-pointer transition-colors duration-300 disabled:cursor-not-allowed"
                      style={{ color: isActive ? "var(--accent)" : disabled ? "var(--text-muted)" : "var(--text-secondary)" }}
                    >
                      <span className={disabled ? "opacity-50" : "group-hover/cat:text-[var(--text-primary)] transition-colors"}>{c}</span>
                      <span className="text-[10px] tabular-nums" style={{ color: "var(--text-muted)" }}>{pad(count)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* viewer */}
          <div className="flex-1 min-w-0">
            <div
              className="group/viewer relative w-full mx-auto"
              style={{ aspectRatio: String(project.ratio), maxHeight: "70vh", maxWidth: `min(100%, ${70 * project.ratio}vh)` }}
            >
              <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />

              <AnimatePresence mode="wait">
                <motion.button
                  key={project.id}
                  type="button"
                  onClick={() => setActive(project)}
                  aria-label={`View ${project.title} full size`}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 cursor-pointer group"
                >
                  <Image src={project.image} alt={project.title} fill className="object-contain" sizes="(max-width:768px) 100vw, 70vw" priority={project.id === 1} />
                  <span className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "rgba(20,22,29,0.6)" }}>
                    <ArrowUpRight size={16} color="#fff" />
                  </span>
                </motion.button>
              </AnimatePresence>

              {N > 1 && (
                <>
                  <button onClick={() => go(-1)} aria-label="Previous project"
                    className="absolute left-1 md:left-3 top-1/2 -translate-y-1/2 z-10 p-2 cursor-pointer opacity-100 md:opacity-0 md:group-hover/viewer:opacity-100 transition-all duration-300 hover:-translate-x-0.5"
                    style={{ color: "var(--text-primary)" }}>
                    <ChevronLeft size={30} strokeWidth={1.25} />
                  </button>
                  <button onClick={() => go(1)} aria-label="Next project"
                    className="absolute right-1 md:right-3 top-1/2 -translate-y-1/2 z-10 p-2 cursor-pointer opacity-100 md:opacity-0 md:group-hover/viewer:opacity-100 transition-all duration-300 hover:translate-x-0.5"
                    style={{ color: "var(--text-primary)" }}>
                    <ChevronRight size={30} strokeWidth={1.25} />
                  </button>
                </>
              )}
            </div>

            {/* caption */}
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mt-10 md:mt-14">
              <AnimatePresence mode="wait">
                <motion.div key={project.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                  <h3 className="font-[family-name:var(--font-space)] text-2xl md:text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>{project.title}</h3>
                  <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                    <span style={{ color: "var(--accent)" }}>{project.category}</span> · {project.year} · {project.location}
                  </p>
                </motion.div>
              </AnimatePresence>

              {N > 1 && (
                <div className="flex items-center gap-2 shrink-0">
                  {filtered.map((p, i) => (
                    <button key={p.id} onClick={() => setIndex(i)} aria-label={`Go to ${p.title}`}
                      className="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
                      style={{ width: i === index ? 28 : 8, background: i === index ? "var(--accent)" : "var(--surface-2)" }} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>{active && <ProjectModal project={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </section>
  );
}
