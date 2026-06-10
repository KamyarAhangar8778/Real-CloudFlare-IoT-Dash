"use client";

import React from "react";
import { motion } from "motion/react";
import { WifiOff } from "lucide-react";
import { BUTTON_CLIP, BOX_CLIP } from "@/lib/presets";

interface LowDataModeBannerProps {
  lowDataMode: boolean;
  animationsEnabled: boolean;
  refetchIot: () => void;
}

export default function LowDataModeBanner({
  lowDataMode,
  animationsEnabled,
  refetchIot,
}: LowDataModeBannerProps) {
  if (!lowDataMode) return null;

  return (
    <motion.div 
      initial={animationsEnabled ? { opacity: 0, y: -10 } : {}}
      animate={animationsEnabled ? { opacity: 1, y: 0 } : {}}
      className="flex flex-col sm:flex-row-reverse items-center justify-between px-6 py-4.5 bg-[var(--card-bg-solid)]/90 backdrop-blur-md border-2 border-[var(--accent3-medium)] text-right text-xs gap-4 max-w-3xl mx-auto w-full transition-all duration-300 shadow-xl"
      style={{ clipPath: BOX_CLIP }}
    >
      <div className="flex items-center gap-3">
        <WifiOff className="w-5 h-5 text-[var(--accent3)] animate-pulse shrink-0" />
        <span className="text-xs font-sans font-bold text-slate-800 dark:text-slate-100">
          حالت صرفه‌جویی در مصرف اینترنت فعال است. دریافت خودکار داده‌ها متوقف شده است.
        </span>
      </div>
      <button
        onClick={refetchIot}
        className="px-5 py-2 bg-[var(--accent3-transparent)] border border-[var(--accent3)] text-[var(--accent3)] hover:bg-[var(--accent3-medium)] font-sans font-extrabold transition-all text-xs cursor-pointer select-none"
        style={{ clipPath: BUTTON_CLIP }}
      >
        به‌روزرسانی کنونی
      </button>
    </motion.div>
  );
}
