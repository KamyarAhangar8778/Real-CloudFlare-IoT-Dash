"use client";

import React from "react";
import { Layers, Plus, Trash2, GripVertical } from "lucide-react";
import LayoutSelector from "./LayoutSelector";

interface GroupHeaderProps {
  id: string;
  segmentCount: number;
  maxCols: number;
  onColsChange: (cols: number) => void;
  onAddPlaceholder: (groupId: string) => void;
  onDeleteGroup: (groupId: string) => void;
  parentGroupsCols: number;
  attributes: any;
  listeners: any;
}

export default function GroupHeader({
  id,
  segmentCount,
  maxCols,
  onColsChange,
  onAddPlaceholder,
  onDeleteGroup,
  parentGroupsCols,
  attributes,
  listeners,
}: GroupHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between bg-black/[0.08] dark:bg-black/35 border-b border-[var(--border-color)] relative z-10 rounded-t-2xl ${
        parentGroupsCols === 3 ? "p-3 px-4 gap-2" : "p-4 gap-4"
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div
          className={`flex items-center justify-center bg-[var(--accent3-transparent)] text-[var(--accent3)] shrink-0 ${
            parentGroupsCols === 3 ? "p-1.5" : "p-2"
          }`}
          style={{
            clipPath:
              "polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)",
          }}
        >
          <Layers className={parentGroupsCols === 3 ? "w-4 h-4" : "w-5 h-5"} />
        </div>
        <div className="min-w-0 flex-1 text-right">
          <h4
            className={`font-sans font-extrabold text-slate-850 dark:text-[var(--accent3)] truncate ${
              parentGroupsCols === 3 ? "text-[11px]" : "text-base"
            }`}
          >
            {id}
          </h4>
          <span className="text-[9px] theme-text-muted mt-0.5 whitespace-nowrap block">
            ({segmentCount} دستگاه)
          </span>
        </div>
      </div>

      <div className={`flex items-center shrink-0 ${parentGroupsCols === 3 ? "gap-1" : "gap-3"}`}>
        <LayoutSelector
          maxCols={maxCols}
          onColsChange={onColsChange}
          parentGroupsCols={parentGroupsCols}
        />

        {/* Add Placeholder Handle */}
        <button
          onClick={() => onAddPlaceholder(id)}
          className="p-1.5 bg-slate-200/90 dark:bg-slate-950 border border-slate-300/85 dark:border-slate-800 text-slate-700 dark:text-gray-300 hover:border-[var(--accent3)] hover:text-[var(--accent3)] transition-all cursor-pointer rounded-lg shadow-sm"
          title="اضافه کردن سگمنت (پایه خالی) به این گروه"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Delete Group Handle */}
        <button
          onClick={() => onDeleteGroup(id)}
          className="p-1.5 bg-slate-200/90 dark:bg-slate-950 border border-slate-300/85 dark:border-slate-800 text-slate-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-all cursor-pointer rounded-lg shadow-sm"
          title="حذف کامل این گروه و تمامی سگمنت‌های داخل آن"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Group Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="p-1.5 bg-slate-200/90 dark:bg-slate-950 border border-slate-300/85 dark:border-slate-800 text-slate-700 dark:text-gray-300 hover:border-[var(--accent3)] hover:text-[var(--accent3)] cursor-grab active:cursor-grabbing transition-all rounded-lg shadow-sm"
          title="کشیدن کل گروه برای جابه‌جایی"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
