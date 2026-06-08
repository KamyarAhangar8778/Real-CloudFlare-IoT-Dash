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
}

export default function WelcomePortal({
  setIsMenuOpen,
  setIsModulesMenuOpen
}: WelcomePortalProps) {
  return (
    <motion.div 
      key="welcome-prompt"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 w-full flex flex-col items-center py-4"
    >
      <div className="space-y-4 text-center">
        <div 
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] md:text-xs text-cyan-400 border border-cyan-500/20 bg-cyan-950/20"
        >
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>پلتفرم لبه و مانیتورینگ اینترنت اشیاء | Edge IoT Platform</span>
        </div>

        <h3 className="text-xl md:text-3xl font-sans font-bold theme-text-primary tracking-tight leading-normal max-w-2xl mx-auto">
          درود بر شما، <br />
          به{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 font-extrabold inline-block">
            سامانه یکپارچه مانیتورینگ اینترنت اشیا
          </span>{" "}
          خوش آمدید
        </h3>

        <p className="text-xs md:text-sm theme-text-tertiary max-w-xl mx-auto leading-relaxed">
          این سامانه ابزار کاملی بری مدیریت، تست و پیکربندی دستگاه‌ها و ماژول‌های متصل ارائه می‌دهد. با بهره‌گیری از معماری پایا و رابط کاربری بهینه‌سازی‌شده، مانیتورینگ بلادرنگ وضعیت پایه‌ها هم‌اکنون با سرعت بیش از پیش در تمامی دستگاه‌ها در دسترس است.
        </p>
      </div>

      {/* Dual Portals (Divided into Left and Right Islands) */}
      <div className="pt-4 w-full max-w-xl px-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Left Island: Settings Portal */}
        <motion.button
          onClick={() => setIsMenuOpen(true)}
          whileHover={{ 
            scale: 1.02,
            y: -1
          }}
          whileTap={{ scale: 0.98 }}
          className="relative group flex items-center justify-between gap-3 px-5 py-3.5 bg-zinc-900 border border-zinc-800 hover:border-cyan-550 hover:bg-zinc-850 text-white rounded-xl font-sans font-bold text-xs md:text-sm cursor-pointer shadow-sm transition-all duration-300 text-right w-full"
        >
          <div className="p-2 rounded-lg bg-zinc-800 text-cyan-400 group-hover:bg-cyan-950/40 transition-colors">
            <SettingsIcon className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
          </div>
          <span className="flex-1 pr-2 theme-text-primary">مشاهده تنظیمات سامانه</span>
          <ChevronLeft className="w-4 h-4 text-zinc-500" />
        </motion.button>

        {/* Right Island: Modules Entrance Portal */}
        <motion.button
          onClick={() => setIsModulesMenuOpen(true)}
          whileHover={{ 
            scale: 1.02,
            y: -1
          }}
          whileTap={{ scale: 0.98 }}
          className="relative group flex items-center justify-between gap-3 px-5 py-3.5 bg-zinc-900 border border-zinc-800 hover:border-emerald-555 hover:bg-zinc-850 text-white rounded-xl font-sans font-bold text-xs md:text-sm cursor-pointer shadow-sm transition-all duration-300 text-right w-full"
        >
          <div className="p-2 rounded-lg bg-zinc-800 text-emerald-400 group-hover:bg-emerald-950/40 transition-colors">
            <Layers className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
          </div>
          <span className="flex-1 pr-2 theme-text-primary">مدیریت ماژول‌ها و پایه‌ها</span>
          <ChevronLeft className="w-4 h-4 text-zinc-500" />
        </motion.button>
      </div>
    </motion.div>
  );
}
