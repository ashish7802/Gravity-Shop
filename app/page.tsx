"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Navbar } from "@/components/ui/Navbar";
import { Hero } from "@/components/ui/Hero";
import { ProductShowcase } from "@/components/product/ProductShowcase";
import dynamic from 'next/dynamic';

const Scene = dynamic(() => import("@/components/canvas/Scene").then(mod => mod.Scene), { ssr: false });
const ProductViewer = dynamic(() => import("@/components/product/ProductViewer").then(mod => mod.ProductViewer), { ssr: false });

export default function Home() {
  const { setMousePosition, isCartOpen } = useAppStore();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates to -1 to +1
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [setMousePosition]);

  return (
    <main className="relative min-h-screen selection:bg-neon-cyan/30 bg-space-900 text-white cursor-none overflow-hidden">
      <div 
        className={`transition-all duration-700 ease-in-out ${isCartOpen ? 'blur-md scale-[0.98] opacity-60 pointer-events-none' : 'blur-0 scale-100 opacity-100'}`}
      >
        <Scene />
        <Navbar />
        <Hero />
        <ProductShowcase />
        <ProductViewer />
      </div>
    </main>
  );
}
