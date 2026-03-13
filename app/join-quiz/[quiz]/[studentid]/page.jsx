"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  Trophy, 
  Loader2, 
  ShieldAlert, 
  Fingerprint,
  Zap
} from "lucide-react";

export default function QuizStart() {
  const { quiz, studentid } = useParams();
  const quizId = quiz;
  const studentId = studentid;

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [locked, setLocked] = useState(false);
  const [reason, setReason] = useState("");
  const [timeLeft, setTimeLeft] = useState(600);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  /* --- Security & Data Fetching Logic (Kept your existing robust logic) --- */
  useEffect(() => {
    const preventDefault = (e) => e.preventDefault();
    const preventKeys = (e) => {
      if ((e.ctrlKey && ["c", "v", "x", "u", "s"].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") || e.key === "F12") {
        e.preventDefault();
      }
    };
    document.addEventListener("copy", preventDefault);
    document.addEventListener("paste", preventDefault);
    document.addEventListener("contextmenu", preventDefault);
    document.addEventListener("keydown", preventKeys);
    return () => {
      document.removeEventListener("copy", preventDefault);
      document.removeEventListener("paste", preventDefault);
      document.removeEventListener("contextmenu", preventDefault);
      document.removeEventListener("keydown", preventKeys);
    };
  }, []);

  const reportLockToBackend = async (lockReason) => {
    try {
      await fetch("/api/quiz-locked", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, quizId, reason: lockReason }),
      });
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    if (showResult || locked) return;
    const handleVisibility = async () => {
      if (document.hidden) {
        const msg = "Tab switching detected!";
        setLocked(true);
        setReason(msg);
        await reportLockToBackend(msg);
      }
    };
    const handleResize = async () => {
      if (window.innerHeight < screen.height - 150) {
        const msg = "Floating window detected";
        setLocked(true);
        setReason(msg);
        await reportLockToBackend(msg);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", handleResize);
    };
  }, [showResult, locked]);

  useEffect(() => {
    if (!studentId || !quizId) return;
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/check-student?studentId=${studentId}&quizId=${quizId}`);
        const data = await res.json();
        if (!data.success) return;
        if (data.student.submitted) {
          setShowResult(true);
          setScore(data.student.score);
        } else if (data.student.locked) {
          setLocked(true);
          setReason(data.student.lockedReason);
        }
      } catch (e) { console.error(e); }
    };
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [studentId, quizId]);

  useEffect(() => {
    if (timeLeft <= 0 && !showResult) {
      setLocked(true);
      setReason("Time Expired");
      reportLockToBackend("Time is over!");
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showResult]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetch(`/api/questions?quizid=${quizId}`);
      const data = await res.json();
      if (data.success) {
        const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
        setQuestions(shuffle(data.questions.map(q => ({ ...q, options: shuffle(q.options) }))));
      }
    };
    if (quizId) fetchQuestions();
  }, [quizId]);

  const handleSubmit = async () => {
    let total = 0;
    questions.forEach((q, i) => { if (answers[i] === q.correct) total++; });
    setScore(total);
    setShowResult(true);
    await fetch("/api/student-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score: total, studentId, quizId }),
    });
  };

  const formatTime = () => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  /* ========================= RENDER: LOCKED (High Contrast) ========================== */
  if (locked) return (
    <div className="min-h-screen flex items-center justify-center bg-[#050000] text-white p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#7f1d1d_0%,transparent_70%)] opacity-20" />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 max-w-md w-full">
        <div className="bg-slate-950 border-2 border-red-500/20 p-12 rounded-[3rem] shadow-[0_0_60px_rgba(239,68,68,0.2)] text-center">
          <div className="inline-flex p-5 rounded-full bg-red-500/10 mb-6">
            <ShieldAlert className="w-12 h-12 text-red-500 animate-pulse" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-red-500 mb-2">Access Revoked</h1>
          <p className="text-xs font-black uppercase tracking-widest text-red-500/60 mb-8">{reason}</p>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Your secure session has been terminated by the Proctor Engine. 
            All responses have been frozen and your instructor has been notified of the violation.
          </p>
          <div className="py-3 px-6 bg-red-500 text-white font-black rounded-xl text-xs tracking-widest uppercase">
            Security Protocol Violation
          </div>
        </div>
      </motion.div>
    </div>
  );

  /* ========================= RENDER: RESULT (High Contrast) ========================== */
  if (showResult) return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white p-6 relative">
      <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl w-full">
        <div className="bg-slate-950 border border-white/10 p-12 rounded-[3.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500" />
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-4xl font-black tracking-tighter mb-10">Submission Success</h1>
          
          <div className="relative w-48 h-48 mx-auto mb-12">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="88" fill="transparent" stroke="currentColor" strokeWidth="16" className="text-white/5" />
              <motion.circle 
                cx="96" cy="96" r="88" fill="transparent" stroke="currentColor" strokeWidth="16" strokeDasharray={552}
                initial={{ strokeDashoffset: 552 }} animate={{ strokeDashoffset: 552 - (552 * score) / questions.length }}
                transition={{ duration: 2, ease: "circOut" }} className="text-indigo-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-black leading-none">{score}</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Score</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/40 p-5 rounded-2xl border border-white/5 shadow-inner">
              <p className="text-[10px] uppercase font-black text-slate-500 mb-1">Final Result</p>
              <p className="text-2xl font-black text-indigo-400">{Math.round((score/questions.length)*100)}%</p>
            </div>
            <div className="bg-black/40 p-5 rounded-2xl border border-white/5 shadow-inner">
              <p className="text-[10px] uppercase font-black text-slate-500 mb-1">Encrypted ID</p>
              <p className="text-2xl font-black text-emerald-400">#{(studentId || "00").slice(-4)}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  /* ========================= RENDER: LOADING ========================== */
  if (!questions.length) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
      <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-6" />
      <div className="flex items-center gap-3">
        <Fingerprint className="w-4 h-4 text-indigo-400 animate-pulse" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Establishing Secure Sync</p>
      </div>
    </div>
  );

  /* ========================= RENDER: QUIZ UI ========================== */
  const question = questions[current];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-10 flex flex-col items-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-indigo-600/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-12">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Secure Examination Instance</p>
            </div>
            <h1 className="text-4xl font-black tracking-tighter italic">LIVE<span className="text-indigo-500">CORE.</span></h1>
          </div>

          <div className={`flex items-center gap-4 px-8 py-4 rounded-3xl border-2 transition-all duration-500 ${timeLeft < 60 ? 'bg-red-500/20 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'bg-slate-950 border-white/10 shadow-xl'}`}>
            <Clock className={`w-6 h-6 ${timeLeft < 60 ? 'text-red-500 animate-spin-slow' : 'text-indigo-500'}`} />
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-widest text-slate-500 leading-none mb-1">Time Remaining</span>
              <span className="text-3xl font-black tabular-nums leading-none tracking-tighter">{formatTime()}</span>
            </div>
          </div>
        </div>

        {/* The Main Container Box */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          <div className="space-y-8">
            {/* Question Card */}
            <motion.div 
              key={current} 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="bg-slate-950 border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
               <div className="absolute top-0 left-0 w-full h-1 bg-white/5" />
               <div className="flex items-center gap-4 mb-8">
                  <span className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20">
                    Q. {current + 1} / {questions.length}
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
               </div>

               <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-12 tracking-tight">
                 {question.question}
               </h2>

               <div className="grid gap-4">
                 {question.options.map((opt, i) => (
                   <button
                     key={i}
                     onClick={() => setAnswers({ ...answers, [current]: opt })}
                     className={`group relative flex items-center justify-between p-6 rounded-2xl border-2 transition-all text-left ${
                       answers[current] === opt 
                       ? 'bg-indigo-600 border-indigo-400 shadow-xl scale-[1.02] z-10' 
                       : 'bg-black/40 border-white/5 hover:border-white/20'
                     }`}
                   >
                     <span className={`text-lg font-bold ${answers[current] === opt ? 'text-white' : 'text-slate-300'}`}>{opt}</span>
                     <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                       answers[current] === opt ? 'bg-white border-white' : 'border-white/10 group-hover:border-white/30'
                     }`}>
                        {answers[current] === opt && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                     </div>
                   </button>
                 ))}
               </div>
            </motion.div>
          </div>

          {/* Side Control Panel */}
          <div className="space-y-6">
            <div className="bg-slate-950 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8">Examination Progress</h3>
              
              <div className="grid grid-cols-5 gap-3 mb-10">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-10 rounded-xl font-black text-xs transition-all border ${
                      i === current ? 'bg-indigo-600 border-indigo-400 text-white scale-110 shadow-lg' : 
                      answers[i] ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 
                      'bg-black border-white/5 text-slate-700 hover:border-white/20'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {current === questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-5 rounded-2xl transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 group"
                  >
                    FINISH EXAM
                    <Zap className="w-5 h-5 group-hover:fill-current" />
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrent(current + 1)}
                    className="w-full bg-white hover:bg-slate-100 text-black font-black py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    NEXT <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Status Footer */}
            <div className="bg-black/40 border border-white/5 p-6 rounded-2xl flex flex-col gap-4">
              <div className="flex items-center gap-3">
                 <ShieldAlert className="w-5 h-5 text-indigo-500" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live AI Monitoring</p>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                   animate={{ x: [-100, 400] }} 
                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                   className="w-1/3 h-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent" 
                 />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}