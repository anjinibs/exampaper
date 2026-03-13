"use client";

import "./globals.css";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import { NextAuthProvider } from "./components/Sessionprovider";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en" className="dark">
      {/* We use bg-[#020617] here as the "True North" background.
          This ensures that during page transitions, the user sees a deep 
          onyx void instead of a bright purple flash.
      */}
      <body className="min-h-screen bg-[#020617] text-white antialiased selection:bg-indigo-500/30">
        
        <NextAuthProvider>
          {/* ✅ Toaster is globally available */}
          <Toaster 
            position="top-center" 
            toastOptions={{
              className: 'border border-white/10 bg-slate-950 text-white rounded-2xl text-xs font-bold uppercase tracking-widest',
              duration: 3000,
            }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ 
                duration: 0.4, 
                ease: [0.16, 1, 0.3, 1] // Custom "Expo" ease for that premium feel
              }}
              className="min-h-screen flex flex-col"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </NextAuthProvider>

      </body>
    </html>
  );
}