"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { LogOut, User as UserIcon } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("PRODUCTS");
  
  const { 
    cartItems, 
    toggleCart,
    isAuthenticated,
    user,
    setUser,
    logout,
    toggleAuthModal
  } = useAppStore();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Restore authenticated session from httpOnly cookie on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, [setUser]);

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

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    logout();
  };

  const navItems = [
    { name: "PRODUCTS", href: "/#showroom-registry" },
    { name: "TECHNOLOGY", href: "/#tech-showcase-section" },
    { name: "MISSION", href: "/#mission-statement" }
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
            className="hidden sm:inline-block font-mono text-[10px] tracking-[0.2em] text-[#bbf3ff] border border-[#bbf3ff]/20 px-3 py-1.5 bg-[#bbf3ff]/5 hover:bg-white hover:text-black hover:border-white transition-all duration-300 rounded-sm cursor-pointer shadow-[0_0_10px_rgba(187,243,255,0.05)] hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
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
        <div className="flex items-center gap-4 sm:gap-6 font-sans text-[12px] font-medium tracking-[0.1em] text-gray-300">
          {/* Admin Command Indicator */}
          {isAuthenticated && user?.role === "admin" && (
            <Link 
              href="/admin"
              className="text-[#bbf3ff] border border-[#bbf3ff]/20 px-3 py-1 bg-[#bbf3ff]/5 hover:bg-white hover:text-black hover:border-white transition-all text-[10px] font-mono tracking-wider"
            >
              [ COMMAND ]
            </Link>
          )}

          {/* User Account or Login */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                href="/account"
                className="flex items-center gap-1.5 hover:text-white transition-colors select-none font-mono py-1 px-2 border border-transparent hover:border-white/10 bg-[#0e0e12]/40 text-[11px]"
                title={user?.name || "Account Ledger"}
              >
                <UserIcon className="w-3.5 h-3.5 text-[#bbf3ff]" />
                <span className="hidden sm:inline">[ LEDGER ]</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-400 transition-colors p-1"
                title="Disconnect Profile"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={toggleAuthModal}
              className="hover:text-white transition-colors select-none font-mono py-1 px-2 border border-transparent hover:border-white/5 bg-[#0e0e12]/40 text-[11px]"
            >
              [ LOGIN ]
            </button>
          )}

          {/* Search Trigger */}
          <button 
            onClick={handleSearchToggle}
            className="hover:text-white transition-colors select-none font-mono py-1 px-2 border border-transparent hover:border-white/5 bg-[#0e0e12]/40 text-[11px]"
          >
            [ SEARCH ]
          </button>

          {/* Technical Cart Count Trigger */}
          <button 
            onClick={toggleCart} 
            className="hover:text-white transition-colors select-none font-mono py-1 px-2 border border-transparent hover:border-white/5 bg-[#0e0e12]/40 text-[11px]"
          >
            {`[ CART: ${String(totalItems).padStart(2, "0")} ]`}
          </button>
        </div>
      </motion.nav>
    </div>
  );
}
