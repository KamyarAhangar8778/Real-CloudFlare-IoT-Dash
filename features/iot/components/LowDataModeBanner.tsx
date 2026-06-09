"use client";

import React from "react";
import { motion } from "motion/react";
import { WifiOff } from "lucide-react";
import { BUTTON_CLIP } from "@/lib/presets";

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
      className="flex flex-col sm:flex-row items-center justify-between px-5 py-3 theme-card-bg-solid border border-accent3/20 rounded-lg text-right text-xs theme-text-secondary gap-3 max-w-2xl mx-auto w-full transition-all duration-300 shadow-lg"
      style={{ clipPath: "polygon(1% 0, 99% 0, 100% 50%, 99% 100%, 1% 100%, 0 50%)" }}
    >
      <button
        onClick={refetchIot}
        className="px-4 py-1.5 bg-accent3/20 border border-accent3 text-accent3 hover:bg-accent3/30 transition-all text-xs font-bold cursor-pointer"
        style={{ clipPath: BUTTON_CLIP }}
      >
        به‌روزرسانی کنونی
      </button>
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-gray-400">
          حالت صرفه‌جویی در مصرف اینترنت فعال است. دریافت خودکار داده‌ها متوقف شده است.
        </span>
        <WifiOff className="w-4 h-4 text-accent3 animate-pulse" />
      </div>
    </motion.div>
  );
}
