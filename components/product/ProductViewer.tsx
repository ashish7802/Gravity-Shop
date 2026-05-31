"use client";

import { useState } from "react";
import { ProductPreviewScene } from "./ProductPreviewScene";
import { ProductDetailsPanel } from "./ProductDetailsPanel";
import { CartFlyAnimation } from "@/components/animations/CartFlyAnimation";
import { useAppStore } from "@/store/useAppStore";
import { v4 as uuidv4 } from "uuid";

interface CartAnimation {
  id: string;
  startPos: { x: number; y: number };
}

export function ProductViewer() {
  const [animations, setAnimations] = useState<CartAnimation[]>([]);
  const { addToCart } = useAppStore();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Get start position for animation from the button click
    const rect = e.currentTarget.getBoundingClientRect();
    const startPos = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    const newAnim = { id: uuidv4(), startPos };
    setAnimations((prev) => [...prev, newAnim]);
  };

  const handleAnimationComplete = (id: string) => {
    setAnimations((prev) => prev.filter((a) => a.id !== id));
    addToCart({
      id: "neural-sync-prime",
      name: "NeuralSync Prime",
      category: "Gaming",
      price: 299.00,
      image: "/headset.png"
    });
  };

  return (
    <section className="relative min-h-screen bg-space-900 overflow-hidden flex items-center border-t border-white/5 py-20">
      
      {/* Background cinematic glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-purple/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-12">
        
        {/* 3D Scene takes up left/center stage */}
        <div className="flex-1 w-full relative">
          <ProductPreviewScene />
          
          {/* Overlay text */}
          <div className="absolute top-4 left-4 md:top-12 md:left-12 pointer-events-none">
            <p className="text-neon-cyan font-mono text-sm tracking-widest uppercase mb-2">Interactive Mode</p>
            <p className="text-gray-500 font-light text-xs">Drag to rotate • Scroll to zoom</p>
          </div>
        </div>

        {/* Right side panel */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-end">
          <ProductDetailsPanel onAddToCart={handleAddToCart} />
        </div>
      </div>

      {/* Render active cart fly animations */}
      {animations.map((anim) => (
        <CartFlyAnimation
          key={anim.id}
          id={anim.id}
          startPos={anim.startPos}
          image="/headset.png"
          onComplete={() => handleAnimationComplete(anim.id)}
        />
      ))}
    </section>
  );
}
