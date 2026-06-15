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
  onUpdateSegmentRule?: (id: string, rule: { targetPin: string; triggerState: boolean; actionState: boolean }) => void;
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
  const rule = segment.rule || { targetPin: "", triggerState: true, actionState: true };
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

        {onUpdateSegmentMode && (
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

        {segment.type === "input" && onUpdateSegmentRule && (
          <div className="relative flex items-center bg-slate-200/90 dark:bg-slate-950 border border-slate-300/85 dark:border-slate-800 p-[3px] mr-1.5 rounded-full shadow-sm" onPointerDown={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowRuleMenu(!showRuleMenu)}
              className={`px-2.5 py-1 text-[9.5px] font-sans font-extrabold transition-all duration-150 cursor-pointer select-none rounded-full ${showRuleMenu ? "bg-[var(--accent3)] text-black font-black" : "text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"}`}
              title="تنظیمات شرط"
            >
              تنظیمات شرط
            </button>
            {showRuleMenu && (
              <div className="absolute top-full mt-2 left-0 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-3 z-50">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">قوانین ورودی</span>
                </div>
                <div className="space-y-2 text-[10px]">
                  <div>
                    <label className="block text-slate-500 mb-1">اگر وضعیت این ورودی شد:</label>
                    <select
                      value={rule.triggerState ? "1" : "0"}
                      onChange={(e) => onUpdateSegmentRule(segment.id, { ...rule, triggerState: e.target.value === "1" })}
                      className="w-full bg-slate-100 dark:bg-slate-800 border-none p-1.5 rounded-md"
                    >
                      <option value="1">HIGH (1)</option>
                      <option value="0">LOW (0)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">پایه هدف (GPIO):</label>
                    <input
                      type="text"
                      placeholder="مثلا 2 یا 4"
                      value={rule.targetPin}
                      onChange={(e) => onUpdateSegmentRule(segment.id, { ...rule, targetPin: e.target.value })}
                      className="w-full bg-slate-100 dark:bg-slate-800 border-none p-1.5 rounded-md text-left"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">وضعیت پایه هدف بشود:</label>
                    <select
                      value={rule.actionState ? "1" : "0"}
                      onChange={(e) => onUpdateSegmentRule(segment.id, { ...rule, actionState: e.target.value === "1" })}
                      className="w-full bg-slate-100 dark:bg-slate-800 border-none p-1.5 rounded-md"
                    >
                      <option value="1">روشن (HIGH)</option>
                      <option value="0">خاموش (LOW)</option>
                    </select>
                  </div>
                </div>
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
