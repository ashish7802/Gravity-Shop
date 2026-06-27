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
        <div className="mb-20 space-y-4">
          <span className="font-mono text-[12px] text-[#bbf3ff] tracking-[0.3em] uppercase block">
            SPECIFICATION_INDEX // CORE_SCIENCES
          </span>
          <h2 className="font-sans font-bold text-[36px] md:text-[42px] uppercase tracking-[-0.02em] leading-tight text-white">
            ADVANCED ENGINEERING
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group relative overflow-hidden rounded-2xl aspect-square"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 space-y-3">
              <span className="font-mono text-[10px] text-neon-cyan tracking-widest uppercase">TECH_SPEC // MATERIAL</span>
              <h3 className="font-sans font-bold text-[22px] text-white uppercase">Aerospace Titanium</h3>
              <p className="text-[13px] text-gray-300 font-sans leading-relaxed">Milled to absolute tolerances. Grade 5 Titanium alloy ensures structural purity with zero weight compromise.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group relative overflow-hidden rounded-2xl aspect-square"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1550009158-9effb6628347?auto=format&fit=crop&w=800&q=80')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 space-y-3">
              <span className="font-mono text-[10px] text-neon-purple tracking-widest uppercase">TECH_SPEC // OPTICS</span>
              <h3 className="font-sans font-bold text-[22px] text-white uppercase">Polarized HUD Matrix</h3>
              <p className="text-[13px] text-gray-300 font-sans leading-relaxed">Micro-projections sealed behind sapphire crystal panels. Real-time telemetry overlaid with zero eye fatigue.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="group relative overflow-hidden rounded-2xl aspect-square"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 space-y-3">
              <span className="font-mono text-[10px] text-neon-magenta tracking-widest uppercase">TECH_SPEC // INTERACTIVE</span>
              <h3 className="font-sans font-bold text-[22px] text-white uppercase">Neural Coupling</h3>
              <p className="text-[13px] text-gray-300 font-sans leading-relaxed">Hologram and audio drivers communicate through modern high-fidelity receivers, bypassing latency loops.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Inline Mission Statement Section
function MissionStatement() {
  return (
    <section className="py-48 bg-[#08080a] flex items-center justify-center text-center relative z-10 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-30"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=80')` }}
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="container mx-auto px-6 md:px-12 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <span className="font-mono text-[12px] text-[#bbf3ff] tracking-[0.3em] uppercase block drop-shadow-md">
            OUR_MISSION // ARCHITECTURE
          </span>
          <p className="font-sans font-bold text-[36px] md:text-[42px] text-white tracking-[-0.02em] uppercase leading-[1.2] drop-shadow-2xl">
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
