"use client";

import { motion } from "framer-motion";
import React from "react";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function GlassPanel({ children, className = "", delay = 0 }: GlassPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`glass-panel neon-border rounded-2xl p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}
