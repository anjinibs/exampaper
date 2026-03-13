"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { User, Hash, Mail, ArrowRight, Loader2, IdCard } from "lucide-react";

export default function StudentInfo() {
  const router = useRouter();
  const { quiz } = useParams();
  const quizid = quiz;

  const [form, setForm] = useState({
    name: "",
    regNo: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.regNo || !form.email) {
      toast.error("Please fill in all identity fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/student-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, quizid }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Identity Verified!");
        setTimeout(() => {
          router.push(`/join-quiz/${quiz}/${data.id}`);
        }, 800);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Connection to server failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* --- ENHANCED BACKGROUND ("The Outside") --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <Toaster position="top-center" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* --- THE BOX (High Contrast "Deep Velvet") --- */}
        <div className="bg-slate-950 border border-white/10 p-10 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] ring-1 ring-white/5 relative overflow-hidden">
          
          {/* Top Decorative Rim */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/5">
              <IdCard className="w-10 h-10 text-indigo-400" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter italic">
              IDENTITY<span className="text-indigo-500">.</span>
            </h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-3">
              Secure Candidate Verification
            </p>
          </div>

          <div className="space-y-6">
            {/* Input Group: Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">
                Full Legal Name
              </label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  name="name"
                  placeholder="e.g. Alexander Pierce"
                  onChange={handleChange}
                  className="w-full pl-14 pr-6 py-4.5 rounded-2xl bg-black/60 border border-white/5 text-white placeholder-slate-700 outline-none transition-all focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 shadow-inner"
                />
              </div>
            </div>

            {/* Input Group: Reg No */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">
                Registration / Roll Number
              </label>
              <div className="relative group">
                <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  name="regNo"
                  placeholder="2026-CS-0042"
                  onChange={handleChange}
                  className="w-full pl-14 pr-6 py-4.5 rounded-2xl bg-black/60 border border-white/5 text-white placeholder-slate-700 outline-none transition-all focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 shadow-inner"
                />
              </div>
            </div>

            {/* Input Group: Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">
                Institutional Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  name="email"
                  type="email"
                  placeholder="student@university.edu"
                  onChange={handleChange}
                  className="w-full pl-14 pr-6 py-4.5 rounded-2xl bg-black/60 border border-white/5 text-white placeholder-slate-700 outline-none transition-all focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 shadow-inner"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-4 group relative overflow-hidden bg-white text-black py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-slate-100 hover:shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Verify & Enter Quiz
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        <p className="mt-10 text-center text-slate-700 text-[10px] tracking-[0.4em] uppercase font-black opacity-50">
          Proctoring Protocol Enabled
        </p>
      </motion.div>
    </div>
  );
}