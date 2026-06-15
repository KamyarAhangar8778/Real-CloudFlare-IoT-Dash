"use client";

import React from "react";

interface AnimationsToggleProps {
  animationsEnabled: boolean;
  setAnimationsEnabled: (val: boolean) => void;
  isDark?: boolean;
}

export default function AnimationsToggle({
  animationsEnabled,
  setAnimationsEnabled,
  isDark = true,
}: AnimationsToggleProps) {
  return (
    <div className="space-y-2 border-b border-accent3-medium/10 pb-4">
      <p className="text-[10px] theme-text-tertiary leading-relaxed">
        اگر دستگاه شما با تاخیر یا بار پردازشی بالایی مواجه است، انیمیشن‌های سنگین یا ترنزیشن‌های
        حرکتی را متوقف کنید:
      </p>

      <button
        onClick={() => setAnimationsEnabled(!animationsEnabled)}
        className={`w-full p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer text-right group ${
          animationsEnabled
            ? isDark
              ? "bg-emerald-950/20 border-accent4/60 shadow-[0_0_12px_rgba(16,185,129,0.1)]"
              : "bg-emerald-50 border-emerald-300 shadow-[0_2px_4px_rgba(16,185,129,0.06)]"
            : isDark
              ? "bg-slate-950/40 border-slate-800 hover:border-slate-700"
              : "bg-slate-50/80 border-slate-200 hover:border-slate-300 shadow-sm"
        }`}
      >
        {/* Text Info */}
        <div className="text-right space-y-0.5 max-w-[70%]">
          <span
            className={`font-sans font-extrabold text-xs block transition-colors duration-300 ${
              animationsEnabled ? "text-emerald-500" : isDark ? "text-gray-200" : "text-slate-800"
            }`}
          >
            {animationsEnabled ? "انیمیشن‌های بورد: فعال تابان" : "انیمیشن‌های بورد: غیرفعال ساکن"}
          </span>
          <span
            className={`text-[9px] block leading-normal font-sans font-medium transition-colors duration-300 ${
              isDark
                ? "text-gray-400 group-hover:text-gray-300"
                : "text-slate-500 group-hover:text-slate-600"
            }`}
          >
            {animationsEnabled
              ? "شکوه کامل بصری و جلوه‌های متحرک فعال"
              : "بهینه‌سازی کامل منابع و پردازش سخت‌افزار"}
          </span>
        </div>

        {/* Modern Premium Toggle Switch */}
        <div
          className={`relative inline-flex h-6 w-11 rounded-full p-0.5 items-center transition-all duration-300 shrink-0 cursor-pointer focus:outline-none select-none hover:scale-110 active:scale-95 hover:brightness-110 ${
            animationsEnabled
              ? "bg-[var(--accent4)] shadow-[0_0_8px_var(--accent4-transparent)]"
              : isDark
                ? "bg-black/30 border border-slate-800/40"
                : "bg-slate-200 border border-slate-300"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-[var(--text-primary)] shadow-md transform ${
              animationsEnabled
                ? "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] -translate-x-5"
                : "translate-x-0"
            }`}
          />
        </div>
      </button>
    </div>
  );
}
