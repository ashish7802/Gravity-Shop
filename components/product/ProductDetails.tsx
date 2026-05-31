"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { SafeImage } from "@/components/ui/SafeImage";
import dynamic from "next/dynamic";
import React from "react";

const ProductCanvas = dynamic(() => import("./ProductCanvas"), { 
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[#08080a]">
      <span className="text-[#bbf3ff] font-mono text-xs animate-pulse tracking-[0.2em]">INITIALIZING 3D ENGINE...</span>
    </div>
  )
});

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  stock: number;
  tags?: string[];
  optimizationStatus?: string;
}

export function ProductDetails({ product, related }: { product: Product, related?: Product[] }) {
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

  const titleLines = product.name.split(" ");

  // Custom technical specs for detailed console
  const detailedSpecs = [
    { name: "CHASSIS SPECIFICATIONS", value: "GRADE 5 TITANIUM / ANODIZED CARBON" },
    { name: "OPTIMIZATION INDEX", value: product.optimizationStatus || "NOMINAL // LEVEL_4" },
    { name: "THERMAL CONDUCTIVITY", value: "385 W/m·K // DISSIPATION PASSIVE" },
    { name: "PAYLOAD CAPACITY", value: `${product.stock} SYSTEM CHANNELS` },
    { name: "NOMINAL FREQUENCY", value: "142 GHz CRYPTOGRAPHIC SYNC" },
    { name: "INPUT DISPATCH RATE", value: "0.15ms TELEMETRY OVERLAY" },
    { name: "ACQUISITION KEY", value: `HEX-${product._id.slice(-8).toUpperCase()}` }
  ];

  return (
    <div className="bg-[#08080a] text-[#e2e8f0]">
      
      {/* 1. CINEMATIC PRODUCT HERO (Launch event style) */}
      <section className="relative min-h-[90vh] flex items-center pt-12 pb-24 border-b border-white/5 overflow-hidden">
        {/* Background ambient light */}
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-[#bbf3ff]/3 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-white/3 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Product Title & Description */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex justify-between items-center max-w-sm">
              <span className="font-mono text-[9px] tracking-[0.25em] text-[#bbf3ff] uppercase bg-[#bbf3ff]/5 border border-[#bbf3ff]/20 px-3 py-1 rounded-sm">
                {product.category}
              </span>
              <span className="font-mono text-[9px] tracking-wider text-[#ffa000] uppercase">
                {product.stock > 0 ? "ASSET_ACQUISITION_READY" : "OUT_OF_STOCK"}
              </span>
            </div>

            <h1 className="font-sans font-black text-5xl md:text-7xl text-white tracking-tighter uppercase leading-[0.85]">
              {titleLines.map((line: string, i: number) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
                  className="block"
                >
                  {line}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm text-[#888899] font-light leading-relaxed max-w-md"
            >
              {product.description} Built specifically for elite technology integrations. Monochromatic finishes, aerospace Grade 5 titanium alloys, and high-frequency active feedback control loops.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="pt-6 border-t border-white/5 max-w-sm"
            >
              <div className="flex justify-between items-baseline mb-6 font-mono text-xs">
                <span className="text-gray-500">ESTIMATED VALUATION</span>
                <span className="text-[#bbf3ff] text-lg font-bold">${product.price}.00</span>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                onMouseEnter={() => setHoveringInteractive(true)}
                onMouseLeave={() => setHoveringInteractive(false)}
                className="w-full border border-white/20 hover:border-white hover:bg-white hover:text-black font-mono tracking-widest text-[10px] py-5 transition-all duration-300 rounded-sm disabled:opacity-30 disabled:cursor-not-allowed uppercase"
              >
                {product.stock > 0 ? "INITIATE_ACQUISITION_PROTOCOL" : "ACQUISITION // UNAVAILABLE"}
              </button>
            </motion.div>
          </div>

          {/* Right Column: 3D Scene viewport (Large Immersive Showroom) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative h-[500px] lg:h-[650px] bg-[#0e0e12] border border-white/5 overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-6 left-6 z-10 font-mono text-[9px] tracking-widest text-[#888899] uppercase">
              SECTOR_02 // VOLUMETRIC_STAGE
            </div>
            
            <div className="flex-1 w-full h-full">
              <ProductCanvas product={product} />
            </div>

            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(8,8,10,0.8)]" />

            <div className="p-6 border-t border-white/5 font-mono text-[8px] text-gray-500 flex justify-between z-10 bg-black/10 backdrop-blur-sm">
              <span>TRACKBALL // INTERACTIVE AXIS ACTIVE</span>
              <span>GRID_COORDS // 45.1097 N</span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. DYNAMIC STORYTELLING & MATERIAL BREAKDOWN */}
      <section className="py-32 border-b border-white/5 bg-[#0a0a0e]">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[4/3] bg-[#0e0e12] border border-white/5 p-12 overflow-hidden flex items-center justify-center"
            >
              <div className="absolute top-4 left-4 font-mono text-[9px] text-[#888899] uppercase tracking-wider">
                ENGINEERING_DIAGRAM_01
              </div>
              <div className="relative w-full h-full">
                <SafeImage 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  className="object-contain filter transition-all duration-700 hover:scale-105" 
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <span className="font-mono text-[9px] text-[#bbf3ff] tracking-[0.2em] block uppercase">
                01 // HIGH-FIDELITY CONSTRUCTION
              </span>
              <h2 className="font-sans font-black text-3xl md:text-5xl uppercase tracking-tighter text-white leading-none">
                BUILT WITH ZERO COMPROMISE.
              </h2>
              <p className="text-sm font-light leading-relaxed text-[#888899]">
                Every component is milled to sub-micron tolerances using aerospace-grade processes. We reject standard retail composite structures in favor of structurally pure alloys, specialized graphene dampeners, and double-insulated internal compartments.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 lg:order-2"
            >
              <span className="font-mono text-[9px] text-[#bbf3ff] tracking-[0.2em] block uppercase">
                02 // TELEMETRY INTEGRATION
              </span>
              <h2 className="font-sans font-black text-3xl md:text-5xl uppercase tracking-tighter text-white leading-none">
                ENGINEERED PERFECTION.
              </h2>
              <p className="text-sm font-light leading-relaxed text-[#888899]">
                Built-in telemetry nodes provide active status monitoring and optimization matrix feeds directly to the console. Features customizable hardware registers, zero-latency physical switches, and dynamic adaptive response systems.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[4/3] bg-[#0e0e12] border border-white/5 p-12 overflow-hidden flex items-center justify-center lg:order-1"
            >
              <div className="absolute top-4 left-4 font-mono text-[9px] text-[#888899] uppercase tracking-wider">
                ENGINEERING_DIAGRAM_02
              </div>
              <div className="relative w-full h-full scale-x-[-1]">
                <SafeImage 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  className="object-contain filter transition-all duration-700 hover:scale-105" 
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 3. DETAILED SPECIFICATION CONSOLE */}
      <section className="py-32 border-b border-white/5 bg-[#08080a]">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="max-w-3xl">
            <span className="font-mono text-[9px] text-[#bbf3ff] tracking-[0.2em] block uppercase mb-3">
              TECHNICAL_CONSOLE // SPECIFICATIONS_MATRIX
            </span>
            <h2 className="font-sans font-black text-4xl md:text-6xl uppercase tracking-tighter text-white leading-none mb-12">
              TELEMETRY SPECIFICATIONS.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 border-t border-white/5 pt-12 font-mono text-[10px]">
            {detailedSpecs.map((spec, i) => (
              <div key={i} className="flex justify-between items-center py-4 border-b border-white/5">
                <span className="text-gray-500 tracking-wider uppercase">{spec.name}</span>
                <span className="text-white tracking-wide uppercase text-right pl-4">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SELECTED COLLECTIONS (RELATED) */}
      {related && related.length > 0 && (
        <section className="py-32 bg-[#08080a]">
          <div className="container mx-auto px-6 md:px-12 max-w-7xl">
            <div className="flex justify-between items-baseline mb-16">
              <h2 className="font-sans font-black text-3xl uppercase text-white tracking-tighter">
                SELECTED REGISTRIES.
              </h2>
              <span className="font-mono text-[9px] text-gray-500 uppercase tracking-wider">
                RELATED_ASSETS // [{String(related.length).padStart(2, "0")}]
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
              {related.map((rel) => (
                <div key={rel._id} className="group relative bg-[#0e0e12]">
                  <a href={`/product/${rel._id}`} className="block p-6 h-full flex flex-col justify-between">
                    <div className="relative h-48 w-full flex items-center justify-center p-4 bg-black/10 mb-6 overflow-hidden">
                      <SafeImage 
                        src={rel.image} 
                        alt={rel.name} 
                        fill 
                        className="object-contain group-hover:scale-108 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" 
                        sizes="(max-width: 768px) 100vw, 25vw" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline">
                        <span className="text-gray-500 font-mono text-[8px] tracking-widest uppercase">{rel.category}</span>
                        <span className="font-mono text-[10px] text-[#bbf3ff] font-bold">${rel.price}.00</span>
                      </div>
                      <h3 className="font-bold text-sm text-[#e2e8f0] group-hover:text-white uppercase transition-colors leading-tight">{rel.name}</h3>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
