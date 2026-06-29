import React, { useState } from "react";
import { MasterHeaderProps } from "./types";
import BrandBox from "./BrandBox";
import LayoutPositionSwitcher from "./LayoutPositionSwitcher";
import LayoutColumnsSwitcher from "./LayoutColumnsSwitcher";
import QuickAccessControls from "./QuickAccessControls";
import ThemeToggle from "./ThemeToggle";
import GlobalRuleSettings from "./GlobalRuleSettings";
import ClockWidget from "./ClockWidget";
import GroupFilterSelector from "./GroupFilterSelector";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";

export default function HorizontalHeader(props: MasterHeaderProps) {
  const [isSubIslandOpen, setIsSubIslandOpen] = useState(false);

  return (
    <div className="w-full flex flex-col gap-3 relative z-20 text-right font-sans" dir="rtl">
      <div
        id="horizontal-master-header"
        className="w-full flex flex-col md:flex-row gap-4 items-stretch"
      >
        {/* 🏛️ Right Island (Compact Title Box) - Small Island */}
        <BrandBox
          headerTitle={props.headerTitle}
          variant="horizontal"
          isDark={props.isDark}
          setIsDark={props.setIsDark}
          animationsEnabled={props.animationsEnabled}
          setIsModulesMenuOpen={props.setIsModulesMenuOpen}
          setIsMenuOpen={props.setIsMenuOpen}
          groupsCols={props.groupsCols}
          setGroupsCols={props.setGroupsCols}
          groupsOrder={props.groupsOrder}
          selectedGroupFilter={props.selectedGroupFilter}
          setSelectedGroupFilter={props.setSelectedGroupFilter}
        />

        {/* 🚀 Left Island Area */}
        <div className="hidden md:flex flex-1 flex-col gap-3">
          {/* Main Left Island */}
          <div className="flex-1 bg-[var(--card-bg-solid)] border border-[var(--border-color)] px-5 py-3.5 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between transition-all duration-350 hover:-translate-y-1.5 hover:shadow-xl hover:border-[var(--accent3)]">
            {/* Inside Left Island, left-aligned section: ROW of Action controls */}
            <div className="flex items-center flex-wrap justify-center gap-3 w-full md:w-auto border-t border-[var(--border-color)] pt-3 md:pt-0 md:border-t-0">
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
                <GlobalRuleSettings variant="horizontal" />
                
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

                {/* Sub-Island Toggle Button */}
                <motion.button
                  type="button"
                  whileHover={props.animationsEnabled ? { scale: 1.05 } : undefined}
                  whileTap={props.animationsEnabled ? { scale: 0.95 } : undefined}
                  onClick={() => setIsSubIslandOpen(!isSubIslandOpen)}
                  className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-300 relative group overflow-hidden ${
                    isSubIslandOpen 
                      ? "bg-[var(--accent3-transparent)] border-[var(--accent3)] text-[var(--accent3)] shadow-[0_0_12px_var(--accent3-transparent)]" 
                      : "border-[var(--border-color)] bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--accent3)] hover:border-[var(--accent3)] hover:bg-[var(--accent3-transparent)]"
                  }`}
                  title="امکانات بیشتر"
                >
                  <div className="flex flex-col items-center justify-center gap-0.5">
                    <SlidersHorizontal className={`w-4 h-4 transition-transform duration-300 ${isSubIslandOpen ? 'translate-y-[-2px]' : ''}`} />
                    <ChevronDown className={`w-3 h-3 absolute transition-all duration-300 ${isSubIslandOpen ? 'bottom-0.5 rotate-180 opacity-100' : 'bottom-[-10px] opacity-0 group-hover:opacity-100 group-hover:bottom-0.5'}`} />
                  </div>
                </motion.button>
              </div>
            </div>

            <div className="hidden md:block">
              <ClockWidget variant="horizontal" />
            </div>
          </div>
        </div>
      </div>

      {/* Sub Island (Full Width) */}
      <AnimatePresence>
        {isSubIslandOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full bg-[var(--card-bg-solid)] border border-[var(--border-color)] px-5 py-3 rounded-2xl shadow-sm flex items-center justify-between gap-4 overflow-hidden"
          >
            {/* Right side: Group Filters */}
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium text-[var(--text-secondary)] whitespace-nowrap">
                فیلتر گروه ها:
              </div>
              <GroupFilterSelector
                groupsOrder={props.groupsOrder}
                selectedGroupFilter={props.selectedGroupFilter}
                setSelectedGroupFilter={props.setSelectedGroupFilter}
                animationsEnabled={props.animationsEnabled}
                variant="horizontal"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
