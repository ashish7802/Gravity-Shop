"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
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
            className="fixed inset-0 bg-[#08080a]/75 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 24 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0e0e12] border-l border-white/5 z-[101] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Ambient subtle backlighting */}
            <div className="absolute top-0 right-0 w-full h-full pointer-events-none z-0">
              <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-white/[0.02] blur-[80px] rounded-full" />
            </div>

            {/* 3D Scene Layer */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
              <CartScene />
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/5 bg-[#0e0e12]/80 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <h2 className="font-mono text-xs tracking-[0.2em] text-white uppercase">CART // TERMINAL_MANIFEST</h2>
              </div>
              <button 
                onClick={toggleCart}
                onMouseEnter={() => setHoveringInteractive(true)}
                onMouseLeave={() => setHoveringInteractive(false)}
                className="p-1 border border-white/5 rounded-sm hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items List */}
            <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-4 no-scrollbar">
              <AnimatePresence mode="popLayout">
                {cartItems.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center opacity-40"
                  >
                    <p className="font-mono text-xs text-white tracking-widest uppercase">CHAMBER // EMPTY</p>
                    <p className="text-[10px] text-gray-400 mt-2 tracking-wider">ACQUIRE DIGITAL ASSETS TO POPULATE</p>
                  </motion.div>
                ) : (
                  cartItems.map((item, idx) => (
                    <CartItemCard key={item.id} item={item} index={idx} />
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer Summary */}
            <div className="relative z-10 p-6 bg-[#0e0e12]/90 backdrop-blur-md border-t border-white/5">
              <CartSummary />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
