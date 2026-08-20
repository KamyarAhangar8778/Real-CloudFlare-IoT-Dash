import React from "react";
import { SingleColumnIcon, DoubleColumnIcon, TripleColumnIcon } from "@/components/icons";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

interface LayoutColumnsSwitcherProps {
  groupsCols: number;
  setGroupsCols: (val: number) => void;
  variant: "vertical" | "horizontal";
  isSidebarCollapsed?: boolean;
}

export default function LayoutColumnsSwitcher({
  groupsCols,
  setGroupsCols,
  variant,
  isSidebarCollapsed,
}: LayoutColumnsSwitcherProps) {
  const animationsEnabled = useIoTStore((s) => s.animationsEnabled);

  if (variant === "vertical" && !isSidebarCollapsed) {
    return (
      <div className="flex items-center justify-between p-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg gap-2">
        <span className="text-[10px] text-[var(--text-tertiary)] font-bold">ستون‌ها:</span>
        <div className="flex gap-1">
          {[1, 2, 3].map((cols) => (
            <button
              key={cols}
              onClick={() => setGroupsCols(cols)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                groupsCols === cols
                  ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] border border-[var(--accent3-medium)] shadow-xs"
                  : "text-[var(--text-muted)] md:hover:text-[var(--text-primary)] border border-transparent"
              }`}
            >
              {cols === 1 && <SingleColumnIcon size={12} animationsEnabled={animationsEnabled} isActive={groupsCols === 1} />}
              {cols === 2 && <DoubleColumnIcon size={12} animationsEnabled={animationsEnabled} isActive={groupsCols === 2} />}
              {cols === 3 && <TripleColumnIcon size={12} animationsEnabled={animationsEnabled} isActive={groupsCols === 3} />}
              <span>{cols} ستون</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${variant === "vertical" && isSidebarCollapsed ? "flex-col" : "items-center"} bg-transparent border border-[var(--border-color)] p-0.5 rounded-xl text-xs gap-0.5 shrink-0`}>
      <button
        onClick={() => setGroupsCols(1)}
        aria-label="تک ستون"
        className={`p-1.5 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
          groupsCols === 1
            ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] font-bold shadow-xs"
            : "text-[var(--text-muted)] md:hover:text-[var(--text-primary)] md:hover:bg-[var(--accent3-transparent)]"
        }`}
        title="نمایش تک ستونه"
      >
        <SingleColumnIcon
          size={14}
          animationsEnabled={animationsEnabled}
          isActive={groupsCols === 1}
        />
      </button>
      <button
        onClick={() => setGroupsCols(2)}
        aria-label="دو ستون"
        className={`p-1.5 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
          groupsCols === 2
            ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] font-bold shadow-xs"
            : "text-[var(--text-muted)] md:hover:text-[var(--text-primary)] md:hover:bg-[var(--accent3-transparent)]"
        }`}
        title="نمایش دو ستونه"
      >
        <DoubleColumnIcon
          size={14}
          animationsEnabled={animationsEnabled}
          isActive={groupsCols === 2}
        />
      </button>
      <button
        onClick={() => setGroupsCols(3)}
        aria-label="سه ستون"
        className={`p-1.5 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
          groupsCols === 3
            ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] font-bold shadow-xs"
            : "text-[var(--text-muted)] md:hover:text-[var(--text-primary)] md:hover:bg-[var(--accent3-transparent)]"
        }`}
        title="نمایش سه ستونه"
      >
        <TripleColumnIcon
          size={14}
          animationsEnabled={animationsEnabled}
          isActive={groupsCols === 3}
        />
      </button>
    </div>
  );
}

