"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { GlassPanel } from "./GlassPanel";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden pointer-events-none">
      {/* Container for content that sits over the 3D canvas */}
      <div className="container mx-auto px-6 md:px-12 z-10 pointer-events-auto">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-panel mb-8 border-neon-purple/30 text-xs font-medium uppercase tracking-widest text-gray-300"
          >
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-glow-pulse" />
            Next-Gen Commerce
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="font-display font-bold text-6xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tighter mb-8"
          >
            DEFY <br />
            <span className="text-gradient">GRAVITY.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg md:text-2xl text-gray-400 max-w-xl mb-12 font-light"
          >
            Experience the pinnacle of digital luxury. Interactive, immersive, and impossibly smooth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <button className="group relative px-8 py-4 bg-white text-space-900 font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95">
              <span className="relative z-10 flex items-center gap-2">
                EXPLORE COLLECTION
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-white to-neon-purple opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />
            </button>
          </motion.div>
        </div>

        {/* Info Panels overlaying the 3D scene on the right side */}
        <div className="absolute right-6 md:right-12 bottom-12 hidden lg:flex flex-col gap-4 w-72">
          <GlassPanel delay={1}>
            <h3 className="text-neon-cyan text-sm font-bold tracking-widest mb-2">LIMITED EDITION</h3>
            <p className="text-gray-400 text-sm">Hyper-responsive 3D rendering with advanced physics and lighting.</p>
          </GlassPanel>
          <GlassPanel delay={1.2}>
            <div className="flex justify-between items-center text-sm font-mono">
              <span className="text-gray-500">SYSTEM STATUS</span>
              <span className="text-neon-magenta animate-pulse">ONLINE</span>
            </div>
          </GlassPanel>
        </div>
      </div>
    </section>
  );
}
