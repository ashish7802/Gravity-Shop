"use client";

import { motion } from "framer-motion";
import { GlowingChart, HolographicDonutChart } from "@/components/admin/GlowingChart";

export default function AdminDashboard() {
  const telemetry = [
    { label: "API LATENCY", value: "12MS", status: "NOMINAL", color: "text-[#bbf3ff]" },
    { label: "DATABASE METRIC", value: "CONNECTED", status: "OK", color: "text-emerald-400" },
    { label: "CACHE HIT RATE", value: "99.8%", status: "OPTIMIZED", color: "text-[#bbf3ff]" },
    { label: "AGGREGATE LOAD", value: "24.1%", status: "NOMINAL", color: "text-gray-300" }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-mono text-[10px]">
      
      {/* Title block */}
      <div className="flex justify-between items-baseline pb-6 border-b border-white/5">
        <div>
          <h1 className="font-sans font-black text-3xl tracking-tight text-white uppercase leading-none mb-2">
            OPERATIONS CONSOLE
          </h1>
          <p className="text-gray-500 tracking-wider">
            SYSTEM_PROTOCOL // ACTIVE_METRICS
          </p>
        </div>
        <div className="flex gap-4">
          <span className="text-[#bbf3ff]">HOST // SECURE</span>
          <span className="text-emerald-400">DB // ACTIVE</span>
        </div>
      </div>

      {/* High-density Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
        {telemetry.map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#0e0e12] p-6 flex flex-col justify-between"
          >
            <div>
              <p className="text-gray-500 tracking-widest uppercase mb-1">{item.label}</p>
              <p className="text-xl font-bold text-white tracking-tight mt-1">{item.value}</p>
            </div>
            <div className="mt-6 flex justify-between items-center text-[9px] border-t border-white/5 pt-3">
              <span className="text-gray-500">STATUS //</span>
              <span className={`${item.color} font-medium`}>{item.status}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts (Vercel Style Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
        <div className="lg:col-span-2 h-[350px] bg-[#0e0e12] p-6">
          <GlowingChart />
        </div>
        <div className="h-[350px] bg-[#0e0e12] p-6">
          <HolographicDonutChart />
        </div>
      </div>

      {/* Live Feed Terminal */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#0e0e12] border border-white/5 p-6 h-[300px] flex flex-col"
      >
        <div className="flex justify-between items-baseline mb-6 pb-3 border-b border-white/5">
          <h3 className="font-sans font-bold text-xs tracking-wider text-white uppercase">Live Event Logs</h3>
          <span className="text-[#ffa000]">REALTIME // MONITORING</span>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="flex items-start justify-between py-2 border-b border-white/[0.02]">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffa000] animate-pulse" />
                <span>ORDER // PROTOCOL_ACQUIRED</span>
                <span className="text-gray-500">#GRV-{9000 + i}</span>
              </div>
              <span className="text-gray-500">SECURE_LINK // NOMINAL_DISPATCH</span>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
