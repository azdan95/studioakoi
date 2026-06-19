"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

const links = ["About", "Work", "Services", "Skills", "Contact"];

export default function Navbar() {
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 0.96]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  useEffect(() => {
    const sections = links.map((l) => document.getElementById(l.toLowerCase()));
    const handler = () => {
      const y = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const s = sections[i];
        if (s && s.offsetTop <= y) { setActive(links[i]); return; }
      }
      setActive("");
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
      {/* theme-aware background that fades in on scroll */}
      <motion.div className="absolute inset-0 pointer-events-none"
        style={{ opacity: bgOpacity, background: "var(--background)" }} />
      <motion.div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ opacity: borderOpacity, background: "var(--border)" }} />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16">
        <motion.button
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-[family-name:var(--font-space)] text-base font-bold tracking-[0.2em] uppercase cursor-pointer"
          style={{ color: "var(--text-primary)" }}
        >
          STUDIO <span style={{ color: "var(--accent)" }}>AKOI</span>
        </motion.button>

        <div className="flex items-center gap-5 md:gap-8">
          <motion.ul initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
            className="hidden md:flex gap-8">
            {links.map((link) => (
              <li key={link}>
                <motion.button onClick={() => scrollTo(link)}
                  whileTap={{ scale: 0.94 }}
                  className="group relative pb-1.5 text-xs font-medium tracking-[0.15em] uppercase transition-colors cursor-pointer"
                  style={{ color: active === link ? "var(--text-primary)" : "var(--text-muted)" }}>
                  {link}
                  {/* hover underline */}
                  <span
                    className="absolute left-0 bottom-0 h-px w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ background: "var(--accent)" }}
                  />
                  {/* active indicator slides between links */}
                  {active === link && (
                    <motion.span layoutId="nav-dot" className="absolute left-0 bottom-0 h-px w-full" style={{ background: "var(--accent)" }} />
                  )}
                </motion.button>
              </li>
            ))}
          </motion.ul>

          <ThemeToggle />

          <motion.button className="md:hidden flex flex-col items-end justify-center w-10 h-10 -mr-2 cursor-pointer"
            style={{ color: "var(--text-secondary)" }} whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu" aria-expanded={menuOpen} aria-controls="mobile-menu">
            <motion.span className="block h-px bg-current" animate={{ width: menuOpen ? 20 : 20, rotate: menuOpen ? 45 : 0, y: menuOpen ? 5 : 0 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }} />
            <motion.span className="block h-px bg-current my-1" animate={{ width: 12, opacity: menuOpen ? 0 : 1 }} transition={{ duration: 0.2 }} />
            <motion.span className="block h-px bg-current" animate={{ width: 20, rotate: menuOpen ? -45 : 0, y: menuOpen ? -5 : 0 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }} />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div key="mobile-menu" id="mobile-menu"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative md:hidden overflow-hidden border-t"
            style={{ background: "var(--background)", borderColor: "var(--border)" }}>
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map((link, i) => (
                <motion.button key={link} onClick={() => scrollTo(link)}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  whileTap={{ scale: 0.96 }}
                  className="text-sm tracking-[0.15em] uppercase text-left cursor-pointer w-fit"
                  style={{ color: active === link ? "var(--text-primary)" : "var(--text-muted)" }}>
                  {link}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
