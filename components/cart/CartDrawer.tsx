"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { CartItemCard } from "./CartItemCard";
import { CartSummary } from "./CartSummary";
import dynamic from "next/dynamic";

const CartScene = dynamic(() => import("./CartScene").then(mod => mod.CartScene), { ssr: false });

export function CartDrawer() {
  const { isCartOpen, toggleCart, cartItems, setHoveringInteractive } = useAppStore();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-space-900/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-space-900/80 backdrop-blur-2xl border-l border-white/10 z-[101] flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Cinematic background glows */}
            <div className="absolute top-0 right-0 w-full h-full pointer-events-none z-0">
              <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-neon-cyan/20 blur-[100px] rounded-full" />
              <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-neon-magenta/20 blur-[100px] rounded-full" />
            </div>

            {/* 3D Scene Layer */}
            <CartScene />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-neon-cyan" />
                <h2 className="font-display font-bold text-xl tracking-wider text-white uppercase">Cart Terminal</h2>
              </div>
              <button 
                onClick={toggleCart}
                onMouseEnter={() => setHoveringInteractive(true)}
                onMouseLeave={() => setHoveringInteractive(false)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items List */}
            <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-4 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {cartItems.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center opacity-50"
                  >
                    <ShoppingBag className="w-12 h-12 mb-4 text-gray-500" />
                    <p className="font-display font-bold text-xl text-white">Chamber Empty</p>
                    <p className="text-sm text-gray-400 mt-2">Acquire digital assets to populate your cart.</p>
                  </motion.div>
                ) : (
                  cartItems.map((item, idx) => (
                    <CartItemCard key={item.id} item={item} index={idx} />
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer Summary */}
            <div className="relative z-10 p-6 bg-space-900/50 backdrop-blur-md border-t border-white/5">
              <CartSummary />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
