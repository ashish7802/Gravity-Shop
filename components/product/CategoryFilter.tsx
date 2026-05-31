"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";

export const CATEGORIES = ["All", "Eyewear", "Audio", "Wearables", "Peripherals", "Apparel"];

interface CategoryFilterProps {
  activeCategory: string;
  onSelect: (category: string) => void;
}

export function CategoryFilter({ activeCategory, onSelect }: CategoryFilterProps) {
  const { setHoveringInteractive } = useAppStore();

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-16 font-mono text-[10px] tracking-widest">
      {CATEGORIES.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            onMouseEnter={() => setHoveringInteractive(true)}
            onMouseLeave={() => setHoveringInteractive(false)}
            className="relative px-6 py-3 rounded-none transition-colors uppercase"
          >
            <span className={`relative z-10 transition-colors duration-300 ${isActive ? "text-black font-bold" : "text-gray-400 hover:text-white"}`}>
              {category}
            </span>
            
            {isActive && (
              <motion.div
                layoutId="activeCategoryIndicator"
                className="absolute inset-0 bg-[#bbf3ff] rounded-sm"
                transition={{ type: "spring", stiffness: 80, damping: 24 }}
              />
            )}
            
            {!isActive && (
              <div className="absolute inset-0 border border-white/5 hover:border-white/20 rounded-sm transition-colors duration-300" />
            )}
          </button>
        );
      })}
    </div>
  );
}
