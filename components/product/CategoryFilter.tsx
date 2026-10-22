"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";

interface CategoryFilterProps {
  categories?: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}

export function CategoryFilter({ categories = ["All", "Audio", "Accessories", "Displays"], activeCategory, onSelect }: CategoryFilterProps) {
  const { setHoveringInteractive } = useAppStore();

  return (
    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-10 font-mono text-[10px] tracking-widest">
      {categories.map((category) => {
        const isActive = activeCategory.toLowerCase() === category.toLowerCase();
        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            onMouseEnter={() => setHoveringInteractive(true)}
            onMouseLeave={() => setHoveringInteractive(false)}
            className="relative px-5 py-2.5 rounded-sm transition-colors uppercase cursor-pointer"
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
