"use client";

import React from "react";
import { useSortable, SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Layers, Plus, Trash2, GripVertical, Columns2, LayoutGrid } from "lucide-react";
import { AnimatePresence } from "motion/react";

interface SortableGroupProps {
  id: string; // Group Name
  items: string[]; // Segment IDs
  segmentCount: number;
  maxCols: number;
  onColsChange: (cols: number) => void;
  onAddPlaceholder: (groupId: string) => void;
  onDeleteGroup: (groupId: string) => void;
  parentGroupsCols?: number;
  animationsEnabled?: boolean;
  children: React.ReactNode;
}

export default function SortableGroup({ id, items, segmentCount, maxCols, onColsChange, onAddPlaceholder, onDeleteGroup, parentGroupsCols = 1, animationsEnabled = true, children }: SortableGroupProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: `group-${id}`,
    data: {
      type: "Group",
      group: id
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: animationsEnabled ? (transition || "transform 350ms cubic-bezier(0.16, 1, 0.3, 1)") : "none",
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="relative group/group-card w-full mb-6 touch-none flex flex-col border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-md rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-350 hover:-translate-y-1 hover:border-[var(--accent3)]"
    >


      {/* Header Island */}
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
             style={{ clipPath: "polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)" }}>
              <Layers className={parentGroupsCols === 3 ? "w-4 h-4" : "w-5 h-5"} />
           </div>
           <div className="min-w-0 flex-1 text-right">
              <h4 className={`font-sans font-extrabold text-slate-850 dark:text-[var(--accent3)] truncate ${parentGroupsCols === 3 ? "text-[11px]" : "text-base"}`}>{id}</h4>
              <span className="text-[9px] theme-text-muted mt-0.5 whitespace-nowrap block">({segmentCount} دستگاه)</span>
           </div>
        </div>

        <div className={`flex items-center shrink-0 ${parentGroupsCols === 3 ? "gap-1" : "gap-3"}`}>
           {/* Layout selector */}
           <div className={`${parentGroupsCols === 3 ? "hidden select-none pointer-events-none" : "hidden sm:flex"} items-center bg-[var(--bg-main)] border border-[var(--border-color)] p-0.5 rounded-xl text-xs gap-0.5 shrink-0 shadow-sm`}>
              <button
                onClick={() => onColsChange(1)}
                aria-label="تک ستون"
                className={`p-1 rounded-lg transition-all cursor-pointer select-none ${maxCols === 1 ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] font-bold" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
                title="نمایش تک ستونه"
              >
                <Columns2 className="w-3.5 h-3.5 rotate-90" />
              </button>
              <button
                onClick={() => onColsChange(2)}
                aria-label="دو ستون"
                className={`p-1 rounded-lg transition-all cursor-pointer select-none ${maxCols === 2 ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] font-bold" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
                title="نمایش دو ستونه"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onColsChange(3)}
                aria-label="سه ستون"
                className={`p-1 rounded-lg transition-all cursor-pointer select-none ${maxCols === 3 ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] font-bold" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
                title="نمایش سه ستونه"
              >
                <LayoutGrid className="w-3.5 h-3.5 scale-x-110" />
              </button>
           </div>

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

      {/* Body Island */}
      <div className="w-full relative group/body flex-grow">
        <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
          <div className={`flex flex-wrap gap-4 w-full text-right p-4 relative z-10 group-layout-${id.replace(/\s+/g, '-')}`}>
            <style dangerouslySetInnerHTML={{__html: `
              .group-layout-${id.replace(/\s+/g, '-')} > * {
                flex-grow: 1;
                flex-shrink: 0;
                flex-basis: ${maxCols === 1 ? '100%' : maxCols === 2 ? 'calc(50% - 0.5rem)' : 'calc(33.333% - 0.75rem)'};
                max-width: 100%;
              }
            `}} />
            <AnimatePresence mode="popLayout">
              {children}
            </AnimatePresence>
          </div>
        </SortableContext>
      </div>
      
      {/* Footer Island */}
      <div 
        className="p-3 bg-black/10 border-t border-[var(--border-color)] flex justify-between flex-row-reverse items-center relative z-10"
      >
          <div className="flex gap-1.5 opacity-50 px-2 transition-opacity group-hover/group-card:opacity-100">
             {Array.from({ length: maxCols }).map((_, idx) => (
                <div key={idx} className="w-2 h-1 bg-[var(--accent3)]" />
             ))}
          </div>
      </div>
    </div>
  );
}
