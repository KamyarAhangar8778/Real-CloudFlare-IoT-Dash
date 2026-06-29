import React from "react";
import { X, GripVertical, Settings } from "lucide-react";
import { ICON_MAP } from "@/features/iot/utils/icons";
import { motion, AnimatePresence } from "motion/react";
import { BUTTON_CLIP } from "@/lib/presets";
import { SegmentData } from "./types";
import { useMediaQuery } from "../../hooks/useMediaQuery";

interface CardHeaderProps {
  segment: SegmentData;
  isPinOn: boolean;
  isUltraCompact: boolean;
  isCompact: boolean;
  mode: "switch" | "push";
  onRemove: (id: string) => void;
  onUpdateSegmentMode?: (id: string, mode: "switch" | "push") => void;
  onUpdateSegmentAutoOff?: (id: string, autoOff: number) => void;
  onUpdateSegmentRule?: (
    id: string,
    rule: {
      highActions?: Array<{
        reqHold: number;
        targetPin: string;
        actionOn: boolean;
        actionType?: number;
        delay?: number;
      }>;
      lowActions?: Array<{
        reqHold: number;
        targetPin: string;
        actionOn: boolean;
        actionType?: number;
        delay?: number;
      }>;
    },
  ) => void;
  countdown?: number | null;
  attributes: any;
  listeners: any;
  isSettingsOpen?: boolean;
  setIsSettingsOpen?: (val: boolean) => void;
}

export default function CardHeader({
  segment,
  isPinOn,
  isUltraCompact,
  isCompact,
  mode,
  onRemove,
  onUpdateSegmentMode,
  onUpdateSegmentAutoOff,
  onUpdateSegmentRule,
  countdown,
  attributes,
  listeners,
  isSettingsOpen,
  setIsSettingsOpen,
}: CardHeaderProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showAutoOffMenu, setShowAutoOffMenu] = React.useState(false);
  const autoOffValue = segment.auto_off || 0;
  const isSmall = isUltraCompact || isCompact || isMobile;

  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen?.(false);
      }
    };
    if (isSettingsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSettingsOpen, setIsSettingsOpen]);

  React.useLayoutEffect(() => {
    if (isSettingsOpen && menuRef.current && buttonRef.current) {
      const menu = menuRef.current;
      const button = buttonRef.current;

      const groupContainer = button.closest(
        ".group\\/group-card",
      ) as HTMLElement;

      if (groupContainer && menu.parentElement) {
        const groupRect = groupContainer.getBoundingClientRect();
        const menuParentRect = menu.parentElement.getBoundingClientRect();

        const parentCenter = menuParentRect.left + menuParentRect.width / 2;
        const groupCenter = groupRect.left + groupRect.width / 2;

        const offset = groupCenter - parentCenter;

        menu.style.left = `calc(50% + ${offset}px)`;
      }
    }
  }, [isSettingsOpen]);

  const renderControls = () => {
    if (!onUpdateSegmentMode || segment.type === "input") return null;
    return (
      <div
        className="flex items-center bg-white dark:bg-slate-950 border border-black dark:border-slate-800 p-[3px] rounded-full shadow-sm relative"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onUpdateSegmentMode(segment.id, "switch")}
          className={`px-2.5 py-1 text-[9.5px] font-sans font-extrabold transition-all duration-150 cursor-pointer select-none rounded-full ${
            mode === "switch"
              ? "bg-[var(--accent3)] text-black font-black shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
              : "text-slate-600 md:hover:text-slate-900 dark:text-gray-400 dark:md:hover:text-white"
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
                : "text-slate-600 md:hover:text-slate-900 dark:text-gray-400 dark:md:hover:text-white"
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
              className={`p-1 rounded-full transition-colors ${autoOffValue > 0 ? "text-[var(--accent3)]" : "text-slate-500 md:hover:text-slate-800 dark:md:hover:text-white"}`}
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

            <AnimatePresence>
              {showAutoOffMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -5 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-full mt-2 left-0 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-3 z-50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      خاموشی خودکار:{" "}
                      {autoOffValue > 0 ? `${autoOffValue} ثانیه` : "غیرفعال"}
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      {...(isSmall ? attributes : {})}
      {...(isSmall ? listeners : {})}
      className={`flex items-center border-b border-[var(--border-color)] bg-slate-500/[0.05] dark:bg-black/25 ${
        isSmall
          ? "justify-center p-2 cursor-grab active:cursor-grabbing"
          : "justify-between p-4"
      }`}
    >
      <div
        className={`flex items-center ${isSmall ? "w-full justify-center" : "gap-1.5 md:gap-2"}`}
      >
        {!isSmall && (
          <>
            <button
              onClick={() => onRemove(segment.id)}
              className="p-1.5 bg-slate-200/90 dark:bg-slate-950 border border-slate-300/85 dark:border-slate-800 text-slate-700 dark:text-gray-300 md:hover:border-[var(--accent3)] md:hover:text-[var(--accent3)] transition-all cursor-pointer rounded-lg shadow-sm"
              title="حذف این سگمنت"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div
              {...attributes}
              {...listeners}
              className="p-1.5 bg-slate-200/90 dark:bg-slate-950 border border-slate-300/85 dark:border-slate-800 text-slate-700 dark:text-gray-300 md:hover:border-[var(--accent3)] md:hover:text-[var(--accent3)] cursor-grab active:cursor-grabbing transition-all rounded-lg shadow-sm"
              title="کشیدن برای جابه‌جایی"
            >
              <GripVertical className="w-4 h-4" />
            </div>
            {onUpdateSegmentMode && segment.type !== "input" && (
              <div className="mr-1.5">{renderControls()}</div>
            )}
          </>
        )}

        {isSmall && (
          <div className="relative flex justify-center w-full group/btn h-6 items-center">
            <button
              ref={buttonRef}
              onClick={() => setIsSettingsOpen?.(!isSettingsOpen)}
              className={`py-1 bg-slate-200/90 dark:bg-slate-950 border border-slate-300/85 dark:border-slate-800 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer rounded-full shadow-sm flex items-center justify-center ${
                isSettingsOpen
                  ? "border-[var(--accent3)] text-[var(--accent3)] shadow-[0_0_8px_rgba(255,165,0,0.3)] w-[22px]"
                  : "w-[54px] md:group-hover/btn:w-[22px] text-slate-700 dark:text-gray-300 md:group-hover/btn:border-[var(--accent3)] md:group-hover/btn:text-[var(--accent3)] md:group-hover/btn:bg-slate-300/50 dark:md:group-hover/btn:bg-slate-800/50"
              }`}
              title="تنظیمات سگمنت"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <Settings className="w-3.5 h-3.5 transition-transform duration-500 md:group-hover/btn:rotate-90 shrink-0" />
            </button>

            <AnimatePresence>
              {isSettingsOpen && (
                <motion.div
                  ref={menuRef}
                  className="absolute top-0 z-[100]"
                  onPointerDown={(e) => e.stopPropagation()}
                  initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-10%" }}
                  animate={{ opacity: 1, scale: 1, x: "-50%", y: "-20%" }}
                  exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-10%" }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className="w-[280px] sm:w-[340px] bg-[var(--card-bg-solid)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl shadow-sm p-4 flex flex-col gap-4 md:hover:-translate-y-1.5 md:hover:shadow-xl md:hover:border-[var(--accent3)] transition-all cursor-default">
                    <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                      <div className="flex flex-col gap-1 text-right">
                        {isUltraCompact && (
                          <span className="font-sans font-extrabold theme-text-primary text-sm">
                            {segment.title}
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded inline-block w-fit ${
                          isPinOn ? "bg-[var(--accent4-transparent)] text-[var(--accent4)]" : "bg-gray-500/10 text-gray-500"
                        }`}>
                          {segment.type === "input" 
                            ? (isPinOn ? "فعال" : "غیرفعال") 
                            : mode === "push" 
                              ? (isPinOn ? "پالس فعال HIGH" : "آماده تحریک LOW") 
                              : (isPinOn ? "روشن / فعال" : "خاموش / غیرفعال")}
                        </span>
                      </div>
                      <button
                        onClick={() => onRemove(segment.id)}
                        className="flex items-center gap-2 p-1.5 px-3 bg-red-500/10 text-red-600 md:hover:bg-red-500 md:hover:text-white transition-all cursor-pointer rounded-lg shadow-sm"
                        title="حذف سگمنت"
                      >
                        <span className="text-[10px] font-bold">
                          برای حذف کردن سگمنت
                        </span>
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {onUpdateSegmentMode && segment.type !== "input" && (
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                          حالت عملکرد:
                        </span>
                        {renderControls()}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {!isSmall && (
        <div className="flex items-center gap-2">
          <div
            className={`p-2 transition-colors ${isPinOn ? "bg-[var(--accent4-transparent)] text-[var(--accent4)]" : "bg-gray-800/20 text-gray-500"}`}
            style={{ clipPath: BUTTON_CLIP }}
          >
            {segment.icon && ICON_MAP[segment.icon] ? (
              React.createElement(ICON_MAP[segment.icon], { className: "w-4 h-4" })
            ) : (
              React.createElement(ICON_MAP["Cpu"], { className: "w-4 h-4" })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
