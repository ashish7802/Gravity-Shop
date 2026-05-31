"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Menu, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const cartRef = useRef<HTMLButtonElement>(null);
  const { setCartIconPosition, cartItems, toggleCart, isAuthenticated, toggleAuthModal, logout, user, setHoveringInteractive } = useAppStore();
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateCartPosition = () => {
      if (cartRef.current) {
        const rect = cartRef.current.getBoundingClientRect();
        setCartIconPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }
    };
    
    updateCartPosition();
    window.addEventListener("resize", updateCartPosition);
    return () => window.removeEventListener("resize", updateCartPosition);
  }, [setCartIconPosition]);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-4 bg-space-900/60 backdrop-blur-xl border-b border-white/5" : "py-6 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-neon-cyan transition-transform group-hover:rotate-12 group-hover:scale-110" />
          <span className="font-display font-bold text-2xl tracking-tighter text-gradient">
            GRAVITY
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-300">
          {["COLLECTIONS", "EXPERIENCE", "TECHNOLOGY"].map((item) => (
            <Link
              key={item}
              href="#"
              className="relative overflow-hidden group py-1"
            >
              <span className="relative z-10 transition-colors group-hover:text-white">
                {item}
              </span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-neon-purple transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && user?.role === "admin" && (
            <Link 
              href="/admin"
              onMouseEnter={() => setHoveringInteractive(true)}
              onMouseLeave={() => setHoveringInteractive(false)}
              className="text-xs font-mono font-bold tracking-widest text-neon-cyan border border-neon-cyan/50 px-3 py-1.5 rounded bg-neon-cyan/10 hover:bg-neon-cyan hover:text-black transition-colors"
            >
              COMMAND CENTER
            </Link>
          )}
          <button 
            onClick={isAuthenticated ? logout : toggleAuthModal}
            className="relative p-2 rounded-full hover:bg-white/5 transition-colors group flex items-center justify-center"
          >
            <User className="w-5 h-5 text-gray-300 group-hover:text-neon-cyan transition-colors" />
            {isAuthenticated && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-neon-cyan rounded-full shadow-[0_0_10px_#00f0ff]" />
            )}
          </button>
          <button onClick={toggleCart} ref={cartRef} className="relative p-2 rounded-full hover:bg-white/5 transition-colors group">
            <ShoppingCart className="w-5 h-5 text-gray-300 group-hover:text-neon-cyan transition-colors" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-neon-magenta rounded-full animate-pulse" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-neon-cyan text-space-900 text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <button className="md:hidden p-2 rounded-full hover:bg-white/5 transition-colors">
            <Menu className="w-6 h-6 text-gray-300" />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
