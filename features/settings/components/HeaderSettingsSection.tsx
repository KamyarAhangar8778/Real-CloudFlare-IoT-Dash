"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { LayoutGrid, ChevronLeft } from "lucide-react";
import { BUTTON_CLIP, ACCORDION_CLIP } from "@/lib/presets";

interface HeaderSettingsSectionProps {
  headerAnimationType: "fade" | "chase";
  setHeaderAnimationType: (val: "fade" | "chase") => void;
  headerTitle: string;
  setHeaderTitle: (val: string) => void;
  expandedSection: string | null;
  toggleSection: (section: string) => void;
}

export default function HeaderSettingsSection({
  headerAnimationType,
  setHeaderAnimationType,
  headerTitle,
  setHeaderTitle,
  expandedSection,
  toggleSection
}: HeaderSettingsSectionProps) {
  const isExpanded = expandedSection === "header-settings";

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
    const defaultTitle = "سامانه هوشمند پادشاهی هخامنش";
    setHeaderTitle(defaultTitle);
    if (typeof window !== "undefined") {
      localStorage.setItem("achaemenid_header_title", defaultTitle);
    }
  };

  return (
    <div
      className="border border-accent3-medium overflow-hidden transition-all duration-300"
      style={{ clipPath: ACCORDION_CLIP }}
    >
      <button
        onClick={() => toggleSection("header-settings")}
        className="w-full py-3 px-4 bg-[var(--card-bg-solid)] flex items-center justify-between text-right cursor-pointer"
      >
        <ChevronLeft
          className="w-4 h-4 text-accent3 transition-transform duration-300"
          style={{ transform: isExpanded ? "rotate(-90deg)" : "rotate(0deg)" }}
        />
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold theme-text-primary">تنظیمات هدر داشبورد</span>
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
            className="theme-card-bg-solid border-t border-accent3-medium/30 p-4 space-y-3 overflow-hidden text-right"
          >
            <p className="text-[10px] theme-text-tertiary leading-relaxed">
              افکت حرکتی بردر جزیره‌های سه‌گانه بالای صفحه را متناسب با سلیقه خود تغییر دهید:
            </p>

            <div className="grid grid-cols-1 gap-2">
              {/* Option 1: Fade */}
              <button
                onClick={() => handleSelectOption("fade")}
                className="p-2.5 text-right transition-all border flex flex-col justify-center hover:border-accent3 cursor-pointer w-full"
                style={{
                  clipPath: BUTTON_CLIP,
                  borderColor: headerAnimationType === "fade" ? "var(--accent4)" : "var(--border-color)",
                  backgroundColor: headerAnimationType === "fade" ? "var(--accent4-transparent)" : "rgba(255, 255, 255, 0.01)"
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${headerAnimationType === "fade" ? "border-accent4" : "border-gray-500"}`}>
                    {headerAnimationType === "fade" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-accent4" style={{ backgroundColor: "var(--accent4)" }} />
                    )}
                  </div>
                  <span className="font-bold text-xs theme-text-primary">
                    محو خطی (راست به چپ)
                  </span>
                </div>
                <span className="text-[9px] theme-text-muted mt-0.5">
                  تغییر رنگ ملایم بردر بین زرهای ناب و فیروزه‌های درخشان
                </span>
              </button>

              {/* Option 2: Chase */}
              <button
                onClick={() => handleSelectOption("chase")}
                className="p-2.5 text-right transition-all border flex flex-col justify-center hover:border-accent3 cursor-pointer w-full"
                style={{
                  clipPath: BUTTON_CLIP,
                  borderColor: headerAnimationType === "chase" ? "var(--accent4)" : "var(--border-color)",
                  backgroundColor: headerAnimationType === "chase" ? "var(--accent4-transparent)" : "rgba(255, 255, 255, 0.01)"
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${headerAnimationType === "chase" ? "border-accent4" : "border-gray-500"}`}>
                    {headerAnimationType === "chase" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-accent4" style={{ backgroundColor: "var(--accent4)" }} />
                    )}
                  </div>
                  <span className="font-bold text-xs theme-text-primary">
                    چرخش به دور هر جزیره (چیس)
                  </span>
                </div>
                <span className="text-[9px] theme-text-muted mt-0.5">
                  جریان یافتن پویا و بی‌پایان رنگ‌های ناب دور تا دور جزیره‌های سه‌گانه
                </span>
              </button>
            </div>

            {/* Custom Header Title Input Field */}
            <div className="border-t border-accent3-medium/20 pt-3 mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleResetTitle}
                  className="text-[9px] text-accent3 hover:text-accent4 transition-colors underline decoration-dotted cursor-pointer"
                  title="بازگرداندن عنوان به شکل پیش‌فرض شاهنشاهی"
                >
                  بازنشانی به پیش‌فرض
                </button>
                <span className="font-bold text-[10px] text-accent3 tracking-wide">
                  عنوان هدر سامانه و جزیره اول
                </span>
              </div>
              
              <input
                type="text"
                value={headerTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                maxLength={50}
                className="w-full px-3 py-2 text-xs text-right theme-card-bg-solid border border-accent3-medium/60 text-white rounded focus:outline-none focus:border-accent4 transition-colors"
                style={{ clipPath: BUTTON_CLIP }}
                placeholder="مثال: سامانه هوشمند پادشاهی هخامنش"
              />
              <p className="text-[9px] theme-text-muted leading-tight">
                با تغییر این متن، نوشته‌ی زرین حک شده بر روی جزیره‌ی راست هدر تغییر خواهد کرد.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
