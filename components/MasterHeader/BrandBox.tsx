import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Moon, Sun, Settings, Bot, Columns, MoreVertical, Layers } from "lucide-react";
import LayoutColumnsSwitcher from "./LayoutColumnsSwitcher";
import GroupFilterSelector from "./GroupFilterSelector";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import { AnimatePresence, motion } from "motion/react";

interface BrandBoxProps {
  headerTitle: string;
  variant: "vertical" | "horizontal";
  isDark?: boolean;
  setIsDark?: (val: boolean) => void;
  animationsEnabled?: boolean;
  setIsModulesMenuOpen?: (val: boolean) => void;
  setIsMenuOpen?: (val: boolean) => void;
  groupsCols?: number;
  setGroupsCols?: (val: number) => void;
  groupsOrder?: string[];
  selectedGroupFilter?: string | null;
  setSelectedGroupFilter?: (group: string | null) => void;
}

export default function BrandBox({
  headerTitle,
  variant,
  isDark,
  setIsDark,
  animationsEnabled,
  setIsModulesMenuOpen,
  setIsMenuOpen,
  groupsCols,
  setGroupsCols,
  groupsOrder,
  selectedGroupFilter,
  setSelectedGroupFilter,
}: BrandBoxProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // We need this for Automations menu
  const { setIsAutomationsMenuOpen, isFullyReady } = useDashboard();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.addEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (variant === "vertical") {
    return (
      <div className="relative group rounded-2xl md:rounded-bl-md md:rounded-tl-md md:rounded-tr-md transition-all duration-350 md:hover:-translate-y-1.5 md:hover:shadow-xl">
        {animationsEnabled && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 opacity-60" xmlns="http://www.w3.org/2000/svg">
            <rect 
              x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" 
              rx="14" ry="14" 
              fill="none" 
              stroke="var(--accent3)" 
              strokeWidth="1.5" 
              pathLength="100"
              strokeDasharray="15 85"
              className="animate-[svg-border-spin_10s_linear_infinite] md:[rx:4px] [rx:14px] md:[ry:4px] [ry:14px]"
            />
          </svg>
        )}
        <div className={`relative z-10 h-full bg-[var(--card-bg-solid)] border border-[var(--border-color)] px-5 py-4 rounded-2xl md:rounded-bl-md md:rounded-tl-md md:rounded-tr-md flex items-center justify-between gap-4 transition-colors duration-300`}>
          <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-xl shrink-0 flex items-center justify-center overflow-hidden shadow-sm md:hover:border-[var(--accent4)] transition-all">
            <Image
              src="/logo.png"
              alt="Logo"
              width={26}
              height={26}
              className="object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <h1 className="font-sans font-extrabold text-[13.5px] tracking-tight leading-tight select-none transition-all duration-300 md:hover:scale-[1.02] title-animated">
              {isFullyReady ? headerTitle : <div className="w-32 h-4 bg-[var(--text-muted)] opacity-20 rounded animate-pulse" />}
            </h1>
            {groupsOrder && setSelectedGroupFilter ? (
              <div className="mt-1 block md:hidden">
                <GroupFilterSelector
                  groupsOrder={groupsOrder}
                  selectedGroupFilter={selectedGroupFilter || null}
                  setSelectedGroupFilter={setSelectedGroupFilter}
                  animationsEnabled={animationsEnabled}
                  isCompact={true}
                />
              </div>
            ) : null}
          </div>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:w-1/3 xl:w-1/4 relative group rounded-2xl transition-all duration-350 md:hover:-translate-y-1.5 md:hover:shadow-xl z-50">
      {animationsEnabled && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 opacity-60" xmlns="http://www.w3.org/2000/svg">
          <rect 
            x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" 
            rx="14" ry="14" 
            fill="none" 
            stroke="var(--accent3)" 
            strokeWidth="1.5" 
            pathLength="100"
            strokeDasharray="15 85"
            className="animate-[svg-border-spin_10s_linear_infinite]"
          />
        </svg>
      )}
      <div className={`relative z-10 h-full bg-[var(--card-bg-solid)] border border-[var(--border-color)] px-5 py-3.5 rounded-2xl flex items-center justify-between md:justify-start gap-4 transition-colors duration-300`}>
        <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-xl shrink-0 flex items-center justify-center overflow-hidden shadow-sm md:hover:border-[var(--accent4)] transition-all">
          <Image
            src="/logo.png"
            alt="Logo"
            width={26}
            height={26}
            className="object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-right flex flex-col items-end gap-1">
          <h1 className="font-sans font-extrabold text-[13.5px] md:text-sm tracking-tight leading-tight select-none transition-all duration-300 md:hover:scale-[1.02] title-animated">
            {isFullyReady ? headerTitle : <div className="w-32 h-4 bg-[var(--text-muted)] opacity-20 rounded animate-pulse" />}
          </h1>
          {groupsOrder && setSelectedGroupFilter ? (
            <div className="mt-1 block md:hidden">
              <GroupFilterSelector
                groupsOrder={groupsOrder}
                selectedGroupFilter={selectedGroupFilter || null}
                setSelectedGroupFilter={setSelectedGroupFilter}
                animationsEnabled={animationsEnabled}
                isCompact={true}
              />
            </div>
          ) : null}
        </div>
      </div>

      {/* Mobile-only Theme Toggle & Menu located in title island for quick reach */}
      <div className="md:hidden flex items-center gap-1 bg-[var(--bg-main)] p-1 border border-[var(--border-color)] rounded-lg relative" ref={dropdownRef}>
        {setIsDark && (
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-1.5 text-[var(--text-secondary)] md:hover:text-[var(--accent4)] rounded transition-all"
            title="تغییر تم پوسته"
            type="button"
          >
            {isDark ? (
              <Moon
                className={`w-4 h-4 text-indigo-400 ${animationsEnabled ? "animate-[bounce_3s_infinite]" : ""}`}
              />
            ) : (
              <Sun
                className={`w-4 h-4 text-orange-400 ${animationsEnabled ? "animate-[spin_20s_linear_infinite]" : ""}`}
              />
            )}
          </button>
        )}
        
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`p-1.5 rounded transition-all ${isDropdownOpen ? "bg-[var(--accent3-transparent)] text-[var(--accent3)]" : "text-[var(--text-secondary)] md:hover:text-[var(--accent3)]"}`}
          title="منوی دسترسی سریع"
          type="button"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={animationsEnabled ? { opacity: 0, scale: 0.95, originX: 0, originY: 0 } : false}
              animate={animationsEnabled ? { opacity: 1, scale: 1 } : false}
              exit={animationsEnabled ? { opacity: 0, scale: 0.95 } : undefined}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 w-64 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-xl shadow-xl p-3 z-50 flex flex-col gap-3 origin-top-left"
            >
              {/* Grid for Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsAutomationsMenuOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  type="button"
                  className="flex flex-col items-center justify-center gap-2 p-3 bg-[var(--bg-main)] border border-[var(--border-color)] md:hover:border-[var(--accent3)] md:hover:bg-[var(--card-hover-bg)] rounded-xl transition-colors text-center group"
                >
                  <div className="p-1.5 rounded-lg bg-[var(--accent3-transparent)] text-[var(--accent3)]">
                    <Bot className={`w-4 h-4 ${animationsEnabled ? "animate-[pulse_3s_ease-in-out_infinite]" : ""}`} />
                  </div>
                  <span className="text-[10px] font-bold text-[var(--text-primary)]">اتوماسیون‌ها</span>
                </button>

                {setIsMenuOpen && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(true);
                      setIsDropdownOpen(false);
                    }}
                    type="button"
                    className="flex flex-col items-center justify-center gap-2 p-3 bg-[var(--bg-main)] border border-[var(--border-color)] md:hover:border-indigo-500/50 md:hover:bg-[var(--card-hover-bg)] rounded-xl transition-colors text-center group"
                  >
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
                      <Settings className={`w-4 h-4 ${animationsEnabled ? "md:group-hover:rotate-90 transition-transform duration-500" : ""}`} />
                    </div>
                    <span className="text-[10px] font-bold text-[var(--text-primary)]">تنظیمات</span>
                  </button>
                )}

                {setIsModulesMenuOpen && (
                  <button
                    onClick={() => {
                      setIsModulesMenuOpen(true);
                      setIsDropdownOpen(false);
                    }}
                    type="button"
                    className="col-span-2 flex flex-col items-center justify-center gap-2 p-3 bg-[var(--bg-main)] border border-[var(--border-color)] md:hover:border-[var(--accent4)] md:hover:bg-[var(--card-hover-bg)] rounded-xl transition-colors text-center group"
                  >
                    <div className="p-1.5 rounded-lg bg-[var(--accent4-transparent)] text-[var(--accent4)]">
                      <Layers className={`w-4 h-4 ${animationsEnabled ? "md:group-hover:scale-110 transition-transform duration-300" : ""}`} />
                    </div>
                    <span className="text-[10px] font-bold text-[var(--text-primary)]">ماژول‌ها</span>
                  </button>
                )}
              </div>

              {setGroupsCols && groupsCols !== undefined && (
                <div className="border-t border-[var(--border-color)] mt-1 pt-3 pb-1">
                  <div className="px-1 mb-2 text-[10px] text-[var(--text-muted)] flex items-center justify-between">
                    <span>تعداد ستون‌ها</span>
                    <Columns className="w-3 h-3" />
                  </div>
                  <div className="flex justify-center" onClick={(e) => {
                    // Only close if a button was actually clicked
                    if ((e.target as HTMLElement).closest('button')) {
                      setIsDropdownOpen(false);
                    }
                  }}>
                    <LayoutColumnsSwitcher
                      groupsCols={groupsCols}
                      setGroupsCols={setGroupsCols}
                      variant="horizontal"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
    </div>
  );
}
