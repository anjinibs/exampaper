"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { 
  Plus, 
  LogOut, 
  Layers, 
  Lock, 
  Unlock, 
  Users, 
  ArrowUpRight, 
  LayoutGrid 
} from "lucide-react";

export default function TeacherDashboard() {
  const { dashboard } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch(`/api/teacher-quiz?teacherId=${dashboard}`);
        const data = await res.json();
        if (data.success) setQuizzes(data.quizzes);
      } catch (err) {
        console.error("Telemetry fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    if (dashboard) fetchQuizzes();
  }, [dashboard]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12 selection:bg-indigo-500/30">
      
      {/* --- COMMAND HEADER --- */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <LayoutGrid size={14} className="text-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Instructor Terminal</span>
          </div>
          <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">
            Active <span className="text-blue-400 text-opacity-80">Sessions.</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => signOut({ callbackUrl: "/" })} 
            className="flex items-center justify-center gap-2 bg-[#0B1220] border border-white/5 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:text-red-400 hover:border-red-400/20 transition-all"
          >
            <LogOut size={14} />
            Disconnect
          </button>

          <Link href={`/${dashboard}/create-quiz`} className="flex-1 md:flex-none">
            <button className="w-full flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(255,255,255,0.05)] hover:scale-[1.02] active:scale-[0.98] transition-all">
              <Plus size={16} strokeWidth={3} />
              New Deployment
            </button>
          </Link>
        </div>
      </motion.div>

      {/* --- GRID INTERFACE --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {quizzes.map((quiz, i) => (
          <motion.div
            key={quiz._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group relative bg-[#3f5965] border border-white/5 p-8 rounded-[2.5rem] shadow-inner ring-1 ring-white/5 hover:border-indigo-500/40 transition-all overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-indigo-500/10 transition-colors">
              <Layers size={80} />
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-black text-white tracking-tighter italic uppercase group-hover:text-indigo-400 transition-colors">
                  {quiz.subjectCode}
                </h2>
                <div className={`p-2 rounded-lg border ${quiz.isLocked ? 'border-red-500/20 text-red-500 bg-red-500/5' : 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5'}`}>
                  {quiz.isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Protocol Code</span>
                  <span className="text-xs font-mono font-bold text-indigo-400">{quiz.quizCode}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Enrollment</span>
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Users size={12} className="text-slate-500" />
                    {quiz.studentCount} Peers
                  </span>
                </div>
              </div>

              <Link href={`/${dashboard}/${quiz.quizCode}`}>
                <button className="w-full group/btn relative overflow-hidden bg-black border border-white/10 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:border-white/20 transition-all">
                  Access Telemetry
                  <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- EMPTY STATE --- */}
      {!loading && quizzes.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem]"
        >
          <div className="mb-4 flex justify-center text-slate-800">
            <Layers size={48} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
            System Idle. No active deployments found.
          </p>
        </motion.div>
      )}

      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/5 blur-[120px]" />
      </div>
    </div>
  );
}