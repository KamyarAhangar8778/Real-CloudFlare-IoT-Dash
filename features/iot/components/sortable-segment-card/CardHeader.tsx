import React from "react";
import { X, GripVertical, Cpu } from "lucide-react";
import { BUTTON_CLIP } from "@/lib/presets";
import { SegmentData } from "./types";

interface CardHeaderProps {
  segment: SegmentData;
  isPinOn: boolean;
  isUltraCompact: boolean;
  mode: "switch" | "push";
  onRemove: (id: string) => void;
  onUpdateSegmentMode?: (id: string, mode: "switch" | "push") => void;
  attributes: any;
  listeners: any;
}

export default function CardHeader({
  segment,
  isPinOn,
  isUltraCompact,
  mode,
  onRemove,
  onUpdateSegmentMode,
  attributes,
  listeners,
}: CardHeaderProps) {
  return (
    <div className={`flex items-center justify-between border-b border-[var(--border-color)] bg-slate-500/[0.05] dark:bg-black/25 ${
      isUltraCompact ? "p-2" : "p-4"
    }`}>
      <div className="flex items-center gap-1.5 md:gap-2">
        <button
          onClick={() => onRemove(segment.id)}
          className="p-1.5 bg-slate-200/90 dark:bg-slate-950 border border-slate-300/85 dark:border-slate-800 text-slate-700 dark:text-gray-300 hover:border-[var(--accent3)] hover:text-[var(--accent3)] transition-all cursor-pointer rounded-lg shadow-sm"
          title="حذف این سگمنت"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <X className={`${isUltraCompact ? "w-3 h-3" : "w-3.5 h-3.5"}`} />
        </button>
        
        <div 
          {...attributes} 
          {...listeners}
          className="p-1.5 bg-slate-200/90 dark:bg-slate-950 border border-slate-300/85 dark:border-slate-800 text-slate-700 dark:text-gray-300 hover:border-[var(--accent3)] hover:text-[var(--accent3)] cursor-grab active:cursor-grabbing transition-all rounded-lg shadow-sm"
          title="کشیدن برای جابه‌جایی"
        >
          <GripVertical className={`${isUltraCompact ? "w-3.5 h-3.5" : "w-4 h-4"}`} />
        </div>

        {onUpdateSegmentMode && (
          <div 
            className="flex items-center bg-slate-200/90 dark:bg-slate-950 border border-slate-300/85 dark:border-slate-800 p-[3px] mr-1.5 rounded-full shadow-sm"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onUpdateSegmentMode(segment.id, "switch")}
              className={`px-2.5 py-1 text-[9.5px] font-sans font-extrabold transition-all duration-150 cursor-pointer select-none rounded-full ${
                mode === "switch"
                  ? "bg-[var(--accent3)] text-black font-black shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
                  : "text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
              }`}
              title="حالت سوئیچ دائمی"
            >
              سوئیچ
            </button>
            <button
              onClick={() => onUpdateSegmentMode(segment.id, "push")}
              className={`px-2.5 py-1 text-[9.5px] font-sans font-extrabold transition-all duration-150 cursor-pointer select-none rounded-full ${
                mode === "push"
                  ? "bg-[var(--accent3)] text-black font-black shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
                  : "text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
              }`}
              title="حالت شستی لحظه‌ای"
            >
              شستی
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="text-right">
          <span className={`block font-sans font-extrabold theme-text-primary group-hover:text-[var(--accent3)] transition-colors ${
            isUltraCompact ? "text-[10px]" : "text-xs"
          }`}>
            {segment.title}
          </span>
        </div>
        {!isUltraCompact && (
          <div 
            className={`p-2 transition-colors ${isPinOn ? "bg-[var(--accent4-transparent)] text-[var(--accent4)]" : "bg-gray-800/20 text-gray-500"}`}
            style={{ clipPath: BUTTON_CLIP }}
          >
            <Cpu className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
}
