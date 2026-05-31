"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SafeImage } from "@/components/ui/SafeImage";
import { Star, ShoppingCart } from "lucide-react";
import React, { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { CartFlyAnimation } from "@/components/animations/CartFlyAnimation";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  rating: number;
  image: string;
}

interface ProductCard3DProps {
  product: Product;
  index: number;
}

export function ProductCard3D({ product, index }: ProductCard3DProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const { setHoveringInteractive, addToCart } = useAppStore();
  const [flyAnimId, setFlyAnimId] = useState<string | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setStartPos({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    setFlyAnimId(product.id + Date.now());
  };

  const onFlyComplete = () => {
    setFlyAnimId(null);
    addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price.replace('$', '')),
      category: product.category,
      image: product.image
    });
  };

  return (
    <>
      {flyAnimId && (
        <CartFlyAnimation
          id={flyAnimId}
          image={product.image}
          startPos={startPos}
          onComplete={onFlyComplete}
        />
      )}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className="perspective-1000 w-full h-full"
      >
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative rounded-2xl glass-panel neon-border p-6 flex flex-col gap-6 cursor-pointer group h-full"
        >
          <div 
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none"
            style={{ transform: "translateZ(1px)" }}
          />

          <div 
            className="relative h-48 w-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
            style={{ transform: "translateZ(50px)" }}
          >
            <div className="absolute inset-0 bg-neon-cyan/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <SafeImage
              src={product.image}
              alt={product.name}
              fill
              className="object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]"
            />
          </div>

          <div 
            className="flex flex-col gap-2 mt-auto"
            style={{ transform: "translateZ(30px)" }}
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono text-neon-cyan tracking-widest uppercase">
                {product.category}
              </span>
              <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-md border border-white/10">
                <Star className="w-3 h-3 text-neon-magenta fill-neon-magenta" />
                <span className="text-xs font-bold text-white">{product.rating}</span>
              </div>
            </div>

            <h3 className="font-display font-bold text-xl text-white group-hover:text-neon-cyan transition-colors">
              {product.name}
            </h3>

            <div className="flex items-center justify-between mt-2">
              <p className="font-mono font-bold text-xl text-white">{product.price}</p>
              <button 
                onClick={handleAddToCart}
                onMouseEnter={() => setHoveringInteractive(true)}
                onMouseLeave={() => setHoveringInteractive(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-neon-cyan text-white hover:text-space-900 flex items-center justify-center transition-colors backdrop-blur-md z-20"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
