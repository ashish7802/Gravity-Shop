"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, PackageCheck, ArrowRight, ShieldCheck, Terminal } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Navbar } from "@/components/ui/Navbar";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || "GRV-AUTH-" + Math.floor(100000 + Math.random() * 900000);
  const total = searchParams.get("total");
  const { removeFromCart, cartItems } = useAppStore();
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    // Clear items upon successful order confirmation
    if (!cleared && cartItems.length > 0) {
      cartItems.forEach((item) => removeFromCart(item.id));
      setCleared(true);
    }
  }, [cleared, cartItems, removeFromCart]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-2xl relative z-10"
    >
      <div className="bg-[#0e0e12]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-[#bbf3ff] to-transparent" />

        {/* Header Telemetry */}
        <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="font-mono text-[9px] text-emerald-400 tracking-[0.25em] uppercase block">
                STATUS // PROTOCOL_ACQUIRED
              </span>
              <h1 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight text-white">
                Order Confirmed
              </h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-3 py-1.5 rounded-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SECURED & ENCRYPTED</span>
          </div>
        </div>

        {/* Receipt Summary Box */}
        <div className="space-y-4 font-mono text-xs bg-black/40 border border-white/5 p-6 rounded-xl mb-8">
          <div className="flex justify-between items-center py-1 border-b border-white/5 text-gray-400">
            <span>SESSION MANIFEST //</span>
            <span className="text-[#bbf3ff] font-bold select-all">{sessionId}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-white/5 text-gray-400">
            <span>CLEARANCE DATE //</span>
            <span className="text-white">{new Date().toUTCString()}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-white/5 text-gray-400">
            <span>FULFILLMENT STAGE //</span>
            <span className="text-emerald-400 font-bold uppercase">PROCESSING FOR DISPATCH</span>
          </div>
          {total && (
            <div className="flex justify-between items-center pt-2 text-sm text-gray-300 font-bold">
              <span>SETTLEMENT TOTAL //</span>
              <span className="text-white font-mono text-base">${Number(total).toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="space-y-3 font-sans text-xs text-gray-400 leading-relaxed mb-8">
          <p>
            Your acquisition transaction has been routed through our distributed logistics network. An automated dispatch link with live telemetry tracking has been appended to your identity profile.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 py-4 bg-white text-black font-mono font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[#bbf3ff] transition-colors flex items-center justify-center gap-2"
          >
            <Terminal className="w-4 h-4" />
            RETURN TO SHOWROOM
          </Link>
          <Link
            href="/account"
            className="flex-1 py-4 bg-white/5 border border-white/10 hover:border-white text-white font-mono font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <PackageCheck className="w-4 h-4 text-emerald-400" />
            ACCOUNT LEDGER
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#08080a] text-white flex flex-col justify-between selection:bg-[#bbf3ff]/30 selection:text-[#bbf3ff]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/5 blur-[160px] rounded-full pointer-events-none" />

        <Suspense fallback={
          <div className="text-emerald-400 font-mono text-xs animate-pulse tracking-widest">
            LOADING FULFILLMENT MANIFEST...
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </main>
    </div>
  );
}
