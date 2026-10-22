"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";

export function CartSummary() {
  const { cartTotal, cartItems, setHoveringInteractive, toggleAuthModal } = useAppStore();
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
        window.location.href = data.url; // Redirect to Stripe or Confirmation
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
    <div className="pt-6 border-t border-white/5 relative z-10 font-mono text-[10px]">
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-500">
          <span>SUBTOTAL</span>
          <span className="text-[#e2e8f0] font-medium">${cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>ESTIMATED TAX [08%]</span>
          <span className="text-[#e2e8f0] font-medium">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>SHIPPING [RELAY]</span>
          <span className="text-[#e2e8f0] font-medium">${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-baseline pt-4 border-t border-white/5">
          <span className="text-white font-bold tracking-wider">AGGREGATE TOTAL</span>
          <span className="text-[#bbf3ff] font-bold text-lg">${total.toFixed(2)}</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-sm text-center">
          <p className="text-[#ffa000] text-[9px] font-mono uppercase tracking-wider mb-2">
            ERROR // {error}
          </p>
          {error.toLowerCase().includes("authenticate") && (
            <button
              onClick={toggleAuthModal}
              className="text-[#bbf3ff] text-[9px] underline font-mono tracking-wider uppercase hover:text-white"
            >
              Click here to Authenticate
            </button>
          )}
        </div>
      )}
      
      <button 
        onClick={handleCheckout}
        disabled={isProcessing || cartItems.length === 0}
        onMouseEnter={() => setHoveringInteractive(true)}
        onMouseLeave={() => setHoveringInteractive(false)}
        className="w-full py-4 border border-white/20 hover:border-white hover:bg-white hover:text-black font-mono tracking-widest text-[9px] transition-all duration-300 rounded-sm disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full border border-black border-t-transparent animate-spin" />
            SECURING LINK MATRIX...
          </span>
        ) : (
          "INITIATE_FULFILLMENT_PROTOCOL"
        )}
      </button>
    </div>
  );
}
