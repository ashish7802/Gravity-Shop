"use client";

import { motion, Variants } from "framer-motion";

export function Hero() {
  const handleScrollToGrid = () => {
    const el = document.getElementById("showroom-registry");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const containerVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1
      }
    }
  };

  const elementVariants: Variants = {
    initial: { opacity: 0, y: 15 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section className="relative h-[60vh] lg:h-[65vh] min-h-[500px] w-full flex items-center bg-[#08080a] overflow-hidden border-b border-white/5 pt-16">
      {/* Subtle background hardware mesh grid overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.08]"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1920&q=80')`,
        }}
      />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_40%,#08080a_90%)]" />

      <motion.div 
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="container mx-auto px-6 md:px-12 max-w-7xl z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
      >
        {/* Left Content Side */}
        <div className="lg:col-span-8 flex flex-col justify-center text-left space-y-6">
          {/* Small Label */}
          <motion.div
            variants={elementVariants}
            className="font-mono text-[11px] text-[#bbf3ff] tracking-widest uppercase"
          >
            [ GRAVITY SHOP ]
          </motion.div>

          {/* Large Heading */}
          <motion.h1
            variants={elementVariants}
            className="font-sans font-black text-4xl md:text-5xl lg:text-6xl tracking-[-0.06em] leading-[0.9] text-white select-none uppercase"
          >
            Engineered Products.<br />
            Built For The Future.
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={elementVariants}
            className="text-[14px] text-gray-400 font-sans font-light leading-relaxed max-w-md"
          >
            Premium technology, performance gear and engineered accessories.
          </motion.p>

          {/* Clean Boxy Buttons */}
          <motion.div
            variants={elementVariants}
            className="flex flex-wrap gap-4 font-mono text-[9px] tracking-widest pt-2"
          >
            <button 
              onClick={handleScrollToGrid}
              className="border border-white/20 hover:border-white hover:bg-white hover:text-black px-6 py-3.5 transition-colors duration-300 rounded-none bg-transparent text-white uppercase cursor-pointer"
            >
              [ Explore Products ]
            </button>
            
            <button 
              className="border border-white/20 hover:border-white hover:bg-white hover:text-black px-6 py-3.5 transition-colors duration-300 rounded-none bg-transparent text-white uppercase cursor-pointer"
            >
              [ View Collection ]
            </button>
          </motion.div>
        </div>

        {/* Right Side Telemetry (40% reduced in size) */}
        <motion.div
          variants={elementVariants}
          className="lg:col-span-4 bg-[#0e0e12]/60 backdrop-blur-md border border-white/5 p-5 font-mono text-[9px] tracking-wider text-gray-500 max-w-[240px] lg:max-w-[260px] ml-auto w-full space-y-2 hover:border-white/20 transition-all duration-300"
        >
          <div className="flex justify-between items-center py-0.5">
            <span>STATUS</span>
            <span className="text-[#bbf3ff]">ONLINE</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span>PRODUCTS</span>
            <span className="text-white">128</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span>LATENCY</span>
            <span className="text-emerald-400">12MS</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span>REGIONS</span>
            <span className="text-white">42</span>
          </div>
          <div className="pt-2.5 border-t border-white/5 text-[8px] text-gray-600 text-center uppercase tracking-widest">
            GRAVITY // READOUT
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}
