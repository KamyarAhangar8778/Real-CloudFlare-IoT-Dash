"use client";

import React from "react";
import { MotionConfig } from "motion/react";
import DashboardStyles from "@/features/iot/components/DashboardStyles";
import CuneiformBackground from "@/features/iot/components/cuneiform-background";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import DashboardHeader from "./DashboardHeader";
import DashboardMain from "./DashboardMain";
import DashboardDrawers from "./DashboardDrawers";
import ToastNotification from "@/features/iot/components/notifications/ToastNotification";
import ScrollToTopButton from "../widgets/ScrollToTopButton";
import { useDashboardLayout } from "../../hooks/useDashboardLayout";
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
  } = useDashboard();

  const { topHeaderContainerWidth, leftHeaderContentWidth } = useDashboardLayout(dashboardWidth);

  return (
    <MotionConfig reducedMotion={animationsEnabled ? "user" : "always"}>
      <div className="theme-bg-main theme-text-secondary min-h-screen relative font-sans leading-relaxed selection:bg-[var(--accent3-transparent)] selection:text-[var(--accent3)] transition-colors duration-500 overflow-x-clip">
        <div className="animate-fade-in">
          <DashboardStyles
            accent3={accent3}
            accent4={accent4}
            isDark={isDark}
            selectedFont={selectedFont}
            animationsEnabled={animationsEnabled}
            dashboardBgColor={dashboardBgColor}
            dashboardBgOpacity={dashboardBgOpacity}
          />

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

          <div
            className={`relative z-10 w-full min-h-screen transition-all duration-500 ${
              headerPosition === "left"
                ? "flex flex-col md:flex-row-reverse items-stretch"
                : `flex flex-col ${topHeaderContainerWidth} mx-auto px-6 py-6 md:py-8 justify-between gap-12`
            }`}
          >
            {headerPosition === "left" && <DashboardHeader position="left" />}

            <div
              className={`flex-1 flex flex-col justify-between gap-12 ${
                headerPosition === "left"
                  ? `p-6 md:pt-1 md:pb-8 md:px-8 ${leftHeaderContentWidth} w-full mx-auto`
                  : "w-full"
              }`}
            >
              <DashboardHeader position="topOrMobile" />
              <DashboardMain />
            </div>
          </div>

          <DashboardDrawers />
          <ToastNotification />
          <ScrollToTopButton />
        </div>
      </div>
    </MotionConfig>
  );
}
