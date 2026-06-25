import React from "react";
import { PanelRightClose, PanelLeftClose } from "lucide-react";
import { MasterHeaderProps } from "./types";
import BrandBox from "./BrandBox";
import LayoutPositionSwitcher from "./LayoutPositionSwitcher";
import LayoutColumnsSwitcher from "./LayoutColumnsSwitcher";
import QuickAccessControls from "./QuickAccessControls";
import ThemeToggle from "./ThemeToggle";
import GlobalRuleSettings from "./GlobalRuleSettings";

export default function VerticalHeader(props: MasterHeaderProps) {
  const { isSidebarCollapsed, setIsSidebarCollapsed } = props;

  return (
    <div
      id="vertical-master-header"
      className="w-full h-full flex flex-col justify-stretch gap-4 text-right font-sans"
      dir="rtl"
    >
      {/* Collapse Toggle Button */}
      {setIsSidebarCollapsed && (
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="w-full bg-[var(--card-bg-solid)] border border-[var(--border-color)] px-4 py-3 rounded-2xl shadow-sm flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent3)] hover:border-[var(--accent3)] transition-all duration-350"
          title={isSidebarCollapsed ? "باز کردن منوی کناری" : "بستن منوی کناری"}
        >
          {isSidebarCollapsed ? <PanelLeftClose className="w-5 h-5 rotate-180" /> : <PanelRightClose className="w-5 h-5" />}
        </button>
      )}

      {/* 🏛️ Title Island (Compact Brand Box) */}
      {!isSidebarCollapsed && (
        <BrandBox headerTitle={props.headerTitle} variant="vertical" />
      )}

      {/* 🚀 Controls & Widgets Island */}
      <div className={`flex-1 bg-[var(--card-bg-solid)] border border-[var(--border-color)] ${isSidebarCollapsed ? "px-2" : "px-5"} py-5 rounded-2xl shadow-sm flex flex-col justify-between gap-6 transition-all duration-350 hover:-translate-y-1.5 hover:shadow-xl hover:border-[var(--accent3)] overflow-hidden`}>
        <div className="space-y-5">
          {/* Interactive Layout Modifiers Grid */}
          <div className="space-y-3">
            {!isSidebarCollapsed && (
              <span className="text-[10px] text-[var(--text-muted)] font-black block text-right uppercase tracking-wider">
                پیکربندی موقعیت و ساختار
              </span>
            )}
            <LayoutPositionSwitcher
              headerPosition={props.headerPosition}
              setHeaderPosition={props.setHeaderPosition}
              variant="vertical"
              isSidebarCollapsed={isSidebarCollapsed}
            />
            <LayoutColumnsSwitcher
              groupsCols={props.groupsCols}
              setGroupsCols={props.setGroupsCols}
              variant="vertical"
              isSidebarCollapsed={isSidebarCollapsed}
            />
          </div>

          {/* Quick-Access Vertical Control Items */}
          <QuickAccessControls
            setIsModulesMenuOpen={props.setIsModulesMenuOpen}
            setIsMenuOpen={props.setIsMenuOpen}
            animationsEnabled={props.animationsEnabled}
            variant="vertical"
            isSidebarCollapsed={isSidebarCollapsed}
          />
        </div>

        <div className="space-y-4">
          <GlobalRuleSettings variant="vertical" isSidebarCollapsed={isSidebarCollapsed} />
          
          <ThemeToggle
            isDark={props.isDark}
            setIsDark={props.setIsDark}
            animationsEnabled={props.animationsEnabled}
            variant="vertical"
            isSidebarCollapsed={isSidebarCollapsed}
          />
        </div>
      </div>
    </div>
  );
}
