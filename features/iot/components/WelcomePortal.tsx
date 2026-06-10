"use client";

import React from "react";
import { motion } from "motion/react";
import { 
  Settings as SettingsIcon, 
  ChevronLeft, 
  Layers, 
  Compass 
} from "lucide-react";

interface WelcomePortalProps {
  setIsMenuOpen: (val: boolean) => void;
  setIsModulesMenuOpen: (val: boolean) => void;
  accent3?: string;
  accent4?: string;
  animationsEnabled?: boolean;
  isDark?: boolean;
}

export default function WelcomePortal({
  setIsMenuOpen,
  setIsModulesMenuOpen,
  accent3,
  accent4,
  animationsEnabled = true,
  isDark = true
}: WelcomePortalProps) {
  const welcomeTextGradientStyle: React.CSSProperties = {
    background: "linear-gradient(120deg, var(--accent3), var(--accent4), var(--accent3))",
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    display: "inline-block",
    animation: animationsEnabled ? "welcome-gradient-animation 4s linear shadow-sm" : "none",
  };

  return (
    <motion.div 
      key="welcome-prompt"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 w-full flex flex-col items-center py-4"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes welcome-gradient-animation {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}} />

      <div className="space-y-4 text-center">
        <div 
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] md:text-xs text-[var(--accent3)] border border-[var(--accent3-medium)] bg-[var(--accent3-transparent)] font-sans font-bold shadow-sm"
        >
          <Compass className="w-3.5 h-3.5 text-[var(--accent3)]" />
          <span>پلتفرم لبه و مانیتورینگ اینترنت اشیاء | Edge IoT Platform</span>
        </div>

        <h3 className="text-xl md:text-3xl font-sans font-extrabold theme-text-primary tracking-tight leading-normal max-w-2xl mx-auto">
          درود بر شما، <br />
          به{" "}
          <span style={welcomeTextGradientStyle} className="font-extrabold font-sans">
            سامانه یکپارچه مانیتورینگ اینترنت اشیا
          </span>{" "}
          خوش آمدید
        </h3>

        <p className="text-xs md:text-sm theme-text-tertiary max-w-xl mx-auto leading-relaxed font-sans">
          این سامانه ابزار کاملی بری مدیریت، تست و پیکربندی دستگاه‌ها و ماژول‌های متصل ارائه می‌دهد. با بهره‌گیری از معماری پایا و رابط کاربری بهینه‌سازی‌شده، مانیتورینگ بلادرنگ وضعیت پایه‌ها هم‌اکنون با سرعت بیش از پیش در تمامی دستگاه‌ها در دسترس است.
        </p>
      </div>

      {/* Dual Portals (Divided into Left and Right Islands) */}
      <div className="pt-4 w-full max-w-xl px-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Left Island: Settings Portal */}
        <motion.button
          onClick={() => setIsMenuOpen(true)}
          whileHover={{ 
            scale: 1.015,
            y: -1
          }}
          whileTap={{ scale: 0.985 }}
          className="relative group flex items-center justify-between gap-3 px-5 py-3.5 bg-[var(--card-bg-solid)] border border-[var(--border-color)] hover:border-[var(--accent3)] hover:bg-[var(--card-hover-bg)] text-[var(--text-primary)] rounded-xl font-sans font-extrabold text-xs md:text-sm cursor-pointer shadow-sm transition-all duration-300 text-right w-full"
        >
          <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--accent3)] group-hover:bg-[var(--accent3-transparent)] transition-colors">
            <SettingsIcon className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
          </div>
          <span className="flex-1 pr-2 text-[var(--text-primary)] font-sans font-bold">مشاهده تنظیمات سامانه</span>
          <ChevronLeft className="w-4 h-4 text-[var(--text-muted)]" />
        </motion.button>

        {/* Right Island: Modules Entrance Portal */}
        <motion.button
          onClick={() => setIsModulesMenuOpen(true)}
          whileHover={{ 
            scale: 1.015,
            y: -1
          }}
          whileTap={{ scale: 0.985 }}
          className="relative group flex items-center justify-between gap-3 px-5 py-3.5 bg-[var(--card-bg-solid)] border border-[var(--border-color)] hover:border-[var(--accent4)] hover:bg-[var(--card-hover-bg)] text-[var(--text-primary)] rounded-xl font-sans font-extrabold text-xs md:text-sm cursor-pointer shadow-sm transition-all duration-300 text-right w-full"
        >
          <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--accent4)] group-hover:bg-[var(--accent4-transparent)] transition-colors">
            <Layers className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
          </div>
          <span className="flex-1 pr-2 text-[var(--text-primary)] font-sans font-bold">مدیریت ماژول‌ها و پایه‌ها</span>
          <ChevronLeft className="w-4 h-4 text-[var(--text-muted)]" />
        </motion.button>
      </div>
    </motion.div>
  );
}
