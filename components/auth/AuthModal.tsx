"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Fingerprint, Mail, Lock, User as UserIcon } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export function AuthModal() {
  const { isAuthModalOpen, toggleAuthModal, setUser, setHoveringInteractive } = useAppStore();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      setUser(data.user);
      toggleAuthModal();
      
      // Reset form
      setName("");
      setEmail("");
      setPassword("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleAuthModal}
            className="fixed inset-0 z-[200] bg-space-900/80 backdrop-blur-md"
          />
          
          <div className="fixed inset-0 z-[201] flex items-center justify-center pointer-events-none p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md pointer-events-auto"
            >
              {/* Holographic Glowing Effects */}
              <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-purple rounded-2xl blur opacity-30 animate-pulse" />
              
              <div className="relative bg-space-900/90 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl overflow-hidden">
                {/* Decorative UI elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan to-neon-magenta" />
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon-cyan/10 blur-3xl rounded-full" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-neon-magenta/10 blur-3xl rounded-full" />

                <div className="flex justify-between items-center mb-8 relative z-10">
                  <div className="flex items-center gap-3">
                    <Fingerprint className="w-6 h-6 text-neon-cyan" />
                    <h2 className="font-display font-bold text-2xl text-white tracking-wider uppercase">
                      {isLogin ? "Authenticate" : "Initialize"}
                    </h2>
                  </div>
                  <button 
                    onClick={toggleAuthModal}
                    onMouseEnter={() => setHoveringInteractive(true)}
                    onMouseLeave={() => setHoveringInteractive(false)}
                    className="text-gray-400 hover:text-white transition-colors p-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-3 rounded border border-red-500/50 bg-red-500/10 text-red-400 text-sm font-mono text-center"
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                  {!isLogin && (
                    <div className="relative group">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-neon-cyan transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Operator Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/50 transition-all font-mono text-sm placeholder:text-gray-600"
                      />
                    </div>
                  )}

                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-neon-cyan transition-colors" />
                    <input 
                      type="email" 
                      placeholder="Access Token (Email)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/50 transition-all font-mono text-sm placeholder:text-gray-600"
                    />
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-neon-cyan transition-colors" />
                    <input 
                      type="password" 
                      placeholder="Encryption Key (Password)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/50 transition-all font-mono text-sm placeholder:text-gray-600"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    onMouseEnter={() => setHoveringInteractive(true)}
                    onMouseLeave={() => setHoveringInteractive(false)}
                    className="w-full py-4 rounded-lg bg-white text-space-900 font-bold tracking-widest relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                  >
                    <span className="relative z-10">
                      {loading ? "PROCESSING..." : isLogin ? "ESTABLISH LINK" : "CREATE IDENTITY"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-white to-neon-magenta opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </button>
                </form>

                <div className="mt-6 text-center relative z-10">
                  <p className="text-gray-500 text-sm">
                    {isLogin ? "No identity found?" : "Identity already established?"}{" "}
                    <button 
                      onClick={() => { setIsLogin(!isLogin); setError(""); }}
                      onMouseEnter={() => setHoveringInteractive(true)}
                      onMouseLeave={() => setHoveringInteractive(false)}
                      className="text-neon-cyan hover:text-white transition-colors font-bold tracking-wide"
                    >
                      {isLogin ? "INITIALIZE NOW" : "AUTHENTICATE"}
                    </button>
                  </p>
                </div>

              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
