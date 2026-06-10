"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Settings as SettingsIcon, CheckCircle2, Palette, Type, Activity, LayoutGrid, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { BUTTON_CLIP } from "@/lib/presets";
import ColorsSection from "./ColorsSection";
import TypographySection from "./TypographySection";
import StabilitySection from "./StabilitySection";
import CuneiformSection from "./CuneiformSection";
import HeaderSettingsSection from "./HeaderSettingsSection";

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  accent3: string;
  setAccent3: (val: string) => void;
  accent4: string;
  setAccent4: (val: string) => void;
  selectedFont: string;
  setSelectedFont: (val: string) => void;
  animationsEnabled: boolean;
  setAnimationsEnabled: (val: boolean) => void;
  headerAnimationType: "fade" | "chase";
  setHeaderAnimationType: (val: "fade" | "chase") => void;
  headerTitle: string;
  setHeaderTitle: (val: string) => void;
  cuneiformOpacity: number;
  setCuneiformOpacity: (val: number) => void;
  cuneiformColor: "accent3" | "accent4" | "white" | "muted";
  setCuneiformColor: (val: "accent3" | "accent4" | "white" | "muted") => void;
  isDark: boolean;
  headerPosition: "top" | "left";
  setHeaderPosition: (val: "top" | "left") => void;
}

const SETTINGS_TABS = [
  { id: "colors", title: "تنظیم تنوع رنگ و تضاد", compactTitle: "رنگ ۳ و رنگ ۴ بورد", Icon: Palette },
  { id: "fonts", title: "مدیریت قلم و تایپوگرافی", compactTitle: "قلم و فونت‌های سلطنتی", Icon: Type },
  { id: "animations", title: "کنترل پایداری و بهینه‌سازی", compactTitle: "فریم‌ریت و مصرف سرویس", Icon: Activity },
  { id: "header-settings", title: "موقعیت و تنظیمات هدر", compactTitle: "طرح قرارگیری هدر بورد", Icon: LayoutGrid },
  { id: "cuneiform", title: "تنظیمات کتیبه خط میخی", compactTitle: "پدیداری و کنتراست پس‌زمینه", Icon: Sparkles }
];

export default function SettingsDrawer({
  isOpen,
  onClose,
  accent3,
  setAccent3,
  accent4,
  setAccent4,
  selectedFont,
  setSelectedFont,
  animationsEnabled,
  setAnimationsEnabled,
  headerAnimationType,
  setHeaderAnimationType,
  headerTitle,
  setHeaderTitle,
  cuneiformOpacity,
  setCuneiformOpacity,
  cuneiformColor,
  setCuneiformColor,
  isDark,
  headerPosition,
  setHeaderPosition
}: SettingsDrawerProps) {
  const [activeTab, setActiveTab] = useState<string>("colors");

  const [isAdjusting, setIsAdjusting] = useState<boolean>(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const isInitialOpenRef = React.useRef<boolean>(true);

  // Compile a signature of all settings that might change and affect dashboard live styles
  const settingsSignature = `${accent3}-${accent4}-${selectedFont}-${animationsEnabled}-${headerAnimationType}-${headerTitle}-${cuneiformOpacity}-${cuneiformColor}-${headerPosition}-${isDark}`;

  React.useEffect(() => {
    if (!isOpen) {
      isInitialOpenRef.current = true;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      return;
    }

    if (isInitialOpenRef.current) {
      isInitialOpenRef.current = false;
      return;
    }

    // A change inside settings has been initiated
    setIsAdjusting(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsAdjusting(false);
    }, 5000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [settingsSignature, isOpen]);

  const handleNext = () => {
    const currIndex = SETTINGS_TABS.findIndex((t) => t.id === activeTab);
    const nextIndex = (currIndex + 1) % SETTINGS_TABS.length;
    setActiveTab(SETTINGS_TABS[nextIndex].id);
  };

  const handlePrev = () => {
    const currIndex = SETTINGS_TABS.findIndex((t) => t.id === activeTab);
    const prevIndex = (currIndex - 1 + SETTINGS_TABS.length) % SETTINGS_TABS.length;
    setActiveTab(SETTINGS_TABS[prevIndex].id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`fixed inset-0 z-50 cursor-pointer transition-all duration-700 ease-in-out ${
              isAdjusting
                ? "bg-black/10 backdrop-blur-none"
                : "bg-black/80 backdrop-blur-md"
            }`}
          />

          {/* Elegant Right-Floating Settings Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 24, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-gradient-to-b from-[var(--drawer-gradient-from)] to-[var(--drawer-gradient-to)] border-l border-accent3-medium rounded-l-[2.5rem] shadow-2xl z-50 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] px-6 py-8 text-right flex flex-col justify-between transition-colors duration-500"
          >
            {/* Drawer Content */}
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-accent3-medium pb-4">
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full theme-card-bg-solid border theme-border theme-text-tertiary hover:text-accent3 transition-all cursor-pointer focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2.5">
                  <div>
                    <h4 className="font-sans font-black text-sm text-accent3" style={{ color: "var(--accent3)" }}>
                      منوی مدیریت و تنظیمات
                    </h4>
                    <p className="text-[9px] theme-text-muted font-sans tracking-wide uppercase">
                      Gateway Configuration Node
                    </p>
                  </div>
                  <div className="p-2 theme-card-bg-solid border border-accent3-medium text-accent3">
                    <SettingsIcon className={`w-4 h-4 ${animationsEnabled ? "animate-[spin_10s_linear_infinite]" : ""}`} />
                  </div>
                </div>
              </div>

              {/* Dynamic Horizontal Title Selector Slider with adjacent previews */}
              <div className="space-y-3">
                <div 
                  className={`border rounded-2xl p-2.5 flex items-center justify-between gap-1 shadow-inner relative overflow-hidden transition-colors duration-300 ${
                    isDark ? "bg-slate-950/40 border-accent3-medium/50" : "bg-white/60 border-slate-200/90"
                  }`}
                >
                  {/* Subtle top edge premium gold gradient */}
                  <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-accent3 to-transparent opacity-80" />

                  {/* Right Arrow (RTL: Move to Previous Tab) */}
                  <button
                    onClick={handlePrev}
                    className={`p-1.5 rounded-xl border transition-all duration-300 cursor-pointer shrink-0 ${
                      isDark 
                        ? "border-accent3-medium/30 bg-black/50 text-accent3 hover:text-accent4 hover:border-accent4" 
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:text-accent3 hover:border-accent3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                    }`}
                    title="بخش قبلی"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Centered Active Tab Label alongside adjacent previews */}
                  {(() => {
                    const currIndex = SETTINGS_TABS.findIndex((t) => t.id === activeTab);
                    const prevIndex = (currIndex - 1 + SETTINGS_TABS.length) % SETTINGS_TABS.length;
                    const nextIndex = (currIndex + 1) % SETTINGS_TABS.length;
                    
                    return (
                      <div className="flex-1 grid grid-cols-12 gap-1 items-center justify-center text-center px-1 select-none overflow-hidden min-h-[58px]">
                        {/* Previous Tab Preview (RTL Right Side, Col Span 3) */}
                        <button
                          onClick={handlePrev}
                          className="col-span-3 text-right group focus:outline-none cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden"
                          title={SETTINGS_TABS[prevIndex].title}
                        >
                          <span className={`block text-[8px] font-sans font-medium truncate opacity-30 group-hover:opacity-60 transition-opacity ${
                            isDark ? "text-gray-400" : "text-slate-500"
                          }`}>
                            {SETTINGS_TABS[prevIndex].compactTitle}
                          </span>
                        </button>

                        {/* Center Active Tab Label (Col Span 6) */}
                        <div className="col-span-6 flex flex-col items-center justify-center overflow-hidden">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={activeTab}
                              initial={{ opacity: 0, scale: 0.95, y: 5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -5 }}
                              transition={{ duration: 0.15 }}
                              className="flex flex-col items-center gap-0.5 w-full"
                            >
                              <div className="flex items-center gap-1.5 justify-center w-full max-w-full">
                                {React.createElement(SETTINGS_TABS[currIndex].Icon, {
                                  className: `w-4 h-4 shrink-0 ${isDark ? "text-accent4" : "text-accent3"}`
                                })}
                                <span className={`font-sans font-extrabold text-[12px] truncate leading-normal ${
                                  isDark ? "text-[var(--accent3)]" : "text-slate-800"
                                }`} style={isDark ? { color: "var(--accent3)" } : {}}>
                                  {SETTINGS_TABS[currIndex].title}
                                </span>
                              </div>
                              <span className={`text-[9px] font-sans font-medium line-clamp-1 opacity-80 ${
                                isDark ? "theme-text-muted" : "text-slate-500"
                              }`}>
                                {SETTINGS_TABS[currIndex].compactTitle}
                              </span>
                            </motion.div>
                          </AnimatePresence>
                        </div>

                        {/* Next Tab Preview (RTL Left Side, Col Span 3) */}
                        <button
                          onClick={handleNext}
                          className="col-span-3 text-left group focus:outline-none cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden"
                          title={SETTINGS_TABS[nextIndex].title}
                        >
                          <span className={`block text-[8px] font-sans font-medium truncate opacity-30 group-hover:opacity-60 transition-opacity ${
                            isDark ? "text-gray-400" : "text-slate-500"
                          }`}>
                            {SETTINGS_TABS[nextIndex].compactTitle}
                          </span>
                        </button>
                      </div>
                    );
                  })()}

                  {/* Left Arrow (RTL: Move to Next Tab) */}
                  <button
                    onClick={handleNext}
                    className={`p-1.5 rounded-xl border transition-all duration-300 cursor-pointer shrink-0 ${
                      isDark 
                        ? "border-accent3-medium/30 bg-black/50 text-accent3 hover:text-accent4 hover:border-accent4" 
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:text-accent3 hover:border-accent3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                    }`}
                    title="بخش بعدی"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* Micro diamond indicators with corrected light theme contrast */}
                <div className="flex items-center justify-center gap-2.5 pb-1">
                  {SETTINGS_TABS.map((tab, idx) => {
                    const isActive = tab.id === activeTab;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="transition-all duration-300 p-1 focus:outline-none cursor-pointer"
                        title={tab.title}
                      >
                        <div
                          className="w-1.5 h-1.5 transition-all duration-300"
                          style={{
                            transform: isActive ? "rotate(45deg) scale(1.35)" : "rotate(45deg) scale(0.9)",
                            backgroundColor: isActive 
                              ? "var(--accent3)" 
                              : isDark 
                                ? "rgba(255, 255, 255, 0.22)" 
                                : "rgba(15, 23, 42, 0.25)",
                            boxShadow: isActive ? "0 0 6px var(--accent3)" : "none"
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* MODULAR COMPONENT RENDER (Active tab rendered inline) */}
              <div className="space-y-4 pt-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === "colors" && (
                      <ColorsSection
                        accent3={accent3}
                        setAccent3={setAccent3}
                        accent4={accent4}
                        setAccent4={setAccent4}
                        isDark={isDark}
                        hideHeader={true}
                      />
                    )}

                    {activeTab === "fonts" && (
                      <TypographySection
                        selectedFont={selectedFont}
                        setSelectedFont={setSelectedFont}
                        hideHeader={true}
                      />
                    )}

                    {activeTab === "animations" && (
                      <StabilitySection
                        animationsEnabled={animationsEnabled}
                        setAnimationsEnabled={setAnimationsEnabled}
                        hideHeader={true}
                        isDark={isDark}
                      />
                    )}

                    {activeTab === "header-settings" && (
                      <HeaderSettingsSection
                        headerAnimationType={headerAnimationType}
                        setHeaderAnimationType={setHeaderAnimationType}
                        headerTitle={headerTitle}
                        setHeaderTitle={setHeaderTitle}
                        headerPosition={headerPosition}
                        setHeaderPosition={setHeaderPosition}
                        hideHeader={true}
                      />
                    )}

                    {activeTab === "cuneiform" && (
                      <CuneiformSection
                        cuneiformOpacity={cuneiformOpacity}
                        setCuneiformOpacity={setCuneiformOpacity}
                        cuneiformColor={cuneiformColor}
                        setCuneiformColor={setCuneiformColor}
                        hideHeader={true}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Drawer Footer info */}
            <div className="border-t border-accent3-medium/20 pt-4 mt-8 text-right space-y-2">
              <div className="flex items-center gap-1.5 justify-end text-[10px] text-accent3">
                <span className="font-bold">امنیت بومی و پایداری شبکه برقرار است</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-accent4" style={{ color: "var(--accent4)" }} />
              </div>
              <p className="text-[9px] theme-text-muted font-sans">
                برای بازگشت به نمای اصلی، بر روی فضای خارج از منو ضربه بزنید یا کلید ضربدر بالا را کلیک کنید.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
