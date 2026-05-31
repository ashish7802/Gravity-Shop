"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import Image from "next/image";
import dynamic from "next/dynamic";

const ProductCanvas = dynamic(() => import("./ProductCanvas"), { 
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
      <span className="text-neon-cyan font-mono animate-pulse">LOADING 3D ENGINE...</span>
    </div>
  )
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProductDetails({ product, related }: { product: any, related?: any[] }) {
  const { addToCart, setHoveringInteractive } = useAppStore();

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Side: 3D Viewer */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative h-[600px] bg-white/5 rounded-3xl border border-white/10 overflow-hidden group"
        >
          <div className="absolute top-6 left-6 z-10">
            <span className="text-xs font-mono tracking-widest text-neon-cyan border border-neon-cyan/30 px-3 py-1 rounded-full bg-neon-cyan/10">
              INTERACTIVE PREVIEW
            </span>
          </div>

          <ProductCanvas product={product} />
          
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
        </motion.div>

        {/* Right Side: Data */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center"
        >
          <div className="mb-8">
            <h1 className="font-display font-bold text-5xl text-white mb-4 uppercase">{product.name}</h1>
            <div className="flex items-center gap-4 text-sm font-mono text-gray-400">
              <span className="px-3 py-1 bg-white/10 rounded-full border border-white/20">{product.category}</span>
              <span className="text-neon-cyan">★ {product.rating || "5.0"} / 5.0</span>
              <span className="text-neon-magenta uppercase">{product.stock > 0 ? `${product.stock} Units Available` : 'OUT OF STOCK'}</span>
            </div>
          </div>

          <p className="text-lg text-gray-300 font-light leading-relaxed mb-12">
            {product.description}
          </p>

          <div className="flex items-end gap-8 mb-12">
            <div>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Value</p>
              <p className="font-display font-bold text-4xl text-white">${product.price}.00</p>
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              onMouseEnter={() => setHoveringInteractive(true)}
              onMouseLeave={() => setHoveringInteractive(false)}
              className="flex-1 py-4 rounded-xl bg-white text-space-900 font-bold tracking-widest relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">{product.stock > 0 ? "INITIALIZE ACQUISITION" : "DEPLETED"}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-white to-neon-magenta opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          </div>

          <div className="pt-8 border-t border-white/10">
            <h3 className="font-mono text-xs tracking-widest text-gray-500 mb-4 uppercase">Asset Telemetry</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-neon-cyan text-xs font-mono mb-1">Hologram Payload</p>
                <p className="text-sm text-white font-mono">{product.modelSize ? `${(product.modelSize / 1024 / 1024).toFixed(2)} MB` : 'Procedural Mesh'}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-neon-magenta text-xs font-mono mb-1">Optimization</p>
                <p className="text-sm text-white font-mono uppercase">{product.optimizationStatus || 'Untracked'}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related Products Section */}
      {related && related.length > 0 && (
        <div className="mt-32 border-t border-white/5 pt-16">
          <h2 className="font-display font-bold text-3xl mb-12 uppercase">Related Acquisitions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {related.map((rel: any) => (
              <a 
                key={rel.id} 
                href={`/product/${rel.id}`}
                className="group relative block aspect-[4/5] bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <Image src={rel.image} alt={rel.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" sizes="(max-width: 768px) 100vw, 25vw" />
                
                <div className="absolute bottom-0 left-0 w-full p-6 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-neon-cyan font-mono text-xs mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{rel.category}</p>
                  <h3 className="font-bold text-xl text-white mb-1">{rel.name}</h3>
                  <p className="font-mono text-gray-400">${rel.price}.00</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
