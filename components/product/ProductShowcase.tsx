"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Product } from "./ProductCard3D";
import { ProductGrid } from "./ProductGrid";
import { CategoryFilter } from "./CategoryFilter";
import { FloatingGradientBackground } from "@/components/ui/FloatingGradientBackground";

export function ProductShowcase() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products${activeCategory !== "All" ? `?category=${activeCategory}` : ""}`);
        const data = await res.json();
        
        const formattedData = data.map((p: { _id: string, [key: string]: unknown }) => ({
          ...p,
          id: p._id.toString(),
        }));
        
        setProducts(formattedData);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  return (
    <section className="relative min-h-screen py-32 z-10 overflow-hidden border-t border-white/5">
      <FloatingGradientBackground />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-4xl md:text-6xl text-white mb-6">
            Curated From <br />
            <span className="text-gradient">The Future.</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto font-light text-lg">
            Equip yourself with next-generation technology and fashion, built for the trailblazers of tomorrow.
          </p>
        </motion.div>

        <CategoryFilter activeCategory={activeCategory} onSelect={setActiveCategory} />
        
        {loading ? (
          <div className="flex justify-center items-center h-64 w-full">
            <div className="w-8 h-8 rounded-full border-2 border-neon-cyan border-t-transparent animate-spin" />
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </section>
  );
}
