"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (next === "dark") document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
    try { localStorage.setItem("theme", next); } catch {}
  };

  return (
    <motion.button onClick={toggle} aria-label="Toggle light or dark mode"
      whileHover={{ scale: 1.12, rotate: 12 }} whileTap={{ scale: 0.85 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transition-colors"
      style={{ color: "var(--text-secondary)" }}>
      <AnimatePresence mode="wait" initial={false}>
        {mounted ? (
          <motion.span key={theme}
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex">
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </motion.span>
        ) : (
          <span className="block w-[15px] h-[15px]" />
        )}
      </AnimatePresence>
    </motion.button>
  );
}
