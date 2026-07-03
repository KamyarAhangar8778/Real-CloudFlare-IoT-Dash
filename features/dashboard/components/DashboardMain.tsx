"use client";

import React from "react";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import LowDataModeBanner from "@/features/iot/components/LowDataModeBanner";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import DashboardWorkspace from "./DashboardWorkspace";
import MobileVoiceCommandButton from "./MobileVoiceCommandButton";

export default function DashboardMain() {
  const {
    segments,
    lowDataMode,
    animationsEnabled,
    refetchIot,
    headerPosition,
    manualSaveMode,
    unsavedChangesCount,
    triggerCloudflarePush,
    dashboardWidth,
    activeGroupId,
    activeSegmentId,
  } = useDashboard();

  const isDragging = !!activeGroupId || !!activeSegmentId;

  const getInnerWidthClass = (width: number) => {
    switch (width) {
      case 1: return "max-w-4xl"; // 896px
      case 2: return "max-w-5xl"; // 1024px
      case 3: return "max-w-6xl"; // 1152px
      case 4: return "max-w-7xl"; // 1280px
      case 5: return "max-w-full";
      default: return "max-w-4xl";
    }
  };

  return (
    <>
      {segments.length > 0 && (lowDataMode || (manualSaveMode && unsavedChangesCount > 0)) && (
        <LowDataModeBanner
          lowDataMode={lowDataMode}
          animationsEnabled={animationsEnabled}
          refetchIot={refetchIot}
          headerPosition={headerPosition}
          manualSaveMode={manualSaveMode}
          unsavedChangesCount={unsavedChangesCount}
          triggerCloudflarePush={triggerCloudflarePush}
        />
      )}

      <DashboardWorkspace />

      {!isDragging && (
        <footer className={`flex flex-col items-center gap-3 text-center text-[10px] theme-text-secondary font-sans border border-[var(--border-color)] bg-[var(--card-bg)]/80 backdrop-blur-md py-4 px-6 mt-12 mb-4 mx-auto ${getInnerWidthClass(dashboardWidth)} w-full shadow-sm md:hover:shadow-lg rounded-xl transition-all duration-300 footer-animated-border`}>
          {/* Device Version Indicator */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--card-hover-bg)] border border-[var(--border-color)] hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all duration-500 cursor-default group hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] overflow-hidden relative">
            {/* Subtle background glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
            
            <span className="font-bold opacity-80 group-hover:opacity-100 transition-opacity duration-300 relative z-10">ورژن داشبورد:</span>
            
            {/* Mobile */}
            <div className="flex sm:hidden items-center gap-1.5 text-[var(--accent3)] relative z-10">
              <Smartphone className="w-3.5 h-3.5 group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-300" />
              <span className="group-hover:font-bold transition-all duration-300">موبایل</span>
            </div>

            {/* Tablet */}
            <div className="hidden sm:flex lg:hidden items-center gap-1.5 text-[var(--accent4)] relative z-10">
              <Tablet className="w-3.5 h-3.5 group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-300" />
              <span className="group-hover:font-bold transition-all duration-300">تبلت</span>
            </div>

            {/* Desktop */}
            <div className="hidden lg:flex items-center gap-1.5 text-emerald-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300 relative z-10">
              <Monitor className="w-3.5 h-3.5 animate-[pulse_3s_ease-in-out_infinite] group-hover:animate-none group-hover:scale-125 group-hover:-translate-y-0.5 transition-transform duration-300" />
              <span className="group-hover:tracking-wide group-hover:font-bold transition-all duration-300">کامپیوتر</span>
            </div>
          </div>

          <span className="footer-animated-text block opacity-70">
            سامانه هوشمند و داشبورد تعاملی مانیتورینگ صنعت اینترنت اشیاء (الهام گرفته از طراحی
            کلودفلر)
          </span>
        </footer>
      )}
      <MobileVoiceCommandButton />
    </>
  );
}
