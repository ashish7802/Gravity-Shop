"use client";

import { useState, useEffect } from "react";
import { ProductGrid } from "./ProductGrid";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  tags: string[];
}

export function ProductShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((p: { _id: string; [key: string]: unknown }) => ({
          ...p,
          id: p._id.toString(),
        }));
        setProducts(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="py-32 flex justify-center items-center bg-[#08080a]">
        <span className="font-mono text-xs text-[#bbf3ff] animate-pulse tracking-[0.2em]">INITIALIZING SHOWROOM GRID...</span>
      </div>
    );
  }

  return (
    <section id="showroom-registry" className="bg-[#08080a] text-white border-t border-white/5 py-32">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        
        {/* Technical Header */}
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4">
          <div className="space-y-2">
            <span className="font-mono text-[11px] text-[#bbf3ff] tracking-widest uppercase block">
              REGISTRY // VERIFIED_HARDWARE_CATALOG
            </span>
            <h2 className="font-sans font-black text-[32px] uppercase tracking-tighter leading-none text-white">
              THE COLLECTION
            </h2>
          </div>
          <div className="font-mono text-[11px] text-gray-500 tracking-wider">
            {`SYS_REGISTRY // ASSETS: ${products.length} ACTIVE`}
          </div>
        </div>

        {/* Dynamic Grid */}
        <ProductGrid products={products} />

      </div>
    </section>
  );
}
