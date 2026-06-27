"use client";

import { motion, Variants } from "framer-motion";
import { SafeImage } from "@/components/ui/SafeImage";
import Link from "next/link";
import React from "react";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number | string;
  image: string;
  tags?: string[];
}

interface ProductCard3DProps {
  product: Product;
}

export const cardVariants: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.96, 
    y: 40 
  },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export function ProductCard3D({ product }: ProductCard3DProps) {
  const formattedPrice = typeof product.price === "number" 
    ? `$${product.price.toFixed(2)}` 
    : String(product.price);

  return (
    <Link href={`/product/${product.id}`} className="block h-full cursor-pointer select-none">
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        className="group relative h-full flex flex-col bg-white/[0.02] backdrop-blur-md border border-white/5 hover:border-white/20 transition-all duration-500 overflow-hidden rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      >
        {/* Dynamic Gradient Glow on Hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-transparent to-neon-purple/10 pointer-events-none z-10 mix-blend-screen opacity-0"
          variants={{
            hover: { opacity: 1 }
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Specular Light Sweep overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none z-10"
          initial={{ x: "-100%" }}
          variants={{
            hover: { x: "100%" }
          }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Product Image Stage */}
        <div className="relative h-64 w-full flex items-center justify-center p-8 bg-black/20">
          <motion.div
            className="relative w-full h-full"
            variants={{
              initial: { scale: 1 },
              hover: { scale: 1.05 }
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <SafeImage
              src={product.image}
              alt={product.name}
              fill
              className="object-contain filter transition-all duration-700"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </motion.div>
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col flex-1 p-6 border-t border-white/5 relative z-20">
          <div className="flex justify-between items-baseline mb-4">
            <span className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.3em]">
              {product.category}
            </span>
            <span className="font-mono text-[13px] text-[#bbf3ff] font-bold tracking-widest">
              {formattedPrice}
            </span>
          </div>

          <motion.h3 
            className="font-sans font-bold text-[22px] tracking-[-0.01em] text-[#e2e8f0] group-hover:text-white transition-colors uppercase leading-[1.1]"
            variants={{
              initial: { y: 0 },
              hover: { y: -2 }
            }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {product.name}
          </motion.h3>

          {/* Technical Telemetry Metadata - Fades In on Hover */}
          <motion.div
            className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-1 overflow-hidden"
            variants={{
              initial: { opacity: 0, height: 0 },
              hover: { opacity: 1, height: "auto" }
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-mono text-[9px] text-gray-600 tracking-wider uppercase">
              ID // {product.id.slice(-6).toUpperCase()}
            </span>
            <span className="font-mono text-[9px] text-gray-600 tracking-wider uppercase">
              TAGS // {product.tags ? product.tags.join(" // ") : "HARDWARE"}
            </span>
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
}
