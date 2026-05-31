"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Mon", revenue: 4000, traffic: 2400 },
  { name: "Tue", revenue: 3000, traffic: 1398 },
  { name: "Wed", revenue: 2000, traffic: 9800 },
  { name: "Thu", revenue: 2780, traffic: 3908 },
  { name: "Fri", revenue: 1890, traffic: 4800 },
  { name: "Sat", revenue: 2390, traffic: 3800 },
  { name: "Sun", revenue: 3490, traffic: 4300 },
];

export function GlowingChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-full h-full p-6 glass-panel rounded-2xl relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-transparent rounded-2xl pointer-events-none" />
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
          <h3 className="font-display font-bold text-lg text-white">Revenue Matrix</h3>
          <p className="text-neon-cyan font-mono text-sm">+24.5% Quantum Delta</p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <div className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_8px_#00f0ff]" />
            Revenue
          </span>
          <span className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <div className="w-2 h-2 rounded-full bg-neon-magenta shadow-[0_0_8px_#ff00aa]" />
            Traffic
          </span>
        </div>
      </div>

      <div className="w-full h-[300px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTraf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff00aa" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ff00aa" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(3,0,20,0.8)', 
                backdropFilter: 'blur(10px)', 
                borderColor: 'rgba(255,255,255,0.1)', 
                borderRadius: '8px',
                color: '#fff'
              }}
              itemStyle={{ color: '#00f0ff' }}
            />
            <Area type="monotone" dataKey="traffic" stroke="#ff00aa" strokeWidth={2} fillOpacity={1} fill="url(#colorTraf)" />
            <Area type="monotone" dataKey="revenue" stroke="#00f0ff" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

const donutData = [
  { name: 'Sneakers', value: 400, color: '#00f0ff' },
  { name: 'Watches', value: 300, color: '#ffd700' },
  { name: 'Gaming', value: 300, color: '#9d00ff' },
  { name: 'Electronics', value: 200, color: '#ff00aa' },
];

import { PieChart, Pie, Cell } from "recharts";

export function HolographicDonutChart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="w-full h-full p-6 glass-panel rounded-2xl relative group flex flex-col items-center justify-center"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple/5 to-transparent rounded-2xl pointer-events-none" />
      <h3 className="font-display font-bold text-lg text-white self-start w-full absolute top-6 left-6">Category Distribution</h3>
      
      <div className="w-full h-full min-h-[250px] relative z-10 flex items-center justify-center mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={donutData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="rgba(255,255,255,0.05)"
            >
              {donutData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(3,0,20,0.8)', 
                backdropFilter: 'blur(10px)', 
                borderColor: 'rgba(255,255,255,0.1)', 
                borderRadius: '8px',
                color: '#fff'
              }}
              itemStyle={{ color: '#00f0ff' }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Holographic core glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/5 rounded-full blur-xl animate-pulse pointer-events-none" />
      </div>
    </motion.div>
  );
}
