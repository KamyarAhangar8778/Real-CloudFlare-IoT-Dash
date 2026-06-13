"use client";

import React from "react";
import { Columns2, LayoutGrid } from "lucide-react";

interface LayoutSelectorProps {
  maxCols: number;
  onColsChange: (cols: number) => void;
  parentGroupsCols: number;
}

export default function LayoutSelector({
  maxCols,
  onColsChange,
  parentGroupsCols,
}: LayoutSelectorProps) {
  if (parentGroupsCols === 3) {
    return null;
  }

  return (
    <div className="hidden sm:flex items-center bg-[var(--bg-main)] border border-[var(--border-color)] p-0.5 rounded-xl text-xs gap-0.5 shrink-0 shadow-sm">
      <button
        onClick={() => onColsChange(1)}
        aria-label="تک ستون"
        className={`p-1 rounded-lg transition-all cursor-pointer select-none ${
          maxCols === 1
            ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] font-bold"
            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        }`}
        title="نمایش تک ستونه"
      >
        <Columns2 className="w-3.5 h-3.5 rotate-90" />
      </button>
      <button
        onClick={() => onColsChange(2)}
        aria-label="دو ستون"
        className={`p-1 rounded-lg transition-all cursor-pointer select-none ${
          maxCols === 2
            ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] font-bold"
            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        }`}
        title="نمایش دو ستونه"
      >
        <LayoutGrid className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onColsChange(3)}
        aria-label="سه ستون"
        className={`p-1 rounded-lg transition-all cursor-pointer select-none ${
          maxCols === 3
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
