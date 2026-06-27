"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("PRODUCTS");
  
  const { 
    cartItems, 
    toggleCart,
    isAuthenticated,
    user
  } = useAppStore();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToGrid = () => {
    const el = document.getElementById("showroom-registry");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearchToggle = () => {
    window.dispatchEvent(new CustomEvent("toggle-search"));
  };

  const navItems = [
    { name: "PRODUCTS", href: "/#showroom-registry" },
    { name: "TECHNOLOGY", href: "/#tech-showcase-section" },
    { name: "ARCHIVE", href: "#" },
    { name: "JOURNAL", href: "#" }
  ];

  return (
    <div className={`fixed left-0 right-0 z-50 transition-all duration-500 flex justify-center ${scrolled ? 'top-6 px-6' : 'top-0 px-0'}`}>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full max-w-7xl h-[72px] flex items-center justify-between transition-all duration-500 ${
          scrolled 
            ? "bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-8" 
            : "bg-transparent border-b border-white/5 px-6 md:px-12"
        }`}
      >
        {/* Brand Link & Smooth Scroll Button */}
        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className="font-sans font-bold text-lg tracking-[0.2em] text-white hover:opacity-80 transition-opacity"
          >
            GRAVITY
          </Link>
          
          <button
            onClick={handleScrollToGrid}
            className="font-mono text-[10px] tracking-[0.2em] text-[#bbf3ff] border border-[#bbf3ff]/20 px-3 py-1.5 bg-[#bbf3ff]/5 hover:bg-white hover:text-black hover:border-white transition-all duration-300 rounded-sm cursor-pointer shadow-[0_0_10px_rgba(187,243,255,0.05)] hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            [ NEW ARRIVALS ]
          </button>
        </div>

        {/* Sliding Technical Nav Links */}
        <div className="hidden md:flex items-center gap-10 h-full font-sans text-[13px] font-medium tracking-[0.15em]">
          {navItems.map((item) => {
            const isActive = activeTab === item.name;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setActiveTab(item.name)}
                className="relative px-1 py-2 text-gray-400 hover:text-white transition-colors uppercase select-none cursor-pointer h-full flex items-center"
              >
                <span className="relative z-10">{item.name}</span>
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#bbf3ff]"
                    transition={{ type: "spring", stiffness: 80, damping: 24 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Technical Actions */}
        <div className="flex items-center gap-6 font-sans text-[13px] font-medium tracking-[0.1em] text-gray-300">
          {/* Admin Command Indicator */}
          {isAuthenticated && user?.role === "admin" && (
            <Link 
              href="/admin"
              className="text-[#bbf3ff] border border-[#bbf3ff]/20 px-3 py-1 bg-[#bbf3ff]/5 hover:bg-white hover:text-black hover:border-white transition-all text-[10px]"
            >
              [ COMMAND ]
            </Link>
          )}

          {/* Search Trigger */}
          <button 
            onClick={handleSearchToggle}
            className="hover:text-white transition-colors select-none font-mono py-1 px-2 border border-transparent hover:border-white/5 bg-[#0e0e12]/40"
          >
            [ SEARCH ]
          </button>

          {/* Technical Cart Count Trigger */}
          <button 
            onClick={toggleCart} 
            className="hover:text-white transition-colors select-none font-mono py-1 px-2 border border-transparent hover:border-white/5 bg-[#0e0e12]/40"
          >
            {`[ CART: ${String(totalItems).padStart(2, "0")} ]`}
          </button>
        </div>
      </motion.nav>
    </div>
  );
}
