import React from "react";
import ColorsSection from "../ColorsSection";
import TypographySection from "../TypographySection";
import StabilitySection from "../StabilitySection";
import CuneiformSection from "../CuneiformSection";
import HeaderSettingsSection from "../HeaderSettingsSection";
import AudioSection from "../audio-section/AudioSection";
import MqttSection from "../mqtt-section/MqttSection";
import MacrosSection from "../macros-section/MacrosSection";
import VoiceCommandsSection from "../voice-commands-section/VoiceCommandsSection";

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
    case "macros":
      return <MacrosSection />;
    case "voice-commands":
      return <VoiceCommandsSection />;
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
    case "audio":
      return <AudioSection />;
    case "mqtt":
      return <MqttSection />;
    default:
      return null;
  }
}
