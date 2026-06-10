"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ChevronLeft } from "lucide-react";

interface CuneiformSectionProps {
  cuneiformOpacity: number;
  setCuneiformOpacity: (val: number) => void;
  cuneiformColor: "accent3" | "accent4" | "white" | "muted";
  setCuneiformColor: (val: "accent3" | "accent4" | "white" | "muted") => void;
  expandedSection?: string | null;
  toggleSection?: (section: string) => void;
  hideHeader?: boolean;
}

export default function CuneiformSection({
  cuneiformOpacity,
  setCuneiformOpacity,
  cuneiformColor,
  setCuneiformColor,
  expandedSection,
  toggleSection,
  hideHeader = false
}: CuneiformSectionProps) {
  const isExpanded = hideHeader ? true : expandedSection === "cuneiform";

  const renderContent = () => (
    <div className="space-y-4 text-right font-sans">
      <p className="text-[10px] theme-text-tertiary leading-relaxed">
        با استفاده از ابزارهای زیر می‌توانید میزان پدیداری و هویت رنگ کتیبه سنگی خط میخی هخامنشی متحرک در پس‌زمینه را سفارشی‌سازی کنید:
      </p>

      {/* Slide Opacity control */}
      <div className="space-y-1.5 text-right w-full">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-accent3 font-mono" style={{ color: "var(--accent3)" }}>
            {Math.round(cuneiformOpacity * 100)}%
          </span>
          <label className="text-[10px] theme-text-secondary font-bold">میزان پدیداری (شفافیت):</label>
        </div>
        <input
          type="range"
          min="0.01"
          max="0.40"
          step="0.01"
          value={cuneiformOpacity}
          onChange={(e) => setCuneiformOpacity(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer"
          style={{ accentColor: "var(--accent3)" }}
        />
      </div>

      {/* Interactive Grid Color picker */}
      <div className="space-y-2 text-right w-full">
        <label className="text-[10px] theme-text-secondary font-bold block">رنگ نگاره‌های خط میخی:</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "accent3", name: "رنگ سوم (طلایی)", color: "var(--accent3)" },
            { id: "accent4", name: "رنگ چهارم (سبز)", color: "var(--accent4)" },
            { id: "white", name: "سفید شاهنشاهی", color: "#ffffff" },
            { id: "muted", name: "خاکستری کتبیه‌ای", color: "#718096" }
          ].map((mode) => {
            const isSelected = cuneiformColor === mode.id;
            return (
              <motion.button
                key={mode.id}
                onClick={() => setCuneiformColor(mode.id as "accent3" | "accent4" | "white" | "muted")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-3 text-right transition-all border text-[10px] rounded-xl flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? "border-[var(--accent3)] bg-[var(--accent3-transparent)] shadow-[0_0_12px_var(--accent3-transparent)] font-bold text-[var(--accent3)]"
                    : "border-[var(--border-color)] hover:border-[var(--accent3)]/50 bg-black/10 hover:bg-black/20"
                }`}
              >
                <div 
                  className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-md transition-transform duration-300 hover:scale-110" 
                  style={{ backgroundColor: mode.color }} 
                />
                <span className={isSelected ? "text-accent3" : "theme-text-secondary"} style={isSelected ? { color: "var(--accent3)" } : {}}>
                  {mode.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (hideHeader) {
    return (
      <div className="theme-card-bg-solid border border-accent3-medium/30 p-4 space-y-4 overflow-hidden rounded-2xl text-right">
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="border border-accent3-medium overflow-hidden transition-all duration-300 rounded-2xl">
      <button
        onClick={() => toggleSection && toggleSection("cuneiform")}
        className="w-full py-3 px-4 bg-[var(--card-bg-solid)] flex items-center justify-between text-right cursor-pointer hover:bg-[var(--card-hover-bg)] transition-colors"
      >
        <ChevronLeft
          className="w-4 h-4 text-accent3 transition-transform duration-300"
          style={{ transform: isExpanded ? "rotate(-90deg)" : "rotate(0deg)" }}
        />
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold theme-text-primary">تنظیمات کتیبه خط میخی پس‌زمینه</span>
          <Sparkles className="w-4 h-4 text-accent3" style={{ color: "var(--accent3)" }} />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="theme-card-bg-solid border-t border-accent3-medium/30 p-4 space-y-4 overflow-hidden"
          >
            {renderContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
