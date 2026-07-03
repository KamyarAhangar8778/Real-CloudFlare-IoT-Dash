"use client";

import React from "react";
import { MotionConfig } from "motion/react";
import DashboardStyles from "@/features/iot/components/DashboardStyles";
import CuneiformBackground from "@/features/iot/components/CuneiformBackground";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import DashboardHeader from "./DashboardHeader";
import DashboardMain from "./DashboardMain";
import DashboardDrawers from "./DashboardDrawers";
import ToastNotification from "@/features/iot/components/ToastNotification";
import ScrollToTopButton from "./ScrollToTopButton";

import { usePageVisibility } from "@/features/iot/hooks/usePageVisibility";

export default function DashboardContainer() {
  usePageVisibility();
  
  const {
    accent3,
    accent4,
    isDark,
    selectedFont,
    animationsEnabled,
    animationsFps,
    matrixDensity,
    matrixSize,
    matrixHoverSize,
    matrixOpacity,
    matrixColor,
    matrixMoving,
    matrixMouseEffect,
    matrixTwinkleEffect,
    matrixTwinkleSpeed,
    headerPosition,
    dashboardWidth,
    dashboardBgColor,
    dashboardBgOpacity,
    isFullyReady,
  } = useDashboard();

  const getTopHeaderContainerWidth = (width: number) => {
    switch (width) {
      case 1: return "max-w-6xl"; // Current default
      case 2: return "max-w-7xl";
      case 3: return "max-w-[90rem]";
      case 4: return "max-w-[105rem]";
      case 5: return "max-w-full";
      default: return "max-w-6xl";
    }
  };

  const getLeftHeaderContentWidth = (width: number) => {
    switch (width) {
      case 1: return "max-w-5xl"; // Current default
      case 2: return "max-w-6xl";
      case 3: return "max-w-7xl";
      case 4: return "max-w-[90rem]";
      case 5: return "max-w-full";
      default: return "max-w-5xl";
    }
  };

  return (
    <MotionConfig reducedMotion={animationsEnabled ? "user" : "always"}>
      <div className="theme-bg-main theme-text-secondary min-h-screen relative font-sans leading-relaxed selection:bg-[var(--accent3-transparent)] selection:text-[var(--accent3)] transition-colors duration-500 overflow-x-clip">
        <div className="animate-fade-in">
          {/* Dynamic Theme CSS-in-JS Injector Component */}
          <DashboardStyles
            accent3={accent3}
            accent4={accent4}
            isDark={isDark}
            selectedFont={selectedFont}
            animationsEnabled={animationsEnabled}
            dashboardBgColor={dashboardBgColor}
            dashboardBgOpacity={dashboardBgOpacity}
          />

            {/* Polished Persian Stones & Cuneiform Background Subsystem */}
            <CuneiformBackground
              isDark={isDark}
              matrixDensity={matrixDensity}
              matrixSize={matrixSize}
              matrixHoverSize={matrixHoverSize}
              matrixOpacity={matrixOpacity}
              matrixColor={matrixColor}
              matrixMoving={matrixMoving}
              matrixMouseEffect={matrixMouseEffect}
              matrixTwinkleEffect={matrixTwinkleEffect}
              matrixTwinkleSpeed={matrixTwinkleSpeed}
              accent3={accent3}
              animationsEnabled={animationsEnabled}
              animationsFps={animationsFps}
            />

            {/* Main Flexible Container Grid */}
            <div
              className={`relative z-10 w-full min-h-screen transition-all duration-500 ${
                headerPosition === "left"
                  ? "flex flex-col md:flex-row-reverse items-stretch"
                  : `flex flex-col ${getTopHeaderContainerWidth(dashboardWidth)} mx-auto px-6 py-6 md:py-8 justify-between gap-12`
              }`}
            >
              {/* Desktop Left Sidebar Frame */}
              {headerPosition === "left" && <DashboardHeader position="left" />}

              {/* Workspace & Main Control Sections */}
              <div
                className={`flex-1 flex flex-col justify-between gap-12 ${
                  headerPosition === "left"
                    ? `p-6 md:pt-1 md:pb-8 md:px-8 ${getLeftHeaderContentWidth(dashboardWidth)} w-full mx-auto`
                    : "w-full"
                }`}
              >
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

          {/* Scroll to Top Button */}
          <ScrollToTopButton />
        </div>
      </div>
    </MotionConfig>
  );
}
