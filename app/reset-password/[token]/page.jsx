"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { Lock, ShieldCheck, RefreshCw, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = useParams();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      toast.error("Security fields cannot be empty");
      return;
    }

    if (password.length < 6) {
      toast.error("Password complexity requirement not met");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Credential mismatch detected");
      return;
    }

    setLoading(true);
    const resetToast = toast.loading("Syncing new credentials...");

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      toast.dismiss(resetToast);

      if (data.success) {
        toast.success("Security credentials updated! 🎉");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        toast.error(data.message || "Reset link expired");
      }
    } catch (error) {
      toast.dismiss(resetToast);
      toast.error("System synchronization error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      <Toaster position="top-center" />

      {/* --- BACKGROUND ("The Void") --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* --- THE BOX (Deep Velvet High-Contrast) --- */}
        <div className="bg-slate-950 border border-white/10 p-10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] ring-1 ring-white/5 relative">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black border border-white/10 rounded-2xl mb-6 shadow-inner ring-1 ring-white/5">
              <ShieldCheck className="w-8 h-8 text-indigo-400" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">
              Secure <span className="text-indigo-500">Reset.</span>
            </h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.25em] mt-3">Override security protocols</p>
          </div>

          <div className="space-y-6">
            {/* New Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Secret Key</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-14 py-4.5 rounded-2xl bg-black border border-white/5 text-white placeholder-slate-800 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner"
                />
                <button 
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Validate Key</label>
              <div className="relative group">
                <RefreshCw className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-14 pr-4 py-4.5 rounded-2xl bg-black border border-white/5 text-white placeholder-slate-800 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Password Match Indicator */}
            <AnimatePresence>
              {password && confirmPassword && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`text-[9px] font-black uppercase tracking-[0.2em] text-center py-3 rounded-xl border ${
                    password === confirmPassword 
                      ? "text-emerald-400 border-emerald-500/10 bg-emerald-500/5" 
                      : "text-red-400 border-red-500/10 bg-red-500/5"
                  }`}
                >
                  {password === confirmPassword ? "✓ Credentials Match" : "✗ Mismatch Detected"}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full group bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-[0_10px_30px_rgba(79,70,229,0.3)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Overwrite Credentials"
              )}
            </button>
          </div>

          <p className="text-center mt-10 text-slate-600 text-[9px] font-black uppercase tracking-widest">
            Critical Action: <span className="text-slate-400 hover:text-indigo-400 cursor-pointer transition-colors">Emergency Admin Contact</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}