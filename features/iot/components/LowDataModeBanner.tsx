"use client";

import React from "react";
import { motion } from "motion/react";
import { WifiOff } from "lucide-react";

interface LowDataModeBannerProps {
  lowDataMode: boolean;
  animationsEnabled: boolean;
  refetchIot: () => void;
  headerPosition?: "top" | "left";
}

export default function LowDataModeBanner({
  lowDataMode,
  animationsEnabled,
  refetchIot,
  headerPosition = "top",
}: LowDataModeBannerProps) {
  if (!lowDataMode) return null;

  return (
    <motion.div 
      initial={animationsEnabled ? { opacity: 0, y: -10 } : {}}
      animate={animationsEnabled ? { opacity: 1, y: 0 } : {}}
      className={`flex flex-col sm:flex-row-reverse items-center justify-between px-6 py-4 bg-[var(--card-bg)]/90 backdrop-blur-md border border-[var(--accent3-medium)]/60 text-right text-xs gap-4 w-full transition-all duration-300 shadow-lg rounded-2xl hover:border-[var(--accent3)] hover:shadow-[0_0_15px_var(--accent3-transparent)] ${
        headerPosition === "left" 
          ? "max-w-5xl mt-6 md:mt-0" 
          : "max-w-6xl mt-4 md:mt-2"
      } mx-auto`}
    >
      <div className="flex items-center gap-3">
        <WifiOff className="w-5 h-5 text-[var(--accent3)] animate-pulse shrink-0" />
        <span className="text-xs font-sans font-extrabold text-slate-800 dark:text-slate-100">
          حالت صرفه‌جویی در مصرف اینترنت فعال است. دریافت خودکار داده‌ها متوقف شده است.
        </span>
      </div>
      <motion.button
        onClick={refetchIot}
        whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
        whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
        className="px-5 py-2.5 bg-[var(--accent3)] text-black hover:bg-[var(--accent3)]/90 font-sans font-extrabold transition-all text-xs cursor-pointer select-none rounded-xl shadow-md"
      >
        به‌روزرسانی کنونی
      </motion.button>
    </motion.div>
  );
}
