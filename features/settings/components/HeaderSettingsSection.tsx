"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { LayoutGrid, ChevronLeft, PanelTop, PanelLeft } from "lucide-react";

interface HeaderSettingsSectionProps {
  headerAnimationType: "fade" | "chase";
  setHeaderAnimationType: (val: "fade" | "chase") => void;
  headerTitle: string;
  setHeaderTitle: (val: string) => void;
  expandedSection?: string | null;
  toggleSection?: (section: string) => void;
  headerPosition: "top" | "left";
  setHeaderPosition: (val: "top" | "left") => void;
  hideHeader?: boolean;
}

export default function HeaderSettingsSection({
  headerAnimationType,
  setHeaderAnimationType,
  headerTitle,
  setHeaderTitle,
  expandedSection,
  toggleSection,
  headerPosition,
  setHeaderPosition,
  hideHeader = false
}: HeaderSettingsSectionProps) {
  const isExpanded = hideHeader ? true : expandedSection === "header-settings";

  const handleSelectOption = (type: "fade" | "chase") => {
    setHeaderAnimationType(type);
  };

  const handleTitleChange = (val: string) => {
    setHeaderTitle(val);
  };

  const handleResetTitle = () => {
    const defaultTitle = "سامانه هوشمند پادشاهی بومی";
    setHeaderTitle(defaultTitle);
  };

  const handlePositionChange = (pos: "top" | "left") => {
    setHeaderPosition(pos);
  };

  const renderContent = () => (
    <div className="space-y-4 text-right font-sans">
      {/* Position switcher */}
      <div className="space-y-3">
        <span className="font-bold text-[10px] theme-text-secondary tracking-wide block">
          موقعیت قرارگیری هدر داشبورد
        </span>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {/* Position 1: Top */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePositionChange("top")}
            className={`p-3 text-right transition-all border rounded-xl flex items-center justify-between cursor-pointer w-full ${
              headerPosition === "top"
                ? "border-[var(--accent4)] bg-[var(--accent4-transparent)] shadow-[0_0_12px_var(--accent4-transparent)]"
                : "border-[var(--border-color)] hover:border-[var(--accent4)]/60 bg-black/10 hover:bg-black/20"
            }`}
          >
            <PanelTop className={`w-4 h-4 ${headerPosition === "top" ? "text-[var(--accent4)]" : "theme-text-muted"}`} />
            <span className={`font-bold text-[11px] ${headerPosition === "top" ? "theme-text-primary" : "theme-text-secondary"}`}>
              هدر پهن بالا
            </span>
          </motion.button>

          {/* Position 2: Left */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePositionChange("left")}
            className={`p-3 text-right transition-all border rounded-xl flex items-center justify-between cursor-pointer w-full ${
              headerPosition === "left"
                 ? "border-[var(--accent4)] bg-[var(--accent4-transparent)] shadow-[0_0_12px_var(--accent4-transparent)]"
                 : "border-[var(--border-color)] hover:border-[var(--accent4)]/60 bg-black/10 hover:bg-black/20"
            }`}
          >
            <PanelLeft className={`w-4 h-4 ${headerPosition === "left" ? "text-[var(--accent4)]" : "theme-text-muted"}`} />
            <span className={`font-bold text-[11px] ${headerPosition === "left" ? "theme-text-primary" : "theme-text-secondary"}`}>
              منوی ستونی چپ
            </span>
          </motion.button>
        </div>
      </div>

      {/* Custom Header Title Input Field */}
      <div className="border-t border-[var(--border-color)] pt-3 space-y-2">
        <div className="flex items-center justify-between">
          <button
            onClick={handleResetTitle}
            className="text-[9.5px] theme-text-tertiary hover:text-[var(--accent4)] transition-colors underline decoration-dotted cursor-pointer"
          >
            بازنشانی عنوان
          </button>
          <span className="font-bold text-[10px] theme-text-secondary tracking-wide">
            عنوان هدر هوشمند
          </span>
        </div>
        
        <input
          type="text"
          value={headerTitle}
          onChange={(e) => handleTitleChange(e.target.value)}
          maxLength={50}
          className="w-full px-3 py-2.5 text-[11px] text-right bg-black/20 border border-[var(--border-color)] theme-text-primary rounded-xl focus:outline-none focus:border-[var(--accent4)] transition-colors"
          placeholder="مثال: داشبورد هوشمند کاربری"
        />
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
        onClick={() => toggleSection && toggleSection("header-settings")}
        className="w-full py-3 px-4 bg-[var(--card-bg-solid)] flex items-center justify-between text-right cursor-pointer hover:bg-[var(--card-hover-bg)] transition-colors"
      >
        <ChevronLeft
          className="w-4 h-4 text-accent3 transition-transform duration-300"
          style={{ transform: isExpanded ? "rotate(-90deg)" : "rotate(0deg)" }}
        />
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold theme-text-primary">موقعیت و تنظیمات هدر</span>
          <LayoutGrid className="w-4 h-4 text-accent4" style={{ color: "var(--accent4)" }} />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="theme-card-bg-solid border-t border-accent3-medium/30 p-4 space-y-4 overflow-hidden text-right"
          >
            {renderContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
