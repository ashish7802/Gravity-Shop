"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function SearchPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Global listener for Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debounced Search Fetch
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const handleSelect = (id: string) => {
    setIsOpen(false);
    router.push(`/product/${id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[101] px-4"
          >
            <div className="bg-[#0a0a10] border border-white/10 shadow-[0_0_50px_rgba(0,240,255,0.1)] rounded-2xl overflow-hidden flex flex-col relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan to-neon-magenta" />
              
              <div className="flex items-center px-4 py-4 border-b border-white/10">
                <Search className="w-6 h-6 text-neon-cyan mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search the ecosystem..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-white text-lg font-mono placeholder:text-gray-600"
                />
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {isLoading && (
                  <div className="p-12 flex justify-center items-center">
                    <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />
                  </div>
                )}
                
                {!isLoading && query.length >= 2 && results.length === 0 && (
                  <div className="p-12 text-center text-gray-500 font-mono">
                    NO MATCHING RECORDS FOUND
                  </div>
                )}

                {!isLoading && results.length > 0 && (
                  <div className="p-2 space-y-1">
                    {results.map((item) => (
                      <button
                        key={item._id.toString()}
                        onClick={() => handleSelect(item._id.toString())}
                        className="w-full flex items-center p-3 hover:bg-white/5 rounded-xl transition-colors group text-left"
                      >
                        <div className="w-12 h-12 relative bg-black rounded border border-white/10 overflow-hidden mr-4">
                          <Image src={item.image} alt={item.name} fill className="object-cover opacity-80 group-hover:opacity-100" sizes="48px" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-bold text-sm group-hover:text-neon-cyan transition-colors">{item.name}</p>
                          <p className="text-gray-500 font-mono text-xs">{item.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-mono text-sm">${item.price}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {!query && (
                  <div className="p-6 text-center">
                    <p className="text-xs font-mono text-gray-600 tracking-widest uppercase">Awaiting Query Input</p>
                  </div>
                )}
              </div>
              
              <div className="px-4 py-3 bg-black/50 border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1 text-xs font-mono text-gray-500"><kbd className="bg-white/10 px-2 rounded">↑</kbd><kbd className="bg-white/10 px-2 rounded">↓</kbd> to navigate</span>
                  <span className="flex items-center gap-1 text-xs font-mono text-gray-500"><kbd className="bg-white/10 px-2 rounded">ENTER</kbd> to select</span>
                </div>
                <span className="text-xs font-mono text-gray-600">Gravity OS Search</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
