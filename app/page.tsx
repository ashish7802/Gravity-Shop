"use client";

import { useAppStore } from "@/store/useAppStore";
import { Navbar } from "@/components/ui/Navbar";
import { Hero } from "@/components/ui/Hero";
import { ProductShowcase } from "@/components/product/ProductShowcase";
import { ProductViewer } from "@/components/product/ProductViewer";
import { motion } from "framer-motion";

// Inline Technology Showcase Section
function TechShowcase() {
  return (
    <section id="tech-showcase-section" className="py-32 border-t border-white/5 bg-[#0e0e12] relative z-10">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        {/* Section Heading */}
        <div className="mb-20 space-y-2">
          <span className="font-mono text-[11px] text-[#bbf3ff] tracking-[0.25em] uppercase block">
            SPECIFICATION_INDEX // CORE_SCIENCES
          </span>
          <h2 className="font-sans font-black text-[32px] uppercase tracking-tighter leading-none text-white">
            ADVANCED ENGINEERING
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <span className="font-mono text-[11px] text-[#bbf3ff] tracking-widest uppercase block">
              TECH_SPEC // MATERIAL
            </span>
            <h3 className="font-sans font-bold text-[20px] text-white uppercase">
              Aerospace Titanium
            </h3>
            <p className="text-[14px] text-gray-400 font-sans font-light leading-relaxed">
              Milled to absolute tolerances. Our structural components utilize Grade 5 Titanium alloy, ensuring structural purity with zero weight compromise under mechanical stress.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <span className="font-mono text-[11px] text-[#bbf3ff] tracking-widest uppercase block">
              TECH_SPEC // OPTICS
            </span>
            <h3 className="font-sans font-bold text-[20px] text-white uppercase">
              Polarized HUD Matrix
            </h3>
            <p className="text-[14px] text-gray-400 font-sans font-light leading-relaxed">
              Micro-projections sealed behind sapphire crystal panels. Real-time telemetry overlaid directly in your field of view with zero eye fatigue or refresh rate limits.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <span className="font-mono text-[11px] text-[#bbf3ff] tracking-widest uppercase block">
              TECH_SPEC // INTERACTIVE
            </span>
            <h3 className="font-sans font-bold text-[20px] text-white uppercase">
              Neural Coupling
            </h3>
            <p className="text-[14px] text-gray-400 font-sans font-light leading-relaxed">
              Hologram and audio drivers communicate through modern high-fidelity receivers, bypassing latency loops for immediate response coordinates tracking.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Inline Mission Statement Section
function MissionStatement() {
  return (
    <section className="py-36 border-t border-white/5 bg-[#08080a] flex items-center justify-center text-center relative z-10">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <span className="font-mono text-[11px] text-[#bbf3ff] tracking-[0.25em] uppercase block">
            OUR_MISSION // ARCHITECTURE
          </span>
          <p className="font-sans font-black text-[32px] text-white tracking-tight uppercase leading-snug">
            WE BELIEVE IN ENGINEERING THE NEXT DECADE. TECHNICAL PRECISION, RESTRAINED LUXURY, UNCOMPROMISING FIDELITY.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Inline Footer Section
function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 bg-[#08080a] font-mono text-[11px] text-gray-600 tracking-wider relative z-10">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4">
        <span>© 2026 GRAVITY_SHOWROOM // ALL RIGHTS RESERVED.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">TERMINAL</a>
          <a href="#" className="hover:text-white transition-colors">PRIVACY_POLICY</a>
          <a href="#" className="hover:text-white transition-colors">SECURITY_PROTOCOL</a>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const { isCartOpen } = useAppStore();

  return (
    <main className="relative min-h-screen bg-[#08080a] text-[#e2e8f0] overflow-x-hidden">
      <div 
        className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isCartOpen ? 'blur-md scale-[0.98] opacity-60 pointer-events-none' : 'blur-0 scale-100 opacity-100'
        }`}
      >
        <Navbar />
        <Hero />
        <ProductViewer />
        <TechShowcase />
        <ProductShowcase />
        <MissionStatement />
        <Footer />
      </div>
    </main>
  );
}
