import React from "react";
import { MasterHeaderProps } from "./types";
import BrandBox from "./BrandBox";
import LayoutPositionSwitcher from "./LayoutPositionSwitcher";
import LayoutColumnsSwitcher from "./LayoutColumnsSwitcher";
import QuickAccessControls from "./QuickAccessControls";
import ThemeToggle from "./ThemeToggle";

export default function VerticalHeader(props: MasterHeaderProps) {
  return (
    <div
      id="vertical-master-header"
      className="w-full h-full flex flex-col justify-stretch gap-4 text-right font-sans"
      dir="rtl"
    >
      {/* 🏛️ Title Island (Compact Brand Box) - Floating Small Island */}
      <BrandBox headerTitle={props.headerTitle} variant="vertical" />

      {/* 🚀 Controls & Widgets Island - Floating Large Island */}
      <div className="flex-1 bg-[var(--card-bg-solid)] border border-[var(--border-color)] px-5 py-5 rounded-2xl shadow-sm flex flex-col justify-between gap-6 transition-all duration-350 hover:-translate-y-1.5 hover:shadow-xl hover:border-[var(--accent3)]">
        <div className="space-y-5">
          {/* Interactive Layout Modifiers Grid */}
          <div className="space-y-3">
            <span className="text-[10px] text-[var(--text-muted)] font-black block text-right uppercase tracking-wider">
              پیکربندی موقعیت و ساختار
            </span>
            <LayoutPositionSwitcher
              headerPosition={props.headerPosition}
              setHeaderPosition={props.setHeaderPosition}
              variant="vertical"
            />
            <LayoutColumnsSwitcher
              groupsCols={props.groupsCols}
              setGroupsCols={props.setGroupsCols}
              variant="vertical"
            />
          </div>

          {/* Quick-Access Vertical Control Items */}
          <QuickAccessControls
            setIsModulesMenuOpen={props.setIsModulesMenuOpen}
            setIsMenuOpen={props.setIsMenuOpen}
            animationsEnabled={props.animationsEnabled}
            variant="vertical"
          />
        </div>

        {/* Footer controls: theme toggler and brand info */}
        <ThemeToggle
          isDark={props.isDark}
          setIsDark={props.setIsDark}
          animationsEnabled={props.animationsEnabled}
          variant="vertical"
        />
      </div>
    </div>
  );
}
