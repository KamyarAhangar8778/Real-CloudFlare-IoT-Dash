"use client";
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Cpu, 
  RefreshCw, 
  CheckCircle, 
  Copy, 
  Download, 
  Upload, 
  AlertTriangle, 
  Terminal, 
  Settings, 
  FileJson,
  Plus,
  Play
} from "lucide-react";
import { BUTTON_CLIP, CLIP_DIAGONAL_TL_BR } from "@/lib/presets";
import { EspConfig, DEFAULT_ESP_CONFIG, validateEspConfig } from "@/features/iot/services/esp32Config";

interface EspSyncDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  // Current active page states
  isDark: boolean;
  accent3: string;
  accent4: string;
  selectedFont: string;
  animationsEnabled: boolean;
  headerAnimationType: "fade" | "chase";
  headerTitle: string;
  cuneiformOpacity: number;
  cuneiformColor: "accent3" | "accent4" | "white" | "muted";
  segments: Array<{ id: string; type: string; pin: string; title: string; group?: string; mode?: "switch" | "push" }>;
  groupsOrder: string[];
  groupConfigs: Record<string, { maxCols: number }>;
  groupsCols: number;
  pinsState: Record<string, boolean>;
  
  // Callback functions to sync dashboard states with imported JSON
  onApplyConfig: (config: EspConfig) => void;
}

export default function EspSyncDrawer({
  isOpen,
  onClose,
  isDark,
  accent3,
  accent4,
  selectedFont,
  animationsEnabled,
  headerAnimationType,
  headerTitle,
  cuneiformOpacity,
  cuneiformColor,
  segments,
  groupsOrder,
  groupConfigs,
  groupsCols,
  pinsState,
  onApplyConfig
}: EspSyncDrawerProps) {
  const [activeTab, setActiveTab] = useState<"sync" | "schema" | "editor">("sync");
  const [espIp, setEspIp] = useState("192.168.4.1");
  const [syncStatus, setSyncStatus] = useState<"synchronized" | "syncing" | "idle" | "error">("idle");
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Generate the current active state package as JSON config
  const getCurrentStateAsConfig = (): EspConfig => {
    return {
      version: "1.2.0-Achaemenid",
      device: {
        name: "سامانه مرزی پاسارگاد",
        chip: "ESP32-S3-WROOM-1",
        firmware: "v3.4.1-Achaemenid-OS",
        reboot_count: 14,
        last_boot: new Date().toISOString()
      },
      preferences: {
        theme_mode: isDark ? "dark" : "light",
        accent_color_3: accent3,
        accent_color_4: accent4,
        font_family: selectedFont,
        animations_enabled: animationsEnabled,
        header_animation: headerAnimationType,
        header_title: headerTitle,
        cuneiform_opacity: cuneiformOpacity,
        cuneiform_color: cuneiformColor
      },
      layout: {
        groups_order: groupsOrder,
        groups_cols: groupsCols,
        group_configs: groupConfigs
      },
      segments: segments.map(s => ({
        id: s.id,
        type: s.type,
        pin: s.pin,
        title: s.title,
        group: s.group || "Test",
        state: !!pinsState[s.pin],
        mode: s.mode || "switch"
      }))
    };
  };

  useEffect(() => {
    if (isOpen) {
      setJsonText(JSON.stringify(getCurrentStateAsConfig(), null, 2));
      setJsonError(null);
    }
  }, [isOpen]);

  const addLog = (msg: string) => {
    setSyncLogs(prev => [`[${new Date().toLocaleTimeString('fa-IR')}] ${msg}`, ...prev.slice(0, 25)]);
  };

  const startManualSync = async () => {
    setSyncStatus("syncing");
    addLog(`آغاز اتصال به درگاه تراشه ESP32 در آدرس http://${espIp}...`);
    
    // Simulate complex parsing and HTTP fetch process
    await new Promise(resolve => setTimeout(resolve, 1400));
    
    try {
      addLog("در حال درخواست دریافت فایل پیکربندی config.json...");
      await new Promise(resolve => setTimeout(resolve, 800));
      
      addLog("اتصال برقرار شد. در حال بارگیری و تفصیر کدهای دریافتی...");
      await new Promise(resolve => setTimeout(resolve, 600));

      // Successfully synced target. In real integration we would call fetch(http://${espIp}/config.json)
      // We will load a fresh customized config to demonstrate how the dashboard builds dynamically
      const fetchedConfig: EspConfig = {
        ...DEFAULT_ESP_CONFIG,
        preferences: {
          ...DEFAULT_ESP_CONFIG.preferences,
          header_title: "سامانه همگام پادشاهی اِسپادانا"
        }
      };
      
      onApplyConfig(fetchedConfig);
      setJsonText(JSON.stringify(fetchedConfig, null, 2));
      setSyncStatus("synchronized");
      addLog("موتور با موفقیت فایل JSON را تفصیر کرد و تمامی عناصر داشبورد را تطبیق داد.");
    } catch (e: any) {
      setSyncStatus("error");
      addLog(`خطا در اتصال: ${e.message || "آدرس تراشه پاسخگو نیست. اتصال را بررسی کنید."}`);
    }
  };

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (validateEspConfig(parsed)) {
        onApplyConfig(parsed);
        setJsonError(null);
        addLog("فایل JSON بومی با موفقیت ویرایش و بر روی داشبورد اعمال گردید.");
        
        // Brief success feedback animation
        setSyncStatus("synchronized");
        setTimeout(() => setSyncStatus("idle"), 2000);
      } else {
        setJsonError("فرمت فایل معتبر است اما ساختار کلیدهای اجباری با پروتکل Achaemenid مغایرت دارد.");
      }
    } catch (e: any) {
      setJsonError(`خطای گرامری JSON: ${e.message}`);
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addLog("کدرشته تنظیمات در حافظه پنهان کپی شد. آماده جهت نوشتن درون کدهای C++ آردوینو.");
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "config.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addLog("فایل config.json دانلود شد. فایل فوق را در LittleFS تراشه درون پوشه /data قرار دهید.");
  };

  const handleUploadLocalJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (validateEspConfig(parsed)) {
          onApplyConfig(parsed);
          setJsonText(text);
          setJsonError(null);
          addLog(`فایل پیکربندی ${file.name} با موفقیت بارگذاری و اعمال شد.`);
        } else {
          setJsonError("کلیدهای ساختاری پروتکل Achaemenid در فایل فوق یافت نشد.");
        }
      } catch (err: any) {
        setJsonError(`خطا در خواندن فایل ساختار یافته: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const backdropBackground = isDark
    ? `radial-gradient(circle at center, ${accent3}15 0%, ${accent4}08 50%, rgba(5,6,9,0.65) 100%)`
    : `radial-gradient(circle at center, ${accent3}0a 0%, ${accent4}05 50%, rgba(244,245,247,0.7) 100%)`;

  const backdropStyle: React.CSSProperties = {
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    background: backdropBackground,
    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          id="esp-sync-drawer-overlay" 
          className="fixed inset-0 z-50 flex justify-end"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={backdropStyle}
            className="absolute inset-0"
          />

          {/* Sidebar Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 150 }}
            className="relative w-full max-w-[580px] h-full theme-card-bg-solid border-l border-accent3-medium/30 rounded-l-[2.5rem] shadow-2xl flex flex-col overflow-hidden [&::-webkit-scrollbar]:hidden [scrollbar-width:none] text-right"
            dir="rtl"
          >
            {/* Elegant Header Slant */}
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-accent3 via-accent4 to-accent3" />

            {/* Inner Padding container */}
            <div className="flex flex-col h-full pt-6 p-6">
              {/* Drawer Top Row */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-color)]">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2.5 bg-[var(--accent3-transparent)] text-accent3"
                    style={{ clipPath: BUTTON_CLIP }}
                  >
                    <Cpu className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="font-sans font-extrabold text-base theme-text-primary uppercase tracking-wide">
                      موتور پردازش تافته (ESP32 Integration Core)
                    </h2>
                    <p className="text-[10px] theme-text-muted mt-0.5">
                      درگاه همگام‌سازی و تحلیل پروتکل‌های ارتباطی تراشه هوشمند
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={onClose}
                  whileHover={animationsEnabled ? { scale: 1.15, rotate: 90 } : undefined}
                  whileTap={animationsEnabled ? { scale: 0.9 } : undefined}
                  className="p-1.5 rounded-full theme-card-bg-solid border theme-border theme-text-tertiary hover:text-accent3 hover:border-accent3 transition-colors cursor-pointer focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Royal Tab Selector */}
              <div className="flex items-center gap-1.5 p-1 bg-black/30 border border-gray-800/10 rounded-lg mb-6 shrink-0">
                <button
                  onClick={() => setActiveTab("sync")}
                  className={`flex-1 py-2 text-xs font-bold transition-all duration-300 ${activeTab === "sync" ? "text-accent3 bg-[var(--accent3-transparent)] border border-[var(--accent3-medium)]" : "theme-text-muted hover:theme-text-primary"}`}
                  style={{ clipPath: BUTTON_CLIP }}
                >
                  <RefreshCw className="w-3.5 h-3.5 inline-block ml-1.5 animate-[spin_12s_linear_infinite]" />
                  همگام‌سازی آنلاین
                </button>
                <button
                  onClick={() => setActiveTab("editor")}
                  className={`flex-1 py-2 text-xs font-bold transition-all duration-300 ${activeTab === "editor" ? "text-accent4 bg-[var(--accent4-transparent)] border border-[var(--accent4-medium)]" : "theme-text-muted hover:theme-text-primary"}`}
                  style={{ clipPath: BUTTON_CLIP }}
                >
                  <FileJson className="w-3.5 h-3.5 inline-block ml-1.5" />
                  کدنامه زنده JSON
                </button>
                <button
                  onClick={() => setActiveTab("schema")}
                  className={`flex-1 py-2 text-xs font-bold transition-all duration-300 ${activeTab === "schema" ? "text-accent3 bg-[var(--accent3-transparent)] border border-[var(--accent3-medium)]" : "theme-text-muted hover:theme-text-primary"}`}
                  style={{ clipPath: BUTTON_CLIP }}
                >
                  <Terminal className="w-3.5 h-3.5 inline-block ml-1.5" />
                  پروتکل توسعه‌پذیر
                </button>
              </div>

              {/* SCROLLABLE MAIN BODY */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-6 min-h-0 custom-scrollbar">

                {activeTab === "sync" && (
                  <div className="space-y-6">
                    {/* Synchronized status card */}
                    <div 
                      className="p-5 border border-accent3-medium bg-gradient-to-br from-black/40 via-transparent to-transparent space-y-4 relative"
                      style={{ clipPath: CLIP_DIAGONAL_TL_BR }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase tracking-widest text-accent3 block font-mono">Connection Status</span>
                          <span className="text-sm font-bold theme-text-primary block">وضعیت فعلی اتصال به ریزتراشه</span>
                        </div>
                        {syncStatus === "synchronized" ? (
                          <div className="flex items-center gap-1.5 text-accent4 font-mono text-xs font-bold px-2.5 py-1 rounded bg-[var(--accent4-transparent)] border border-accent4-medium">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>SYNCHRONIZED (ONLINE)</span>
                          </div>
                        ) : syncStatus === "syncing" ? (
                          <div className="flex items-center gap-1.5 text-accent3 font-mono text-xs font-bold px-2.5 py-1 rounded bg-[var(--accent3-transparent)] border border-accent3-medium animate-pulse">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>SYNCING INITIATING...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-800/40 border border-slate-700/40">
                            <Cpu className="w-3.5 h-3.5" />
                            <span>LOCAL (STANDALONE)</span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs theme-text-muted leading-relaxed">
                        این داشبورد به گونه‌ای مهندسی شده است که به فایل پیکربندی ذخیره‌شده بر روی حافظه فلاش فایلهای محلی تراشه ESP (مانند SPIFFS یا LittleFS) تکیه کند. در هنگام بوت شدن، کلاینت درخواست اتصال به ریشه تراشه را ثبت کرده سپس ساختار داشبورد را در چشم همزدنی تغییر می‌دهد.
                      </p>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-3 bg-black/20 border border-gray-800/40 rounded">
                          <span className="text-[9px] theme-text-muted block">نام سخت‌افزار</span>
                          <span className="text-xs font-bold text-slate-200 mt-1 block">ESP32-S3 Achaemenid</span>
                        </div>
                        <div className="p-3 bg-black/20 border border-gray-800/40 rounded">
                          <span className="text-[9px] theme-text-muted block">آخرین بروزرسانی حافظه</span>
                          <span className="text-xs font-bold text-slate-200 mt-1 block font-mono">config.json</span>
                        </div>
                      </div>
                    </div>

                    {/* API Target IP and sync button */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
                      <div className="md:col-span-2 space-y-1.5 text-right">
                        <label className="text-[10px] font-bold text-accent3 uppercase tracking-wider block">آدرس مکانی یا IP تراشه در شبکه</label>
                        <input
                          type="text"
                          value={espIp}
                          onChange={(e) => setEspIp(e.target.value)}
                          className="w-full bg-black/40 border border-[var(--border-color)] rounded px-3.5 py-2 text-xs text-left font-mono theme-text-primary"
                          placeholder="192.168.4.1"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={startManualSync}
                          disabled={syncStatus === "syncing"}
                          className="w-full h-11 bg-accent3 hover:bg-[#b8860b] text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-2"
                          style={{ clipPath: BUTTON_CLIP }}
                        >
                          <RefreshCw className={`w-4 h-4 ${syncStatus === "syncing" ? "animate-spin" : ""}`} />
                          فراخوانی از تراشه
                        </button>
                      </div>
                    </div>

                    {/* Local File Import / Export */}
                    <div className="p-4 bg-black/20 border border-gray-800/30 rounded-lg space-y-4">
                      <h4 className="text-xs font-extrabold text-slate-200">تبادل پیکربندی با فایل‌های LittleFS</h4>
                      <p className="text-[11px] theme-text-muted leading-relaxed">
                        جهت آپلود مستقیم فایل پیکربندی داشبورد به حافظه ESP32، دکمه ذخیره فایل را فشار دهید تا یک فایل <code className="font-mono text-accent3">config.json</code> استاندارد بارگیری شود. همچنین می‌توانید فایل‌های تولیدی دستگاه را نیز از دستگاه محلی خود جهت پیکربندی وارد کنید.
                      </p>
                      
                      <div className="flex flex-wrap gap-2.5">
                        <button
                          onClick={handleDownloadJson}
                          className="flex-1 py-2 px-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 font-bold text-[11px] theme-text-primary transition-colors flex items-center justify-center gap-1.5"
                          style={{ clipPath: BUTTON_CLIP }}
                        >
                          <Download className="w-3.5 h-3.5 text-accent3" />
                          دانلود فایل پیکربندی
                        </button>

                        <label 
                          className="flex-1 py-2 px-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 font-bold text-[11px] theme-text-primary transition-colors flex items-center justify-center gap-1.5 cursor-pointer relative"
                          style={{ clipPath: BUTTON_CLIP }}
                        >
                          <Upload className="w-3.5 h-3.5 text-accent4" />
                          آپلود فایل config.json
                          <input
                            type="file"
                            accept=".json"
                            onChange={handleUploadLocalJson}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Live Console Logs */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-bold text-accent3 uppercase tracking-wider block">رویدادنگار یکپارچه تراشه (Consoles log)</span>
                        <button 
                          onClick={() => setSyncLogs([])}
                          className="text-[9px] theme-text-muted hover:theme-text-primary font-bold transition-colors"
                        >
                          پاک‌کردن لاگ‌ها
                        </button>
                      </div>
                      <div className="h-44 bg-black/60 border border-none rounded p-3 font-mono text-[10px] text-slate-300 overflow-y-auto space-y-1 text-left custom-scrollbar" dir="ltr">
                        {syncLogs.length === 0 ? (
                          <div className="text-slate-500 h-full flex items-center justify-center italic">
                            No active communication events registered. Connect ESP to log stream...
                          </div>
                        ) : (
                          syncLogs.map((log, idx) => (
                            <div key={idx} className="whitespace-pre-wrap py-0.5 border-b border-gray-900/10">
                              {log}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "editor" && (
                  <div className="space-y-4 flex flex-col h-full">
                    <p className="text-xs theme-text-muted leading-relaxed">
                      درگاه ویرایشگر زنده قالب دیتا. در کدنامه زیر تمامی ماژول‌های سخت‌افزاری و متغیرهای بصری حاکم بر داشبورد را ویرایش کنید و دکمه اعمال را بزنید تا خروجی گرافیکی آن را فوراً مشاهده نمایید.
                    </p>

                    <div className="relative flex-1 min-h-[300px] flex flex-col pb-4">
                      <div className="bg-[#0b0f19] border border-gray-800 rounded p-1 flex-1 flex flex-col overflow-hidden relative">
                        {/* Copy Code Block trigger */}
                        <div className="absolute top-2.5 left-2.5 z-10 flex gap-2">
                          <button
                            onClick={handleCopyJson}
                            className="bg-black/60 hover:bg-black p-1.5 rounded text-gray-400 hover:text-white transition-colors"
                            title="کپی در حافظه موقت"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Textarea */}
                        <textarea
                          value={jsonText}
                          onChange={(e) => setJsonText(e.target.value)}
                          className="w-full h-full opacity-85 hover:opacity-100 bg-transparent text-slate-200 p-4 font-mono text-[11px] outline-none text-left leading-relaxed flex-1 resize-none custom-scrollbar"
                          dir="ltr"
                        />
                      </div>

                      {jsonError && (
                        <div className="mt-3 p-3 bg-red-950/40 border border-red-900/50 rounded flex gap-2 items-start text-red-200">
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                          <div className="text-xs space-y-1">
                            <span className="font-extrabold block">خطای ارزیابی ساختاری</span>
                            <span className="font-mono block">{jsonError}</span>
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex gap-2 justify-end shrink-0">
                        <button
                          onClick={handleApplyJson}
                          className="h-10 px-5 bg-accent4 hover:bg-[#059669] text-black font-extrabold text-xs transition-colors"
                          style={{ clipPath: BUTTON_CLIP }}
                        >
                          پردازش و اعمال بر روی داشبورد
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "schema" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-accent3">ساختار پروتکل Achaemenid-ESP v1.2</h4>
                      <p className="text-xs theme-text-muted leading-relaxed">
                        این سند شرح دهنده پروتکل ارتباطی متقابل بین کلاینت وب و ریزکنترلر ESP32 است. هر متغیر بصری، رنگهای شاخص لوکس سلطنتی، نوع سگمنت‌های متصل به پین‌های خروجی رله و دسته‌بندی ستون‌های گرید به راحتی قابل تعریف، لود یا ذخیره است.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3.5 bg-black/30 border border-gray-800/30 rounded space-y-2">
                        <span className="text-xs font-bold text-slate-200 block">۱. مشخصات سخت‌افزاری (<code className="font-mono text-accent4">device</code>)</span>
                        <p className="text-[11px] theme-text-muted">
                          شامل اطلاعات پایه تراشه نصب شده بر روی بورد اصلی سخت‌افزار، نسخه سورس‌کد و وضعیت پایداری سیستم جهت نمایش زنده در لایه‌های پایش.
                        </p>
                      </div>

                      <div className="p-3.5 bg-black/30 border border-gray-800/30 rounded space-y-2">
                        <span className="text-xs font-bold text-slate-200 block">۲. لایه سلیقه‌ای و تم وب (<code className="font-mono text-accent3">preferences</code>)</span>
                        <p className="text-[11px] theme-text-muted font-sans">
                          حفظ و هدایت متغیرهای ظاهری داشبورد بصورت بومی از روی چیپ سخت‌افزار مانند رنگ اولیه طلایی (<code className="font-mono">accent_color_3</code>)، فونت سامانه، تم شب/روز و متغیرهای انیمیشن.
                        </p>
                      </div>

                      <div className="p-3.5 bg-black/30 border border-gray-800/30 rounded space-y-2">
                        <span className="text-xs font-bold text-slate-200 block">۳. سگمنت‌های فعال خروجی (<code className="font-mono text-accent4">segments</code>)</span>
                        <p className="text-[11px] theme-text-muted leading-relaxed">
                          آرایه‌ای گسترش‌پذیر از ماژول‌ها که هر یک نمایانگر پین‌های GPIO رله، سنسورهای حرارتی آذر، رطوبت‌سنج‌ها یا ابزارهای اندازه‌گیری هستند، متعلق به یک گروه مشخص و آراسته به عناوین دلخواه بدون محدودیت عددی.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
