"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { Mail, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleReset = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSent(true);
        toast.success("Check your inbox!");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* --- ENHANCED BACKGROUND (The "Outside") --- */}
      {/* Dynamic colorful blobs to make the background feel "far away" */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)]" />
      </div>
      
      <Toaster position="top-center" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* --- THE BOX (High Contrast "Deep Velvet" Style) --- */}
        {/* 1. Added a solid dark background (slate-950) to separate from the blue-ish background */}
        {/* 2. Added a thick shadow and a bright "rim" border */}
        <div className="bg-slate-950 border border-white/10 p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)] ring-1 ring-white/5 relative overflow-hidden">
          
          {/* Subtle inner glow for the box */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          <AnimatePresence mode="wait">
            {!isSent ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 border border-white/10 rounded-2xl mb-6 shadow-inner group-hover:scale-110 transition-transform">
                    <Mail className="w-8 h-8 text-indigo-400" />
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tight italic">
                    RECOVERY<span className="text-indigo-500">.</span>
                  </h2>
                  <p className="text-sm text-slate-500 mt-3 font-medium">
                    Lost your access? Enter your email to receive a secure link.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                      Institutional Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="name@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/60 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder-slate-700 outline-none transition-all focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 shadow-inner"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(79,70,229,0.3)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Send Recovery Link"
                    )}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl mb-8 rotate-3">
                  <ShieldCheck className="w-10 h-10 text-emerald-400" />
                </div>
                <h2 className="text-3xl font-black text-white mb-3 tracking-tighter">Check Your Inbox</h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-10">
                  A verification link has been dispatched to <br />
                  <span className="text-indigo-400 font-bold">{email}</span>
                </p>
                <button 
                  onClick={() => setIsSent(false)}
                  className="text-white bg-white/5 border border-white/10 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                  Resend Link
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-slate-500 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Return to Vault
            </Link>
          </div>
        </div>

        <p className="mt-10 text-center text-slate-700 text-[10px] tracking-[0.3em] uppercase font-black opacity-40">
          Encrypted Authentication Session
        </p>
      </motion.div>
    </div>
  );
}