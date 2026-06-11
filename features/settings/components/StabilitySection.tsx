"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, ChevronLeft, WifiOff, Globe, Server, CloudLightning, ShieldCheck } from "lucide-react";
import { BUTTON_CLIP, ACCORDION_CLIP } from "@/lib/presets";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { 
  getCloudflareWorkerUrl, 
  setCloudflareWorkerUrl, 
  isCloudflareEnabled 
} from "@/features/iot/services/cloudflareService";

interface StabilitySectionProps {
  animationsEnabled: boolean;
  setAnimationsEnabled: (val: boolean) => void;
  expandedSection?: string | null;
  toggleSection?: (section: string) => void;
  hideHeader?: boolean;
  isDark?: boolean;
}

export default function StabilitySection({
  animationsEnabled,
  setAnimationsEnabled,
  expandedSection,
  toggleSection,
  hideHeader = false,
  isDark = true
}: StabilitySectionProps) {
  const isExpanded = hideHeader ? true : expandedSection === "animations";
  const { lowDataMode, setLowDataMode } = useIoTStore();
  const [cfUrl, setCfUrl] = useState(() => getCloudflareWorkerUrl());

  const handleCfUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCfUrl(val);
    setCloudflareWorkerUrl(val);
  };

  const isCfConnected = isCloudflareEnabled();

  const renderContent = () => (
    <div className="space-y-4 text-right">
      {/* Module 1: Animations Toggle */}
      <div className="space-y-2 border-b border-accent3-medium/10 pb-4">
        <p className="text-[10px] theme-text-tertiary leading-relaxed">
          اگر دستگاه شما با تاخیر یا بار پردازشی بالایی مواجه است، انیمیشن‌های سنگین یا ترنزیشن‌های حرکتی را متوقف کنید:
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
            <span className={`font-sans font-extrabold text-xs block transition-colors duration-300 ${
              animationsEnabled
                ? "text-emerald-500" 
                : isDark ? "text-gray-200" : "text-slate-800"
            }`}>
              {animationsEnabled ? "انیمیشن‌های بورد: فعال تابان" : "انیمیشن‌های بورد: غیرفعال ساکن"}
            </span>
            <span className={`text-[9px] block leading-normal font-sans font-medium transition-colors duration-300 ${
              isDark ? "text-gray-400 group-hover:text-gray-300" : "text-slate-500 group-hover:text-slate-600"
            }`}>
              {animationsEnabled ? "شکوه کامل بصری و جلوه‌های متحرک فعال" : "بهینه‌سازی کامل منابع و پردازش سخت‌افزار"}
            </span>
          </div>
          
          {/* Modern Premium Toggle Switch */}
          <div className={`relative inline-flex h-6 w-11 rounded-full p-0.5 items-center transition-all duration-300 shrink-0 cursor-pointer focus:outline-none select-none hover:scale-110 active:scale-95 hover:brightness-110 ${
            animationsEnabled 
              ? "bg-[var(--accent4)] shadow-[0_0_8px_var(--accent4-transparent)]" 
              : isDark
                ? "bg-black/30 border border-slate-800/40"
                : "bg-slate-200 border border-slate-300"
          }`}>
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

      {/* Module 2: Low-Data Mode Toggle */}
      <div className="border-b border-accent3-medium/10 pb-4 space-y-2">
        <p className="text-[10px] theme-text-tertiary leading-relaxed">
          اگر در مصرف اینترنت با محدودیت حجم روبرو هستید، سامانه را در حالت کم‌مصرف قرار دهید تا دریافت‌های خودکار متوقف شده و مصرف پس‌زمینه کاملاً مهار گردد:
        </p>

        <button
          onClick={() => setLowDataMode(!lowDataMode)}
          className={`w-full p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer text-right group ${
            lowDataMode
              ? isDark
                ? "bg-amber-950/20 border-accent3/60 shadow-[0_0_12px_rgba(212,175,55,0.1)]"
                : "bg-amber-50/80 border-amber-300 shadow-[0_2px_4px_rgba(212,175,55,0.06)]"
              : isDark
                ? "bg-slate-950/40 border-slate-800 hover:border-slate-700"
                : "bg-slate-50/80 border-slate-200 hover:border-slate-300 shadow-sm"
          }`}
        >
          {/* Text Info */}
          <div className="text-right space-y-0.5 max-w-[70%]">
            <span className={`font-sans font-extrabold text-xs block flex items-center gap-1 w-full justify-end transition-colors duration-300 ${
              lowDataMode
                ? isDark ? "text-[rgba(212,175,55,1)]" : "text-amber-600"
                : isDark ? "text-gray-200" : "text-slate-800"
            }`}>
              <span>{lowDataMode ? "حالت کم‌مصرف اینترنت: روشن" : "حالت کم‌مصرف اینترنت: خاموش"}</span>
              <WifiOff className={`w-3.5 h-3.5 ${lowDataMode ? "text-accent3" : isDark ? "text-gray-400" : "text-slate-500"}`} />
            </span>
            <span className={`text-[9px] block leading-normal font-sans font-medium transition-colors duration-300 ${
              isDark ? "text-gray-400 group-hover:text-gray-300" : "text-slate-500 group-hover:text-slate-600"
            }`}>
              {lowDataMode ? "غیرفعال‌سازی همگام‌سازی ۳ ثانیه‌ای زنده (دریافت اطلاعات فقط با رفرش دستی شما)" : "همگام‌سازی هوشمند زنده و پویای هر ۳ ثانیه از سرور ابری"}
            </span>
          </div>
          
          {/* Modern Premium Toggle Switch */}
          <div className={`relative inline-flex h-6 w-11 rounded-full p-0.5 items-center transition-all duration-300 shrink-0 cursor-pointer focus:outline-none select-none hover:scale-110 active:scale-95 hover:brightness-110 ${
            lowDataMode 
              ? "bg-[var(--accent4)] shadow-[0_0_8px_var(--accent4-transparent)]" 
              : isDark
                ? "bg-black/30 border border-slate-800/40"
                : "bg-slate-200 border border-slate-300"
          }`}>
            <span
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-[var(--text-primary)] shadow-md transform ${
                animationsEnabled 
                  ? "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" 
                  : ""
              } ${
                lowDataMode ? "-translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </button>
      </div>

      {/* Module 3: Cloudflare Integration Section */}
      <div className="pt-2 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] theme-text-tertiary">Cloudflare Workers KV & Durable Objects</span>
          <span className="font-bold text-[11px] text-accent3">اتصال هوشمند کلودفلر</span>
        </div>
        
        <p className="text-[10px] theme-text-tertiary leading-relaxed">
          برای ذخیره‌سازی ابری و دائم ساختار چیدمان (Cloudflare KV) و نظارت بر شیرها و سوییچ‌ها (Durable Objects)، آدرس ورکر خود را وارد کنید:
        </p>

        <div className="relative mt-1">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Globe className="h-4 w-4 text-accent3 opacity-70" />
          </div>
          <input
            type="text"
            dir="ltr"
            value={cfUrl}
            onChange={handleCfUrlChange}
            placeholder="https://my-iot-worker.subdomain.workers.dev"
            className="block w-full py-2.5 pr-10 pl-3 border border-accent3-medium/30 rounded-xl bg-black/40 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-accent3 font-mono transition-all"
          />
        </div>

        {/* Status Indicator Bar */}
        <div className={`p-3 rounded-xl border flex items-center justify-between text-right text-[10px] ${
          isCfConnected
            ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-400"
            : "bg-slate-950/40 border-slate-800 text-slate-400"
        }`}>
          <div className="flex items-center gap-1.5 justify-end w-full">
            <span className="font-bold">
              {isCfConnected 
                ? "سیستم روی حالت ذخیره‌سازی کلودفلر (ابر زنده) تنظیم شده است." 
                : "پخش آفلاین / حافظه محلی فعال است (ورکر تنظیم نشده است)."}
            </span>
            {isCfConnected ? (
              <CloudLightning className="w-3.5 h-3.5 text-emerald-400 animate-pulse animate-[pulse_2s_infinite]" />
            ) : (
              <Server className="w-3.5 h-3.5 text-slate-400" />
            )}
          </div>
        </div>
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
        onClick={() => toggleSection && toggleSection("animations")}
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
            {renderContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
