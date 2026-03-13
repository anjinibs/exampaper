"use client";

import React, { useEffect, useState } from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useSession, signIn, signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function SocialButtons() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const saveSocialUser = async () => {
        setIsProcessing(true);
        const toastId = toast.loading("Syncing educator profile...");
        
        try {
          const res = await fetch("/api/social-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: session.user.email,
              name: session.user.name || "SocialUser",
              Authprovider: "google github",
            }),
          });
          
          const data = await res.json();
          toast.dismiss(toastId);

          if (res.ok && data.error === false) {
            toast.success(`Access Granted: ${session.user.name.split(' ')[0]}`, {
              style: { 
                background: "#020617", 
                color: "#fff", 
                border: "1px solid rgba(255,255,255,0.1)",
                fontSize: "12px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.1em"
              },
            });
            router.push(`/${data.id}`);
          } else {
            signOut({ redirect: false });
            toast.error(data.message || "Unauthorized access ❌");
          }
        } catch (err) {
          toast.dismiss(toastId);
          toast.error("Cloud sync failed ❌");
        } finally {
          setIsProcessing(false);
        }
      };

      saveSocialUser();
    }
  }, [status, session, router]);

  return (
    <div className="relative">
      {/* --- High-Contrast Loading Overlay --- */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-slate-950/90 backdrop-blur-md flex items-center justify-center rounded-2xl border border-white/10"
          >
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">Verifying</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-4">
        {/* Google Button */}
        <button 
          onClick={() => signIn("google")}
          disabled={isProcessing}
          className="group relative flex items-center justify-center gap-3 flex-1 bg-black border border-white/5 py-4 rounded-2xl transition-all hover:bg-white/[0.02] hover:border-white/20 active:scale-[0.98] disabled:opacity-50 shadow-inner ring-1 ring-white/5"
        >
          <div className="bg-white/5 p-1.5 rounded-lg group-hover:bg-white/10 transition-colors">
            <FaGoogle className="text-white text-xs" />
          </div>
          <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest transition-colors">Google</span>
        </button>

        {/* GitHub Button */}
        <button 
          onClick={() => signIn("github")}
          disabled={isProcessing}
          className="group relative flex items-center justify-center gap-3 flex-1 bg-black border border-white/5 py-4 rounded-2xl transition-all hover:bg-white/[0.02] hover:border-white/20 active:scale-[0.98] disabled:opacity-50 shadow-inner ring-1 ring-white/5"
        >
          <div className="bg-white/5 p-1.5 rounded-lg group-hover:bg-white/10 transition-colors">
            <FaGithub className="text-white text-xs" />
          </div>
          <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest transition-colors">GitHub</span>
        </button>
      </div>
    </div>
  );
}