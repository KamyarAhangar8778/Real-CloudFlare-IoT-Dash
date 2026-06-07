"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Type, ChevronLeft } from "lucide-react";
import { BUTTON_CLIP, ACCORDION_CLIP } from "@/lib/presets";

interface TypographySectionProps {
  selectedFont: string;
  setSelectedFont: (val: string) => void;
  expandedSection: string | null;
  toggleSection: (section: string) => void;
}

export default function TypographySection({
  selectedFont,
  setSelectedFont,
  expandedSection,
  toggleSection
}: TypographySectionProps) {
  const isExpanded = expandedSection === "fonts";

  return (
    <div
      className="border border-accent3-medium overflow-hidden transition-all duration-300"
      style={{ clipPath: ACCORDION_CLIP }}
    >
      <button
        onClick={() => toggleSection("fonts")}
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
            <p className="text-[10px] theme-text-tertiary leading-relaxed">
              قلم و هویت کتبی کتیبه‌های داشبورد را متناسب با سلیقه خود انتخاب کنید. تغییر خط به صورت لحظه‌ای روی کل بورد اعمال خواهد شد:
            </p>

            {/* Centralized Premium Unified Preview Block */}
            <div 
              className="theme-card-bg border border-accent3-medium p-4 text-center my-2 select-none relative overflow-hidden flex flex-col items-center justify-center gap-1 min-h-[75px]"
              style={{ clipPath: BUTTON_CLIP }}
            >
              <div className="absolute top-1 right-2 w-1 h-1 bg-accent3/40" style={{ clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)" }} />
              <div className="absolute bottom-1 left-2 w-1 h-1 bg-accent3/40" style={{ clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)" }} />
              
              <span className="text-[9px] theme-text-muted font-sans tracking-wide uppercase">DYNAMIC SCRIBE SYSTEM PREVIEW</span>
              
              {/* Live Dynamic Font display text */}
              <span 
                className="text-lg md:text-xl font-bold tracking-tight text-accent3 transition-all duration-300"
                style={{ 
                  fontFamily: 
                    selectedFont === "vazir" ? "'Vazirmatn'" :
                    selectedFont === "lalezar" ? "'Lalezar'" :
                    selectedFont === "mono" ? "'JetBrains Mono'" :
                    selectedFont === "playfair" ? "'Playfair Display'" :
                    selectedFont === "cairo" ? "'Cairo'" :
                    selectedFont === "amiri" ? "'Amiri'" :
                    selectedFont === "changa" ? "'Changa'" :
                    selectedFont === "reem" ? "'Reem Kufi'" : "'Space Grotesk'"
                }}
              >
                هخامنش | Achaemenid
              </span>
            </div>

            {/* Clean/Compact Royal Dropdown Picker */}
            <div className="space-y-1.5 text-right">
              <label className="text-[9px] theme-text-tertiary block font-bold">
                قلم سلطنتی فعال بورد را انتخاب کنید:
              </label>
              <div
                className="relative flex items-center bg-black/40 border border-accent3-medium/60 text-right w-full"
                style={{ clipPath: BUTTON_CLIP }}
              >
                <select
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  className="w-full bg-slate-900/40 text-xs py-3.5 pr-4 pl-8 theme-text-primary text-right focus:outline-none cursor-pointer appearance-none font-sans"
                  dir="rtl"
                >
                  <option value="vazir" className="bg-slate-950 font-sans">قلم وزیرمتن (پیش‌فرض مدرن)</option>
                  <option value="lalezar" className="bg-slate-950 font-sans">قلم لاله‌زار (حماسی برجسته)</option>
                  <option value="cairo" className="bg-slate-950 font-sans">قلم کایرو (Cairo - هندسی متعادل)</option>
                  <option value="amiri" className="bg-slate-950 font-sans">قلم امیری (Amiri - کتابت و دیوانی)</option>
                  <option value="changa" className="bg-slate-950 font-sans">قلم چنگا (Changa - تکنو هندسی)</option>
                  <option value="reem" className="bg-slate-950 font-sans">قلم ریم کوفی (Reem Kufi - باستانی عربی)</option>
                  <option value="playfair" className="bg-slate-950 font-sans">قلم پلی‌فیر (Playfair - لاتین کلاسیک)</option>
                  <option value="space" className="bg-slate-950 font-sans">قلم اسپیس (Space - آینده‌نگار دیجیتال)</option>
                  <option value="mono" className="bg-slate-950 font-sans">قلم جت‌برینز (Mono - فنی هکری)</option>
                </select>
                {/* Native Arrow overlay replacement */}
                <div className="absolute left-3 pointer-events-none text-accent3">
                  <ChevronLeft className="w-4 h-4 translate-y-[1px]" style={{ transform: "rotate(-90deg)" }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
