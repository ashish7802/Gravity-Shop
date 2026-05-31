"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Cpu, Battery, Zap, Shield } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface ProductDetailsPanelProps {
  onAddToCart: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function ProductDetailsPanel({ onAddToCart }: ProductDetailsPanelProps) {
  const { setHoveringInteractive } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="flex flex-col gap-6 w-full max-w-md pointer-events-auto"
    >
      <GlassPanel>
        <div className="flex justify-between items-start mb-4">
          <div>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 text-neon-cyan text-xs font-bold tracking-widest uppercase mb-2 bg-neon-cyan/10 px-2 py-1 rounded"
            >
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
              In Stock
            </motion.div>
            <h2 className="font-display font-bold text-4xl text-white">NeuralSync <br/> Headset</h2>
          </div>
          <p className="text-3xl font-mono text-neon-purple font-light">$299</p>
        </div>
        
        <p className="text-gray-400 font-light text-sm mb-6">
          Direct neural interface audio with zero latency. Experience sound not through your ears, but directly within your consciousness.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { icon: Cpu, label: "Quantum Chip" },
            { icon: Battery, label: "200h Battery" },
            { icon: Zap, label: "Zero Latency" },
            { icon: Shield, label: "Titanium Build" }
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <stat.icon className="w-5 h-5 text-gray-400" />
              <span className="text-xs font-bold text-gray-300">{stat.label}</span>
            </div>
          ))}
        </div>

        <button 
          onMouseEnter={() => setHoveringInteractive(true)}
          onMouseLeave={() => setHoveringInteractive(false)}
          onClick={onAddToCart}
          className="relative w-full overflow-hidden group py-4 rounded-xl bg-white text-space-900 font-bold transition-transform active:scale-95"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            ADD TO CART
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-white to-neon-magenta opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />
        </button>
      </GlassPanel>
    </motion.div>
  );
}
