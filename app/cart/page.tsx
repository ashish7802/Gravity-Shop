"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Navbar } from "@/components/ui/Navbar";
import { CartSummary } from "@/components/cart/CartSummary";
import { SafeImage } from "@/components/ui/SafeImage";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useAppStore();

  return (
    <div className="min-h-screen bg-[#08080a] text-white flex flex-col justify-between selection:bg-[#bbf3ff]/30 selection:text-[#bbf3ff]">
      <Navbar />

      <main className="flex-1 container mx-auto px-6 md:px-12 max-w-7xl pt-36 pb-24 relative z-10">
        <div className="flex items-center justify-between pb-8 border-b border-white/5 mb-10">
          <div>
            <span className="font-mono text-[10px] text-[#bbf3ff] tracking-[0.25em] uppercase block mb-1">
              INVENTORY STAGING // MANIFEST
            </span>
            <h1 className="font-sans font-black text-4xl uppercase tracking-tight text-white flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-[#bbf3ff]" />
              Cart Manifest
            </h1>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 font-mono text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO SHOWROOM
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-white/10 rounded-2xl p-12 bg-[#0e0e12]/40">
            <p className="font-mono text-sm text-[#bbf3ff] tracking-widest uppercase mb-2">
              CHAMBER // EMPTY
            </p>
            <p className="font-sans text-xs text-gray-500 max-w-sm mx-auto mb-8">
              No hardware assets currently staged for acquisition. Browse the verified catalog to populate your terminal manifest.
            </p>
            <Link
              href="/#showroom-registry"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-black font-mono font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[#bbf3ff] transition-colors"
            >
              EXPLORE COLLECTION
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Cart items table */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-[#0e0e12]/80 border border-white/5 p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-5 w-full sm:w-auto">
                    <div className="relative w-20 h-20 bg-black/40 border border-white/5 rounded-lg overflow-hidden flex-shrink-0">
                      <SafeImage
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div>
                      <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest block">
                        {item.category}
                      </span>
                      <h3 className="font-sans font-bold text-lg text-white uppercase">{item.name}</h3>
                      <p className="font-mono text-xs text-[#bbf3ff] mt-1">${item.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                    <div className="flex items-center border border-white/10 rounded-lg bg-black/40">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-xs text-white px-3">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-mono text-sm font-bold text-white min-w-[70px] text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-4 bg-[#0e0e12]/90 border border-white/10 rounded-2xl p-6 shadow-xl sticky top-28">
              <h2 className="font-mono text-xs tracking-widest text-[#bbf3ff] uppercase mb-4 pb-4 border-b border-white/5">
                FULFILLMENT ESTIMATE
              </h2>
              <CartSummary />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
