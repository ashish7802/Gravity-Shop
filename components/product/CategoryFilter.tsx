"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";

export const CATEGORIES = ["All", "Sneakers", "Electronics", "Gaming", "Fashion", "Accessories"];

interface CategoryFilterProps {
  activeCategory: string;
  onSelect: (category: string) => void;
}

export function CategoryFilter({ activeCategory, onSelect }: CategoryFilterProps) {
  const { setHoveringInteractive } = useAppStore();

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-12">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          onMouseEnter={() => setHoveringInteractive(true)}
          onMouseLeave={() => setHoveringInteractive(false)}
          className="relative px-6 py-2 rounded-full text-sm font-medium transition-colors"
        >
          <span className={`relative z-10 transition-colors duration-300 ${activeCategory === category ? "text-space-900 font-bold" : "text-gray-400 hover:text-white"}`}>
            {category}
          </span>
          
          {activeCategory === category && (
            <motion.div
              layoutId="activeCategoryIndicator"
              className="absolute inset-0 bg-neon-cyan rounded-full shadow-[0_0_15px_rgba(0,240,255,0.5)]"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}
          
          {activeCategory !== category && (
            <div className="absolute inset-0 border border-white/10 rounded-full hover:border-white/30 transition-colors duration-300" />
          )}
        </button>
      ))}
    </div>
  );
}
