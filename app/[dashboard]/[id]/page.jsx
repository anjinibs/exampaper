"use client";

import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  Lock, Unlock, Users, BarChart3, 
  Fingerprint, Activity, ChevronLeft, ShieldAlert 
} from "lucide-react";
import Link from "next/link";

import Leaderboard from "./Leaderboard";
import ScoreGraph from "./ScoreGraph";
import MalpracticeList from "./MalpracticeList";

export default function QuizDetails() {
  const { id, dashboard } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    let interval;
    const fetchQuiz = async () => {
      try {
        const res = await fetch(
          `/api/quiz-details?teacherId=${dashboard}&quizId=${id}`,
          { cache: "no-store" }
        );
        const data = await res.json();

        if (data.success) {
          const studentsData = data.quizzedetails || [];
          setStudents(studentsData);
          setIsLocked(data.isLocked);

          const studentCount = studentsData.length;
          const totalScore = studentsData.reduce((acc, curr) => acc + (curr.score || 0), 0);
          const averageScore = studentCount > 0 ? totalScore / studentCount : 0;

          setQuiz({
            quizId: id,
            quizCode: data.coursecode,
            studentCount,
            averageScore,
          });
        }
      } catch (err) {
        console.error("Telemetry sync failure:", err);
      } finally {
        setLoading(false);
      }
    };

    if (dashboard && id) {
      fetchQuiz();
      interval = setInterval(fetchQuiz, 2000);
    }
    return () => clearInterval(interval);
  }, [id, dashboard]);

  const toggleQuizLock = async () => {
    try {
      const res = await fetch("/api/toggle-quiz-lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId: dashboard,
          quizId: id,
          lock: !isLocked,
        }),
      });
      const data = await res.json();
      if (data.success) setIsLocked(!isLocked);
    } catch (err) {
      console.error("Override protocol failed:", err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
       <Activity className="w-8 h-8 text-indigo-500 animate-pulse" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-10 selection:bg-indigo-500/30">
      
      {/* --- COMMAND HEADER --- */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="flex items-center gap-5">
          <Link href={`/${dashboard}`} className="group p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all active:scale-90">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Live Session: {id}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic">
              {quiz?.quizCode || "System"} <span className="text-indigo-500 text-opacity-80">Dashboard</span>
            </h1>
          </div>
        </div>

        <button
          onClick={toggleQuizLock}
          className={`relative overflow-hidden flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-2xl ${
            isLocked
              ? "bg-emerald-600 hover:bg-emerald-500 text-white"
              : "bg-red-600 hover:bg-red-500 text-white"
          }`}
        >
          {isLocked ? <Unlock size={18} /> : <Lock size={18} />}
          {isLocked ? "Open Session" : "Lock Session"}
        </button>
      </div>

      {/* --- METRIC GRID --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <MetricCard icon={Fingerprint} title="Course ID" value={quiz?.quizCode} color="text-indigo-400" />
        <MetricCard icon={Users} title="Active Students" value={quiz?.studentCount} color="text-white" />
        <MetricCard icon={BarChart3} title="Class Average" value={quiz?.averageScore.toFixed(1)} color="text-emerald-400" />
      </div>

      {/* --- MAIN ANALYTICS HUB --- */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8">
        
        {/* LEADERBOARD & GRAPH (Left 7 Columns) */}
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-slate-950/50 border border-white/5 p-8 rounded-[2.5rem] shadow-inner ring-1 ring-white/5">
            <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
              <Activity className="text-indigo-500" size={18} />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Score Telemetry</h3>
            </div>
            <ScoreGraph students={students} />
          </section>

          <section>
            <Leaderboard students={students} />
          </section>
        </div>

        {/* MALPRACTICE MONITOR (Right 5 Columns) */}
        <div className="lg:col-span-5">
          <div className="sticky top-10">
            <div className="mb-4 flex items-center gap-2 pl-2">
              <ShieldAlert className="text-red-500" size={16} />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500/80">Integrity Monitor</h3>
            </div>
            <MalpracticeList students={students} />
          </div>
        </div>

      </div>

      {/* --- BACKGROUND AMBIANCE --- */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 blur-[140px] rounded-full pointer-events-none -z-10" />
    </div>
  );
}

function MetricCard({ icon: Icon, title, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-slate-950 border border-white/10 p-8 rounded-[2rem] shadow-inner ring-1 ring-white/5 group hover:border-indigo-500/30 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className="text-slate-600 group-hover:text-indigo-400 transition-colors" size={18} />
        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{title}</span>
      </div>
      <div className={`text-4xl font-black tracking-tighter italic ${color}`}>
        {value || "---"}
      </div>
    </motion.div>
  );
}