"use client";

import React from "react";
import { MotionConfig } from "motion/react";
import SyncOverlay from "@/features/iot/components/SyncOverlay";
import DashboardStyles from "@/features/iot/components/DashboardStyles";
import CuneiformBackground from "@/features/iot/components/CuneiformBackground";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import DashboardHeader from "./DashboardHeader";
import DashboardMain from "./DashboardMain";
import DashboardDrawers from "./DashboardDrawers";
import ToastNotification from "@/features/iot/components/ToastNotification";

export default function DashboardContainer() {
  const {
    accent3,
    accent4,
    isDark,
    selectedFont,
    animationsEnabled,
    cuneiformColor,
    cuneiformOpacity,
    cuneiformColorValue,
    headerPosition,
    isFullyReady,
    syncProgress,
    syncMessage,
    handleBypassSync,
    workerUrl,
    setWorkerUrl,
    handleRetrySync,
  } = useDashboard();

  return (
    <MotionConfig reducedMotion={animationsEnabled ? "user" : "always"}>
      <div className="theme-bg-main theme-text-secondary min-h-screen overflow-x-hidden relative font-sans leading-relaxed selection:bg-[var(--accent3-transparent)] selection:text-[var(--accent3)] transition-colors duration-500">
        
        {/* Fullscreen Initial ESP32 Configuration Sync Overlay */}
        <SyncOverlay
          isFullyReady={isFullyReady}
          syncMessage={syncMessage}
          syncProgress={syncProgress}
          onBypass={handleBypassSync}
          workerUrl={workerUrl}
          setWorkerUrl={setWorkerUrl}
          onRetry={handleRetrySync}
        />

        {/* Dynamic Theme CSS-in-JS Injector Component */}
        <DashboardStyles
          accent3={accent3}
          accent4={accent4}
          isDark={isDark}
          selectedFont={selectedFont}
          animationsEnabled={animationsEnabled}
        />

        {/* Polished Persian Stones & Cuneiform Background Subsystem */}
        <CuneiformBackground
          isDark={isDark}
          cuneiformColor={cuneiformColor}
          cuneiformOpacity={cuneiformOpacity}
          cuneiformColorValue={cuneiformColorValue}
          accent3={accent3}
          animationsEnabled={animationsEnabled}
        />

        {/* Main Flexible Container Grid */}
        <div className={`relative z-10 w-full min-h-screen transition-all duration-500 ${
          headerPosition === "left"
            ? "flex flex-col md:flex-row-reverse items-stretch"
            : "flex flex-col max-w-6xl mx-auto px-6 py-6 md:py-8 justify-between gap-12"
        }`}>

          {/* Desktop Left Sidebar Frame */}
          {headerPosition === "left" && (
            <DashboardHeader position="left" />
          )}

          {/* Workspace & Main Control Sections */}
          <div className={`flex-1 flex flex-col justify-between gap-12 ${
            headerPosition === "left" ? "p-6 md:pt-1 md:pb-8 md:px-8 max-w-5xl w-full mx-auto" : "w-full"
          }`}>
            {/* Top Header Section (Shows on mobile/top dynamically) */}
            <DashboardHeader position="topOrMobile" />

            {/* Banners, Workspaces, Encyclopedia & Footer */}
            <DashboardMain />
          </div>
        </div>

        {/* Dynamic drawers */}
        <DashboardDrawers />

        {/* Toast notifications */}
        <ToastNotification />
      </div>
    </MotionConfig>
  );
}
