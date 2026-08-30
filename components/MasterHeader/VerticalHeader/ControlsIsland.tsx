import React, { useState } from "react";
import { Settings2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import LayoutColumnsSwitcher from "../LayoutColumnsSwitcher";
import QuickAccessControls from "../QuickAccessControls";
import ThemeToggle from "../ThemeToggle";
import ClockWidget from "../ClockWidget";
import HeaderZoomControls from "../HeaderZoomControls";
import GroupFilterSelector from "../GroupFilterSelector";

export default function ControlsIsland({ props }: { props: any }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { isSidebarCollapsed } = props;

  return (
    <div className="relative flex-1 flex flex-col justify-between gap-3 overflow-hidden">
      <div className="relative z-10 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-0.5 -mr-0.5">
        <div className="space-y-3">
          <QuickAccessControls
            setIsModulesMenuOpen={props.setIsModulesMenuOpen}
            setIsMenuOpen={props.setIsMenuOpen}
            animationsEnabled={props.animationsEnabled}
            variant="vertical"
            isSidebarCollapsed={isSidebarCollapsed}
          />
        </div>

        {/* Group / Room Filter in Vertical Header */}
        {props.groupsOrder && props.groupsOrder.length > 0 && !isSidebarCollapsed && (
          <div className="space-y-1.5 pt-2 border-t border-[var(--border-color)]/60">
            <span className="text-[10px] text-[var(--text-muted)] font-bold block text-right uppercase tracking-wider px-1">
              دسته‌بندی و اتاق‌ها
            </span>
            <div className="w-full flex justify-center py-1">
              <GroupFilterSelector
                groupsOrder={props.groupsOrder}
                selectedGroupFilter={props.selectedGroupFilter}
                setSelectedGroupFilter={props.setSelectedGroupFilter}
                animationsEnabled={props.animationsEnabled}
                isCompact={true}
              />
            </div>
          </div>
        )}

        {/* Free-Canvas Zoom Controls in Vertical Header */}
        <div className="w-full flex justify-center">
          <HeaderZoomControls variant="vertical" />
        </div>

        {isSidebarCollapsed ? (
          <div className="space-y-2.5 pt-2.5 border-t border-[var(--border-color)]/60 w-full flex flex-col items-center">
            <LayoutColumnsSwitcher
              groupsCols={props.groupsCols}
              setGroupsCols={props.setGroupsCols}
              variant="vertical"
              isSidebarCollapsed={isSidebarCollapsed}
            />
          </div>
        ) : (
          <div className="space-y-2.5 pt-3 border-t border-[var(--border-color)]/60">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between text-[var(--text-secondary)] md:hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              title="قابلیت‌های بیشتر و چیدمان"
            >
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                <span className="text-xs font-bold">چیدمان و ستون‌ها</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAdvanced ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2.5 pt-2 pb-1">
                    <LayoutColumnsSwitcher
                      groupsCols={props.groupsCols}
                      setGroupsCols={props.setGroupsCols}
                      variant="vertical"
                      isSidebarCollapsed={isSidebarCollapsed}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="relative z-10 space-y-3 pt-3 border-t border-[var(--border-color)]/60 shrink-0">
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
  );
}
