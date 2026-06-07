"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Settings as SettingsIcon, CheckCircle2 } from "lucide-react";
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
}

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
  isDark
}: SettingsDrawerProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
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
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 cursor-pointer"
          />

          {/* Elegant Right-Floating Settings Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 24, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-gradient-to-b from-[var(--drawer-gradient-from)] to-[var(--drawer-gradient-to)] border-l border-accent3-medium shadow-2xl z-50 overflow-y-auto px-6 py-8 text-right flex flex-col justify-between transition-colors duration-500"
          >
            {/* Drawer Content */}
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-accent3-medium pb-4">
                <button
                  onClick={onClose}
                  className="p-1.5 theme-card-bg-solid border theme-border theme-text-tertiary hover:text-accent3 transition-all cursor-pointer"
                  style={{ clipPath: BUTTON_CLIP }}
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
                    <SettingsIcon className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* MODULAR ACCORDION CONFIGURATIONS */}
              <div className="space-y-4">
                {/* ACCORDION MODULE 1: CUSTOM ACCENT COLOR SOLVER */}
                <ColorsSection
                  accent3={accent3}
                  setAccent3={setAccent3}
                  accent4={accent4}
                  setAccent4={setAccent4}
                  isDark={isDark}
                  expandedSection={expandedSection}
                  toggleSection={toggleSection}
                />

                {/* ACCORDION MODULE 2: TYPOGRAPHY CONFIGURATION */}
                <TypographySection
                  selectedFont={selectedFont}
                  setSelectedFont={setSelectedFont}
                  expandedSection={expandedSection}
                  toggleSection={toggleSection}
                />

                {/* ACCORDION MODULE 3: ANIMATIONS AND STABILITY CONTROL */}
                <StabilitySection
                  animationsEnabled={animationsEnabled}
                  setAnimationsEnabled={setAnimationsEnabled}
                  expandedSection={expandedSection}
                  toggleSection={toggleSection}
                />

                {/* ACCORDION MODULE 4: DASHBOARD HEADER SETTINGS */}
                <HeaderSettingsSection
                  headerAnimationType={headerAnimationType}
                  setHeaderAnimationType={setHeaderAnimationType}
                  headerTitle={headerTitle}
                  setHeaderTitle={setHeaderTitle}
                  expandedSection={expandedSection}
                  toggleSection={toggleSection}
                />

                {/* ACCORDION MODULE 5: ANCIENT CUNEIFORM BACKGROUND CONTROLS */}
                <CuneiformSection
                  cuneiformOpacity={cuneiformOpacity}
                  setCuneiformOpacity={setCuneiformOpacity}
                  cuneiformColor={cuneiformColor}
                  setCuneiformColor={setCuneiformColor}
                  expandedSection={expandedSection}
                  toggleSection={toggleSection}
                />
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
