import React from "react";
import ImperialClock from "@/features/encyclopedia/components/ImperialClock";
import { MasterHeaderProps } from "./types";
import BrandBox from "./BrandBox";
import LayoutPositionSwitcher from "./LayoutPositionSwitcher";
import LayoutColumnsSwitcher from "./LayoutColumnsSwitcher";
import QuickAccessControls from "./QuickAccessControls";
import ThemeToggle from "./ThemeToggle";

export default function HorizontalHeader(props: MasterHeaderProps) {
  return (
    <div 
      id="horizontal-master-header" 
      className="w-full flex flex-col md:flex-row gap-4 items-stretch relative z-20 text-right font-sans" 
      dir="rtl"
    >
      {/* 🏛️ Right Island (Compact Title Box) - Small Island */}
      <BrandBox 
        headerTitle={props.headerTitle} 
        variant="horizontal"
        isDark={props.isDark}
        setIsDark={props.setIsDark}
        animationsEnabled={props.animationsEnabled}
      />

      {/* 🚀 Left Island (Flexible actions controls box) - Large Island */}
      <div className="flex-1 bg-[var(--card-bg-solid)] border border-[var(--border-color)] px-5 py-3.5 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between transition-all duration-350 hover:-translate-y-1.5 hover:shadow-xl hover:border-[var(--accent3)]">
        {/* Inside Left Island, right-aligned section: Live Clock Capsule */}
        <div className="hidden sm:flex items-center justify-center shrink-0">
          <div className="px-5 py-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-full text-xs font-semibold">
            <ImperialClock />
          </div>
        </div>

        {/* Inside Left Island, left-aligned section: ROW of Action controls */}
        <div className="flex items-center flex-wrap justify-center gap-3 w-full md:w-auto md:justify-end border-t border-[var(--border-color)] pt-3 md:pt-0 md:border-t-0">
          
          {/* Layout Orientation View Switcher */}
          <LayoutPositionSwitcher 
            headerPosition={props.headerPosition}
            setHeaderPosition={props.setHeaderPosition}
            variant="horizontal"
          />

          {/* Grid Layout column modifiers standard switcher */}
          <LayoutColumnsSwitcher 
            groupsCols={props.groupsCols}
            setGroupsCols={props.setGroupsCols}
            variant="horizontal"
          />

          {/* Control Target Drawers with Premium feedback */}
          <div className="flex items-center gap-2">
            <QuickAccessControls 
              setIsModulesMenuOpen={props.setIsModulesMenuOpen}
              setIsMenuOpen={props.setIsMenuOpen}
              animationsEnabled={props.animationsEnabled}
              variant="horizontal"
            />

            <ThemeToggle 
              isDark={props.isDark}
              setIsDark={props.setIsDark}
              animationsEnabled={props.animationsEnabled}
              variant="horizontal"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
