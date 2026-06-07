"use client";

import React from "react";
import { motion } from "motion/react";
import { 
  Settings as SettingsIcon, 
  ChevronLeft, 
  Layers, 
  Compass 
} from "lucide-react";
import { 
  BUTTON_CLIP, 
  CLIP_DIAGONAL_TL_BR, 
  CLIP_DIAGONAL_TR_BL 
} from "@/lib/presets";

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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 w-full flex flex-col items-center"
    >
      <div className="space-y-5">
        <div 
          className="inline-flex items-center gap-2 px-4 py-1.5 text-xs text-accent3 border border-dashed border-accent3-medium"
          style={{ clipPath: BUTTON_CLIP, background: "var(--accent3-transparent)" }}
        >
          <Compass className="w-4 h-4 text-accent3" style={{ color: "var(--accent3)" }} />
          <span>سلام و درود بی‌کران بر کوروش کبیر و داریوش بزرگ، شاهنشاهان عادل و ماندگار هخامنشی</span>
        </div>

        <h3 className="text-2xl md:text-4xl font-sans font-extrabold theme-text-primary tracking-tight leading-normal">
          درود بر شما همکار گرامی، <br />
          به{" "}
          <motion.span 
            className="golden-royal-text-shimmer font-black drop-shadow-lg inline-block duration-500 relative cursor-default"
            animate={{ 
              y: [0, -4, 0],
              filter: [
                "drop-shadow(0 0 1px var(--accent3-transparent))",
                "drop-shadow(0 0 10px var(--accent3-medium))",
                "drop-shadow(0 0 1px var(--accent3-transparent))"
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            داشبورد یکپارچه هخامنشی
          </motion.span>{" "}
          خوش آمدید
        </h3>

        <p className="text-xs md:text-sm theme-text-tertiary max-w-xl mx-auto leading-relaxed">
          کوروش کبیر، بنیان‌گذار شاهنشاهی هخامنشی، با نگارش منشور حقوق بشر، آزادی و بخشندگی بی‌همتای خویش را در جهان جاودانه ساخت؛ و داریوش بزرگ، با سازماندهی مدون شهربانی‌ها (ساتراپی)، احداث جاده شاهی، ایجاد سکه یکپارچه (داریک) و آبادانی تخت جمشید، مقتدرترین حکومت باستانی جهان را مستحکم نمود.
        </p>
      </div>

      {/* Dual Imperial Portals (Divided into Left and Right Islands) */}
      <div className="pt-2 w-full max-w-2xl px-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Left Island: Settings Portal (Accent 3 - Gold) */}
        <motion.button
          onClick={() => setIsMenuOpen(true)}
          whileHover={{ 
            scale: 1.04,
            boxShadow: "0 10px 20px -5px var(--accent3-medium)",
          }}
          whileTap={{ scale: 0.97 }}
          className="relative group flex items-center justify-between gap-3 px-6 py-4 text-black font-sans font-black text-sm md:text-base cursor-pointer overflow-hidden shadow-md transition-colors duration-500 text-right w-full"
          style={{ 
            clipPath: CLIP_DIAGONAL_TL_BR,
            background: "var(--accent3)"
          }}
        >
          {/* Achaemenid Diamond Corner Indicators (No rounded-full!) */}
          <div className="absolute top-1.5 right-2 w-1.5 h-1.5 bg-black/30 group-hover:scale-150 transition-transform duration-300" style={{ clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)" }} />
          <div className="absolute bottom-1.5 left-2 w-1.5 h-1.5 bg-black/30 group-hover:scale-150 transition-transform duration-300" style={{ clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)" }} />
          
          {/* Expanding ray hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine duration-1000 ease-out pointer-events-none" />
          
          <SettingsIcon className="w-5 h-5 text-black group-hover:rotate-90 transition-transform duration-500 ease-out" />
          <span className="flex-1 pr-2">گشایش دروازه تنظیمات</span>
          <ChevronLeft className="w-4 h-4 text-black" />
        </motion.button>

        {/* Right Island: Modules Entrance Portal (Accent 4 - Emerald/Mint) */}
        <motion.button
          onClick={() => setIsModulesMenuOpen(true)}
          whileHover={{ 
            scale: 1.04,
            boxShadow: "0 10px 20px -5px var(--accent4-medium)",
          }}
          whileTap={{ scale: 0.97 }}
          className="relative group flex items-center justify-between gap-3 px-6 py-4 text-black font-sans font-black text-sm md:text-base cursor-pointer overflow-hidden shadow-md transition-colors duration-500 text-right w-full"
          style={{ 
            clipPath: CLIP_DIAGONAL_TR_BL,
            background: "var(--accent4)"
          }}
        >
          {/* Achaemenid Diamond Corner Indicators (No rounded-full!) */}
          <div className="absolute top-1.5 right-2 w-1.5 h-1.5 bg-black/30 group-hover:scale-150 transition-transform duration-300" style={{ clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)" }} />
          <div className="absolute bottom-1.5 left-2 w-1.5 h-1.5 bg-black/30 group-hover:scale-150 transition-transform duration-300" style={{ clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)" }} />
          
          {/* Expanding ray hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine duration-1000 ease-out pointer-events-none" />
          
          <Layers className="w-5 h-5 text-black group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ease-out" />
          <span className="flex-1 pr-2">ورود به منوی ماژول‌ها</span>
          <ChevronLeft className="w-4 h-4 text-black" />
        </motion.button>
      </div>
    </motion.div>
  );
}
