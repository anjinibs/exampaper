"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function ScoreGraph({ students }) {
  // Prep data: Sort by score to show the "curve" of the class
  const data = [...students]
    .sort((a, b) => a.score - b.score) // Sorted low to high for a smooth growth curve
    .filter(s => s.score !== undefined)
    .map(s => ({
      name: s.name,
      score: s.score || 0
    }));

  return (
    <div className="w-full h-72 relative">
      {/* Custom Tooltip Styling to match Onyx Theme */}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#ffffff05" 
          />
          
          <XAxis 
            dataKey="name" 
            hide={true} // Hide names on axis to prevent overlapping text clutter
          />
          
          <YAxis 
            stroke="#475569" 
            fontSize={10} 
            fontWeight="bold"
            tickLine={false}
            axisLine={false}
          />
          
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "#020617", 
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              fontSize: "10px",
              fontWeight: "900",
              textTransform: "uppercase",
              letterSpacing: "0.1em"
            }}
            itemStyle={{ color: "#818cf8" }}
            cursor={{ stroke: '#6366f1', strokeWidth: 1 }}
          />
          
          <Area
            type="monotone"
            dataKey="score"
            stroke="#6366f1"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorScore)"
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* --- OVERLAY LABELS --- */}
      <div className="absolute top-0 right-0 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Live Telemetry</span>
        </div>
      </div>
    </div>
  );
}