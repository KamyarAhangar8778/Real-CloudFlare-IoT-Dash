import React from "react";
import ColorsSection from "../ColorsSection";
import TypographySection from "../TypographySection";
import StabilitySection from "../StabilitySection";
import CuneiformSection from "../CuneiformSection";
import HeaderSettingsSection from "../HeaderSettingsSection";

import { SettingsDrawerProps } from "./types";

interface SettingsTabContentProps extends SettingsDrawerProps {
  activeTab: string;
}

export function SettingsTabContent({
  activeTab,
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
}: SettingsTabContentProps) {
  switch (activeTab) {
    case "colors":
      return (
        <ColorsSection
          accent3={accent3}
          setAccent3={setAccent3}
          accent4={accent4}
          setAccent4={setAccent4}
          isDark={isDark}
          hideHeader={true}
        />
      );
    case "fonts":
      return (
        <TypographySection
          selectedFont={selectedFont}
          setSelectedFont={setSelectedFont}
          hideHeader={true}
        />
      );
    case "animations":
      return (
        <StabilitySection
          animationsEnabled={animationsEnabled}
          setAnimationsEnabled={setAnimationsEnabled}
          hideHeader={true}
          isDark={isDark}
        />
      );
    case "header-settings":
      return (
        <HeaderSettingsSection
          headerAnimationType={headerAnimationType}
          setHeaderAnimationType={setHeaderAnimationType}
          headerTitle={headerTitle}
          setHeaderTitle={setHeaderTitle}
          headerPosition={headerPosition}
          setHeaderPosition={setHeaderPosition}
          hideHeader={true}
        />
      );
    case "cuneiform":
      return (
        <CuneiformSection
          cuneiformOpacity={cuneiformOpacity}
          setCuneiformOpacity={setCuneiformOpacity}
          cuneiformColor={cuneiformColor}
          setCuneiformColor={setCuneiformColor}
          hideHeader={true}
        />
      );
    default:
      return null;
  }
}
