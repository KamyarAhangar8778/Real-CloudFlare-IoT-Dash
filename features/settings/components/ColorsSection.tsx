"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Palette, ChevronLeft, Sparkles } from "lucide-react";
import { heritagePresets, HeritagePreset } from "@/lib/presets";

interface ColorsSectionProps {
  accent3: string;
  setAccent3: (val: string) => void;
  accent4: string;
  setAccent4: (val: string) => void;
  isDark: boolean;
  expandedSection?: string | null;
  toggleSection?: (section: string) => void;
  hideHeader?: boolean;
}

export default function ColorsSection({
  accent3,
  setAccent3,
  accent4,
  setAccent4,
  expandedSection,
  toggleSection,
  hideHeader = false
}: ColorsSectionProps) {
  const [showHexInputs, setShowHexInputs] = React.useState(false);

  const selectPreset = (preset: HeritagePreset) => {
    setAccent3(preset.accent3);
    setAccent4(preset.accent4);
  };

  const isExpanded = hideHeader ? true : expandedSection === "colors";

  const renderContent = () => (
    <div className="space-y-5 text-right font-sans">
      <p className="text-[10px] theme-text-tertiary leading-relaxed">
        این داشبورد مجهز به سیستم پایداری ۴ رنگی است. رنگ‌های اصلی (سیاه، سفید و خاکستری) همواره ثابت هستند. شما می‌توانید رنگ‌های اختیاری سوم و چهارم را در زیر پیکربندی نمایید:
      </p>

      {/* Historical Curated Persian Presets */}
      <div className="space-y-3">
        <label className="text-[10px] theme-text-tertiary block font-bold">
          انتخاب پالت‌های تاریخی پادشاهی:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {heritagePresets.map((preset) => {
            const isSelected = accent3 === preset.accent3 && accent4 === preset.accent4;
            return (
              <motion.button
                key={preset.id}
                onClick={() => selectPreset(preset)}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-3.5 text-right transition-all text-xs theme-card-bg-solid border rounded-xl flex items-center justify-between group cursor-pointer ${
                  isSelected
                    ? "border-[var(--accent3)] bg-[var(--accent3-transparent)] shadow-[0_0_15px_var(--accent3-transparent)]"
                    : "border-[var(--border-color)] hover:border-[var(--accent3)]/60 bg-black/20 hover:bg-black/45"
                }`}
              >
                {/* Colors Preview dots - beautifully circular */}
                <div className="flex gap-2 items-center">
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20 transition-transform duration-300 group-hover:scale-110 shadow-lg" 
                    style={{ backgroundColor: preset.accent4 }} 
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20 transition-transform duration-300 group-hover:scale-110 shadow-lg -mr-1.5" 
                    style={{ backgroundColor: preset.accent3 }} 
                  />
                </div>
                <div className="text-right">
                  <span className="font-extrabold theme-text-primary block">{preset.name}</span>
                  <span className="text-[9.5px] theme-text-muted block mt-0.5">{preset.desc}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Manual Custom Picker (RGB Solver) */}
      <div className="border-t border-accent3-medium/20 pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[9.5px] theme-text-tertiary">سازش فرکانس‌های دلخواه</span>
          <label className="text-[10px] theme-text-tertiary block font-bold">
            تنظیم رنگ‌بندی دلخواه شما:
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Accent 3 Manual Circular Picker */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-[var(--border-color)] bg-black/15 hover:bg-black/30 transition-colors">
            <span className="text-[10px] theme-text-secondary font-bold mb-3">رنگ سوم اصلی</span>
            <div 
              className="relative w-12 h-12 rounded-full border-2 border-white/30 shadow-lg flex items-center justify-center overflow-hidden transition-transform hover:scale-110 cursor-pointer"
              style={{ backgroundColor: accent3 }}
            >
              <input
                type="color"
                value={accent3}
                onChange={(e) => setAccent3(e.target.value)}
                className="absolute inset-0 w-16 h-16 -m-2 opacity-0 cursor-pointer"
              />
              <div className="w-5 h-5 rounded-full border border-white/50 pointer-events-none" style={{ backgroundColor: accent3 }} />
            </div>
          </div>

          {/* Accent 4 Manual Circular Picker */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-[var(--border-color)] bg-black/15 hover:bg-black/30 transition-colors">
            <span className="text-[10px] theme-text-secondary font-bold mb-3">رنگ چهارم کمکی</span>
            <div 
              className="relative w-12 h-12 rounded-full border-2 border-white/30 shadow-lg flex items-center justify-center overflow-hidden transition-transform hover:scale-110 cursor-pointer"
              style={{ backgroundColor: accent4 }}
            >
              <input
                type="color"
                value={accent4}
                onChange={(e) => setAccent4(e.target.value)}
                className="absolute inset-0 w-16 h-16 -m-2 opacity-0 cursor-pointer"
              />
              <div className="w-5 h-5 rounded-full border border-white/50 pointer-events-none" style={{ backgroundColor: accent4 }} />
            </div>
          </div>
        </div>

        {/* Collapsible Manual HEX input */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowHexInputs(!showHexInputs)}
            className="w-full py-2 px-3.5 mt-1 text-[10px] theme-text-secondary font-semibold hover:theme-text-primary transition-colors flex items-center justify-between border border-[var(--border-color)] bg-black/10 hover:bg-black/20 rounded-xl cursor-pointer"
          >
            <ChevronLeft
              className="w-3.5 h-3.5 text-accent3 transition-transform duration-300"
              style={{ transform: showHexInputs ? "rotate(-90deg)" : "rotate(0deg)" }}
            />
            <span className="flex items-center gap-1.5">
              تنظیم پیشرفته کد رنگ دستی (HEX)
            </span>
          </button>

          <AnimatePresence initial={false}>
            {showHexInputs && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-3 pt-3.5 pb-1">
                  {/* Accent 3 Hex input */}
                  <div className="space-y-1 text-right">
                    <span className="text-[9.5px] theme-text-muted block font-sans">کد هگز رنگ سوم:</span>
                    <input
                      type="text"
                      value={accent3}
                      onChange={(e) => setAccent3(e.target.value)}
                      placeholder="#000000"
                      className="w-full text-center bg-slate-900/50 border border-[var(--border-color)] text-[11px] font-mono py-2 focus:outline-none focus:border-accent3 theme-text-primary rounded-xl uppercase"
                    />
                  </div>

                  {/* Accent 4 Hex input */}
                  <div className="space-y-1 text-right">
                    <span className="text-[9.5px] theme-text-muted block font-sans">کد هگز رنگ چهارم:</span>
                    <input
                      type="text"
                      value={accent4}
                      onChange={(e) => setAccent4(e.target.value)}
                      placeholder="#000000"
                      className="w-full text-center bg-slate-900/50 border border-[var(--border-color)] text-[11px] font-mono py-2 focus:outline-none focus:border-accent4 theme-text-primary rounded-xl uppercase"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Live Talisman Theme Status Check */}
      <div className="theme-card-bg-solid border border-accent4-medium/40 p-3 text-center space-y-1.5 rounded-2xl">
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-accent4">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span className="font-bold">مجموعه رنگ‌های کدهای سخت‌افزاری پایدار است</span>
        </div>
        <div className="flex justify-center gap-2 text-[9px] font-mono theme-text-tertiary">
          <span>A3: {accent3}</span>
          <span className="text-gray-600">|</span>
          <span>A4: {accent4}</span>
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
      {/* Accordion Trigger Header */}
      <button
        onClick={() => toggleSection && toggleSection("colors")}
        className="w-full py-3 px-4 bg-[var(--card-bg-solid)] flex items-center justify-between text-right hover:bg-[var(--card-hover-bg)] transition-colors cursor-pointer"
      >
        <ChevronLeft
          className="w-4 h-4 text-accent3 transition-transform duration-300"
          style={{ transform: isExpanded ? "rotate(-90deg)" : "rotate(0deg)" }}
        />
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold theme-text-primary">تنظیم تنوع رنگ و تضاد (رنگ ۳ و ۴)</span>
          <Palette className="w-4 h-4 text-accent3" />
        </div>
      </button>

      {/* Accordion Content Panel */}
      <AnimatePresence initial={false}>
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
