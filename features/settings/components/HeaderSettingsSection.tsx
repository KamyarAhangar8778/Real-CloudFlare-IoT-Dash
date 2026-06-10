"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { LayoutGrid, ChevronLeft, PanelTop, PanelLeft } from "lucide-react";
import { BUTTON_CLIP, ACCORDION_CLIP } from "@/lib/presets";

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
    if (typeof window !== "undefined") {
      localStorage.setItem("achaemenid_header_anim", type);
    }
  };

  const handleTitleChange = (val: string) => {
    setHeaderTitle(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("achaemenid_header_title", val);
    }
  };

  const handleResetTitle = () => {
    const defaultTitle = "سامانه هوشمند پادشاهی بومی";
    setHeaderTitle(defaultTitle);
    if (typeof window !== "undefined") {
      localStorage.setItem("achaemenid_header_title", defaultTitle);
    }
  };

  const handlePositionChange = (pos: "top" | "left") => {
    setHeaderPosition(pos);
    if (typeof window !== "undefined") {
      localStorage.setItem("cloudflare_layout_header_position", pos);
    }
  };

  const renderContent = () => (
    <div className="space-y-4 text-right">
      {/* Position switcher */}
      <div className="space-y-2">
        <span className="font-bold text-[10px] text-accent3 tracking-wide block">
          موقعیت قرارگیری هدر داشبورد (طرح کلودفلر)
        </span>
        <p className="text-[9px] theme-text-tertiary">
          محل نمایش و ساختار هدر و منوهای کنترلی را انتخاب کنید:
        </p>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {/* Position 1: Top */}
          <button
            onClick={() => handlePositionChange("top")}
            className="p-2.5 text-right transition-all border flex items-center justify-between hover:border-accent3 cursor-pointer w-full"
            style={{
              clipPath: BUTTON_CLIP,
              borderColor: headerPosition === "top" ? "var(--accent4)" : "var(--border-color)",
              backgroundColor: headerPosition === "top" ? "var(--accent4-transparent)" : "rgba(255, 255, 255, 0.01)"
            }}
          >
            <PanelTop className="w-4 h-4 text-[var(--accent4)]" />
            <span className="font-bold text-xs theme-text-primary">
              هدر پهن بالا
            </span>
          </button>

          {/* Position 2: Left */}
          <button
            onClick={() => handlePositionChange("left")}
            className="p-2.5 text-right transition-all border flex items-center justify-between hover:border-accent3 cursor-pointer w-full"
            style={{
              clipPath: BUTTON_CLIP,
              borderColor: headerPosition === "left" ? "var(--accent4)" : "var(--border-color)",
              backgroundColor: headerPosition === "left" ? "var(--accent4-transparent)" : "rgba(255, 255, 255, 0.01)"
            }}
          >
            <PanelLeft className="w-4 h-4 text-[var(--accent4)]" />
            <span className="font-bold text-xs theme-text-primary">
              منوی ستونی چپ
            </span>
          </button>
        </div>
      </div>

      {/* Custom Header Title Input Field */}
      <div className="border-t border-accent3-medium/20 pt-3 space-y-2">
        <div className="flex items-center justify-between">
          <button
            onClick={handleResetTitle}
            className="text-[9px] text-accent3 hover:text-accent4 transition-colors underline decoration-dotted cursor-pointer"
          >
            بازنشانی عنوان
          </button>
          <span className="font-bold text-[10px] text-accent3 tracking-wide">
            عنوان هدر هوشمند
          </span>
        </div>
        
        <input
          type="text"
          value={headerTitle}
          onChange={(e) => handleTitleChange(e.target.value)}
          maxLength={50}
          className="w-full px-3 py-2 text-xs text-right theme-card-bg-solid border border-accent3-medium/60 text-white rounded focus:outline-none focus:border-accent4 transition-colors"
          style={{ clipPath: BUTTON_CLIP }}
          placeholder="مثال: داشبورد هوشمند کاربری"
        />
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
        onClick={() => toggleSection && toggleSection("header-settings")}
        className="w-full py-3 px-4 bg-[var(--card-bg-solid)] flex items-center justify-between text-right cursor-pointer"
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
