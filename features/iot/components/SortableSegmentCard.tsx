"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "motion/react";
import { X, Cpu, Plus, GripVertical } from "lucide-react";
import { BUTTON_CLIP, CLIP_DIAGONAL_TR_BL } from "@/lib/presets";

interface SortableSegmentCardProps {
  segment: { id: string; type: string; pin: string; title: string; group?: string; mode?: "switch" | "push" };
  isPinOn: boolean;
  onRemove: (id: string) => void;
  onTogglePin: (pin: string) => void;
  onSetPinState?: (pin: string, state: boolean) => void;
  onUpdateSegmentMode?: (id: string, mode: "switch" | "push") => void;
  isLoadingIoT: boolean;
  onSetupPlaceholder?: (id: string) => void;
  parentGroupsCols?: number;
  groupMaxCols?: number;
  animationsEnabled?: boolean;
}

export default function SortableSegmentCard({
  segment,
  isPinOn,
  onRemove,
  onTogglePin,
  onSetPinState,
  onUpdateSegmentMode,
  isLoadingIoT,
  onSetupPlaceholder,
  parentGroupsCols = 1,
  groupMaxCols = 3,
  animationsEnabled = true,
}: SortableSegmentCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: segment.id,
    data: {
      type: "Segment",
      group: segment.group || "Test"
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: animationsEnabled 
      ? (transition || "transform 350ms cubic-bezier(0.16, 1, 0.3, 1)") 
      : "none",
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.35 : 1,
    scale: isDragging ? 0.96 : 1,
  };

  const densityFactor = groupMaxCols * parentGroupsCols;
  const isUltraCompact = densityFactor >= 6;
  const isCompact = densityFactor === 4 || densityFactor === 3;

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} className="touch-none w-full relative h-full">
        <div 
          className={`w-full border-2 border-dashed border-[var(--accent3-medium)]/35 bg-[var(--card-bg)]/20 backdrop-blur-md rounded-2xl transition-all duration-300 ${
            isUltraCompact ? "min-h-[90px]" : "min-h-[140px]"
          } flex items-center justify-center`}
        >
          <div className="w-5 h-5 rounded-full border-2 border-[var(--accent3-medium)]/20 border-t-[var(--accent3)] animate-spin opacity-40" />
        </div>
      </div>
    );
  }

  if (segment.type === "placeholder") {
    return (
      <div ref={setNodeRef} style={style} className="touch-none w-full relative">
        <motion.div
          className="w-full h-full relative"
          layout={animationsEnabled ? "position" : false}
          transition={animationsEnabled ? { type: "spring", stiffness: 380, damping: 32 } : undefined}
          initial={animationsEnabled ? { opacity: 0, scale: 0.93, y: 10 } : false}
          animate={animationsEnabled ? { opacity: 1, scale: 1, y: 0 } : false}
          exit={animationsEnabled ? { opacity: 0, scale: 0.85, y: -10, transition: { duration: 0.2, ease: "easeIn" } } : undefined}
        >
          <div className="absolute top-2 left-2 z-20 flex gap-1.5">
             <button
               onClick={() => onRemove(segment.id)}
               onPointerDown={(e) => e.stopPropagation()}
               className="p-1.5 bg-slate-200/90 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 hover:bg-[var(--accent3-transparent)] dark:hover:bg-[var(--accent3-transparent)] text-slate-700 dark:text-gray-300 hover:text-[var(--accent3)] transition-colors cursor-pointer rounded-lg shadow-sm"
               title="حذف جایگاه خالی"
             >
               <X className="w-3.5 h-3.5" />
             </button>
             <div 
               {...attributes} 
               {...listeners}
               className="p-1.5 bg-slate-200/90 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 hover:bg-[var(--accent3-transparent)] dark:hover:bg-[var(--accent3-transparent)] text-slate-700 dark:text-gray-300 hover:text-[var(--accent3)] cursor-grab active:cursor-grabbing transition-colors rounded-lg shadow-sm"
               title="کشیدن جایگاه"
             >
               <GripVertical className="w-3.5 h-3.5" />
             </div>
          </div>
          <button
            onClick={() => onSetupPlaceholder && onSetupPlaceholder(segment.id)}
            className={`w-full h-full border-2 border-dashed border-[var(--accent3-medium)]/30 hover:border-[var(--accent3)] hover:shadow-[0_0_15px_var(--accent3-transparent)] bg-[var(--card-bg)] hover:bg-[var(--card-hover-bg)] flex flex-col items-center justify-center gap-2 transition-all duration-350 cursor-pointer text-center group rounded-2xl ${
              isUltraCompact ? "p-3 min-h-[90px]" : isCompact ? "p-4 min-h-[128px]" : "p-6 min-h-[178px]"
            }`}
          >
            <div className="p-2 bg-[var(--accent3-transparent)] group-hover:bg-[var(--accent3)] group-hover:text-black text-[var(--accent3)] transition-colors" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}>
              <Plus className="w-4 h-4" />
            </div>
            {!isUltraCompact && (
              <div>
                <span className="block font-sans font-bold text-xs md:text-sm theme-text-primary group-hover:text-[var(--accent3)] transition-colors">
                  {isCompact ? "تعیین سگمنت" : "جایگذاری سگمنت در اینجا"}
                </span>
              </div>
            )}
          </button>
        </motion.div>
      </div>
    );
  }

  const mode = segment.mode || "switch";
  const buttonProps = mode === "push"
    ? {
        onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onSetPinState?.(segment.pin, true);
        },
        onPointerUp: (e: React.PointerEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onSetPinState?.(segment.pin, false);
        },
        onPointerLeave: (e: React.PointerEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onSetPinState?.(segment.pin, false);
        },
        onPointerCancel: (e: React.PointerEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onSetPinState?.(segment.pin, false);
        },
        onTouchStart: (e: React.TouchEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onSetPinState?.(segment.pin, true);
        },
        onTouchEnd: (e: React.TouchEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onSetPinState?.(segment.pin, false);
        },
      }
    : {
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onTogglePin(segment.pin);
        },
        onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
          e.stopPropagation();
        }
      };

  return (
    <div ref={setNodeRef} style={style} className="touch-none w-full relative h-full">
      <motion.div
        layout={animationsEnabled ? "position" : false}
        transition={animationsEnabled ? { type: "spring", stiffness: 380, damping: 32 } : undefined}
        initial={animationsEnabled ? { opacity: 0, scale: 0.93, y: 10 } : false}
        animate={animationsEnabled ? { opacity: 1, scale: 1, y: 0 } : false}
        exit={animationsEnabled ? { opacity: 0, scale: 0.85, y: -10, transition: { duration: 0.2, ease: "easeIn" } } : undefined}
        whileHover={animationsEnabled ? { y: -1.5, scale: 1.002 } : undefined}
        className={`w-full flex flex-col bg-[var(--card-bg)] backdrop-blur-md border border-[var(--border-color)] hover:border-[var(--accent3)]/50 transition-all duration-300 relative group h-full shadow-sm hover:shadow-lg rounded-2xl overflow-hidden ${
          isUltraCompact ? "min-h-[90px]" : "min-h-[140px]"
        }`}
      >
        {/* Shimmer linear accents */}
        <div className="absolute top-0 right-0 w-3 h-3 hover:border-accent3/40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-3 h-3 hover:border-accent3/40 pointer-events-none" />

        <div className="flex flex-col h-full justify-between">
          {/* Card Header Row */}
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

              {/* Mode indicator/selector inside card header */}
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

          {/* Card Body */}
          <div className={`${isUltraCompact ? "p-2 flex-grow flex items-center justify-center" : isCompact ? "p-3 flex-1 flex items-center" : "p-4 flex-1"}`}>
            {isUltraCompact ? (
              // Ultra-compact ON/OFF switch
              <div className="flex items-center justify-center w-full">
                <button
                  {...buttonProps}
                  className={`relative inline-flex h-6 w-11 rounded-full p-0.5 items-center transition-all duration-300 shrink-0 cursor-pointer focus:outline-none shadow-inner select-none hover:scale-110 active:scale-95 hover:brightness-110 ${
                    isPinOn 
                      ? "bg-[var(--accent4)] shadow-[0_0_8px_rgba(16,185,129,0.35)]" 
                      : "bg-black/50 border border-slate-800"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-[var(--text-primary)] shadow-md transform ${
                      animationsEnabled 
                        ? "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" 
                        : ""
                    } ${
                      isPinOn ? "-translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ) : isCompact ? (
              // Compact view: hide left blue badge, show concise label (پایه X) + toggle
              <div 
                className="flex items-center justify-between w-full bg-[var(--card-bg-solid)] p-2 border border-[var(--border-color)] rounded-xl"
              >
                <span className="text-[10px] font-sans font-bold theme-text-secondary">
                  {mode === "push" ? `پالس ${segment.pin}` : `پایه ${segment.pin}`}
                </span>

                <button
                  {...buttonProps}
                  className={`relative inline-flex h-6 w-11 rounded-full p-0.5 items-center transition-all duration-300 shrink-0 cursor-pointer focus:outline-none select-none hover:scale-110 active:scale-95 hover:brightness-110 ${
                    isPinOn 
                      ? "bg-[var(--accent4)] shadow-[0_0_8px_rgba(16,185,129,0.35)]" 
                      : "bg-black/30 border border-slate-800/40"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-[var(--text-primary)] shadow-md transform ${
                      animationsEnabled 
                        ? "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" 
                        : ""
                    } ${
                      isPinOn ? "-translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ) : (
              // Normal full-featured view
              <div 
                className="flex items-center justify-between bg-[var(--card-bg-solid)] p-4 border border-[var(--border-color)] rounded-xl"
              >
                <span 
                  className={`text-[10px] font-sans font-bold px-2.5 py-0.5 border rounded-lg ${
                    isPinOn ? "border-[var(--accent4)] text-[var(--accent4)] bg-[var(--accent4-transparent)]" : "border-gray-500 text-gray-400"
                  }`}
                >
                  {mode === "push" 
                    ? (isPinOn ? "پالس فعال HIGH" : "آماده تحریک LOW") 
                    : (isPinOn ? "روشن / فعال" : "خاموش / غیرفعال")}
                </span>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <span className="block text-xs font-sans font-bold theme-text-primary">
                      {mode === "push" ? `شستی پایه ${segment.pin}` : `سوئیچ پایه ${segment.pin}`}
                    </span>
                    <span className="block text-[9px] theme-text-muted mt-0.5">
                      {mode === "push" ? "GPIO Pin Pulse" : "GPIO Pin Trigger"}
                    </span>
                  </div>
                  
                  <button
                    {...buttonProps}
                    className={`relative inline-flex h-6 w-11 rounded-full p-0.5 items-center transition-all duration-300 shrink-0 cursor-pointer focus:outline-none select-none hover:scale-110 active:scale-95 hover:brightness-110 ${
                      isPinOn 
                        ? "bg-[var(--accent4)] shadow-[0_0_8px_rgba(16,185,129,0.35)]" 
                        : "bg-black/30 border border-slate-800/40"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-[var(--text-primary)] shadow-md transform ${
                        animationsEnabled 
                          ? "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" 
                          : ""
                      } ${
                        isPinOn ? "-translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Card Footer - Only display when not in ultra-compact/compact to maximize clean layout */}
          {!isUltraCompact && !isCompact && (
            <div className="p-2 border-t border-[var(--border-color)] bg-black/10 min-h-[24px]">
               {/* Clean aesthetic segment status line */}
               <div className="flex justify-between items-center text-[8px] font-mono tracking-wider text-gray-500 hover:text-[var(--accent3)] transition-colors">
                 <span>SW STATE: {isPinOn ? "HIGH" : "LOW"}</span>
                 <span>ADDR: PIN_{segment.pin}</span>
               </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
