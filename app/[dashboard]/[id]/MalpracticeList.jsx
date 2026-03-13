"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { ShieldAlert, Unlock, AlertTriangle, UserX } from "lucide-react";

export default function MalpracticeList({ students }) {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const malpracticeReports = students.filter((student) => student.locked);
    setReports(malpracticeReports);
  }, [students]);

  const handleUnlock = async (studentId, quizId) => {
    const toastId = toast.loading("Processing system override...");
    try {
      const res = await fetch("/api/unlock-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, quizId }),
      });
      const data = await res.json();
      
      toast.dismiss(toastId);
      if (data.success) {
        toast.success("Candidate re-authorized 🔓", {
          style: { background: "#064e3b", color: "#fff", border: "1px solid #10b981" }
        });
        setReports(reports.filter((r) => r.id !== studentId));
      } else {
        toast.error("Override failed");
      }
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Terminal sync error");
    }
  };

  if (!reports.length)
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-slate-950/50 rounded-[2rem] border border-white/5">
        <ShieldAlert className="w-12 h-12 text-slate-800 mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">No Integrity Breaches Detected</p>
      </div>
    );

  return (
    <div className="bg-slate-950 border border-red-500/20 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(239,68,68,0.1)] relative overflow-hidden">
      
      {/* --- Hazard Header --- */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl animate-pulse">
            <AlertTriangle className="text-red-500" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase tracking-[0.2em] text-white italic">Security Breach</h2>
            <p className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest">Immediate Intervention Required</p>
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto custom-scrollbar">
        <table className="w-full">
          <thead>
            <tr className="text-slate-600 border-b border-white/5">
              <th className="text-left pb-4 pl-2 font-black text-[9px] uppercase tracking-[0.2em]">Candidate</th>
              <th className="text-left pb-4 font-black text-[9px] uppercase tracking-[0.2em]">Index No</th>
              <th className="text-left pb-4 font-black text-[9px] uppercase tracking-[0.2em]">Violation</th>
              <th className="text-right pb-4 pr-2 font-black text-[9px] uppercase tracking-[0.2em]">Command</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {reports.map((r) => (
                <motion.tr
                  key={r.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group hover:bg-red-500/[0.02] transition-colors"
                >
                  <td className="py-5 pl-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center">
                        <UserX size={14} className="text-slate-500" />
                      </div>
                      <span className="text-sm font-bold text-white tracking-tight">{r.name}</span>
                    </div>
                  </td>

                  <td className="py-5">
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-black px-3 py-1 rounded-lg border border-white/5">
                      {r.regNo}
                    </span>
                  </td>

                  <td className="py-5">
                    <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-tighter text-red-400 bg-red-400/10 px-3 py-1 rounded-md border border-red-400/20">
                      <span className="w-1 h-1 rounded-full bg-red-400 animate-ping" />
                      {r.lockedReason || "Tab Switch Detected"}
                    </span>
                  </td>

                  <td className="py-5 text-right pr-2">
                    <button
                      onClick={() => handleUnlock(r.id, r.quizId)}
                      className="group/btn relative inline-flex items-center gap-2 bg-black border border-white/10 hover:border-emerald-500/50 px-5 py-2.5 rounded-xl transition-all active:scale-[0.95] overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-emerald-500/0 group-hover/btn:bg-emerald-500/5 transition-colors" />
                      <Unlock size={14} className="text-slate-500 group-hover/btn:text-emerald-400 transition-colors" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover/btn:text-emerald-400 transition-colors">
                        Override
                      </span>
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Aesthetic Bottom Border */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
    </div>
  );
}