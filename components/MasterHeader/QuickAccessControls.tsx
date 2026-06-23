import React from "react";
import { Settings as SettingsIcon, Layers } from "lucide-react";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";

interface QuickAccessControlsProps {
  setIsModulesMenuOpen: (val: boolean) => void;
  setIsMenuOpen: (val: boolean) => void;
  animationsEnabled?: boolean;
  variant: "vertical" | "horizontal";
}

export default function QuickAccessControls({
  setIsModulesMenuOpen,
  setIsMenuOpen,
  animationsEnabled,
  variant,
}: QuickAccessControlsProps) {
  const { setIsAutomationsMenuOpen } = useDashboard();

  if (variant === "vertical") {
    return (
      <div className="space-y-2 mt-4">
        <span className="text-[10px] text-[var(--text-muted)] font-black block text-right uppercase tracking-wider">
          بخش‌های کاربری
        </span>

        {/* Modules Drawer Trigger */}
        <button
          onClick={() => setIsModulesMenuOpen(true)}
          className="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg-solid)] hover:bg-[var(--card-hover-bg)] hover:border-[var(--accent4-medium)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300 transform active:scale-[0.98]"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[var(--accent4-transparent)] text-[var(--accent4)]">
              <Layers
                className={`w-4 h-4 ${animationsEnabled ? "animate-[pulse_3s_ease-in-out_infinite]" : ""}`}
              />
            </div>
            <span className="text-xs font-semibold">پالایه و ماژول‌ها</span>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--border-color)] text-[var(--text-muted)] font-mono">
            Modules
          </span>
        </button>

        {/* Automations Drawer Trigger */}
        <button
          onClick={() => setIsAutomationsMenuOpen(true)}
          className="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg-solid)] hover:bg-[var(--card-hover-bg)] hover:border-[var(--accent3-medium)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300 transform active:scale-[0.98]"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[var(--accent3-transparent)] text-[var(--accent3)]">
              <svg xmlns="http://www.w3.org/00/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 ${animationsEnabled ? "animate-[pulse_3s_ease-in-out_infinite]" : ""}`}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <span className="text-xs font-semibold">اتوماسیون‌ها</span>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--border-color)] text-[var(--text-muted)] font-mono">
            Time
          </span>
        </button>

        {/* System config trigger */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg-solid)] hover:bg-[var(--card-hover-bg)] hover:border-[var(--accent3-medium)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300 transform active:scale-[0.98]"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-gray-500/10 text-[var(--text-tertiary)] transition-all">
              <SettingsIcon
                className={`w-4 h-4 ${animationsEnabled ? "animate-[spin_10s_linear_infinite]" : ""}`}
              />
            </div>
            <span className="text-xs font-semibold">تنظیمات اصلی</span>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--border-color)] text-[var(--text-muted)] font-mono">
            Setup
          </span>
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Modules trigger */}
      <button
        onClick={() => setIsModulesMenuOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 md:py-2 bg-[var(--card-bg-solid)] hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] rounded-xl text-xs font-semibold text-[var(--text-secondary)] transition-all hover:border-[var(--accent4)] active:scale-[0.97]"
        title="مدیریت ماژول‌ها و ابزارها"
      >
        <Layers
          className={`w-3.5 h-3.5 text-[var(--accent4)] ${animationsEnabled ? "animate-[pulse_3s_ease-in-out_infinite]" : ""}`}
        />
        <span>ماژول‌ها</span>
      </button>

      {/* Automations trigger */}
      <button
        onClick={() => setIsAutomationsMenuOpen(true)}
        className="p-2 md:p-2.5 bg-[var(--card-bg-solid)] hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all hover:border-[var(--accent3)] active:scale-[0.97] group"
        title="اتوماسیون‌های زمانی"
      >
        <svg xmlns="http://www.w3.org/00/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 transition-transform duration-300 ${animationsEnabled ? "group-hover:scale-110" : ""}`}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      </button>

      {/* General system Settings trigger */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="p-2 md:p-2.5 bg-[var(--card-bg-solid)] hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all hover:border-[var(--accent3)] active:scale-[0.97] group"
        title="پیکربندی سیستم"
      >
        <SettingsIcon
          className={`w-4 h-4 transition-transform duration-300 ${animationsEnabled ? "animate-[spin_10s_linear_infinite]" : ""}`}
        />
      </button>
    </>
  );
}
