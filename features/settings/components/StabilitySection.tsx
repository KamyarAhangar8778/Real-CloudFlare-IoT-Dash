"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, ChevronLeft, WifiOff } from "lucide-react";
import { BUTTON_CLIP, ACCORDION_CLIP } from "@/lib/presets";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

interface StabilitySectionProps {
  animationsEnabled: boolean;
  setAnimationsEnabled: (val: boolean) => void;
  expandedSection: string | null;
  toggleSection: (section: string) => void;
}

export default function StabilitySection({
  animationsEnabled,
  setAnimationsEnabled,
  expandedSection,
  toggleSection
}: StabilitySectionProps) {
  const isExpanded = expandedSection === "animations";
  const { lowDataMode, setLowDataMode } = useIoTStore();

  return (
    <div
      className="border border-accent3-medium overflow-hidden transition-all duration-300"
      style={{ clipPath: ACCORDION_CLIP }}
    >
      <button
        onClick={() => toggleSection("animations")}
        className="w-full py-3 px-4 bg-[var(--card-bg-solid)] flex items-center justify-between text-right cursor-pointer"
      >
        <ChevronLeft
          className="w-4 h-4 text-accent3 transition-transform duration-300"
          style={{ transform: isExpanded ? "rotate(-90deg)" : "rotate(0deg)" }}
        />
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold theme-text-primary">کنترل پایداری و بهینه‌سازی</span>
          <Activity className="w-4 h-4 text-accent4" style={{ color: "var(--accent4)" }} />
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
            <div>
              <p className="text-[10px] theme-text-tertiary leading-relaxed mb-2">
                اگر دستگاه شما با تاخیر یا بار پردازشی بالایی مواجه است، انیمیشن‌های سنگین یا ترنزیشن‌های حرکتی را متوقف کنید:
              </p>

              <button
                onClick={() => setAnimationsEnabled(!animationsEnabled)}
                className="w-full p-3 text-right transition-all theme-card-bg-solid border flex items-center justify-between hover:border-accent3 cursor-pointer"
                style={{
                  clipPath: BUTTON_CLIP,
                  borderColor: animationsEnabled ? "var(--accent4)" : "var(--accent3-medium)",
                  backgroundColor: animationsEnabled ? "var(--accent4-transparent)" : "rgba(255, 255, 255, 0.02)"
                }}
              >
                <div className="text-right">
                  <span className="font-bold text-xs theme-text-primary block">
                    {animationsEnabled ? "انیمیشن‌های بورد: فعال تابان" : "انیمیشن‌های بورد: غیرفعال ساکن"}
                  </span>
                  <span className="text-[9px] theme-text-muted block mt-0.5">
                    {animationsEnabled ? "شکوه کامل بصری و جلوه‌های متحرک فعال" : "بهینه‌سازی کامل منابع و پردازش سخت‌افزار"}
                  </span>
                </div>
                
                <div className={`w-10 h-6 border p-0.5 flex items-center transition-all duration-300 ${animationsEnabled ? 'border-accent4 bg-accent4/20' : 'border-gray-600 bg-gray-900'}`} style={{ clipPath: BUTTON_CLIP }}>
                  <div 
                    className={`w-4 h-4 transition-all duration-300 ${animationsEnabled ? 'bg-accent4 translate-x-3.5' : 'bg-gray-500 translate-x-0'}`}
                    style={{ 
                      backgroundColor: animationsEnabled ? "var(--accent4)" : "",
                      clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"
                    }}
                  />
                </div>
              </button>
            </div>

            <div className="border-t border-accent3-medium/10 pt-4">
              <p className="text-[10px] theme-text-tertiary leading-relaxed mb-2">
                اگر در مصرف اینترنت با محدودیت حجم روبرو هستید، سامانه را در حالت کم‌مصرف قرار دهید تا دریافت‌های خودکار متوقف شده و مصرف پس‌زمینه کاملاً مهار گردد:
              </p>

              <button
                onClick={() => setLowDataMode(!lowDataMode)}
                className="w-full p-3 text-right transition-all theme-card-bg-solid border flex items-center justify-between hover:border-accent3 cursor-pointer"
                style={{
                  clipPath: BUTTON_CLIP,
                  borderColor: lowDataMode ? "var(--accent3)" : "rgba(255, 255, 255, 0.1)",
                  backgroundColor: lowDataMode ? "rgba(212, 175, 55, 0.08)" : "rgba(255, 255, 255, 0.02)"
                }}
              >
                <div className="text-right">
                  <span className="font-bold text-xs theme-text-primary block flex items-center gap-1 w-full justify-end">
                    <span>{lowDataMode ? "حالت کم‌مصرف اینترنت: روشن" : "حالت کم‌مصرف اینترنت: خاموش"}</span>
                    <WifiOff className="w-3.5 h-3.5 text-accent3" style={{ color: "var(--accent3)" }} />
                  </span>
                  <span className="text-[9px] theme-text-muted block mt-0.5">
                    {lowDataMode ? "غیرفعال‌سازی همگام‌سازی ۳ ثانیه‌ای زنده (دریافت اطلاعات فقط با رفرش دستی شما)" : "همگام‌سازی هوشمند زنده و پویای هر ۳ ثانیه از سرور ابری"}
                  </span>
                </div>
                
                <div className={`w-10 h-6 border p-0.5 flex items-center transition-all duration-300 ${lowDataMode ? 'border-accent3 bg-accent3/20' : 'border-gray-600 bg-gray-900'}`} style={{ clipPath: BUTTON_CLIP }}>
                  <div 
                    className={`w-4 h-4 transition-all duration-300 ${lowDataMode ? 'bg-accent3 translate-x-3.5' : 'bg-gray-500 translate-x-0'}`}
                    style={{ 
                      backgroundColor: lowDataMode ? "var(--accent3)" : "",
                      clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"
                    }}
                  />
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
