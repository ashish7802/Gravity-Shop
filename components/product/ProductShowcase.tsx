"use client";

import { useState, useEffect, useMemo } from "react";
import { ProductGrid } from "./ProductGrid";
import { CategoryFilter } from "./CategoryFilter";

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
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
        const formatted: Product[] = list.map((p) => ({
          id: p._id ? String(p._id) : p.id ? String(p.id) : String(Math.random()),
          name: typeof p.name === "string" ? p.name : "Hardware Asset",
          category: typeof p.category === "string" ? p.category : "Hardware",
          price: typeof p.price === "number" ? p.price : 99,
          image: typeof p.image === "string" ? p.image : "/headset.png",
          description: typeof p.description === "string" ? p.description : "",
          tags: Array.isArray(p.tags) ? (p.tags as string[]) : [],
        }));
        setProducts(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products", err);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());
  }, [products, activeCategory]);

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
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4">
          <div className="space-y-2">
            <span className="font-mono text-[11px] text-[#bbf3ff] tracking-widest uppercase block">
              REGISTRY // VERIFIED_HARDWARE_CATALOG
            </span>
            <h2 className="font-sans font-black text-[32px] uppercase tracking-tighter leading-none text-white">
              THE COLLECTION
            </h2>
          </div>
          <div className="font-mono text-[11px] text-gray-500 tracking-wider">
            {`SYS_REGISTRY // ASSETS: ${filteredProducts.length} OF ${products.length} ACTIVE`}
          </div>
        </div>

        {/* Dynamic Category Filter */}
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        {/* Dynamic Grid */}
        <ProductGrid products={filteredProducts} />

      </div>
    </section>
  );
}
