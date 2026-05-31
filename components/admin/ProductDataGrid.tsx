"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit2, Trash2, Search, Filter } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      <div className="glass-panel rounded-2xl overflow-hidden flex flex-col p-8 items-center justify-center min-h-[400px]">
        <span className="text-neon-cyan font-mono animate-pulse">LOADING ASSETS...</span>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
        <div className="relative w-64 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-neon-cyan transition-colors" />
          <input 
            type="text" 
            placeholder="Search assets..." 
            className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white text-sm focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-all placeholder:text-gray-600 font-mono"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-colors">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Grid Header */}
      <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 text-xs font-mono text-gray-500 uppercase tracking-wider bg-black/40">
        <div className="col-span-4">Asset Name</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-2">Value</div>
        <div className="col-span-2">Stock Level</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {/* Grid Body */}
      <div className="divide-y divide-white/5">
        {products.map((product, idx) => {
          const status = product.stock > 10 ? "Active" : product.stock > 0 ? "Low Stock" : "Depleted";
          
          return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={product._id} 
            className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors group relative overflow-hidden"
          >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/5 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 pointer-events-none" />

            <div className="col-span-4 flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative group-hover:border-neon-cyan/50 transition-colors">
                {product.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-600 rounded-sm group-hover:border-neon-cyan group-hover:shadow-[0_0_8px_#00f0ff] transition-all" />
                )}
              </div>
              <div>
                <p className="font-bold text-white text-sm">{product.name}</p>
                <p className="text-xs text-gray-500 font-mono">ID: {product._id.substring(0, 6)}</p>
              </div>
            </div>
            
            <div className="col-span-2 relative z-10">
              <span className="text-sm text-gray-300 font-mono">{product.category}</span>
            </div>
            
            <div className="col-span-2 relative z-10">
              <span className="text-sm font-bold text-white tracking-wider">${parseFloat(product.price).toFixed(2)}</span>
            </div>
            
            <div className="col-span-2 relative z-10">
              <span className="text-sm text-gray-300 font-mono">{product.stock} units</span>
            </div>
            
            <div className="col-span-1 relative z-10">
              <span className={`text-xs px-2 py-1 rounded font-mono ${
                status === "Active" ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20" :
                status === "Low Stock" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}>
                {status}
              </span>
            </div>
            
            <div className="col-span-1 flex justify-end gap-2 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1.5 text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10 rounded transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )})}
        {products.length === 0 && (
          <div className="p-8 text-center text-gray-500 font-mono">No assets found. Upload one to begin.</div>
        )}
      </div>
    </div>
  );
}
