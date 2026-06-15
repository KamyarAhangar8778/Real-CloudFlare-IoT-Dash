import React from "react";
import { Columns2, LayoutGrid } from "lucide-react";

interface LayoutColumnsSwitcherProps {
  groupsCols: number;
  setGroupsCols: (val: number) => void;
  variant: "vertical" | "horizontal";
}

export default function LayoutColumnsSwitcher({
  groupsCols,
  setGroupsCols,
  variant,
}: LayoutColumnsSwitcherProps) {
  if (variant === "vertical") {
    return (
      <div className="flex items-center justify-between p-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg gap-2">
        <span className="text-[10px] text-[var(--text-tertiary)] font-bold">ستون‌ها:</span>
        <div className="flex gap-1">
          {[1, 2, 3].map((cols) => (
            <button
              key={cols}
              onClick={() => setGroupsCols(cols)}
              className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                groupsCols === cols
                  ? "bg-[var(--accent3)] text-black"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {cols} ستون
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center bg-[var(--bg-main)] border border-[var(--border-color)] p-0.5 rounded-xl text-xs gap-0.5 shrink-0">
      <button
        onClick={() => setGroupsCols(1)}
        aria-label="تک ستون"
        className={`p-1.5 rounded-lg transition-all ${
          groupsCols === 1
            ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] font-bold"
            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        }`}
        title="نمایش تک ستونه"
      >
        <Columns2 className="w-3.5 h-3.5 rotate-90" />
      </button>
      <button
        onClick={() => setGroupsCols(2)}
        aria-label="دو ستون"
        className={`p-1.5 rounded-lg transition-all ${
          groupsCols === 2
            ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] font-bold"
            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        }`}
        title="نمایش دو ستونه"
      >
        <LayoutGrid className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setGroupsCols(3)}
        aria-label="سه ستون"
        className={`p-1.5 rounded-lg transition-all ${
          groupsCols === 3
            ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] font-bold"
            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        }`}
        title="نمایش سه ستونه"
      >
        <LayoutGrid className="w-3.5 h-3.5 scale-x-110" />
      </button>
    </div>
  );
}
