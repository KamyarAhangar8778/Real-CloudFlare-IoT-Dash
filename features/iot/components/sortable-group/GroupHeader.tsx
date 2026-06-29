"use client";

import React from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { ICON_MAP } from "@/features/iot/utils/icons";
import LayoutSelector from "./LayoutSelector";

interface GroupHeaderProps {
  id: string;
  segmentCount: number;
  maxCols: number;
  icon?: string;
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
  icon,
  onColsChange,
  onAddPlaceholder,
  onDeleteGroup,
  parentGroupsCols,
  attributes,
  listeners,
}: GroupHeaderProps) {
  
  return (
    <div
      className="flex items-stretch justify-between bg-[var(--card-bg)] backdrop-blur-md border border-[var(--border-color)] shadow-sm transition-colors duration-350 md:group-hover/group-card:border-[var(--accent3)] md:group-hover/group-card:shadow-xl relative z-10 rounded-t-2xl rounded-b-none overflow-hidden"
    >
      {/* Right Part: Title and Layout Selector */}
      <div className={`flex items-center justify-between flex-1 min-w-0 ${parentGroupsCols === 3 ? "p-1.5 pr-3 gap-2" : "p-2 pr-4 gap-3 sm:p-2.5 sm:pr-5 sm:gap-4"}`}>
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`flex items-center justify-center bg-[var(--accent3-transparent)] text-[var(--accent3)] shrink-0 ${
              parentGroupsCols === 3 ? "p-1 w-6 h-6" : "p-1.5 w-7 h-7 sm:p-2 sm:w-auto sm:h-auto"
            }`}
            style={{
              clipPath:
                "polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)",
            }}
          >
            {icon && ICON_MAP[icon] ? (
              React.createElement(ICON_MAP[icon], { className: parentGroupsCols === 3 ? "w-3.5 h-3.5" : "w-4 h-4 sm:w-5 sm:h-5" })
            ) : (
              React.createElement(ICON_MAP["Layers"], { className: parentGroupsCols === 3 ? "w-3.5 h-3.5" : "w-4 h-4 sm:w-5 sm:h-5" })
            )}
          </div>
          <div className="min-w-0 flex-1 text-right leading-tight">
            <h4
              className={`font-sans font-extrabold text-slate-900 dark:text-[var(--accent3)] truncate ${
                parentGroupsCols === 3 ? "text-[11px]" : "text-xs sm:text-base"
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
          className={`flex items-center justify-center text-[var(--text-secondary)] md:hover:text-emerald-600 dark:md:hover:text-emerald-400 md:hover:bg-emerald-500/10 transition-all duration-300 cursor-pointer border-l border-[var(--border-color)] group ${parentGroupsCols === 3 ? "w-10" : "w-12 sm:w-14"}`}
          title="اضافه کردن سگمنت (پایه خالی) به این گروه"
        >
          <Plus className={`transition-transform duration-300 md:group-hover:scale-110 ${parentGroupsCols === 3 ? "w-4 h-4" : "w-5 h-5"}`} />
        </button>

        {/* Delete Group Handle */}
        <button
          onClick={() => onDeleteGroup(id)}
          className={`flex items-center justify-center text-[var(--text-secondary)] md:hover:text-rose-600 dark:md:hover:text-rose-400 md:hover:bg-rose-500/10 transition-all duration-300 cursor-pointer border-l border-[var(--border-color)] group ${parentGroupsCols === 3 ? "w-10" : "w-12 sm:w-14"}`}
          title="حذف کامل این گروه و تمامی سگمنت‌های داخل آن"
        >
          <Trash2 className={`transition-transform duration-300 md:group-hover:scale-110 ${parentGroupsCols === 3 ? "w-4 h-4" : "w-5 h-5"}`} />
        </button>

        {/* Group Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className={`flex items-center justify-center text-[var(--text-secondary)] md:hover:text-indigo-600 dark:md:hover:text-indigo-400 md:hover:bg-indigo-500/10 transition-all duration-300 cursor-grab active:cursor-grabbing border-l-0 group ${parentGroupsCols === 3 ? "w-10" : "w-12 sm:w-14"}`}
          title="کشیدن کل گروه برای جابه‌جایی"
        >
          <GripVertical className={`transition-transform duration-300 group-md:hover:scale-110 ${parentGroupsCols === 3 ? "w-4 h-4" : "w-5 h-5"}`} />
        </div>
      </div>
    </div>
  );
}
