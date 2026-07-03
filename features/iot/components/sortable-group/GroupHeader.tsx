"use client";

import React from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { ICON_MAP } from "@/features/iot/utils/icons";
import LayoutSelector from "./LayoutSelector";
import { motion, AnimatePresence } from "motion/react";
import { useMediaQuery } from "@/features/iot/hooks/useMediaQuery";

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
  const [isCompact, setIsCompact] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 639px)");

  const titleContainerRef = React.useRef<HTMLDivElement>(null);
  const titleTextRef = React.useRef<HTMLHeadingElement>(null);
  const buttonRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const container = titleContainerRef.current;
    const text = titleTextRef.current;
    if (!container || !text) return;

    const checkSpace = () => {
      const textWidth = text.scrollWidth;
      const textClientWidth = text.clientWidth;

      if (!isCompact) {
        if (textWidth > textClientWidth) {
          setIsCompact(true);
        }
      } else {
        const layoutSelectorWidth = 100; // Approximate width required for the LayoutSelector and gap
        if (textClientWidth - layoutSelectorWidth >= textWidth) {
          setIsCompact(false);
          setIsSettingsOpen(false);
        }
      }
    };

    const observer = new ResizeObserver(checkSpace);
    observer.observe(container);
    return () => observer.disconnect();
  }, [isCompact]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };
    if (isSettingsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSettingsOpen]);

  return (
    <div className="flex items-stretch justify-between w-full gap-2 sm:gap-4 relative z-10 pointer-events-none">
      {/* Right Part: Title and Layout Selector */}
      <div
        className={`flex items-center justify-between flex-1 min-w-0 pointer-events-auto bg-[var(--card-bg)] backdrop-blur-md border border-[var(--border-color)] shadow-sm transition-colors duration-350 md:group-hover/group-card:border-[var(--accent3)] md:group-hover/group-card:shadow-xl rounded-2xl ${parentGroupsCols === 3 ? "p-1.5 pr-3 gap-2" : "p-2 pr-4 gap-3 sm:p-2.5 sm:pr-5 sm:gap-4"}`}
      >
        <div ref={titleContainerRef} className="flex items-center gap-2 min-w-0 flex-1">
          <div className="relative flex justify-center items-center">
            <div
              ref={buttonRef}
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`flex items-center justify-center transition-all cursor-pointer md:hover:opacity-80 ${isSettingsOpen ? "bg-[var(--accent3)] text-black shadow-[0_0_8px_rgba(255,165,0,0.3)]" : "bg-[var(--accent3-transparent)] text-[var(--accent3)]"} shrink-0 ${
                parentGroupsCols === 3 ? "p-1 w-6 h-6" : "p-1.5 w-7 h-7 sm:p-2 sm:w-auto sm:h-auto"
              }`}
              style={{
                clipPath:
                  "polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)",
              }}
              title="تنظیمات گروه"
            >
              {icon ? (
                ICON_MAP[icon] ? (
                  React.createElement(ICON_MAP[icon], {
                    className: parentGroupsCols === 3 ? "w-3.5 h-3.5" : "w-4 h-4 sm:w-5 sm:h-5",
                  })
                ) : (
                  <span
                    className={`leading-none flex items-center justify-center ${parentGroupsCols === 3 ? "text-sm w-3.5 h-3.5" : "text-base sm:text-xl w-4 h-4 sm:w-5 sm:h-5"}`}
                  >
                    {icon}
                  </span>
                )
              ) : (
                React.createElement(ICON_MAP["Layers"], {
                  className: parentGroupsCols === 3 ? "w-3.5 h-3.5" : "w-4 h-4 sm:w-5 sm:h-5",
                })
              )}
            </div>

            <AnimatePresence>
              {isSettingsOpen && (
                <motion.div
                  ref={menuRef}
                  className="absolute top-[calc(100%+8px)] z-[100]"
                  onPointerDown={(e) => e.stopPropagation()}
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  style={{ right: 0 }}
                >
                  <div className="w-auto bg-[var(--card-bg-solid)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl shadow-xl p-3 sm:p-4 flex flex-col gap-3 md:hover:-translate-y-1.5 md:hover:shadow-2xl md:hover:border-[var(--accent3)] transition-all cursor-default">
                    <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2 min-w-[150px] sm:min-w-[180px]">
                      <span className="font-sans font-extrabold theme-text-primary text-xs sm:text-sm truncate max-w-[180px] sm:max-w-[220px]">
                        {id}
                      </span>
                    </div>
                    {(isCompact || isMobile) && (
                      <div className="flex flex-col gap-2 w-full">
                        <span className="text-[10px] font-bold text-slate-500">
                          تعداد ستون‌های سگمنت
                        </span>
                        <LayoutSelector
                          maxCols={maxCols}
                          onColsChange={(cols) => {
                            onColsChange(cols);
                            setIsSettingsOpen(false);
                          }}
                          parentGroupsCols={3}
                          fullWidth={true}
                        />
                      </div>
                    )}

                    <div
                      className={`flex flex-col gap-2 ${(isCompact || isMobile) ? "pt-2 border-t border-[var(--border-color)]" : ""}`}
                    >
                      <button
                        onClick={() => {
                          onAddPlaceholder(id);
                          setIsSettingsOpen(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors w-full"
                      >
                        <Plus className="w-4 h-4" />
                        <span>اضافه کردن سگمنت</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="min-w-0 flex-1 text-right leading-tight">
            <h4
              ref={titleTextRef}
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

        {!(isCompact || isMobile) && (
          <div className="shrink-0">
            <LayoutSelector
              maxCols={maxCols}
              onColsChange={onColsChange}
              parentGroupsCols={parentGroupsCols}
            />
          </div>
        )}
      </div>

      {/* Left Part: Action Buttons */}
      <div className="flex items-stretch shrink-0 pointer-events-auto bg-[var(--card-bg)] backdrop-blur-md border border-[var(--border-color)] shadow-sm transition-colors duration-350 md:group-hover/group-card:border-[var(--accent3)] md:group-hover/group-card:shadow-xl rounded-2xl overflow-hidden">
        {/* Delete Group Handle */}
        <button
          onClick={() => onDeleteGroup(id)}
          className={`flex items-center justify-center text-[var(--text-secondary)] md:hover:text-rose-600 dark:md:hover:text-rose-400 md:hover:bg-rose-500/10 transition-all duration-300 cursor-pointer border-l border-[var(--border-color)] group ${parentGroupsCols === 3 ? "w-10" : "w-12 sm:w-14"}`}
          title="حذف کامل این گروه و تمامی سگمنت‌های داخل آن"
        >
          <Trash2
            className={`transition-transform duration-300 md:group-hover:scale-110 ${parentGroupsCols === 3 ? "w-4 h-4" : "w-5 h-5"}`}
          />
        </button>

        {/* Group Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className={`flex items-center justify-center text-[var(--text-secondary)] md:hover:text-indigo-600 dark:md:hover:text-indigo-400 md:hover:bg-indigo-500/10 transition-all duration-300 cursor-grab active:cursor-grabbing group ${parentGroupsCols === 3 ? "w-10" : "w-12 sm:w-14"}`}
          title="کشیدن کل گروه برای جابه‌جایی"
        >
          <GripVertical
            className={`transition-transform duration-300 group-md:hover:scale-110 ${parentGroupsCols === 3 ? "w-4 h-4" : "w-5 h-5"}`}
          />
        </div>
      </div>
    </div>
  );
}
