"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { SafeImage } from "@/components/ui/SafeImage";

export function SearchPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Global listener for Cmd/Ctrl + K and toggle-search event
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

    const handleToggleSearch = () => {
      setIsOpen((prev) => !prev);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("toggle-search", handleToggleSearch);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("toggle-search", handleToggleSearch);
    };
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
            className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[101] px-4"
          >
            <div className="bg-[#0e0e12] border border-white/5 shadow-2xl shadow-black rounded-none overflow-hidden flex flex-col relative">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#bbf3ff]" />
              
              <div className="flex items-center px-6 py-5 border-b border-white/5">
                <Search className="w-4 h-4 text-gray-500 mr-4" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="SEARCH SHOWROOM REGISTRY..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-white text-sm font-mono placeholder:text-gray-700 tracking-wider"
                />
                <button onClick={() => setIsOpen(false)} className="p-1 border border-white/5 rounded-none text-gray-400 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-[50vh] overflow-y-auto no-scrollbar">
                {isLoading && (
                  <div className="p-12 flex justify-center items-center">
                    <Loader2 className="w-5 h-5 text-[#bbf3ff] animate-spin" />
                  </div>
                )}
                
                {!isLoading && query.length >= 2 && results.length === 0 && (
                  <div className="p-12 text-center text-gray-500 font-mono text-[10px] tracking-widest">
                    NO RECORD MATCHES FOUND IN DATABASE
                  </div>
                )}

                {!isLoading && results.length > 0 && (
                  <div className="p-2 divide-y divide-white/[0.03]">
                    {results.map((item) => (
                      <button
                        key={item._id.toString()}
                        onClick={() => handleSelect(item._id.toString())}
                        className="w-full flex items-center p-3 hover:bg-white/[0.02] transition-colors group text-left rounded-none"
                      >
                        <div className="w-10 h-10 relative bg-black border border-white/5 overflow-hidden mr-4">
                          <SafeImage src={item.image} alt={item.name} fill className="object-contain opacity-80 group-hover:opacity-100 transition-opacity" sizes="40px" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-sans font-bold text-xs uppercase tracking-tight group-hover:text-[#bbf3ff] transition-colors">{item.name}</p>
                          <p className="text-gray-500 font-mono text-[9px] uppercase tracking-wider">{item.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-mono text-[10px] font-bold">${item.price}.00</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {!query && (
                  <div className="p-12 text-center">
                    <p className="text-[9px] font-mono text-gray-600 tracking-[0.25em] uppercase">AWAITING SYSTEM QUERY INPUT</p>
                  </div>
                )}
              </div>
              
              <div className="px-6 py-4 bg-black/40 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-gray-500">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1"><kbd className="bg-white/5 px-1 border border-white/10 rounded-sm">↑↓</kbd> NAVIGATE</span>
                  <span className="flex items-center gap-1"><kbd className="bg-white/5 px-1 border border-white/10 rounded-sm">ENTER</kbd> SELECT</span>
                </div>
                <span className="text-[8px] tracking-widest uppercase">GRAVITY OS ENGINE</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
