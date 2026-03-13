"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SocialButtons from "./SocialButtons";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { Mail, Lock, LogIn, AlertCircle, Loader2, GraduationCap } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Minimum 6 characters";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleLogin = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Authenticating educator...");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      toast.dismiss(loadingToast);

      if (data.success) {
        toast.success("Welcome back, Professor! 🎉");
        router.push(`/${data.id}`);
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      <Toaster position="top-center" />
      
      {/* --- BACKGROUND ("The Void") --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 blur-[130px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "circOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* --- THE BOX (Deep Velvet High-Contrast) --- */}
        <div className="bg-slate-950 border border-white/10 p-10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] ring-1 ring-white/5 overflow-hidden relative">
          
          {/* Subtle Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black border border-white/10 rounded-2xl mb-6 shadow-inner ring-1 ring-white/5">
              <GraduationCap className="w-8 h-8 text-indigo-400" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">
              Edu<span className="text-indigo-500">Vault.</span>
            </h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.25em] mt-3">Professor Authentication</p>
          </div>

          <div className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Institutional ID</label>
              <div className="relative group">
                <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.email ? 'text-red-400' : 'text-slate-600 group-focus-within:text-indigo-400'}`} />
                <input
                  type="email"
                  name="email"
                  placeholder="professor@university.edu"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full pl-14 pr-4 py-4.5 rounded-2xl bg-black border transition-all outline-none text-white placeholder-slate-800 shadow-inner ${
                    errors.email ? "border-red-500/40 bg-red-500/5" : "border-white/5 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5"
                  }`}
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-[10px] font-bold flex items-center gap-1.5 ml-2">
                    <AlertCircle className="w-3 h-3" /> {errors.email.toUpperCase()}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Credential Key</label>
                <Link href="/forgot-password" size="sm" className="text-[10px] font-black text-indigo-500 hover:text-indigo-400 uppercase tracking-widest">
                  Reset?
                </Link>
              </div>
              <div className="relative group">
                <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.password ? 'text-red-400' : 'text-slate-600 group-focus-within:text-indigo-400'}`} />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full pl-14 pr-4 py-4.5 rounded-2xl bg-black border transition-all outline-none text-white placeholder-slate-800 shadow-inner ${
                    errors.password ? "border-red-500/40 bg-red-500/5" : "border-white/5 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5"
                  }`}
                />
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-[10px] font-bold flex items-center gap-1.5 ml-2">
                    <AlertCircle className="w-3 h-3" /> {errors.password.toUpperCase()}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full group bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-[0_10px_30px_rgba(79,70,229,0.3)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Access Dashboard"}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em] font-black"><span className="bg-slate-950 px-4 text-slate-600">Enterprise SSO</span></div>
            </div>

            <SocialButtons />
          </div>
        </div>

        <p className="mt-8 text-center text-slate-600 text-[10px] font-black uppercase tracking-widest">
          New Educator? <Link href="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors">Apply for Account</Link>
        </p>
      </motion.div>
    </div>
  );
}