"use client";

import React from "react";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import LowDataModeBanner from "@/features/iot/components/LowDataModeBanner";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import DashboardWorkspace from "./DashboardWorkspace";

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
  } = useDashboard();

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

      <footer className="flex flex-col items-center gap-3 text-center text-[10px] theme-text-secondary font-sans border border-[var(--border-color)] bg-[var(--card-bg)]/80 backdrop-blur-md py-4 px-6 mt-12 mb-4 mx-auto max-w-4xl shadow-sm md:hover:shadow-lg rounded-xl transition-all duration-300 footer-animated-border">
        {/* Device Version Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--card-hover-bg)] border border-[var(--border-color)]">
          <span className="font-bold opacity-80">ورژن داشبورد:</span>
          
          {/* Mobile */}
          <div className="flex sm:hidden items-center gap-1.5 text-[var(--accent3)]">
            <Smartphone className="w-3.5 h-3.5" />
            <span>موبایل</span>
          </div>

          {/* Tablet */}
          <div className="hidden sm:flex lg:hidden items-center gap-1.5 text-[var(--accent4)]">
            <Tablet className="w-3.5 h-3.5" />
            <span>تبلت</span>
          </div>

          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-1.5 text-emerald-500">
            <Monitor className="w-3.5 h-3.5" />
            <span>کامپیوتر</span>
          </div>
        </div>

        <span className="footer-animated-text block opacity-70">
          سامانه هوشمند و داشبورد تعاملی مانیتورینگ صنعت اینترنت اشیاء (الهام گرفته از طراحی
          کلودفلر)
        </span>
      </footer>
    </>
  );
}
