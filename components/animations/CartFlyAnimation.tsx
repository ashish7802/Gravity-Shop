"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { SafeImage } from "@/components/ui/SafeImage";

interface CartFlyAnimationProps {
  id: string;
  image: string;
  startPos: { x: number; y: number };
  onComplete: () => void;
}

export function CartFlyAnimation({ id, image, startPos, onComplete }: CartFlyAnimationProps) {
  const { cartIconPosition } = useAppStore();

  if (!cartIconPosition) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={id}
        initial={{ 
          x: startPos.x, 
          y: startPos.y, 
          scale: 1, 
          opacity: 1,
          rotate: 0 
        }}
        animate={{ 
          x: cartIconPosition.x - 30, // Adjust for center alignment
          y: cartIconPosition.y - 30,
          scale: 0.1, 
          opacity: 0,
          rotate: 360
        }}
        transition={{ 
          duration: 0.8, 
          ease: [0.16, 1, 0.3, 1] // Apple-like smooth cinematic easing
        }}
        onAnimationComplete={onComplete}
        className="fixed z-[1000] pointer-events-none w-32 h-32 flex items-center justify-center drop-shadow-[0_0_30px_rgba(0,240,255,0.8)]"
        style={{ left: -64, top: -64 }} // Center the image based on startPos
      >
        <SafeImage src={image} alt="Adding to cart" fill className="object-contain" />
        
        {/* Particle trail */}
        <motion.div
          animate={{ scale: [1, 2], opacity: [0.8, 0] }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-neon-cyan blur-xl rounded-full mix-blend-screen"
        />
      </motion.div>
    </AnimatePresence>
  );
}
