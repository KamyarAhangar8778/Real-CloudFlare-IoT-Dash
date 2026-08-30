import React from "react";
import { Settings2 } from "lucide-react";

interface TriggerButtonProps {
  variant: "horizontal" | "vertical";
  isSidebarCollapsed?: boolean;
  animationsEnabled?: boolean;
  onClick: () => void;
}

export default function TriggerButton({ variant, isSidebarCollapsed, animationsEnabled, onClick }: TriggerButtonProps) {
  if (isSidebarCollapsed || (variant === "horizontal" && isSidebarCollapsed !== false)) {
    return (
      <button
        id="mobile-global-rules-trigger"
        onClick={onClick}
        className="w-10 h-10 p-2 bg-[var(--card-bg)] md:hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] md:hover:border-[var(--accent3)]/60 rounded-xl text-[var(--accent3)] transition-all cursor-pointer flex justify-center items-center shadow-xs md:hover:shadow-[0_0_12px_var(--accent3-transparent)] active:scale-95"
        title="قوانین و شرط‌ها"
      >
        <Settings2 className={`w-4 h-4 transition-transform duration-300 ${animationsEnabled ? "md:hover:rotate-90" : ""}`} />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] md:hover:bg-[var(--card-hover-bg)] md:hover:border-[var(--accent3)]/40 text-[var(--text-secondary)] md:hover:text-[var(--text-primary)] transition-all duration-200 transform active:scale-[0.98] group cursor-pointer shadow-xs"
    >
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-[var(--accent3-transparent)] text-[var(--accent3)]">
          <Settings2
            className={`w-4 h-4 transition-transform duration-300 ${animationsEnabled ? "group-hover:rotate-90" : ""}`}
          />
        </div>
        <span className="text-xs font-semibold">قوانین و سناریوها</span>
      </div>
      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--border-color)]/60 text-[var(--text-muted)] font-mono">
        Rules
      </span>
    </button>
  );
}
