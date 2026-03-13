"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Hash } from "lucide-react";

export default function Leaderboard({ students }) {
  // Sort and filter students
  const sortedStudents = [...students]
    .sort((a, b) => b.score - a.score)
    .filter((s) => s.score !== undefined);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-950 border border-white/10 rounded-[2.5rem] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.8)] ring-1 ring-white/5 relative overflow-hidden"
    >
      {/* --- Decorative Header --- */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-black border border-indigo-500/20 rounded-2xl shadow-inner text-indigo-400">
            <Trophy size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase tracking-[0.2em] text-white">Standings</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Performance Data</p>
          </div>
        </div>
        <div className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">
            {sortedStudents.length} Candidates
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-slate-600">
              <th className="text-left pb-4 pl-2 font-black text-[9px] uppercase tracking-[0.2em]">Rank</th>
              <th className="text-left pb-4 font-black text-[9px] uppercase tracking-[0.2em]">Candidate</th>
              <th className="text-center pb-4 font-black text-[9px] uppercase tracking-[0.2em]">Index No</th>
              <th className="text-right pb-4 pr-2 font-black text-[9px] uppercase tracking-[0.2em]">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedStudents.map((s, i) => {
              const isTopThree = i < 3;
              return (
                <motion.tr 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  {/* RANK COLUMN */}
                  <td className="py-4 pl-2">
                    <div className="flex items-center">
                      {i === 0 ? (
                        <Medal className="text-yellow-500" size={18} />
                      ) : i === 1 ? (
                        <Medal className="text-slate-400" size={18} />
                      ) : i === 2 ? (
                        <Medal className="text-amber-700" size={18} />
                      ) : (
                        <span className="text-slate-700 font-black text-xs ml-1">#{i + 1}</span>
                      )}
                    </div>
                  </td>

                  {/* NAME COLUMN */}
                  <td className="py-4">
                    <span className={`text-sm font-bold tracking-tight ${isTopThree ? 'text-white' : 'text-slate-400'}`}>
                      {s.name}
                    </span>
                  </td>

                  {/* REG NO COLUMN */}
                  <td className="py-4 text-center">
                    <span className="text-[10px] font-mono font-bold text-slate-600 bg-black/40 px-3 py-1 rounded-lg border border-white/5">
                      {s.regNo}
                    </span>
                  </td>

                  {/* SCORE COLUMN */}
                  <td className="py-4 text-right pr-2">
                    <span className={`text-sm font-black italic tracking-tighter ${
                      i === 0 ? 'text-emerald-400' : 'text-indigo-400'
                    }`}>
                      {s.score.toLocaleString()}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- Empty State --- */}
      {sortedStudents.length === 0 && (
        <div className="py-20 text-center">
          <Hash className="mx-auto text-slate-800 mb-4" size={40} />
          <p className="text-xs font-black uppercase tracking-widest text-slate-700">No data transmitted yet</p>
        </div>
      )}
    </motion.div>
  );
}