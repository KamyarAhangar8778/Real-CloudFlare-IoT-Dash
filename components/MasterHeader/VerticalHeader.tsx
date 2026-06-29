import React, { useState } from "react";
import { PanelRightClose, PanelLeftClose, Settings2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MasterHeaderProps } from "./types";
import BrandBox from "./BrandBox";
import LayoutPositionSwitcher from "./LayoutPositionSwitcher";
import LayoutColumnsSwitcher from "./LayoutColumnsSwitcher";
import QuickAccessControls from "./QuickAccessControls";
import ThemeToggle from "./ThemeToggle";
import GlobalRuleSettings from "./GlobalRuleSettings";
import ClockWidget from "./ClockWidget";
import GroupFilterSelector from "./GroupFilterSelector";

export default function VerticalHeader(props: MasterHeaderProps) {
  const { isSidebarCollapsed, setIsSidebarCollapsed } = props;
  const [showAdvanced, setShowAdvanced] = useState(false);

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
        <BrandBox 
          headerTitle={props.headerTitle} 
          variant="vertical" 
          animationsEnabled={props.animationsEnabled}
          groupsOrder={props.groupsOrder}
          selectedGroupFilter={props.selectedGroupFilter}
          setSelectedGroupFilter={props.setSelectedGroupFilter}
        />
      )}

      {/* 🚀 Controls & Widgets Island */}
      <div className={`flex-1 bg-[var(--card-bg-solid)] border border-[var(--border-color)] ${isSidebarCollapsed ? "px-2" : "px-5"} py-5 rounded-2xl shadow-sm flex flex-col justify-between gap-4 transition-all duration-350 hover:-translate-y-1.5 hover:shadow-xl hover:border-[var(--accent3)] overflow-hidden`}>
        
        {/* Top Part: High & Low usage features */}
        <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1 -mr-1">
          {/* High Usage Section */}
          <div className="space-y-4">
            <QuickAccessControls
              setIsModulesMenuOpen={props.setIsModulesMenuOpen}
              setIsMenuOpen={props.setIsMenuOpen}
              animationsEnabled={props.animationsEnabled}
              variant="vertical"
              isSidebarCollapsed={isSidebarCollapsed}
            />
            <GlobalRuleSettings variant="vertical" isSidebarCollapsed={isSidebarCollapsed} />
          </div>

          {/* Low Usage Section (Advanced) */}
          <div className="space-y-3 pt-4 border-t border-[var(--border-color)]">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              title="قابلیت‌های بیشتر"
            >
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                {!isSidebarCollapsed && <span className="text-xs font-bold">قابلیت‌های بیشتر</span>}
              </div>
              {!isSidebarCollapsed && (
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAdvanced ? "rotate-180" : ""}`} />
              )}
            </button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3 pt-2 pb-2">
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

                    {!isSidebarCollapsed && (
                      <div className="pt-2">
                        <GroupFilterSelector
                          groupsOrder={props.groupsOrder}
                          selectedGroupFilter={props.selectedGroupFilter}
                          setSelectedGroupFilter={props.setSelectedGroupFilter}
                          animationsEnabled={props.animationsEnabled}
                          variant="vertical"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Elements */}
        <div className="space-y-4 pt-4 border-t border-[var(--border-color)] shrink-0">
          <ClockWidget variant="vertical" isSidebarCollapsed={isSidebarCollapsed} />

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
