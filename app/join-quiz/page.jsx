"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { BookOpen, Lock, Loader2, ChevronRight, ShieldCheck } from "lucide-react";

export default function StudentQuizAccess() {
  const router = useRouter();

  const [subjectCode, setSubjectCode] = useState("");
  const [quizCode, setQuizCode] = useState("");
  const [loading, setLoading] = useState(false);

  const startQuiz = async () => {
    if (!subjectCode || !quizCode) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/quiz/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectCode, quizCode }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Identity verified! Redirecting...");
        router.push(`/join-quiz/${quizCode}/student-info`);
      } else {
        toast.error(data.message || "Invalid quiz details");
      }
    } catch (error) {
      toast.error("Server connection lost");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* --- ENHANCED BACKGROUND ("The Outside") --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full animate-pulse delay-1000" />
        {/* Subtle Grid Overlay to add texture to the "Outside" */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150 pointer-events-none" />
      </div>

      <Toaster position="top-center" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[440px]"
      >
        {/* --- THE BOX (Deep Velvet High-Contrast) --- */}
        <div className="bg-slate-950 border border-white/10 p-10 rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.9)] ring-1 ring-white/5 relative overflow-hidden">
          
          {/* Subtle top light bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

          {/* Header Section */}
          <div className="flex flex-col items-center mb-12">
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="w-20 h-20 bg-black border border-white/10 rounded-3xl flex items-center justify-center shadow-inner mb-6"
            >
              <ShieldCheck className="w-10 h-10 text-indigo-500" />
            </motion.div>
            <h2 className="text-4xl font-black text-white tracking-tighter italic">
              PORTAL<span className="text-indigo-500">.</span>
            </h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3">
              Secure Session Entry
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                Subject Code
              </label>
              <div className="relative group">
                <BookOpen className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  placeholder="e.g. CS-201"
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                  className="w-full pl-14 pr-6 py-4.5 rounded-2xl bg-black border border-white/5 text-white placeholder-slate-800 outline-none transition-all focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                Access Token
              </label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  placeholder="••••••••"
                  type="password"
                  value={quizCode}
                  onChange={(e) => setQuizCode(e.target.value)}
                  className="w-full pl-14 pr-6 py-4.5 rounded-2xl bg-black border border-white/5 text-white placeholder-slate-800 outline-none transition-all focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 shadow-inner"
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={startQuiz}
              disabled={loading}
              className="w-full group mt-4 bg-indigo-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-indigo-500 hover:shadow-[0_10px_25px_rgba(79,70,229,0.4)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Enter Vault
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Support Footer */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-10 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]"
        >
          Issue with Access?{" "}
          <button className="text-indigo-400 hover:text-indigo-300 transition-colors">
            Contact Supervisor
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
}