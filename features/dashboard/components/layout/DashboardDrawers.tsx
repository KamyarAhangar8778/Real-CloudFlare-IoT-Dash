"use client";

import React from "react";
import SettingsDrawer from "@/features/settings/components/SettingsDrawer";
import ModulesDrawer from "@/features/iot/components/ModulesDrawer";
import AutomationsDrawer from "@/features/iot/components/AutomationsDrawer";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";

export default function DashboardDrawers() {
  const {
    isMenuOpen,
    setIsMenuOpen,
    isModulesMenuOpen,
    setIsModulesMenuOpen,
    isAutomationsMenuOpen,
    setIsAutomationsMenuOpen,
    activeSettingsTab,
    setActiveSettingsTab,
    accent3,
    setAccent3,
    accent4,
    setAccent4,
    selectedFont,
    setSelectedFont,
    animationsEnabled,
    setAnimationsEnabled,
    animationsFps,
    setAnimationsFps,
    headerAnimationType,
    setHeaderAnimationType,
    headerTitle,
    setHeaderTitle,
    matrixDensity,
    setMatrixDensity,
    matrixSize,
    setMatrixSize,
    matrixHoverSize,
    setMatrixHoverSize,
    matrixOpacity,
    setMatrixOpacity,
    matrixColor,
    setMatrixColor,
    matrixMoving,
    setMatrixMoving,
    matrixMouseEffect,
    setMatrixMouseEffect,
    matrixTwinkleEffect,
    setMatrixTwinkleEffect,
    matrixTwinkleSpeed,
    setMatrixTwinkleSpeed,
    isDark,
    headerPosition,
    setHeaderPosition,
    dashboardWidth,
    setDashboardWidth,
    dashboardBgColor,
    setDashboardBgColor,
    dashboardBgOpacity,
    setDashboardBgOpacity,
    isGroupsCompactLayout,
    setIsGroupsCompactLayout,
    isSegmentsCompactLayout,
    setIsSegmentsCompactLayout,
    handleAddSegment,
    segments,
    handleRemoveSegment,
  } = useDashboard();

  return (
    <>
      {isMenuOpen && (
        <SettingsDrawer
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          activeTab={activeSettingsTab}
          setActiveTab={setActiveSettingsTab}
          accent3={accent3}
          setAccent3={setAccent3}
          accent4={accent4}
          setAccent4={setAccent4}
          selectedFont={selectedFont}
          setSelectedFont={setSelectedFont}
          animationsEnabled={animationsEnabled}
          setAnimationsEnabled={setAnimationsEnabled}
          animationsFps={animationsFps}
          setAnimationsFps={setAnimationsFps}
          headerAnimationType={headerAnimationType}
          setHeaderAnimationType={setHeaderAnimationType}
          headerTitle={headerTitle}
          setHeaderTitle={setHeaderTitle}
          matrixDensity={matrixDensity}
          setMatrixDensity={setMatrixDensity}
          matrixSize={matrixSize}
          setMatrixSize={setMatrixSize}
          matrixHoverSize={matrixHoverSize}
          setMatrixHoverSize={setMatrixHoverSize}
          matrixOpacity={matrixOpacity}
          setMatrixOpacity={setMatrixOpacity}
          matrixColor={matrixColor}
          setMatrixColor={setMatrixColor}
          matrixMoving={matrixMoving}
          setMatrixMoving={setMatrixMoving}
          matrixMouseEffect={matrixMouseEffect}
          setMatrixMouseEffect={setMatrixMouseEffect}
          matrixTwinkleEffect={matrixTwinkleEffect}
          setMatrixTwinkleEffect={setMatrixTwinkleEffect}
          matrixTwinkleSpeed={matrixTwinkleSpeed}
          setMatrixTwinkleSpeed={setMatrixTwinkleSpeed}
          isDark={isDark}
          headerPosition={headerPosition}
          setHeaderPosition={setHeaderPosition}
          dashboardWidth={dashboardWidth}
          setDashboardWidth={setDashboardWidth}
          dashboardBgColor={dashboardBgColor}
          setDashboardBgColor={setDashboardBgColor}
          dashboardBgOpacity={dashboardBgOpacity}
          setDashboardBgOpacity={setDashboardBgOpacity}
          isGroupsCompactLayout={isGroupsCompactLayout}
          setIsGroupsCompactLayout={setIsGroupsCompactLayout}
          isSegmentsCompactLayout={isSegmentsCompactLayout}
          setIsSegmentsCompactLayout={setIsSegmentsCompactLayout}
        />
      )}

      {isModulesMenuOpen && (
        <ModulesDrawer
          isOpen={isModulesMenuOpen}
          onClose={() => setIsModulesMenuOpen(false)}
          onAddSegment={handleAddSegment}
          segments={segments}
          onRemoveSegment={handleRemoveSegment}
          isDark={isDark}
          accent3={accent3}
          accent4={accent4}
          animationsEnabled={animationsEnabled}
        />
      )}

      {isAutomationsMenuOpen && (
        <AutomationsDrawer
          isOpen={isAutomationsMenuOpen}
          onClose={() => setIsAutomationsMenuOpen(false)}
          isDark={isDark}
          animationsEnabled={animationsEnabled}
        />
      )}
    </>
  );
}
