"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthPage() {
  const [tab, setTab] = useState("login");

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-[#020617] relative overflow-hidden">
      
      {/* --- Ambient Background Magic --- */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15] 
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-indigo-600 blur-[140px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-[10%] -right-[10%] w-[500px] h-[500px] bg-purple-600 blur-[140px] rounded-full" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 pointer-events-none" />
      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="z-10 w-full max-w-[440px] py-10"
      >
        {/* Branding / Logo Space */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-white tracking-tighter italic">
            QUIZ<span className="text-indigo-500">PRO</span>
          </h1>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-[1px] w-8 bg-slate-800" />
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">
              Educator Portal
            </p>
            <div className="h-[1px] w-8 bg-slate-800" />
          </div>
        </div>

        {/* --- High-Contrast Tab Switcher --- */}
        <div className="relative bg-black border border-white/10 p-1.5 flex mb-8 rounded-[2rem] shadow-2xl ring-1 ring-white/5">
          {/* Sliding Background Indicator */}
          <motion.div
            initial={false}
            animate={{ x: tab === "login" ? "0%" : "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-white rounded-[1.5rem]"
          />

          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-3.5 z-10 text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
              tab === "login" ? "text-black" : "text-slate-500 hover:text-white"
            }`}
          >
            Log In
          </button>

          <button
            onClick={() => setTab("register")}
            className={`flex-1 py-3.5 z-10 text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
              tab === "register" ? "text-black" : "text-slate-500 hover:text-white"
            }`}
          >
            Register
          </button>
        </div>

        {/* --- Form Container --- */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Note: The Child forms (LoginForm/RegisterForm) provide their own 
                  slate-950 background and padding. */}
              {tab === "login" ? <LoginForm /> : <RegisterForm />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Support */}
        <p className="text-center text-slate-700 text-[10px] font-black uppercase tracking-[0.2em] mt-12 opacity-60">
          Military Grade Encryption <br />
          <span className="text-slate-500 mt-2 block">v2.4.0-release</span>
        </p>
      </motion.div>
    </div>
  );
}