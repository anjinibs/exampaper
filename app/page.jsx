"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Users, Zap, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      
      {/* --- Ambient Background Magic --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15] 
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] bg-indigo-600 blur-[140px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1] 
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-[10%] -right-[10%] w-[600px] h-[600px] bg-purple-600 blur-[140px] rounded-full" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50" />
      </div>

      {/* --- Feature Badge --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 mb-10 px-6 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl flex items-center gap-3 ring-1 ring-white/5 shadow-2xl"
      >
        <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
          The New Standard in Assessment
        </span>
      </motion.div>

      {/* --- Main Heading --- */}
      <div className="z-10 text-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-[0.85] italic uppercase"
        >
          QUIZ<span className="text-indigo-500">PRO</span><br />
          <span className="text-slate-800 drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]">SYSTEMS</span>
        </motion.h1>
      </div>

      {/* --- Subtext --- */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="z-10 text-slate-500 text-sm sm:text-base text-center max-w-xl mb-14 font-bold uppercase tracking-[0.2em] leading-relaxed"
      >
        Automated Intelligence for the Modern Educator. <br />
        Deploy secure assessments in <span className="text-white">milliseconds.</span>
      </motion.p>

      {/* --- Action Buttons --- */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="z-10 flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
      >
        <Link href="/login" className="w-full sm:w-auto">
          <button className="group relative w-full sm:w-72 bg-white text-black px-10 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(99,102,241,0.3)] active:scale-[0.98]">
            <div className="flex items-center justify-center gap-3">
              <GraduationCap className="w-4 h-4" />
              Teacher Portal
            </div>
          </button>
        </Link>

        <Link href="/join-quiz" className="w-full sm:w-auto">
          <button className="group relative w-full sm:w-72 bg-black border border-white/10 text-white px-10 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all hover:bg-white/[0.03] hover:border-white/20 active:scale-[0.98] shadow-inner ring-1 ring-white/5">
            <div className="flex items-center justify-center gap-3">
              <Zap className="w-4 h-4 text-indigo-500 group-hover:fill-indigo-500 transition-all" />
              Join Session
              <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </div>
          </button>
        </Link>
      </motion.div>

      {/* --- Trust Indicators --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="z-10 mt-32 flex flex-wrap justify-center gap-10 md:gap-20 opacity-20 hover:opacity-50 transition-all duration-1000"
      >
        {[
          { icon: Users, label: "Multi-Tenant" },
          { icon: ShieldCheck, label: "Edu-Secure" },
          { icon: Zap, label: "Live Sync" }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 font-black tracking-[0.4em] italic text-[10px] uppercase">
            <item.icon className="w-4 h-4" /> {item.label}
          </div>
        ))}
      </motion.div>

      {/* --- Bottom Horizon Glow --- */}
      <div className="absolute bottom-[-150px] left-0 w-full h-[300px] bg-indigo-600/10 blur-[160px] pointer-events-none" />
    </div>
  );
}