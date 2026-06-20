"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="border-t py-8 px-6 md:px-10" style={{borderColor:"var(--border)", background:"var(--surface-1)"}}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <motion.p initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}
          className="text-xs tracking-[0.1em]" style={{color:"var(--text-muted)"}}>
          © 2026 Ahmed Shahdan · Studio AKOI · Malé, Maldives
        </motion.p>
        <motion.p initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{delay:0.1}}
          className="text-xs tracking-[0.1em]" style={{color:"var(--text-muted)"}}>
          Interior Architecture & Spatial Design
        </motion.p>
      </div>
    </footer>
  );
}
