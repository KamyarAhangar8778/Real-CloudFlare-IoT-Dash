"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Type, ChevronLeft, Check } from "lucide-react";
import { ACCORDION_CLIP, BUTTON_CLIP } from "@/lib/presets";

interface TypographySectionProps {
  selectedFont: string;
  setSelectedFont: (val: string) => void;
  expandedSection?: string | null;
  toggleSection?: (section: string) => void;
  hideHeader?: boolean;
}

const FONTS_LIST = [
  { id: "vazir", name: "وزیرمتن", family: "'Vazirmatn'", desc: "پایه مدرن" },
  { id: "lalezar", name: "لاله‌زار", family: "'Lalezar'", desc: "حماسی برجسته" },
  { id: "cairo", name: "کایرو", family: "'Cairo'", desc: "هندسی متعادل" },
  { id: "amiri", name: "امیری", family: "'Amiri'", desc: "کتابت سنتی" },
  { id: "changa", name: "چنگا", family: "'Changa'", desc: "تکنو خشن" },
  { id: "reem", name: "ریم کوفی", family: "'Reem Kufi'", desc: "کوفی باستانی" },
  { id: "tajawal", name: "تجول", family: "'Tajawal'", desc: "اداری قرآنی" },
  { id: "playfair", name: "پلی‌فیر", family: "'Playfair Display'", desc: "لاتین کلاسیک" },
  { id: "space", name: "اسپیس", family: "'Space Grotesk'", desc: "آینده‌نگار" },
  { id: "mono", name: "جت‌برینز", family: "'JetBrains Mono'", desc: "فنی هکری" }
];

export default function TypographySection({
  selectedFont,
  setSelectedFont,
  expandedSection,
  toggleSection,
  hideHeader = false
}: TypographySectionProps) {
  const isExpanded = hideHeader ? true : expandedSection === "fonts";

  const renderContent = () => (
    <div className="space-y-4 text-right">
      <p className="text-[10px] theme-text-tertiary leading-relaxed">
        یکی از قلم‌های زیر را برای بورد خود انتخاب نمایید. پیش‌نمایش زنده هر قلم با متن زیر نمایش داده شده است:
      </p>

      {/* Grid: 2 rows of 5 columns on large screen, wrapping nicely on smaller screens */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 pt-1">
        {FONTS_LIST.map((font) => {
          const isSelected = selectedFont === font.id;
          return (
            <motion.button
              key={font.id}
              onClick={() => setSelectedFont(font.id)}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex flex-col justify-between text-right p-3.5 min-h-[110px] border transition-all duration-300 rounded-2xl cursor-pointer ${
                isSelected
                  ? "bg-[var(--accent3-transparent)] border-[var(--accent3)] shadow-[0_0_15px_var(--accent3-transparent)]"
                  : "bg-black/25 hover:bg-black/40 border-[var(--border-color)] hover:border-[var(--accent3)]/40"
              }`}
            >
              {/* Top Meta info */}
              <div className="flex items-center justify-between w-full gap-1">
                <span className={`text-[8.5px] font-sans font-bold tracking-tight ${isSelected ? "text-[var(--accent3)]" : "theme-text-muted"}`}>
                  {font.desc}
                </span>
                <span className="font-sans font-black text-[10px] theme-text-primary">
                  {font.name}
                </span>
              </div>

              {/* Central Dynamic Scribe Preview Text */}
              <div className="w-full py-2 flex items-center justify-center overflow-hidden">
                <span
                  className={`text-[12px] font-bold text-center leading-relaxed transition-colors duration-300 ${
                    isSelected ? "text-[var(--accent3)]" : "theme-text-secondary group-hover:theme-text-primary"
                  }`}
                  style={{ fontFamily: font.family }}
                >
                  درود بر شما، به داشبورد خودتون خوش اومدین!!
                </span>
              </div>

              {/* Small Checkmark selection marker */}
              {isSelected && (
                <div className="absolute bottom-1.5 left-2 text-[var(--accent3)]">
                  <Check className="w-3.5 h-3.5 stroke-[3px]" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );

  if (hideHeader) {
    return (
      <div className="theme-card-bg-solid border border-accent3-medium/30 p-4 space-y-4 overflow-hidden rounded-xl text-right">
        {renderContent()}
      </div>
    );
  }

  return (
    <div
      className="border border-accent3-medium overflow-hidden transition-all duration-300"
      style={{ clipPath: ACCORDION_CLIP }}
    >
      <button
        onClick={() => toggleSection && toggleSection("fonts")}
        className="w-full py-3 px-4 bg-[var(--card-bg-solid)] flex items-center justify-between text-right hover:bg-[var(--card-hover-bg)] transition-colors cursor-pointer"
      >
        <ChevronLeft
          className="w-4 h-4 text-accent3 transition-transform duration-300"
          style={{ transform: isExpanded ? "rotate(-90deg)" : "rotate(0deg)" }}
        />
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold theme-text-primary">مدیریت قلم و تایپوگرافی</span>
          <Type className="w-4 h-4 text-accent3" />
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
