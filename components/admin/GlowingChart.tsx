"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-full p-6 bg-[#0e0e12] border border-white/5 rounded-sm relative group"
    >
      <div className="flex justify-between items-center mb-6 relative z-10 font-mono text-[10px]">
        <div>
          <h3 className="font-sans font-bold text-xs text-white uppercase tracking-wider">Revenue Matrix</h3>
          <p className="text-[#bbf3ff] mt-0.5">METRIC // +24.5% ACCELERATION</p>
        </div>
        <div className="flex gap-4">
          <span className="flex items-center gap-2 text-gray-500">
            <div className="w-1.5 h-1.5 rounded-full bg-[#bbf3ff]" />
            Revenue
          </span>
          <span className="flex items-center gap-2 text-gray-500">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
            Traffic
          </span>
        </div>
      </div>

      <div className="w-full h-[220px] relative z-10 font-mono text-[9px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#bbf3ff" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#bbf3ff" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTraf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.1)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis stroke="rgba(255,255,255,0.1)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0e0e12', 
                borderColor: 'rgba(255,255,255,0.08)', 
                borderRadius: '2px',
                color: '#fff',
                fontSize: 10,
                fontFamily: 'monospace'
              }}
              itemStyle={{ color: '#bbf3ff' }}
            />
            <Area type="monotone" dataKey="traffic" stroke="#888899" strokeWidth={1} fillOpacity={1} fill="url(#colorTraf)" />
            <Area type="monotone" dataKey="revenue" stroke="#bbf3ff" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

const donutData = [
  { name: 'Eyewear', value: 400, color: '#bbf3ff' },
  { name: 'Audio', value: 300, color: '#ffffff' },
  { name: 'Wearables', value: 300, color: '#888899' },
  { name: 'Peripherals', value: 200, color: '#ffa000' },
  { name: 'Apparel', value: 150, color: '#444455' },
];

export function HolographicDonutChart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-full p-6 bg-[#0e0e12] border border-white/5 rounded-sm relative group flex flex-col items-center justify-center"
    >
      <h3 className="font-mono font-bold text-xs text-white uppercase tracking-wider self-start absolute top-6 left-6">
        Category Distribution
      </h3>
      
      <div className="w-full h-full min-h-[200px] relative z-10 flex items-center justify-center mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={donutData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
              stroke="rgba(255,255,255,0.03)"
            >
              {donutData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0e0e12', 
                borderColor: 'rgba(255,255,255,0.08)', 
                borderRadius: '2px',
                color: '#fff',
                fontSize: 10,
                fontFamily: 'monospace'
              }}
              itemStyle={{ color: '#bbf3ff' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
