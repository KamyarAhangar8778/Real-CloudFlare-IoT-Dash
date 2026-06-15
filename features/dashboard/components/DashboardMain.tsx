"use client";

import React from "react";
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

      <footer className="text-center text-[10px] theme-text-secondary font-sans border border-[var(--border-color)] bg-[var(--card-bg)]/80 backdrop-blur-md py-4 px-6 mt-12 mb-4 mx-auto max-w-4xl shadow-sm hover:shadow-lg rounded-xl transition-all duration-300 footer-animated-border">
        <span className="footer-animated-text block">
          سامانه هوشمند و داشبورد تعاملی مانیتورینگ صنعت اینترنت اشیاء (الهام گرفته از طراحی
          کلودفلر)
        </span>
      </footer>
    </>
  );
}
