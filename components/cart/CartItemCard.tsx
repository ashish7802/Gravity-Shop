"use client";

import { motion } from "framer-motion";
import { Plus, Minus, Trash2 } from "lucide-react";
import { CartItem, useAppStore } from "@/store/useAppStore";
import Image from "next/image";

interface CartItemCardProps {
  item: CartItem;
  index: number;
}

export function CartItemCard({ item, index }: CartItemCardProps) {
  const { updateQuantity, removeFromCart, setHoveringInteractive } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: 20 }}
      transition={{ duration: 0.4, delay: index * 0.1, type: "spring", stiffness: 300, damping: 25 }}
      className="relative p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden group"
    >
      {/* Background glow specific to category */}
      <div 
        className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500
          ${item.category === "Sneakers" ? "bg-neon-cyan" : 
            item.category === "Gaming" ? "bg-neon-magenta" : "bg-neon-purple"}
        `}
      />

      <div className="flex gap-4 relative z-10">
        <div className="w-16 h-16 rounded-lg bg-space-900/50 flex items-center justify-center relative overflow-hidden border border-white/5">
          <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
        </div>
        
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-display font-bold text-white text-sm">{item.name}</p>
              <p className="text-xs text-gray-400">{item.category}</p>
            </div>
            <button 
              onClick={() => removeFromCart(item.id)}
              onMouseEnter={() => setHoveringInteractive(true)}
              onMouseLeave={() => setHoveringInteractive(false)}
              className="text-gray-500 hover:text-neon-magenta transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex justify-between items-end">
            <p className="font-mono text-neon-cyan font-bold">${item.price.toFixed(2)}</p>
            
            <div className="flex items-center gap-3 bg-space-900/50 rounded-full px-2 py-1 border border-white/10">
              <button 
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                onMouseEnter={() => setHoveringInteractive(true)}
                onMouseLeave={() => setHoveringInteractive(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-bold text-white w-4 text-center">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                onMouseEnter={() => setHoveringInteractive(true)}
                onMouseLeave={() => setHoveringInteractive(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
