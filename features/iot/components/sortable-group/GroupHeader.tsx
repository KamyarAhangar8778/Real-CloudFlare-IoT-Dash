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
      className="flex items-stretch justify-between bg-black/[0.08] dark:bg-black/35 border-b border-[var(--border-color)] relative z-10 rounded-t-2xl overflow-hidden"
    >
      {/* Right Part: Title and Layout Selector */}
      <div className={`flex items-center justify-between flex-1 ${parentGroupsCols === 3 ? "p-2 pr-4 gap-2" : "p-2.5 pr-5 gap-4"}`}>
        <div className="flex items-center gap-2 min-w-0">
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

        <div className="shrink-0">
          <LayoutSelector
            maxCols={maxCols}
            onColsChange={onColsChange}
            parentGroupsCols={parentGroupsCols}
          />
        </div>
      </div>

      {/* Left Part: 3 Action Buttons */}
      <div className="flex items-stretch shrink-0 border-r border-[var(--border-color)]">
        {/* Add Placeholder Handle */}
        <button
          onClick={() => onAddPlaceholder(id)}
          className={`flex items-center justify-center text-slate-600 dark:text-gray-400 hover:text-[var(--accent3)] hover:bg-[var(--accent3-transparent)] transition-all cursor-pointer border-l border-[var(--border-color)] ${parentGroupsCols === 3 ? "w-10" : "w-12 sm:w-14"}`}
          title="اضافه کردن سگمنت (پایه خالی) به این گروه"
        >
          <Plus className={parentGroupsCols === 3 ? "w-4 h-4" : "w-5 h-5"} />
        </button>

        {/* Delete Group Handle */}
        <button
          onClick={() => onDeleteGroup(id)}
          className={`flex items-center justify-center text-slate-600 dark:text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer border-l border-[var(--border-color)] ${parentGroupsCols === 3 ? "w-10" : "w-12 sm:w-14"}`}
          title="حذف کامل این گروه و تمامی سگمنت‌های داخل آن"
        >
          <Trash2 className={parentGroupsCols === 3 ? "w-4 h-4" : "w-5 h-5"} />
        </button>

        {/* Group Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className={`flex items-center justify-center text-slate-600 dark:text-gray-400 hover:text-[var(--accent3)] hover:bg-[var(--accent3-transparent)] transition-all cursor-grab active:cursor-grabbing ${parentGroupsCols === 3 ? "w-10" : "w-12 sm:w-14"}`}
          title="کشیدن کل گروه برای جابه‌جایی"
        >
          <GripVertical className={parentGroupsCols === 3 ? "w-4 h-4" : "w-5 h-5"} />
        </div>
      </div>
    </div>
  );
}
