"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Settings as SettingsIcon, 
  Layers, 
  Sun,
  Moon,
  Cpu
} from "lucide-react";
import { 
  BUTTON_CLIP
} from "@/lib/presets";
import ImperialClock from "@/features/encyclopedia/components/ImperialClock";

interface MasterHeaderProps {
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  setIsModulesMenuOpen: (val: boolean) => void;
  setIsMenuOpen: (val: boolean) => void;
  setIsEspDrawerOpen: (val: boolean) => void;
  headerAnimationType: "fade" | "chase";
  headerTitle: string;
  groupsCols: number;
  setGroupsCols: (val: number) => void;
}

export default function MasterHeader({
  isDark,
  setIsDark,
  setIsModulesMenuOpen,
  setIsMenuOpen,
  setIsEspDrawerOpen,
  headerAnimationType,
  headerTitle,
  groupsCols,
  setGroupsCols
}: MasterHeaderProps) {
  return (
    <div id="header-continent-group" className="w-full flex flex-col md:flex-row-reverse items-stretch gap-4 relative md:-mt-2 z-20">
      
      {/* Structural Styles for parallel slants and animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 640px) {
          /* All three islands and the theme toggle are parallel parallelograms slanted on both sides */
          .clip-header-island {
            clip-path: polygon(16px 0%, 100% 0%, calc(100% - 16px) 100%, 0% 100%);
          }
        }
        @media (max-width: 639px) {
          .clip-header-island {
            clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px);
          }
        }

        @keyframes borderShiftMove {
          0% {
            background-position: 0% 0%;
            filter: drop-shadow(0 0 1px var(--accent3-medium));
          }
          50% {
            filter: drop-shadow(0 0 3px var(--accent4-medium));
          }
          100% {
            background-position: 200% 0%;
            filter: drop-shadow(0 0 1px var(--accent3-medium));
          }
        }

        .animated-border-gold-emerald {
          background: linear-gradient(90deg, var(--accent3) 0%, var(--accent4) 25%, var(--accent3) 50%, var(--accent4) 75%, var(--accent3) 100%);
          background-size: 200% 100%;
          animation: borderShiftMove 8s linear infinite;
          transition: all 0.5s ease;
        }
      ` }} />

      {/* THEME ISLAND (Floating parallel-slanted state-switching button on the right) */}
      <motion.div 
        className="clip-header-island p-[1.5px] relative overflow-hidden flex items-stretch shrink-0 w-14 h-12 shadow-[0_15px_30px_rgba(0,0,0,0.65)] hover:shadow-[0_20px_45px_rgba(16,185,129,0.35)] transition-shadow duration-300 cursor-pointer"
        whileHover={{
          y: -4,
          scale: 1.05
        }}
      >
        {headerAnimationType === "chase" ? (
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_6s_linear_infinite] pointer-events-none"
            style={{
              width: "400px",
              height: "400px",
              background: "conic-gradient(from 0deg, var(--accent3), var(--accent4), var(--accent3))",
            }}
          />
        ) : (
          <div className="absolute inset-0 animated-border-gold-emerald" />
        )}

        <button
          onClick={() => setIsDark(!isDark)}
          id="theme-island-toggle"
          className="clip-header-island group flex items-center justify-center h-full w-full transition-all duration-500 cursor-pointer overflow-hidden transform active:scale-95 z-10"
          style={{ 
            backgroundColor: isDark ? "#080a0f" : "#fcfdfe" 
          }}
          title="تغییر طرح رنگ‌بندی (روز تابان / شب سرد)"
          aria-label="تغییر طرح رنگ‌بندی (روز تابان / شب سرد)"
        >
          {/* Subtle Decorative Indicators */}
          <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-accent3/20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-accent3/20 pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.div 
                key="moon"
                initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex items-center justify-center"
              >
                <Moon className="w-5 h-5 text-accent3 transition-all duration-500 group-hover:scale-120 group-hover:rotate-12" style={{ color: "var(--accent3)" }} />
              </motion.div>
            ) : (
              <motion.div 
                key="sun"
                initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex items-center justify-center animate-[spin_30s_linear_infinite]"
              >
                <Sun className="w-5 h-5 text-accent4 transition-all duration-500 group-hover:scale-120" style={{ color: "var(--accent4)" }} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </motion.div>

      {/* MASTER FLOATING ARCHIPELAGO (Constructed from 3 distinct floating islands with pure border animations) */}
      <div className="flex-1 flex flex-col sm:flex-row-reverse items-stretch gap-3 md:gap-4 relative">

        {/* Island 1: Title Island (Rightmost in Persian/RTL) */}
        <motion.div 
          className="clip-header-island p-[1.5px] flex items-stretch shrink-0 relative overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.65)] hover:shadow-[0_20px_45px_rgba(212,163,89,0.35)] transition-shadow duration-300"
          whileHover={{
            y: -4,
            scale: 1.03
          }}
        >
          {headerAnimationType === "chase" ? (
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_6s_linear_infinite] pointer-events-none"
              style={{
                width: "800px",
                height: "800px",
                background: "conic-gradient(from 0deg, var(--accent3), var(--accent4), var(--accent3))",
              }}
            />
          ) : (
            <div className="absolute inset-0 animated-border-gold-emerald" />
          )}

          <div 
            className="clip-header-island flex items-center gap-2.5 px-6 py-2 h-12 w-full transition-all duration-500 z-10"
            style={{ 
              backgroundColor: isDark ? "#080a0f" : "#fcfdfe" 
            }}
          >
            <motion.div 
              className="w-4 h-4 flex items-center justify-center relative border border-accent3/40 bg-accent3-transparent shrink-0"
              style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
              animate={{
                rotate: [0, 90, 180, 270, 360]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <div 
                className="w-1.5 h-1.5 bg-accent3" 
                style={{ 
                  backgroundColor: "var(--accent3)",
                  clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" 
                }} 
              />
            </motion.div>
            <h1 className="font-sans font-extrabold text-xs md:text-sm tracking-tight theme-text-primary header-noble-glow bg-gradient-to-r from-[var(--text-primary)] via-slate-400 to-accent3 bg-clip-text text-transparent whitespace-nowrap select-none" dir="rtl">
              {headerTitle}
            </h1>
          </div>
        </motion.div>

        {/* Island 2: Clock & Calendar Island (Middle) */}
        <motion.div 
          className="clip-header-island p-[1.5px] flex items-stretch flex-1 min-w-[200px] relative overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.65)] hover:shadow-[0_20px_45px_rgba(16,185,129,0.25)] transition-shadow duration-300"
          whileHover={{
            y: -4,
            scale: 1.01
          }}
        >
          {headerAnimationType === "chase" ? (
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_6s_linear_infinite] pointer-events-none"
              style={{
                width: "1000px",
                height: "1000px",
                background: "conic-gradient(from 0deg, var(--accent3), var(--accent4), var(--accent3))",
              }}
            />
          ) : (
            <div className="absolute inset-0 animated-border-gold-emerald" />
          )}

          <div 
            className="clip-header-island flex items-center justify-between px-4 py-2 h-12 w-full transition-all duration-500 z-10 gap-2"
            style={{ 
              backgroundColor: isDark ? "#080a0f" : "#fcfdfe" 
            }}
          >
            {/* Groups grid layout toggler */}
            <div 
              className="flex items-center gap-[3px] p-0.5 bg-black/30 border border-gray-800/40 shrink-0" 
              style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}
            >
              <button
                onClick={() => {
                  setGroupsCols(1);
                  if (typeof window !== "undefined") {
                     localStorage.setItem("achaemenid_dashboard_groups_cols", "1");
                  }
                }}
                className={`w-5 h-5 flex flex-col items-center justify-center gap-[1px] transition-all cursor-pointer hover:-translate-y-[1px] ${groupsCols === 1 ? 'text-[var(--accent3)] bg-[var(--accent3-transparent)] font-bold scale-105' : 'text-gray-500 hover:text-gray-300'}`}
                style={{ clipPath: "polygon(2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)" }}
                title="نمایش تک ستونه گروه‌ها"
                aria-label="نمایش تک ستونه گروه‌ها"
              >
                <div className="w-[11px] h-[3px] bg-current rounded-[1px]" />
                <div className="w-[11px] h-[3px] bg-current rounded-[1px]" />
              </button>
              <button
                onClick={() => {
                  setGroupsCols(2);
                  if (typeof window !== "undefined") {
                     localStorage.setItem("achaemenid_dashboard_groups_cols", "2");
                  }
                }}
                className={`w-5 h-5 flex items-center justify-center gap-[1.5px] transition-all cursor-pointer hover:-translate-y-[1px] ${groupsCols === 2 ? 'text-[var(--accent3)] bg-[var(--accent3-transparent)] font-bold scale-105' : 'text-gray-500 hover:text-gray-300'}`}
                style={{ clipPath: "polygon(2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)" }}
                title="نمایش دو ستونه گروه‌ها"
                aria-label="نمایش دو ستونه گروه‌ها"
              >
                <div className="w-[4px] h-[8px] bg-current rounded-[1px]" />
                <div className="w-[4px] h-[8px] bg-current rounded-[1px]" />
              </button>
              <button
                onClick={() => {
                  setGroupsCols(3);
                  if (typeof window !== "undefined") {
                     localStorage.setItem("achaemenid_dashboard_groups_cols", "3");
                  }
                }}
                className={`w-5 h-5 flex items-center justify-center gap-[1px] transition-all cursor-pointer hover:-translate-y-[1px] ${groupsCols === 3 ? 'text-[var(--accent3)] bg-[var(--accent3-transparent)] font-bold scale-105' : 'text-gray-500 hover:text-gray-300'}`}
                style={{ clipPath: "polygon(2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)" }}
                title="نمایش سه ستونه گروه‌ها"
                aria-label="نمایش سه ستونه گروه‌ها"
              >
                <div className="w-[2.5px] h-[8px] bg-current rounded-[1px]" />
                <div className="w-[2.5px] h-[8px] bg-current rounded-[1px]" />
                <div className="w-[2.5px] h-[8px] bg-current rounded-[1px]" />
              </button>
            </div>

            {/* Simulated Live Imperial Clock Center */}
            <div className="flex-1 flex justify-center">
              <ImperialClock />
            </div>
          </div>
        </motion.div>

        {/* Island 3: Modules & Settings Toggles Island (Leftmost in Persian/RTL) */}
        <motion.div 
          className="clip-header-island p-[1.5px] flex items-stretch shrink-0 relative overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.65)] hover:shadow-[0_20px_45px_rgba(212,163,89,0.35)] transition-shadow duration-300"
          whileHover={{
            y: -4,
            scale: 1.04
          }}
        >
          {headerAnimationType === "chase" ? (
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_6s_linear_infinite] pointer-events-none"
              style={{
                width: "500px",
                height: "500px",
                background: "conic-gradient(from 0deg, var(--accent3), var(--accent4), var(--accent3))",
              }}
            />
          ) : (
            <div className="absolute inset-0 animated-border-gold-emerald" />
          )}

          <div 
            className="clip-header-island flex items-center gap-3 px-6 py-2 h-12 w-full transition-all duration-500 z-10"
            style={{ 
              backgroundColor: isDark ? "#080a0f" : "#fcfdfe" 
            }}
          >
            <button
              onClick={() => setIsModulesMenuOpen(true)}
              className="relative group inline-flex items-center justify-center w-8 h-8 hover:from-black hover:-translate-y-[2px] hover:border-[var(--accent4)] hover:shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all duration-300 cursor-pointer overflow-hidden transform active:scale-95 text-[var(--accent4)]"
              style={{ 
                clipPath: BUTTON_CLIP,
                border: "1px solid var(--accent4-medium)",
                background: "linear-gradient(90deg, var(--accent4-transparent), transparent)" 
              }}
              title="منوی مدیریت ماژول‌ها و سگمنت‌ها"
              aria-label="منوی مدیریت ماژول‌ها و سگمنت‌ها"
            >
              <Layers className="w-4 h-4 text-[var(--accent4)] group-hover:scale-110 transition-transform duration-500" />
            </button>
            <button
              onClick={() => setIsEspDrawerOpen(true)}
              className="relative group inline-flex items-center justify-center w-8 h-8 hover:from-black hover:-translate-y-[2px] hover:border-[var(--accent3)] hover:shadow-[0_0_8px_rgba(212,163,89,0.3)] transition-all duration-300 cursor-pointer overflow-hidden transform active:scale-95 text-[var(--accent3)]"
              style={{ 
                clipPath: BUTTON_CLIP,
                border: "1px solid var(--accent3-medium)",
                background: "linear-gradient(90deg, var(--accent3-transparent), transparent)" 
              }}
              title="موتور همگام‌ساز قالب دیتای تراشه ESP32"
              aria-label="موتور همگام‌ساز قالب دیتای تراشه ESP32"
            >
              <Cpu className="w-4 h-4 text-[var(--accent3)] group-hover:scale-110 transition-transform duration-500" />
            </button>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="relative group inline-flex items-center justify-center w-8 h-8 hover:from-black hover:-translate-y-[2px] hover:border-[var(--accent3)] hover:shadow-[0_0_8px_rgba(212,163,89,0.3)] transition-all duration-300 cursor-pointer overflow-hidden transform active:scale-95 text-accent3"
              style={{ 
                clipPath: BUTTON_CLIP,
                border: "1px solid var(--accent3-medium)",
                background: "linear-gradient(90deg, var(--accent3-transparent), transparent)" 
              }}
              title="تنظیمات پایداری و منو"
              aria-label="تنظیمات پایداری و منو"
            >
              <SettingsIcon className="w-4 h-4 text-accent3 group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
