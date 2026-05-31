"use client";

import { useAppStore } from "@/store/useAppStore";

interface ProductDetailsPanelProps {
  product: {
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    tags?: string[];
    stock: number;
  };
  onAddToCart: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function ProductDetailsPanel({ product, onAddToCart }: ProductDetailsPanelProps) {
  const { setHoveringInteractive } = useAppStore();

  const specsList = [
    { label: "CORE CLASSIFICATION", value: product.category.toUpperCase() },
    { label: "PAYLOAD CAPACITY", value: `${product.stock} UNITS AVAILABLE` },
    { label: "ASSET IDENTIFIER", value: `GRV-${product.id.slice(-6).toUpperCase()}` },
    { label: "INTEGRATION KEY", value: "SECURE // TERMINAL_ACTIVE" }
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-md bg-[#0e0e12] border border-[#ffffff08] p-8 rounded-sm relative z-20">
      
      {/* Header Telemetry */}
      <div className="flex justify-between items-start pb-6 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-2 text-[#bbf3ff] font-mono text-[9px] tracking-[0.25em] uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#bbf3ff] animate-pulse" />
            REGISTRY // SPEC_VERIFIED
          </div>
          <h2 className="font-sans font-black text-3xl text-white tracking-tight uppercase leading-none">
            {product.name}
          </h2>
        </div>
        <p className="font-mono text-lg text-[#bbf3ff] font-medium tracking-tight">${product.price}.00</p>
      </div>
      
      {/* Description */}
      <p className="text-gray-400 font-light text-xs leading-relaxed">
        {product.description} Engineered with premium composite structures and telemetry status support.
      </p>

      {/* Specifications Parameter Table */}
      <div className="border-t border-b border-white/5 py-6 flex flex-col gap-3 font-mono text-[10px]">
        {specsList.map((spec, i) => (
          <div key={i} className="flex justify-between items-center py-1">
            <span className="text-gray-500 tracking-wider">{spec.label}</span>
            <span className="text-[#e2e8f0] tracking-wide uppercase">{spec.value}</span>
          </div>
        ))}
      </div>

      {/* Technical Command Button */}
      <button 
        onMouseEnter={() => setHoveringInteractive(true)}
        onMouseLeave={() => setHoveringInteractive(false)}
        onClick={onAddToCart}
        className="w-full border border-white/20 hover:border-white hover:bg-white hover:text-black font-mono tracking-widest text-[10px] py-4 transition-all duration-300 rounded-sm"
      >
        ADD_TO_TERMINAL // ACQUIRE
      </button>

    </div>
  );
}
