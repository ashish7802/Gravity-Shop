"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Users, ShoppingCart, DollarSign, AlertTriangle } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function AdminAnalyticsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-neon-cyan font-mono animate-pulse">AGGREGATING METRICS...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="font-display font-bold text-4xl tracking-wider text-white uppercase"
        >
          System Analytics
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="text-gray-400 font-mono mt-2"
        >
          Real-time commerce telemetry and stock monitoring.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 font-mono text-sm">TOTAL USERS</p>
              <h3 className="text-3xl font-bold text-white mt-2">{data?.totalUsers || 0}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-neon-cyan/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-neon-cyan" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan to-transparent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 font-mono text-sm">TOTAL ORDERS</p>
              <h3 className="text-3xl font-bold text-white mt-2">{data?.totalOrders || 0}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-neon-magenta/10 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-neon-magenta" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-neon-magenta to-transparent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 font-mono text-sm">TOTAL REVENUE</p>
              <h3 className="text-3xl font-bold text-white mt-2">${(data?.totalRevenue || 0).toFixed(2)}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5">
          <h3 className="font-mono text-sm text-gray-400 mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4 text-neon-cyan" /> MONTHLY REVENUE (6 MONTHS)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.monthlyRevenue || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#00f0ff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#00f0ff" fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass-panel p-6 rounded-2xl border border-white/5">
            <h3 className="font-mono text-sm text-gray-400 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" /> LOW STOCK ALERTS
            </h3>
            <div className="space-y-4">
              {data?.lowStock?.length === 0 ? (
                <p className="text-gray-500 text-sm">Inventory levels optimal.</p>
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data?.lowStock?.map((item: any) => (
                  <div key={item._id} className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-white text-sm">{item.name}</span>
                    <span className="text-yellow-500 font-mono text-xs bg-yellow-500/10 px-2 py-1 rounded">
                      {item.stock} LEFT
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="glass-panel p-6 rounded-2xl border border-white/5">
            <h3 className="font-mono text-sm text-gray-400 mb-4 flex items-center gap-2">
              TOP SELLING PRODUCTS
            </h3>
            <div className="space-y-4">
              {data?.topSellingProducts?.length === 0 ? (
                <p className="text-gray-500 text-sm">No sales data yet.</p>
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data?.topSellingProducts?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-white text-sm truncate max-w-[150px]">{item.name}</span>
                    <div className="text-right">
                      <p className="text-neon-cyan font-mono text-xs">{item.sold} sold</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
