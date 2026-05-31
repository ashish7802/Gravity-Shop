"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";

export function ProductDataGrid() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0e0e12] border border-white/5 flex flex-col p-8 items-center justify-center min-h-[400px]">
        <span className="text-[#bbf3ff] font-mono text-xs animate-pulse tracking-[0.2em]">FETCHING INVENTORY REGISTRY...</span>
      </div>
    );
  }

  return (
    <div className="bg-[#0e0e12] border border-white/5 rounded-none flex flex-col font-mono text-[10px]">
      
      {/* Toolbar */}
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/10">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <input 
            type="text" 
            placeholder="FILTER REGISTRY..." 
            className="w-full bg-black/35 border border-white/5 rounded-sm py-2 pl-10 pr-4 text-white text-[10px] focus:border-white/20 outline-none transition-all placeholder:text-gray-600 font-mono tracking-widest"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-white/5 hover:border-white/20 hover:bg-white/5 text-[10px] text-gray-400 hover:text-white transition-all rounded-sm tracking-widest">
          <Filter className="w-3.5 h-3.5" /> FILTER
        </button>
      </div>

      {/* Grid Header */}
      <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 text-gray-500 uppercase tracking-widest bg-black/20 font-bold">
        <div className="col-span-4">ASSET // IDENTIFIER</div>
        <div className="col-span-2">CATEGORY</div>
        <div className="col-span-2">NOMINAL VALUE</div>
        <div className="col-span-2">STOCK MATRIX</div>
        <div className="col-span-2 text-right">STATUS // TELEMETRY</div>
      </div>

      {/* Grid Body */}
      <div className="divide-y divide-white/5">
        {products.map((product, idx) => {
          const status = product.stock > 10 ? "OK" : product.stock > 0 ? "ALERT" : "DEPLETED";
          const formattedPrice = typeof product.price === "number" ? product.price : parseFloat(product.price);
          
          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
              key={product._id} 
              className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/[0.02] transition-colors"
            >
              {/* Asset Identifier */}
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-black/20 border border-white/5 flex items-center justify-center overflow-hidden rounded-sm">
                  {product.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain p-1" />
                  )}
                </div>
                <div>
                  <p className="font-sans font-bold text-white text-xs uppercase tracking-tight">{product.name}</p>
                  <p className="text-gray-500 text-[9px] mt-0.5">ID: {product._id.slice(-8).toUpperCase()}</p>
                </div>
              </div>
              
              {/* Category */}
              <div className="col-span-2">
                <span className="text-gray-400 uppercase">{product.category}</span>
              </div>
              
              {/* Value */}
              <div className="col-span-2">
                <span className="text-white font-medium">${formattedPrice.toFixed(2)}</span>
              </div>
              
              {/* Stock */}
              <div className="col-span-2">
                <span className="text-gray-400">{product.stock} UNITS</span>
              </div>
              
              {/* Status */}
              <div className="col-span-2 text-right">
                <span className={`px-2 py-0.5 border font-bold text-[9px] rounded-sm ${
                  status === "OK" ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/5" :
                  status === "ALERT" ? "border-[#ffa000]/20 text-[#ffa000] bg-[#ffa000]/5" :
                  "border-red-500/20 text-red-400 bg-red-500/5"
                }`}>
                  {status}
                </span>
              </div>
            </motion.div>
          );
        })}
        
        {products.length === 0 && (
          <div className="p-8 text-center text-gray-500 tracking-wider">NO REGISTERED INVENTORIES IN DATABASE.</div>
        )}
      </div>
    </div>
  );
}
