"use client";

import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";

const projects = [
  {
    id: 1,
    title: "Lagoon Spa Pavilion",
    category: "Hospitality",
    year: "2024",
    location: "Malé, Maldives",
    description: "Overwater spa retreat fusing Maldivian timber craft with a floating pool pavilion. Natural light and ocean ventilation replace mechanical systems throughout.",
    image: "/portfolio/spa-pavilion.png",
  },
  {
    id: 2,
    title: "Event Pavilion",
    category: "Event & Hospitality",
    year: "2023",
    location: "Malé, Maldives",
    description: "An intimate open-air celebration venue with handwoven ceiling lanterns, Persian-inspired rugs, and a canopy of festoon lighting set against a night sky.",
    image: "/portfolio/event-pavilion.png",
  },
  {
    id: 3,
    title: "Hotel Lobby & Gallery",
    category: "Commercial Interior",
    year: "2023",
    location: "Maldives",
    description: "A warm copper-clad hotel lobby designed as a gallery walk — raw stone, louvred ceilings, and curated art meet at the point of arrival.",
    image: "/portfolio/hotel-lobby.jpg",
  },
  {
    id: 4,
    title: "Cultural Centre",
    category: "Institutional",
    year: "2022",
    location: "Wellington, NZ",
    description: "A civic cultural space anchored by a mature Japanese maple and a reflective pond. Slatted timber ceilings diffuse daylight across the public concourse.",
    image: "/portfolio/cultural-center.png",
  },
  {
    id: 5,
    title: "Forest Retreat Cabins",
    category: "Residential",
    year: "2022",
    location: "New Zealand",
    description: "Cantilevered angular cabins suspended within a pine forest. Faceted black-steel forms contrast with exposed timber decking and full-height glazing.",
    image: "/portfolio/forest-retreat.jpg",
  },
] as const;

type Project = (typeof projects)[number];

/* ---------- shared visuals ---------- */

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(33,36,49,0.85)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-2xl w-full rounded-sm overflow-hidden"
        style={{ background: "var(--background)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-72 w-full">
          <Image src={project.image} alt={project.title} fill className="object-cover" sizes="672px" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--background) 0%, transparent 60%)" }} />
        </div>
        <div className="p-8 -mt-8 relative">
          <div className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "var(--accent)" }}>
            {project.category} · {project.year} · {project.location}
          </div>
          <h2 className="font-[family-name:var(--font-space)] text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>{project.title}</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{project.description}</p>
        </div>
        <motion.button onClick={onClose} aria-label="Close"
          whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full cursor-pointer"
          style={{ background: "rgba(33,36,49,0.7)", border: "1px solid var(--border)" }}>
          <X size={14} color="rgba(245,245,245,0.8)" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function ProjectFace({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="group relative block w-full aspect-[4/3] overflow-hidden rounded-sm cursor-pointer text-left"
      style={{ border: "1px solid var(--border)" }}
    >
      <Image
        src={project.image}
        alt={project.title}
        fill
        className="object-cover transition-all duration-700 ease-in-out grayscale group-hover:grayscale-0 group-hover:scale-105"
        sizes="(max-width:768px) 80vw, 40vw"
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,16,22,0.92) 0%, rgba(15,16,22,0.25) 55%, transparent 100%)" }} />
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
        <div className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--accent)" }}>
          {project.category} · {project.year}
        </div>
        <h3 className="font-[family-name:var(--font-space)] text-2xl md:text-3xl font-semibold text-white leading-tight mb-1">
          {project.title}
        </h3>
        <p className="text-xs tracking-wider" style={{ color: "rgba(245,245,245,0.6)" }}>{project.location}</p>
      </div>
      <span className="absolute bottom-0 left-0 right-0 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" style={{ background: "var(--accent)" }} />
    </button>
  );
}

/* ---------- coverflow card ---------- */

function CoverCard({
  project, index, centerIndex, cardVW, gapVW, onOpen,
}: {
  project: Project;
  index: number;
  centerIndex: MotionValue<number>;
  cardVW: number;
  gapVW: number;
  onOpen: () => void;
}) {
  const dist = useTransform(centerIndex, (c) => index - c);
  const rotateY = useTransform(dist, (d) => Math.max(-1.4, Math.min(1.4, d)) * -22);
  const scale = useTransform(dist, (d) => 1 - Math.min(Math.abs(d), 1) * 0.16);
  const opacity = useTransform(dist, (d) => 1 - Math.min(Math.abs(d), 1.8) * 0.4);
  const zIndex = useTransform(dist, (d) => 100 - Math.round(Math.abs(d) * 10));

  return (
    <motion.div
      style={{ width: `${cardVW}vw`, marginRight: `${gapVW}vw`, rotateY, scale, opacity, zIndex }}
      className="relative shrink-0 will-change-transform"
    >
      <ProjectFace project={project} onOpen={onOpen} />
    </motion.div>
  );
}

/* ---------- gallery ---------- */

export default function Gallery() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState<Project | null>(null);
  const [geo, setGeo] = useState({ cardVW: 40, gapVW: 4 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const N = projects.length;
  const slot = geo.cardVW + geo.gapVW;
  const x = useTransform(scrollYProgress, (t) => `${50 - geo.cardVW / 2 - t * (N - 1) * slot}vw`);
  const centerIndex = useTransform(scrollYProgress, (t) => t * (N - 1));

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setGeo(w < 768 ? { cardVW: 80, gapVW: 6 } : w < 1024 ? { cardVW: 56, gapVW: 5 } : { cardVW: 40, gapVW: 4 });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* reduced-motion / fallback: a calm vertical grid, no scroll-jacking */
  if (reduced) {
    return (
      <section id="work" className="py-24 md:py-32 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-xs tracking-[0.25em] uppercase mb-3" style={{ color: "var(--accent)" }}>Selected Work</p>
          <h2 className="font-[family-name:var(--font-space)] text-4xl md:text-5xl font-bold" style={{ color: "var(--text-primary)" }}>Portfolio</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => <ProjectFace key={p.id} project={p} onOpen={() => setActive(p)} />)}
        </div>
        <AnimatePresence>{active && <ProjectModal project={active} onClose={() => setActive(null)} />}</AnimatePresence>
      </section>
    );
  }

  return (
    <section id="work" ref={ref} style={{ height: `${N * 60}vh` }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        {/* header overlay */}
        <div className="absolute top-0 left-0 right-0 z-30 px-6 md:px-10 pt-24 md:pt-28 pointer-events-none">
          <div className="max-w-7xl mx-auto flex items-end justify-between gap-6">
            <div>
              <p className="text-xs tracking-[0.25em] uppercase mb-3" style={{ color: "var(--accent)" }}>Selected Work</p>
              <h2 className="font-[family-name:var(--font-space)] text-4xl md:text-6xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Portfolio</h2>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs tracking-[0.15em] uppercase" style={{ color: "var(--text-muted)" }}>
              <ArrowLeft size={14} /> Scroll <ArrowRight size={14} />
            </div>
          </div>
        </div>

        {/* coverflow track (perspective lives here so rotateY reads as 3D) */}
        <motion.div style={{ x, perspective: 1600 }} className="flex items-center will-change-transform">
          {projects.map((p, i) => (
            <CoverCard key={p.id} project={p} index={i} centerIndex={centerIndex} cardVW={geo.cardVW} gapVW={geo.gapVW} onOpen={() => setActive(p)} />
          ))}
        </motion.div>

        {/* progress rail */}
        <div className="absolute bottom-12 left-6 right-6 md:left-10 md:right-10 h-px" style={{ background: "var(--border)" }}>
          <motion.div className="h-full origin-left" style={{ scaleX: scrollYProgress, background: "var(--accent)" }} />
        </div>
      </div>

      {/* modal rendered outside the transformed track so position:fixed anchors to the viewport */}
      <AnimatePresence>{active && <ProjectModal project={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </section>
  );
}
