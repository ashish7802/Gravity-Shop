"use client";

import { motion } from "framer-motion";

export function FloatingGradientBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep space base layer */}
      <div className="absolute inset-0 bg-space-900" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_10%,transparent_100%)]" />

      {/* Floating Orbs */}
      <motion.div
        animate={{
          x: ["0%", "20%", "-20%", "0%"],
          y: ["0%", "-20%", "20%", "0%"],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-neon-purple/20 rounded-full blur-[120px] mix-blend-screen"
      />
      
      <motion.div
        animate={{
          x: ["0%", "-30%", "10%", "0%"],
          y: ["0%", "20%", "-30%", "0%"],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-cyan/20 rounded-full blur-[100px] mix-blend-screen"
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 0.8, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-magenta/10 rounded-full blur-[150px] mix-blend-screen"
      />
    </div>
  );
}
