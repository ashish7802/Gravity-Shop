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
    <section className="relative h-[80vh] min-h-[600px] w-full flex items-center bg-[#08080a] overflow-hidden border-b border-white/5 pt-16">
      {/* Animated Glowing Orbs for Glassmorphism Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/20 blur-[120px] rounded-full animate-float mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-purple/20 blur-[150px] rounded-full animate-pulse-slow mix-blend-screen" />
      <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-neon-magenta/10 blur-[100px] rounded-full animate-float mix-blend-screen" style={{ animationDelay: '2s' }} />

      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#08080a_100%)]" />

      <motion.div 
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="container mx-auto px-6 md:px-12 max-w-7xl z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
      >
        {/* Left Content Side */}
        <div className="lg:col-span-6 flex flex-col justify-center text-left space-y-6">
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
            className="font-sans font-black text-5xl md:text-6xl lg:text-7xl tracking-[-0.02em] leading-[1.05] text-white select-none capitalize"
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
            className="flex flex-wrap gap-4 font-mono text-[10px] tracking-widest pt-4"
          >
            <button 
              onClick={handleScrollToGrid}
              className="border border-neon-cyan/50 hover:border-neon-cyan hover:bg-neon-cyan hover:text-black px-8 py-4 transition-all duration-300 rounded-full bg-neon-cyan/10 backdrop-blur-md text-neon-cyan hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] uppercase cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            >
              [ Explore Products ]
            </button>
            
            <button 
              onClick={() => {
                const el = document.getElementById("showroom-registry");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="border border-white/20 hover:border-white hover:bg-white hover:text-black px-8 py-4 transition-all duration-300 rounded-full bg-white/5 backdrop-blur-md text-white uppercase cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]"
            >
              [ View Collection ]
            </button>
          </motion.div>
        </div>

        {/* Right Side Featured Image */}
        <motion.div
          variants={elementVariants}
          className="lg:col-span-6 relative h-[400px] md:h-[500px] w-full hidden lg:block"
        >
          <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=1200&q=80')`,
              }}
            />
            {/* Dark gradient overlay for text legibility if needed, or just to blend it into the dark theme */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-transparent to-transparent opacity-80" />
            
            {/* Small Floating Tag */}
            <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full font-sans text-xs font-medium text-white shadow-lg">
              Featured: Acoustic Prime
            </div>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}
