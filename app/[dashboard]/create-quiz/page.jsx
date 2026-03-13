"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Save, Copy, Hash, BookOpen, Trash2, CheckCircle2 } from "lucide-react";
import { nanoid } from "nanoid";
import toast from "react-hot-toast";

export default function CreateQuiz() {
  const { dashboard } = useParams();
  const router = useRouter();
  
  const [quizCode] = useState(nanoid(8).toUpperCase());
  const [subjectCode, setSubjectCode] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correct: 0 }
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correct: 0 }
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) return toast.error("Quiz must have at least one question.");
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (qIndex, field, value) => {
    const newQ = [...questions];
    newQ[qIndex][field] = value;
    setQuestions(newQ);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const newQ = [...questions];
    newQ[qIndex].options[oIndex] = value;
    setQuestions(newQ);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(quizCode);
    toast.success("Access code copied to terminal.");
  };

  const saveQuiz = async () => {
    if (!subjectCode) return toast.error("Identification code (Subject) required.");
    
    const loadingToast = toast.loading("Encrypting and saving quiz data...");

    try {
      const response = await fetch("/api/quiz/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectCode,
          quizCode,
          questions,
          teacherId: dashboard,
        }),
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (data.success) {
        toast.success("Quiz deployed successfully!");
        setTimeout(() => router.push(`/${dashboard}`), 1200);
      } else {
        toast.error(data.message || "Deployment failed");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Network protocol error");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 flex flex-col items-center">
      
      {/* --- HEADER --- */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mb-12 flex flex-col md:flex-row justify-between items-end gap-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={14} className="text-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Authoring Environment</span>
          </div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
            Build <span className="text-indigo-500">Session.</span>
          </h1>
        </div>

        <div className="flex flex-col items-end gap-2">
           <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Entry Protocol Code</span>
           <div className="flex items-center gap-2 bg-black border border-white/10 p-2 pl-4 rounded-xl ring-1 ring-white/5 shadow-inner">
              <code className="text-indigo-400 font-mono font-bold tracking-widest">{quizCode}</code>
              <button onClick={copyToClipboard} className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors">
                <Copy size={16} />
              </button>
           </div>
        </div>
      </motion.div>

      {/* --- SUBJECT INFO --- */}
      <div className="w-full max-w-4xl mb-10">
        <div className="relative group">
          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input
            placeholder="SUBJECT IDENTIFIER (e.g. CS101-DATA-STRUCTURES)"
            value={subjectCode}
            onChange={(e) => setSubjectCode(e.target.value.toUpperCase())}
            className="w-full p-6 pl-14 rounded-2xl bg-slate-950 border border-white/10 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all font-black text-xs tracking-[0.2em] placeholder:text-slate-800 text-indigo-400"
          />
        </div>
      </div>

      {/* --- QUESTIONS LIST --- */}
      <div className="w-full max-w-4xl space-y-8 mb-20">
        <AnimatePresence>
          {questions.map((q, qIndex) => (
            <motion.div
              key={qIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group relative bg-slate-950 border border-white/5 rounded-[2.5rem] p-8 shadow-inner hover:border-white/10 transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Module {qIndex + 1}</span>
                <button 
                  onClick={() => removeQuestion(qIndex)}
                  className="p-2 text-slate-700 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <textarea
                placeholder="PROMPT / QUESTION DESCRIPTION"
                value={q.question}
                rows={2}
                onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                className="w-full p-0 bg-transparent outline-none text-xl font-bold tracking-tight text-white placeholder:text-slate-800 resize-none mb-8 border-b border-white/5 pb-4 focus:border-indigo-500/50 transition-all"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className={`relative flex items-center transition-all rounded-2xl border ${q.correct === oIndex ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-black border-white/5'}`}>
                    <button
                      onClick={() => updateQuestion(qIndex, "correct", oIndex)}
                      className={`absolute left-4 p-1 rounded-full transition-all ${q.correct === oIndex ? 'text-indigo-400' : 'text-slate-800 hover:text-slate-600'}`}
                    >
                      <CheckCircle2 size={20} fill={q.correct === oIndex ? "currentColor" : "transparent"} className={q.correct === oIndex ? "fill-indigo-500/20" : ""} />
                    </button>

                    <input
                      placeholder={`Option ${oIndex + 1}`}
                      value={opt}
                      onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                      className="w-full bg-transparent p-4 pl-14 outline-none text-sm font-bold tracking-tight text-slate-300 placeholder:text-slate-800"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* --- ADD BUTTON --- */}
        <button
          onClick={addQuestion}
          className="w-full py-10 rounded-[2.5rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-3 text-slate-700 hover:text-indigo-500 hover:border-indigo-500/20 hover:bg-indigo-500/5 transition-all group"
        >
          <PlusCircle size={32} className="group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Initialize New Module</span>
        </button>
      </div>

      {/* --- FOOTER ACTION BAR --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-6">
        <button
          onClick={saveQuiz}
          className="w-full bg-white text-black py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Save size={18} />
          Deploy Quiz to Terminal
        </button>
      </div>

      {/* Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/5 blur-[120px]" />
      </div>
    </div>
  );
}