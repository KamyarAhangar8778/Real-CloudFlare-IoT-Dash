"use client";

import React from "react";
import { motion } from "motion/react";
import { ChevronDown, BookOpen } from "lucide-react";
import { BUTTON_CLIP } from "@/lib/presets";

interface EncyclopediaHeaderProps {
  isSymbolsSectionExpanded: boolean;
  setIsSymbolsSectionExpanded: (val: boolean) => void;
}

export function EncyclopediaHeader({
  isSymbolsSectionExpanded,
  setIsSymbolsSectionExpanded
}: EncyclopediaHeaderProps) {
  return (
    <button
      onClick={() => setIsSymbolsSectionExpanded(!isSymbolsSectionExpanded)}
      className="w-full py-4 px-6 flex items-center justify-between text-right hover:bg-[var(--accent3-transparent)] transition-all duration-300 cursor-pointer focus:outline-none"
    >
      <div className="flex items-center gap-2.5">
        <span 
          className={`text-[10px] font-sans px-2.5 py-0.5 border ${
            isSymbolsSectionExpanded ? 'border-accent3 text-accent3' : 'border-accent3-medium theme-text-muted'
          } transition-all`} 
          style={{ clipPath: BUTTON_CLIP }}
        >
          {isSymbolsSectionExpanded ? "فعال" : "بسته"}
        </span>
        <motion.div
          animate={{ rotate: isSymbolsSectionExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-accent3" style={{ color: "var(--accent3)" }} />
        </motion.div>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold theme-text-primary hidden sm:inline md:block">
          {isSymbolsSectionExpanded ? "برای بستن بخش راهنمای نمادها کلیک کنید" : "برای گشایش دانشنامه هویت و نگاره‌های شاهنشاهی هخامنشی کلیک کنید"}
        </span>
        <span className="text-xs font-bold theme-text-primary sm:hidden">
          کمتر / بیشتر
        </span>
        <div className="p-1.5 theme-card-bg-solid border border-accent3-medium text-accent3">
          <BookOpen className="w-4 h-4" />
        </div>
      </div>
    </button>
  );
}
