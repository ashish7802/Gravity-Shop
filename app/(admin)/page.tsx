"use client";

import { motion } from "framer-motion";
import { DollarSign, Package, Users, Activity, ArrowUpRight } from "lucide-react";
import { GlowingChart, HolographicDonutChart } from "@/components/admin/GlowingChart";

const kpis = [
  { title: "Total Revenue", value: "$124,563.00", change: "+14.5%", icon: DollarSign, color: "text-neon-cyan", glow: "shadow-[0_0_15px_#00f0ff]" },
  { title: "Active Orders", value: "842", change: "+5.2%", icon: Package, color: "text-neon-magenta", glow: "shadow-[0_0_15px_#ff00aa]" },
  { title: "Total Users", value: "12,493", change: "+22.4%", icon: Users, color: "text-neon-purple", glow: "shadow-[0_0_15px_#9d00ff]" },
  { title: "System Load", value: "24%", change: "-2.1%", icon: Activity, color: "text-white", glow: "shadow-[0_0_15px_#ffffff]" },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="font-display font-bold text-4xl tracking-wider text-white uppercase"
          >
            Command Center
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="text-gray-400 font-mono mt-2"
          >
            System Status: <span className="text-neon-cyan shadow-[0_0_8px_#00f0ff]">OPTIMAL</span>
          </motion.p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
              className="glass-panel p-6 rounded-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon className={`w-16 h-16 ${kpi.color}`} />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg bg-black/50 ${kpi.glow}`}>
                    <Icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                  <span className="flex items-center gap-1 text-neon-cyan font-mono text-sm bg-neon-cyan/10 px-2 py-1 rounded-md">
                    <ArrowUpRight className="w-3 h-3" /> {kpi.change}
                  </span>
                </div>
                <div>
                  <h3 className="text-gray-400 font-mono text-sm uppercase tracking-wider">{kpi.title}</h3>
                  <p className="font-display font-bold text-3xl text-white mt-1">{kpi.value}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[400px]">
          <GlowingChart />
        </div>
        <div className="h-[400px]">
          <HolographicDonutChart />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 h-[400px]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-panel rounded-2xl p-6 h-full flex flex-col"
        >
          <h3 className="font-display font-bold text-lg text-white mb-6">Live Feed</h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="w-2 h-2 mt-2 rounded-full bg-neon-magenta shadow-[0_0_8px_#ff00aa] animate-pulse" />
                <div>
                  <p className="text-sm text-white">Order <span className="font-mono text-neon-cyan">#GRV-{9000 + i}</span></p>
                  <p className="text-xs text-gray-400 mt-1">Payment authorized. Preparing for dispatch.</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
