"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Settings as SettingsIcon, 
  Layers, 
  Sun, 
  Moon, 
  Cpu, 
  PanelTop, 
  PanelLeft,
  LayoutGrid,
  Columns2,
  Sparkles
} from "lucide-react";
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
  headerPosition: "top" | "left";
  setHeaderPosition: (val: "top" | "left") => void;
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
  setGroupsCols,
  headerPosition,
  setHeaderPosition
}: MasterHeaderProps) {

  const handleTogglePosition = (pos: "top" | "left") => {
    setHeaderPosition(pos);
    if (typeof window !== "undefined") {
      localStorage.setItem("cloudflare_layout_header_position", pos);
    }
  };

  // 1. VERTICAL SIDEBAR LAYOUT (For Left sidebar position on medium/desktop displays)
  if (headerPosition === "left") {
    return (
      <div id="vertical-master-header" className="w-full h-full flex flex-col justify-between gap-6 py-2">
        {/* Core Header section */}
        <div className="space-y-6">
          {/* Brand/Title Header */}
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[var(--accent4-transparent)] border border-[var(--accent4-medium)] text-[var(--accent4)] rounded-lg shrink-0">
                <Cpu className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-right">
                <h1 className="font-sans font-bold text-sm text-[var(--text-primary)] leading-tight tracking-tight select-none">
                  {headerTitle}
                </h1>
                <span className="text-[9px] text-[var(--text-muted)] block font-mono">
                  Cloudflare Inspired IoT Node
                </span>
              </div>
            </div>
          </div>

          {/* Live Clock Capsule (Vertical) */}
          <div className="p-3 bg-[var(--bg-main)] hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] rounded-xl transition-all duration-300">
            <ImperialClock />
          </div>

          {/* Interactive Layout Modifiers Grid */}
          <div className="space-y-3">
            <span className="text-[10px] text-[var(--text-muted)] font-black block text-right uppercase tracking-wider">
              پیکربندی موقعیت و ساختار
            </span>
            <div className="grid grid-cols-2 gap-2">
              {/* Top Layout Option */}
              <button
                onClick={() => handleTogglePosition("top")}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-[var(--border-color)] text-[11px] font-bold text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-hover-bg)] transition-all"
                title="قرارگیری هدر در بالای صفحه"
              >
                <PanelTop className="w-3.5 h-3.5" />
                <span>هدر بالا</span>
              </button>

              {/* Left Layout Option */}
              <button
                onClick={() => handleTogglePosition("left")}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-[var(--accent4)] bg-[var(--accent4-transparent)] text-[var(--accent4)] text-[11px] font-bold transition-all"
                title="قرارگیری منو در سمت چپ"
              >
                <PanelLeft className="w-3.5 h-3.5" />
                <span>منوی چپ</span>
              </button>
            </div>

            {/* Grid layout cols switcher inside sidebar */}
            <div className="flex items-center justify-between p-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg gap-2">
              <span className="text-[10px] text-[var(--text-tertiary)] font-bold">ستون‌ها:</span>
              <div className="flex gap-1">
                {[1, 2, 3].map((cols) => (
                  <button
                    key={cols}
                    onClick={() => setGroupsCols(cols)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                      groupsCols === cols
                        ? "bg-[var(--accent3)] text-black"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {cols} ستون
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick-Access Vertical Control Items */}
          <div className="space-y-2 mt-4">
            <span className="text-[10px] text-[var(--text-muted)] font-black block text-right uppercase tracking-wider">
              بخش‌های کاربری
            </span>

            {/* Modules Drawer Trigger */}
            <button
              onClick={() => setIsModulesMenuOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg-solid)] hover:bg-[var(--card-hover-bg)] hover:border-[var(--accent4-medium)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300 transform active:scale-[0.98]"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[var(--accent4-transparent)] text-[var(--accent4)]">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold">پالایه و ماژول‌ها</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--border-color)] text-[var(--text-muted)] font-mono">
                Modules
              </span>
            </button>

            {/* ESP Config Sync Trigger */}
            <button
              onClick={() => setIsEspDrawerOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg-solid)] hover:bg-[var(--card-hover-bg)] hover:border-[var(--accent3-medium)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300 transform active:scale-[0.98]"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[var(--accent3-transparent)] text-[var(--accent3)]">
                  <Cpu className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold">همگام‌ساز تراشه</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--border-color)] text-[var(--text-muted)] font-mono">
                ESP32
              </span>
            </button>

            {/* System config trigger */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg-solid)] hover:bg-[var(--card-hover-bg)] hover:border-[var(--accent3-medium)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300 transform active:scale-[0.98]"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-gray-500/10 text-[var(--text-tertiary)]">
                  <SettingsIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold">تنظیمات اصلی</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--border-color)] text-[var(--text-muted)] font-mono">
                Setup
              </span>
            </button>
          </div>
        </div>

        {/* Footer controls: theme toggler and brand info */}
        <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-main)] hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] transition-all text-xs font-medium"
          >
            <span className="text-[11px] text-[var(--text-secondary)]">
              {isDark ? "حالت تیره" : "حالت روشن"}
            </span>
            <div className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-500">
              {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
          </button>
        </div>
      </div>
    );
  }

  // 2. HORIZONTAL HEADER LAYOUT (For standard top placement & mobile displays)
  return (
    <div id="horizontal-master-header" className="w-full flex flex-col md:flex-row gap-4 justify-between items-center bg-[var(--card-bg-solid)] border border-[var(--border-color)] px-5 py-3.5 rounded-2xl shadow-sm relative z-20">
      
      {/* Right Column: Logo & Editable Title */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        {/* Mobile menu trigger helper/indicator & logo */}
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-[var(--accent4-transparent)] border border-[var(--accent4-medium)] text-[var(--accent4)] rounded-xl shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="text-right">
            <h1 className="font-sans font-extrabold text-[13px] md:text-sm tracking-tight text-[var(--text-primary)]">
              {headerTitle}
            </h1>
            <p className="text-[9px] text-[var(--text-muted)] font-mono leading-none mt-0.5">
              Interactive Modern Dashboard
            </p>
          </div>
        </div>

        {/* Short Layout toggler just for mobile viewports */}
        <div className="md:hidden flex items-center gap-1 bg-[var(--bg-main)] p-1 border border-[var(--border-color)] rounded-lg">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--accent4)] rounded transition-all"
            title="تغییر تم"
          >
            {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Middle Column: Unified Clock capsule */}
      <div className="hidden lg:flex items-center justify-center shrink-0">
        <div className="px-5 py-1.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-full">
          <ImperialClock />
        </div>
      </div>

      {/* Left Column: Row of Action Items */}
      <div className="flex items-center flex-wrap justify-center gap-3 w-full md:w-auto md:justify-end border-t border-[var(--border-color)] pt-3 md:pt-0 md:border-t-0">
        
        {/* Layout Switcher Buttons Inside Header */}
        <div className="flex items-center p-0.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl shadow-inner gap-0.5 shrink-0">
          <button
            onClick={() => handleTogglePosition("top")}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[var(--accent3)] text-black shadow-sm transition-all"
            title="نمای پهن بالا"
          >
            <PanelTop className="w-3 h-3" />
            <span className="hidden sm:inline">هدر بالا</span>
          </button>
          <button
            onClick={() => handleTogglePosition("left")}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-all"
            title="نمای ستونی چپ"
          >
            <PanelLeft className="w-3 h-3" />
            <span className="hidden sm:inline">منوی چپ</span>
          </button>
        </div>

        {/* Dashboard Grid columns layout switcher (Standard 1, 2, 3 columns tabs) */}
        <div className="flex items-center bg-[var(--bg-main)] border border-[var(--border-color)] p-0.5 rounded-xl text-xs gap-0.5 shrink-0">
          <button
            onClick={() => setGroupsCols(1)}
            aria-label="تک ستون"
            className={`p-1.5 rounded-lg transition-all ${groupsCols === 1 ? 'bg-[var(--accent3-transparent)] text-[var(--accent3)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
            title="نمایش تک ستونه"
          >
            <Columns2 className="w-3.5 h-3.5 rotate-90" />
          </button>
          <button
            onClick={() => setGroupsCols(2)}
            aria-label="دو ستون"
            className={`p-1.5 rounded-lg transition-all ${groupsCols === 2 ? 'bg-[var(--accent3-transparent)] text-[var(--accent3)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
            title="نمایش دو ستونه"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setGroupsCols(3)}
            aria-label="سه ستون"
            className={`p-1.5 rounded-lg transition-all ${groupsCols === 3 ? 'bg-[var(--accent3-transparent)] text-[var(--accent3)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
            title="نمایش سه ستونه"
          >
            <LayoutGrid className="w-3.5 h-3.5 scale-x-110" />
          </button>
        </div>

        {/* Functional drawer triggers */}
        <div className="flex items-center gap-2">
          {/* Modules Control Dialog */}
          <button
            onClick={() => setIsModulesMenuOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 md:py-2 bg-[var(--card-bg-solid)] hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] rounded-xl text-xs font-semibold text-[var(--text-secondary)] transition-all hover:border-[var(--accent4)] active:scale-[0.97]"
            title="مدیریت ماژول‌ها"
          >
            <Layers className="w-3.5 h-3.5 text-[var(--accent4)]" />
            <span>ماژول‌ها</span>
          </button>

          {/* ESP Synchronization Dialog */}
          <button
            onClick={() => setIsEspDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 md:py-2 bg-[var(--card-bg-solid)] hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] rounded-xl text-xs font-semibold text-[var(--text-secondary)] transition-all hover:border-[var(--accent3)] active:scale-[0.97]"
            title="همگام‌سازی ESP32"
          >
            <Cpu className="w-3.5 h-3.5 text-[var(--accent3)]" />
            <span>تراشه</span>
          </button>

          {/* Master Settings Dialog */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 md:p-2.5 bg-[var(--card-bg-solid)] hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all hover:border-[var(--accent3)] active:scale-[0.97]"
            title="تنظیمات سامانه"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* Standard simple theme mode toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="hidden md:flex p-2 md:p-2.5 bg-[var(--card-bg-solid)] hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all active:scale-[0.97]"
            title="تغییر تم"
          >
            {isDark ? <Sun className="w-4 h-4 text-orange-450" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>

      </div>
    </div>
  );
}
