"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, User, Mail, Lock, ArrowRight } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Navbar } from "@/components/ui/Navbar";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAppStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Identity registration failed");
      }

      setUser(data.user);
      router.push("/account");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-white flex flex-col justify-between selection:bg-[#bbf3ff]/30 selection:text-[#bbf3ff]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 pt-32 pb-16 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#bbf3ff]/5 blur-[140px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-[#0e0e12]/90 backdrop-blur-2xl border border-white/10 p-8 rounded-2xl shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-transparent" />

            <div className="mb-8 space-y-2">
              <span className="font-mono text-[10px] text-emerald-400 tracking-[0.25em] uppercase block">
                IDENTITY INITIALIZATION // SECURE PROTOCOL
              </span>
              <h1 className="font-sans font-black text-3xl uppercase tracking-tight text-white flex items-center gap-3">
                <UserPlus className="w-7 h-7 text-emerald-400" />
                Register
              </h1>
              <p className="font-mono text-xs text-gray-400">
                Enroll a new encrypted clearance profile in the Gravity registry.
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 text-xs font-mono"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-1.5">
                  Operator Designation (Full Name)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Commander Shepard"
                    className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white font-mono placeholder:text-gray-600 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-1.5">
                  Identity Token (Email)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operator@gravityshop.com"
                    className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white font-mono placeholder:text-gray-600 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-1.5">
                  Encryption Key (Password - 6+ characters)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white font-mono placeholder:text-gray-600 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 bg-white text-black font-mono font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "REGISTERING IDENTITY..." : "INITIALIZE_PROFILE"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 text-center font-mono text-xs text-gray-500">
              Identity already exists?{" "}
              <Link href="/login" className="text-[#bbf3ff] hover:underline uppercase tracking-wider">
                Authenticate
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
