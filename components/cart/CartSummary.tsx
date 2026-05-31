"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";

export function CartSummary() {
  const { cartTotal, cartItems, setHoveringInteractive } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  
  const tax = cartTotal * 0.08;
  const shipping = cartTotal > 0 ? 15.00 : 0;
  const total = cartTotal + tax + shipping;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsProcessing(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during checkout.");
      }
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Subtotal</span>
          <span className="font-mono text-white">${cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>Estimated Tax</span>
          <span className="font-mono text-white">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>Shipping (Quantum Relay)</span>
          <span className="font-mono text-white">${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-end pt-4 border-t border-white/5">
          <span className="text-gray-300 font-bold">Total</span>
          <span className="font-mono text-neon-cyan font-bold text-2xl">${total.toFixed(2)}</span>
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-xs font-mono mb-2 text-center">{error}</p>
      )}
      
      <button 
        onClick={handleCheckout}
        disabled={isProcessing || cartItems.length === 0}
        onMouseEnter={() => setHoveringInteractive(true)}
        onMouseLeave={() => setHoveringInteractive(false)}
        className="w-full py-4 rounded-xl bg-white text-space-900 font-bold tracking-widest relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isProcessing ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-space-900 border-t-transparent animate-spin" />
              SECURING LINK...
            </>
          ) : (
            "INITIALIZE CHECKOUT"
          )}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-white to-neon-magenta opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </button>
    </div>
  );
}
