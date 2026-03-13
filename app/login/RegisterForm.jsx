"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { User, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, ChevronLeft, Loader2, Edit3 } from "lucide-react";
import SocialButtons from "./SocialButtons";

export default function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState("register"); // 'register' or 'otp'
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState({});
  
  const otpRefs = useRef([]);

  const validate = () => {
    let err = {};
    if (!form.name.trim()) err.name = "Name is required";
    if (!form.email.trim()) err.email = "Email is required";
    if (!form.password.trim()) err.password = "Password is required";
    else if (form.password.length < 6) err.password = "Min 6 characters";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSendOTP = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await fetch("/api/send-otp", {
        method: "POST",
        body: JSON.stringify({ email: form.email }),
      });
      toast.success("Security code sent to your email");
      setStep("otp");
    } catch (e) {
      toast.error("Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1].focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const verifyOtpAndRegister = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) return toast.error("Please enter the 6-digit code");

    setLoading(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        body: JSON.stringify({ otp: otpValue, email: form.email }),
      });
      const data = await res.json();

      if (!data.success) throw new Error("Invalid code");

      const regRes = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      const regData = await regRes.json();

      if (regData.success) {
        toast.success("Account created successfully!");
        router.push(`/${regData.id}`);
      } else {
        toast.error(regData.message);
      }
    } catch (e) {
      toast.error(e.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 border border-white/10 p-10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] ring-1 ring-white/5 overflow-hidden relative">
      <Toaster position="top-center" />
      
      <AnimatePresence mode="wait">
        {step === "register" ? (
          <motion.div
            key="reg-fields"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Full Name</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  placeholder="e.g. Dr. Sarah Smith"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-14 pr-4 py-4.5 rounded-2xl bg-black border border-white/5 text-white placeholder-slate-800 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner"
                />
              </div>
              {errors.name && <p className="text-red-400 text-[10px] font-bold ml-2 italic tracking-tight">{errors.name}</p>}
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Institutional Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="email"
                  placeholder="sarah@university.edu"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-14 pr-4 py-4.5 rounded-2xl bg-black border border-white/5 text-white placeholder-slate-800 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner"
                />
              </div>
              {errors.email && <p className="text-red-400 text-[10px] font-bold ml-2 italic tracking-tight">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Create Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-14 pr-14 py-4.5 rounded-2xl bg-black border border-white/5 text-white placeholder-slate-800 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner"
                />
                <button 
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-[10px] font-bold ml-2 italic tracking-tight">{errors.password}</p>}
            </div>

            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_10px_25px_rgba(79,70,229,0.3)]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Verification Code <ArrowRight size={18} /></>}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em] font-black text-slate-600"><span className="bg-slate-950 px-4">Instant Connect</span></div>
            </div>
            <SocialButtons />
          </motion.div>
        ) : (
          <motion.div
            key="otp-fields"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center"
          >
            <div className="mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-black border border-emerald-500/20 rounded-2xl mb-6 shadow-inner ring-1 ring-emerald-500/10 text-emerald-400">
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter italic">SECURITY<span className="text-emerald-500">.</span></h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-3">Identity Verification Code</p>
              <div className="flex items-center justify-center gap-2 mt-4 bg-black/40 py-2 px-4 rounded-full border border-white/5 w-fit mx-auto">
                <span className="text-indigo-400 text-xs font-bold tracking-tight">{form.email}</span>
                <button onClick={() => setStep("register")} className="p-1 hover:bg-white/5 rounded text-slate-500 transition-colors">
                  <Edit3 size={14} />
                </button>
              </div>
            </div>

            <div className="flex gap-2 justify-between mb-10">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleOtpKeyDown(e, i)}
                  className="w-12 h-16 text-center text-2xl font-black rounded-xl bg-black border border-white/10 text-emerald-400 focus:border-emerald-500 focus:bg-emerald-500/5 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all shadow-inner"
                />
              ))}
            </div>

            <button
              onClick={verifyOtpAndRegister}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-[0_10px_25px_rgba(16,185,129,0.2)]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Finalize Registration"}
            </button>

            <button 
              onClick={() => setStep("register")}
              className="mt-8 text-slate-600 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 mx-auto transition-colors"
            >
              <ChevronLeft size={16} /> Back to details
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}