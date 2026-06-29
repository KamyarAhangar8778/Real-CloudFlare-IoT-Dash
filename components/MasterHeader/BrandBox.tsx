import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Moon, Sun, Settings, Bot, Columns, MoreVertical, Layers, Settings2 } from "lucide-react";
import LayoutColumnsSwitcher from "./LayoutColumnsSwitcher";
import GroupFilterSelector from "./GroupFilterSelector";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";

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
  const { setIsAutomationsMenuOpen } = useDashboard();

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
      <div className="bg-[var(--card-bg-solid)] border border-[var(--border-color)] px-5 py-4 rounded-2xl md:rounded-bl-md md:rounded-tl-md md:rounded-tr-md shadow-sm flex items-center justify-between gap-4 transition-all duration-350 hover:-translate-y-1.5 hover:shadow-xl hover:border-[var(--accent3)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-xl shrink-0 flex items-center justify-center overflow-hidden shadow-sm hover:border-[var(--accent4)] transition-all">
            <Image
              src="/logo.png"
              alt="Logo"
              width={26}
              height={26}
              className="object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-right">
            <h1 className="font-sans font-extrabold text-[13.5px] tracking-tight text-[var(--text-primary)] leading-tight select-none">
              {headerTitle}
            </h1>
            <p className="text-[9px] text-[var(--text-muted)] font-mono leading-none mt-1">
              Interactive Modern Dashboard
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:w-1/3 xl:w-1/4 bg-[var(--card-bg-solid)] border border-[var(--border-color)] px-5 py-3.5 rounded-2xl shadow-sm flex items-center justify-between md:justify-start gap-4 transition-all duration-350 hover:-translate-y-1.5 hover:shadow-xl hover:border-[var(--accent3)] z-50 relative">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-xl shrink-0 flex items-center justify-center overflow-hidden shadow-sm hover:border-[var(--accent4)] transition-all">
          <Image
            src="/logo.png"
            alt="Logo"
            width={26}
            height={26}
            className="object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-right">
          <h1 className="font-sans font-extrabold text-[13.5px] md:text-sm tracking-tight text-[var(--text-primary)] leading-tight select-none">
            {headerTitle}
          </h1>
          <p className="text-[9px] text-[var(--text-muted)] font-mono leading-none mt-1">
            Interactive Modern Dashboard
          </p>
        </div>
      </div>

      {/* Mobile-only Theme Toggle & Menu located in title island for quick reach */}
      <div className="md:hidden flex items-center gap-1 bg-[var(--bg-main)] p-1 border border-[var(--border-color)] rounded-lg relative" ref={dropdownRef}>
        {setIsDark && (
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--accent4)] rounded transition-all"
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
          className={`p-1.5 rounded transition-all ${isDropdownOpen ? "bg-[var(--accent3-transparent)] text-[var(--accent3)]" : "text-[var(--text-secondary)] hover:text-[var(--accent3)]"}`}
          title="منوی دسترسی سریع"
          type="button"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-xl shadow-xl p-3 z-50 flex flex-col gap-3 origin-top-left animate-in fade-in zoom-in-95 duration-200">
            {/* Grid for Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsAutomationsMenuOpen(true);
                  setIsDropdownOpen(false);
                }}
                type="button"
                className="flex flex-col items-center justify-center gap-2 p-3 bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-[var(--accent3)] hover:bg-[var(--card-hover-bg)] rounded-xl transition-colors text-center group"
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
                  className="flex flex-col items-center justify-center gap-2 p-3 bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-indigo-500/50 hover:bg-[var(--card-hover-bg)] rounded-xl transition-colors text-center group"
                >
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
                    <Settings className={`w-4 h-4 ${animationsEnabled ? "group-hover:rotate-90 transition-transform duration-500" : ""}`} />
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
                  className="flex flex-col items-center justify-center gap-2 p-3 bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-[var(--accent4)] hover:bg-[var(--card-hover-bg)] rounded-xl transition-colors text-center group"
                >
                  <div className="p-1.5 rounded-lg bg-[var(--accent4-transparent)] text-[var(--accent4)]">
                    <Layers className={`w-4 h-4 ${animationsEnabled ? "group-hover:scale-110 transition-transform duration-300" : ""}`} />
                  </div>
                  <span className="text-[10px] font-bold text-[var(--text-primary)]">ماژول‌ها</span>
                </button>
              )}
              
              <button
                onClick={() => {
                  // Global rule settings trigger
                  const rulesBtn = document.getElementById("mobile-global-rules-trigger");
                  if (rulesBtn) rulesBtn.click();
                  setIsDropdownOpen(false);
                }}
                type="button"
                className="flex flex-col items-center justify-center gap-2 p-3 bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-amber-500/50 hover:bg-[var(--card-hover-bg)] rounded-xl transition-colors text-center group"
              >
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                  <Settings2 className={`w-4 h-4 ${animationsEnabled ? "animate-[spin_10s_linear_infinite]" : ""}`} />
                </div>
                <span className="text-[10px] font-bold text-[var(--text-primary)]">شرط‌ها</span>
              </button>
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

            {groupsOrder && setSelectedGroupFilter && (
              <div className="border-t border-[var(--border-color)] mt-1 pt-3 pb-1">
                <GroupFilterSelector
                  groupsOrder={groupsOrder}
                  selectedGroupFilter={selectedGroupFilter || null}
                  setSelectedGroupFilter={setSelectedGroupFilter}
                  variant="vertical"
                  animationsEnabled={animationsEnabled}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
