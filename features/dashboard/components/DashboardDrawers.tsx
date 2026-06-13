"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";

const SettingsDrawer = dynamic(() => import("@/features/settings/components/SettingsDrawer"), { ssr: false });
const ModulesDrawer = dynamic(() => import("@/features/iot/components/ModulesDrawer"), { ssr: false });

export default function DashboardDrawers() {
  const {
    isMenuOpen,
    setIsMenuOpen,
    isModulesMenuOpen,
    setIsModulesMenuOpen,
    accent3,
    setAccent3,
    accent4,
    setAccent4,
    selectedFont,
    setSelectedFont,
    animationsEnabled,
    setAnimationsEnabled,
    headerAnimationType,
    setHeaderAnimationType,
    headerTitle,
    setHeaderTitle,
    cuneiformOpacity,
    setCuneiformOpacity,
    cuneiformColor,
    setCuneiformColor,
    isDark,
    headerPosition,
    setHeaderPosition,
    handleAddSegment,
    segments,
    handleRemoveSegment,
  } = useDashboard();

  return (
    <>
      <SettingsDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        accent3={accent3}
        setAccent3={setAccent3}
        accent4={accent4}
        setAccent4={setAccent4}
        selectedFont={selectedFont}
        setSelectedFont={setSelectedFont}
        animationsEnabled={animationsEnabled}
        setAnimationsEnabled={setAnimationsEnabled}
        headerAnimationType={headerAnimationType}
        setHeaderAnimationType={setHeaderAnimationType}
        headerTitle={headerTitle}
        setHeaderTitle={setHeaderTitle}
        cuneiformOpacity={cuneiformOpacity}
        setCuneiformOpacity={setCuneiformOpacity}
        cuneiformColor={cuneiformColor}
        setCuneiformColor={setCuneiformColor}
        isDark={isDark}
        headerPosition={headerPosition}
        setHeaderPosition={setHeaderPosition}
      />

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
    </>
  );
}
