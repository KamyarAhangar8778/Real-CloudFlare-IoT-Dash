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
  onUpdateSegmentAutoOff?: (id: string, autoOff: number) => void;
  onUpdateSegmentRule?: (id: string, rule: { targetPinHigh: string; actionOnHigh: boolean; targetPinLow: string; actionOnLow: boolean }) => void;
  countdown?: number | null;
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
  onUpdateSegmentAutoOff,
  onUpdateSegmentRule,
  countdown,
  attributes,
  listeners,
}: CardHeaderProps) {
  const [showAutoOffMenu, setShowAutoOffMenu] = React.useState(false);
  const [showRuleMenu, setShowRuleMenu] = React.useState(false);
  const autoOffValue = segment.auto_off || 0;
  const rule = segment.rule || { targetPinHigh: "", actionOnHigh: true, targetPinLow: "", actionOnLow: false };
  return (
    <div
      className={`flex items-center justify-between border-b border-[var(--border-color)] bg-slate-500/[0.05] dark:bg-black/25 ${
        isUltraCompact ? "p-2" : "p-4"
      }`}
    >
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

        {onUpdateSegmentMode && segment.type !== "input" && (
          <div
            className="flex items-center bg-slate-200/90 dark:bg-slate-950 border border-slate-300/85 dark:border-slate-800 p-[3px] mr-1.5 rounded-full shadow-sm relative"
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
            {(!segment.auto_off || segment.auto_off === 0) && (
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
            )}

            {onUpdateSegmentAutoOff && (
              <div className="relative flex items-center ml-1 pl-1 border-l border-slate-300 dark:border-slate-700">
                <button
                  onClick={() => setShowAutoOffMenu(!showAutoOffMenu)}
                  className={`p-1 rounded-full transition-colors ${autoOffValue > 0 ? "text-[var(--accent3)]" : "text-slate-500 hover:text-slate-800 dark:hover:text-white"}`}
                  title="تنظیم زمان خاموشی خودکار (Auto-Off)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </button>
                {countdown !== null && countdown !== undefined && (
                  <span className="text-[10px] font-bold text-[var(--accent3)] mr-1 tabular-nums">
                    {countdown}s
                  </span>
                )}

                {showAutoOffMenu && (
                  <div className="absolute top-full mt-2 left-0 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-3 z-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                        خاموشی خودکار: {autoOffValue > 0 ? `${autoOffValue} ثانیه` : "غیرفعال"}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      value={autoOffValue}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        onUpdateSegmentAutoOff(segment.id, val);
                        if (val > 0 && mode === "push" && onUpdateSegmentMode) {
                          onUpdateSegmentMode(segment.id, "switch");
                        }
                      }}
                      className="w-full accent-[var(--accent3)] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] text-slate-500 mt-1 px-1">
                      <span>خاموش</span>
                      <span>60s</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="text-right">
          <span
            className={`block font-sans font-extrabold theme-text-primary group-hover:text-[var(--accent3)] transition-colors ${
              isUltraCompact ? "text-[10px]" : "text-xs"
            }`}
          >
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
