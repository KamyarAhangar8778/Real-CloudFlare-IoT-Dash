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
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.7 : 1,
  };

  const densityFactor = groupMaxCols * parentGroupsCols;
  const isUltraCompact = densityFactor >= 6;
  const isCompact = densityFactor === 4 || densityFactor === 3;

  if (segment.type === "placeholder") {
    return (
      <div ref={setNodeRef} style={style} className="touch-none w-full relative">
        <div className="absolute top-2 left-2 z-20 flex gap-1.5">
           <button
             onClick={() => onRemove(segment.id)}
             onPointerDown={(e) => e.stopPropagation()}
             className="p-1 bg-black/50 hover:bg-red-500/50 text-gray-400 hover:text-white transition-colors cursor-pointer"
             style={{ clipPath: BUTTON_CLIP }}
             title="حذف جایگاه خالی"
           >
             <X className="w-3.5 h-3.5" />
           </button>
           <div 
             {...attributes} 
             {...listeners}
             className="p-1 bg-black/50 hover:bg-[var(--accent3-transparent)] text-gray-400 hover:text-[var(--accent3)] cursor-grab active:cursor-grabbing transition-colors"
             style={{ clipPath: BUTTON_CLIP }}
             title="کشیدن جایگاه"
           >
             <GripVertical className="w-3.5 h-3.5" />
           </div>
        </div>
        <button
          onClick={() => onSetupPlaceholder && onSetupPlaceholder(segment.id)}
          className={`w-full h-full border-2 border-dashed border-accent3-medium/30 hover:border-accent3/80 bg-[var(--card-bg)] hover:bg-[var(--card-hover-bg)] flex flex-col items-center justify-center gap-2 transition-all duration-300 cursor-pointer text-center group ${
            isUltraCompact ? "p-3 min-h-[90px]" : isCompact ? "p-4 min-h-[128px]" : "p-6 min-h-[178px]"
          }`}
          style={{ clipPath: CLIP_DIAGONAL_TR_BL }}
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
        whileHover={{ y: -3, scale: 1.01 }}
        className={`w-full flex flex-col bg-[var(--card-bg)] backdrop-blur-md border border-[var(--accent3-medium)] transition-all duration-300 relative group h-full shadow-[0_15px_30px_rgba(0,0,0,0.6)] ${
          isUltraCompact ? "min-h-[90px]" : "min-h-[140px]"
        }`}
        style={{ clipPath: CLIP_DIAGONAL_TR_BL }}
      >
        {/* Shimmer linear accents */}
        <div className="absolute top-0 right-0 w-3 h-3 hover:border-accent3/40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-3 h-3 hover:border-accent3/40 pointer-events-none" />

        <div className="flex flex-col h-full justify-between">
          {/* Card Header Row */}
          <div className={`flex items-center justify-between border-b border-[var(--border-color)] bg-black/20 ${
            isUltraCompact ? "p-2" : "p-4"
          }`}>
            <div className="flex items-center gap-1.5 md:gap-2">
              <button
                onClick={() => onRemove(segment.id)}
                className="p-1 hover:bg-red-500/15 text-[var(--text-muted)] hover:text-red-500 transition-colors cursor-pointer"
                style={{ clipPath: BUTTON_CLIP }}
                title="حذف این سگمنت"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <X className={`${isUltraCompact ? "w-3 h-3" : "w-3.5 h-3.5"}`} />
              </button>
              
              <div 
                {...attributes} 
                {...listeners}
                className="p-1 hover:bg-[var(--accent3-transparent)] text-[var(--accent3-medium)] hover:text-[var(--accent3)] cursor-grab active:cursor-grabbing transition-colors"
                style={{ clipPath: BUTTON_CLIP }}
                title="کشیدن برای جابه‌جایی"
              >
                <GripVertical className={`${isUltraCompact ? "w-3.5 h-3.5" : "w-4 h-4"}`} />
              </div>

              {/* Mode indicator/selector inside card header */}
              {onUpdateSegmentMode && (
                <div 
                  className="flex items-center bg-black/55 border border-gray-800/80 p-0.5 mr-1"
                  style={{ clipPath: BUTTON_CLIP }}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onUpdateSegmentMode(segment.id, "switch")}
                    className={`px-1.5 py-0.5 text-[8.5px] font-sans font-bold transition-all duration-150 cursor-pointer ${
                      mode === "switch"
                        ? "bg-[var(--accent3)] text-black font-black"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                    style={{ clipPath: BUTTON_CLIP }}
                    title="حالت سوئیچ دائمی"
                  >
                    سوئیچ
                  </button>
                  <button
                    onClick={() => onUpdateSegmentMode(segment.id, "push")}
                    className={`px-1.5 py-0.5 text-[8.5px] font-sans font-bold transition-all duration-150 cursor-pointer ${
                      mode === "push"
                        ? "bg-[var(--accent3)] text-black font-black"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                    style={{ clipPath: BUTTON_CLIP }}
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
                  className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer border border-[var(--border-color)] transition-colors duration-200 ease-in-out focus:outline-none shadow-inner select-none ${
                    isPinOn ? "bg-[var(--accent4)] shadow-[0_0_8px_rgba(var(--accent4),0.4)]" : "bg-black/50"
                  }`}
                  style={{ clipPath: BUTTON_CLIP }}
                >
                  <span
                    className={`pointer-events-none inline-block h-full w-1/2 bg-[var(--text-primary)] shadow-lg ring-0 transition-transform duration-200 ease-in-out ${
                      isPinOn ? "-translate-x-full" : "translate-x-0"
                    }`}
                    style={{ clipPath: BUTTON_CLIP }}
                  />
                </button>
              </div>
            ) : isCompact ? (
              // Compact view: hide left blue badge, show concise label (پایه X) + toggle
              <div 
                className="flex items-center justify-between w-full bg-[var(--card-bg-solid)] p-2 border border-[var(--border-color)]"
                style={{ clipPath: BUTTON_CLIP }}
              >
                <span className="text-[10px] font-sans font-bold theme-text-secondary">
                  {mode === "push" ? `پالس ${segment.pin}` : `پایه ${segment.pin}`}
                </span>

                <button
                  {...buttonProps}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer border border-[var(--border-color)] transition-colors duration-200 ease-in-out focus:outline-none select-none ${
                    isPinOn ? "bg-[var(--accent4)]" : "bg-black/30"
                  }`}
                  style={{ clipPath: BUTTON_CLIP }}
                >
                  <span
                    className={`pointer-events-none inline-block h-full w-1/2 bg-[var(--text-primary)] shadow-lg ring-0 transition-transform duration-200 ease-in-out ${
                      isPinOn ? "-translate-x-full" : "translate-x-0"
                    }`}
                    style={{ clipPath: BUTTON_CLIP }}
                  />
                </button>
              </div>
            ) : (
              // Normal full-featured view
              <div 
                className="flex items-center justify-between bg-[var(--card-bg-solid)] p-4 border border-[var(--border-color)]"
                style={{ clipPath: BUTTON_CLIP }}
              >
                <span 
                  className={`text-[10px] font-sans font-bold px-2.5 py-0.5 border ${
                    isPinOn ? "border-[var(--accent4)] text-[var(--accent4)] bg-[var(--accent4-transparent)]" : "border-gray-500 text-gray-400"
                  }`}
                  style={{ clipPath: BUTTON_CLIP }}
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
                    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer border border-[var(--border-color)] transition-colors duration-200 ease-in-out focus:outline-none select-none ${
                      isPinOn ? "bg-[var(--accent4)]" : "bg-black/30"
                    }`}
                    style={{ clipPath: BUTTON_CLIP }}
                  >
                    <span
                      className={`pointer-events-none inline-block h-full w-1/2 bg-[var(--text-primary)] shadow-lg ring-0 transition-transform duration-200 ease-in-out ${
                        isPinOn ? "-translate-x-full" : "translate-x-0"
                      }`}
                      style={{ clipPath: BUTTON_CLIP }}
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

      {/* Diagonal Cut Line at Top Right for rhythm */}
      <div className="absolute top-0 right-0 w-6 h-6 pointer-events-none z-10 overflow-hidden">
        <div className="absolute w-[150%] h-[1px] bg-[var(--accent3)] top-0 right-0 origin-top-right rotate-45 -translate-y-[1px]" />
      </div>
    </div>
  );
}
