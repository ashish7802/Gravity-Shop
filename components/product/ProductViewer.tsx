"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ProductPreviewScene } from "./ProductPreviewScene";
import { ProductDetailsPanel } from "./ProductDetailsPanel";
import { useAppStore } from "@/store/useAppStore";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  tags: string[];
  stock: number;
}

export function ProductViewer() {
  const { addToCart } = useAppStore();
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((p: { _id: string; [key: string]: unknown }) => ({
          ...p,
          id: p._id.toString(),
        }));
        
        // Find Acoustic Prime Headset as our primary 3D showcase product
        const headset = formatted.find((p: Product) => p.name.includes("Acoustic Prime"));
        setFeaturedProduct(headset || formatted[0] || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products for viewer", err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = () => {
    if (featuredProduct) {
      addToCart({
        id: featuredProduct.id,
        name: featuredProduct.name,
        category: featuredProduct.category,
        price: featuredProduct.price,
        image: featuredProduct.image,
      });
    }
  };

  if (loading || !featuredProduct) {
    return (
      <div className="relative min-h-[60vh] flex items-center justify-center bg-[#08080a]">
        <span className="font-mono text-xs text-[#bbf3ff] animate-pulse tracking-[0.2em]">INITIALIZING 3D ENGINE...</span>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen bg-[#08080a] overflow-hidden flex items-center border-t border-white/5 py-24">
      {/* Background radial technical glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#bbf3ff]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: 3D Scene */}
          <motion.div 
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 w-full relative"
          >
            <ProductPreviewScene />
            
            {/* Ambient telemetry label */}
            <div className="absolute top-6 left-6 pointer-events-none font-mono text-[9px] tracking-widest text-[#888899] uppercase">
              SECTOR_01 // 3D_VOLUMETRIC_STAGE
            </div>
          </motion.div>

          {/* Right: Technical specifications panel */}
          <motion.div 
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 w-full flex justify-center lg:justify-end"
          >
            <ProductDetailsPanel product={featuredProduct} onAddToCart={handleAddToCart} />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
