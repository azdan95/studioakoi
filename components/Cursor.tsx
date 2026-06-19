"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

export default function Cursor() {
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };
    const down = () => setClicked(true);
    const up   = () => setClicked(false);
    const checkHover = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setHovered(!!el.closest("a, button, [role='button'], input, textarea, label"));
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousemove", checkHover);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousemove", checkHover);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [rawX, rawY]);

  return (
    <motion.div
      style={{
        x: rawX,
        y: rawY,
        translateX: "-50%",
        translateY: "-50%",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: "none",
        width:  clicked ? 5 : hovered ? 12 : 8,
        height: clicked ? 5 : hovered ? 12 : 8,
        borderRadius: "50%",
        background: "#EA5C1F",
        transition: "width 0.15s ease, height 0.15s ease",
      }}
    />
  );
}
