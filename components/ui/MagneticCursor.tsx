"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";

export function MagneticCursor() {
  const { isHoveringInteractive } = useAppStore();
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-screen flex items-center justify-center"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        opacity: isVisible ? 1 : 0,
      }}
    >
      <motion.div
        animate={{
          scale: isHoveringInteractive ? 2.5 : 1,
          backgroundColor: isHoveringInteractive ? "rgba(0, 240, 255, 0.2)" : "rgba(157, 0, 255, 0.5)",
          border: isHoveringInteractive ? "1px solid rgba(0, 240, 255, 0.8)" : "1px solid rgba(157, 0, 255, 0.8)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-full h-full rounded-full shadow-[0_0_20px_rgba(157,0,255,0.6)] backdrop-blur-sm"
      />
      <motion.div 
        className="absolute w-1 h-1 bg-white rounded-full"
        animate={{ scale: isHoveringInteractive ? 0 : 1 }}
      />
    </motion.div>
  );
}
