"use client";

import { motion } from "framer-motion";
import { CartItem, useAppStore } from "@/store/useAppStore";
import { SafeImage } from "@/components/ui/SafeImage";

interface CartItemCardProps {
  item: CartItem;
  index: number;
}

export function CartItemCard({ item, index }: CartItemCardProps) {
  const { updateQuantity, removeFromCart, setHoveringInteractive } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        type: "spring", 
        stiffness: 80, 
        damping: 24,
        delay: index * 0.05 
      }}
      className="p-4 bg-[#0e0e12] border border-[#ffffff08] rounded-sm relative overflow-hidden group flex gap-4"
    >
      {/* Product Image Stage */}
      <div className="w-16 h-16 bg-black/10 flex items-center justify-center relative overflow-hidden border border-white/5 rounded-sm">
        <SafeImage src={item.image} alt={item.name} fill className="object-contain p-2" />
      </div>
      
      {/* BOM Details Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-sans font-bold text-white text-xs uppercase tracking-tight">{item.name}</p>
            <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest mt-0.5">
              ID // {item.id.slice(-8).toUpperCase()}
            </p>
          </div>
          
          {/* Delete Button styled as technical deletion */}
          <button 
            onClick={() => removeFromCart(item.id)}
            onMouseEnter={() => setHoveringInteractive(true)}
            onMouseLeave={() => setHoveringInteractive(false)}
            className="font-mono text-[9px] text-gray-500 hover:text-[#ffa000] border border-white/5 hover:border-[#ffa000]/30 px-2 py-0.5 bg-white/5 rounded-sm transition-colors uppercase"
          >
            [ DEL ]
          </button>
        </div>

        <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5">
          <p className="font-mono text-xs text-[#bbf3ff] font-medium">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
          
          {/* Boxy parameter parameter adjustments */}
          <div className="flex items-center bg-black/30 border border-white/5 rounded-sm font-mono text-[10px]">
            <button 
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              onMouseEnter={() => setHoveringInteractive(true)}
              onMouseLeave={() => setHoveringInteractive(false)}
              className="px-2 py-1 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              -
            </button>
            <span className="px-3 text-white border-l border-r border-white/5 min-w-[24px] text-center">
              {String(item.quantity).padStart(2, "0")}
            </span>
            <button 
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              onMouseEnter={() => setHoveringInteractive(true)}
              onMouseLeave={() => setHoveringInteractive(false)}
              className="px-2 py-1 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
