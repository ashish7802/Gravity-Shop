"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Fingerprint, Mail, Lock, ShieldCheck, ArrowRight, UserCheck } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Navbar } from "@/components/ui/Navbar";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { setUser } = useAppStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e?: React.FormEvent, customCreds?: { email: string; pass: string }) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");

    const targetEmail = customCreds ? customCreds.email : email;
    const targetPassword = customCreds ? customCreds.pass : password;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, password: targetPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      setUser(data.user);
      if (data.user.role === "admin" && redirect === "/") {
        router.push("/admin");
      } else {
        router.push(redirect);
      }
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication error");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: "admin" | "user") => {
    if (role === "admin") {
      setEmail("admin@gravityshop.com");
      setPassword("admin123");
      handleLogin(undefined, { email: "admin@gravityshop.com", pass: "admin123" });
    } else {
      setEmail("user@gravityshop.com");
      setPassword("user123");
      handleLogin(undefined, { email: "user@gravityshop.com", pass: "user123" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md relative z-10"
    >
      <div className="bg-[#0e0e12]/90 backdrop-blur-2xl border border-white/10 p-8 rounded-2xl shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#bbf3ff] to-transparent" />

        <div className="mb-8 space-y-2">
          <span className="font-mono text-[10px] text-[#bbf3ff] tracking-[0.25em] uppercase block">
            SECURITY PROTOCOL // ACCESS GATEWAY
          </span>
          <h1 className="font-sans font-black text-3xl uppercase tracking-tight text-white flex items-center gap-3">
            <Fingerprint className="w-7 h-7 text-[#bbf3ff]" />
            Authenticate
          </h1>
          <p className="font-mono text-xs text-gray-400">
            Supply verified operator credentials to gain terminal clearance.
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

        <form onSubmit={handleLogin} className="space-y-4">
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
                className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white font-mono placeholder:text-gray-600 focus:outline-none focus:border-[#bbf3ff]/50 focus:ring-1 focus:ring-[#bbf3ff]/50 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-1.5">
              Decryption Key (Password)
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white font-mono placeholder:text-gray-600 focus:outline-none focus:border-[#bbf3ff]/50 focus:ring-1 focus:ring-[#bbf3ff]/50 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-white text-black font-mono font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[#bbf3ff] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "INITIALIZING..." : "LINK_TERMINAL"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
          <span className="font-mono text-[9px] text-gray-500 tracking-wider uppercase block text-center">
            ONE-CLICK DEMO ACCESS
          </span>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleQuickLogin("admin")}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#bbf3ff]/40 rounded-lg text-left transition-all"
            >
              <div className="flex items-center gap-1.5 text-[#bbf3ff] text-[10px] font-mono font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                ADMIN CONSOLE
              </div>
              <div className="text-[9px] text-gray-500 font-mono mt-0.5">admin@gravityshop.com</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("user")}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/40 rounded-lg text-left transition-all"
            >
              <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-mono font-bold">
                <UserCheck className="w-3.5 h-3.5" />
                VERIFIED BUYER
              </div>
              <div className="text-[9px] text-gray-500 font-mono mt-0.5">user@gravityshop.com</div>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center font-mono text-xs text-gray-500">
          New operator?{" "}
          <Link href="/register" className="text-[#bbf3ff] hover:underline uppercase tracking-wider">
            Create Identity
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#08080a] text-white flex flex-col justify-between selection:bg-[#bbf3ff]/30 selection:text-[#bbf3ff]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 pt-32 pb-16 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#bbf3ff]/5 blur-[140px] rounded-full pointer-events-none" />

        <Suspense fallback={
          <div className="text-[#bbf3ff] font-mono text-xs animate-pulse tracking-widest">
            AUTHENTICATING GATEWAY...
          </div>
        }>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
