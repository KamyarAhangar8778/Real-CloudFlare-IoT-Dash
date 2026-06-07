"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Palette, ChevronLeft, Sparkles } from "lucide-react";
import { heritagePresets, HeritagePreset, BUTTON_CLIP, ACCORDION_CLIP } from "@/lib/presets";

interface ColorsSectionProps {
  accent3: string;
  setAccent3: (val: string) => void;
  accent4: string;
  setAccent4: (val: string) => void;
  isDark: boolean;
  expandedSection: string | null;
  toggleSection: (section: string) => void;
}

export default function ColorsSection({
  accent3,
  setAccent3,
  accent4,
  setAccent4,
  isDark,
  expandedSection,
  toggleSection
}: ColorsSectionProps) {
  const selectPreset = (preset: HeritagePreset) => {
    setAccent3(preset.accent3);
    setAccent4(preset.accent4);
  };

  const isExpanded = expandedSection === "colors";

  return (
    <div
      className="border border-accent3-medium overflow-hidden transition-all duration-300"
      style={{ clipPath: ACCORDION_CLIP }}
    >
      {/* Accordion Trigger Header */}
      <button
        onClick={() => toggleSection("colors")}
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
            <p className="text-[10px] theme-text-tertiary leading-relaxed">
              این داشبورد مجهز به سیستم پایداری ۴ رنگی است. رنگ‌های اصلی (سیاه، سفید و خاکستری) همواره ثابت هستند. شما می‌توانید رنگ‌های اختیاری سوم و چهارم را در زیر پیکربندی نمایید:
            </p>

            {/* Historical Curated Persian Presets */}
            <div className="space-y-2">
              <label className="text-[9px] theme-text-tertiary block font-bold">
                انتخاب پالت‌های تاریخی هدیه ایران:
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {heritagePresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => selectPreset(preset)}
                    className="p-2 text-right transition-all text-[11px] theme-card-bg-solid border theme-text-secondary flex items-center justify-between group hover:border-accent3 cursor-pointer"
                    style={{
                      clipPath: BUTTON_CLIP,
                      borderColor:
                        accent3 === preset.accent3 && accent4 === preset.accent4
                          ? "var(--accent3)"
                          : "var(--border-color)"
                    }}
                  >
                    {/* Colors Preview dots */}
                    <div className="flex gap-1.5 items-center">
                      <div className="w-3 h-3 border border-white/20" style={{ backgroundColor: preset.accent4 }} />
                      <div className="w-3 h-3 border border-white/20" style={{ backgroundColor: preset.accent3 }} />
                    </div>
                    <div className="text-right">
                      <span className="font-bold theme-text-primary block">{preset.name}</span>
                      <span className="text-[9px] theme-text-muted block">{preset.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Custom Picker (RGB Solver) */}
            <div className="border-t border-accent3-medium/20 pt-3 space-y-3">
              <label className="text-[9px] theme-text-tertiary block font-bold">
                تیونینگ دستی رنگ‌های فرکانس کاتد:
              </label>

              <div className="grid grid-cols-2 gap-3">
                {/* Accent 3 custom input */}
                <div className="space-y-1 text-right">
                  <span className="text-[9px] theme-text-muted block font-sans">رنگ سوم اصلی:</span>
                  <div
                    className="flex items-center gap-1.5 theme-card-bg-solid px-2 py-1.5 border theme-border"
                    style={{ clipPath: BUTTON_CLIP }}
                  >
                    <input
                      type="color"
                      value={accent3}
                      onChange={(e) => setAccent3(e.target.value)}
                      className="w-4 h-4 border-0 cursor-pointer p-0 bg-transparent rounded-none"
                    />
                    <input
                      type="text"
                      value={accent3}
                      onChange={(e) => setAccent3(e.target.value)}
                      className="bg-transparent text-[10px] w-full text-center font-mono focus:outline-none theme-text-primary p-0 uppercase"
                    />
                  </div>
                </div>

                {/* Accent 4 custom input */}
                <div className="space-y-1 text-right">
                  <span className="text-[9px] theme-text-muted block font-sans">رنگ چهارم کمکی:</span>
                  <div
                    className="flex items-center gap-1.5 theme-card-bg-solid px-2 py-1.5 border theme-border"
                    style={{ clipPath: BUTTON_CLIP }}
                  >
                    <input
                      type="color"
                      value={accent4}
                      onChange={(e) => setAccent4(e.target.value)}
                      className="w-4 h-4 border-0 cursor-pointer p-0 bg-transparent rounded-none"
                    />
                    <input
                      type="text"
                      value={accent4}
                      onChange={(e) => setAccent4(e.target.value)}
                      className="bg-transparent text-[10px] w-full text-center font-mono focus:outline-none theme-text-primary p-0 uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Live Talisman Theme Status Check */}
            <div
              className="theme-card-bg-solid border border-accent4-medium p-2.5 text-center space-y-1.5"
              style={{ clipPath: BUTTON_CLIP }}
            >
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-accent4">
                <Sparkles className="w-3 h-3 animate-spin" />
                <span className="font-bold">مجموعه رنگ‌های کدهای سخت‌افزاری پایدار است</span>
              </div>
              <div className="flex justify-center gap-2 text-[9px] font-mono theme-text-tertiary">
                <span>A3: {accent3}</span>
                <span className="text-gray-600">|</span>
                <span>A4: {accent4}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
