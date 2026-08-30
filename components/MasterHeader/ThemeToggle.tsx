import React from "react";
import { ThemeAnimatedIcon } from "@/components/icons";

interface ThemeToggleProps {
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  animationsEnabled?: boolean;
  variant?: "vertical" | "horizontal";
  isSidebarCollapsed?: boolean;
}

/**
 * Dashboard Theme Toggle button for the Right-Docked Master Header.
 */
export default function ThemeToggle({
  isDark,
  setIsDark,
  animationsEnabled = false,
  isSidebarCollapsed,
}: ThemeToggleProps) {
  if (!isSidebarCollapsed) {
    return (
      <div className="pt-2 border-t border-[var(--border-color)]/60">
        <button
          onClick={() => setIsDark(!isDark)}
          className="w-full flex items-center justify-between p-2 rounded-xl bg-[var(--card-bg)] md:hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] transition-all text-xs font-medium group cursor-pointer shadow-xs active:scale-[0.98]"
          title="تغییر حالت روز و شب"
        >
          <span className="text-[11px] text-[var(--text-secondary)] font-medium">
            {isDark ? "حالت شب (تیره)" : "حالت روز (روشن)"}
          </span>
          <div className="p-1.5 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] shadow-xs text-[var(--accent3)]">
            <ThemeAnimatedIcon
              isDark={isDark}
              animationsEnabled={animationsEnabled}
              size={15}
            />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="pt-2 border-t border-[var(--border-color)]/60 flex justify-center w-full">
      <button
        onClick={() => setIsDark(!isDark)}
        className="w-10 h-10 flex justify-center items-center p-2 bg-[var(--card-bg)] md:hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] md:hover:text-[var(--accent3)] md:hover:border-[var(--accent3)]/50 transition-all active:scale-95 group cursor-pointer shadow-xs md:hover:shadow-[0_0_12px_var(--accent3-transparent)]"
        title="تغییر رنگ پوسته"
      >
        <ThemeAnimatedIcon
          isDark={isDark}
          animationsEnabled={animationsEnabled}
          size={16}
        />
      </button>
    </div>
  );
}


