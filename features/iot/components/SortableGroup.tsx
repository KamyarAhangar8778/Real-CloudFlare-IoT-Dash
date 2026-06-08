"use client";

import React from "react";
import { useSortable, SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Layers, Plus, Trash2, GripVertical } from "lucide-react";

interface SortableGroupProps {
  id: string; // Group Name
  items: string[]; // Segment IDs
  segmentCount: number;
  maxCols: number;
  onColsChange: (cols: number) => void;
  onAddPlaceholder: (groupId: string) => void;
  onDeleteGroup: (groupId: string) => void;
  parentGroupsCols?: number;
  children: React.ReactNode;
}

export default function SortableGroup({ id, items, segmentCount, maxCols, onColsChange, onAddPlaceholder, onDeleteGroup, parentGroupsCols = 1, children }: SortableGroupProps) {
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
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="relative group/group-card w-full mb-6 touch-none flex flex-col border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-md rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-150"
    >


      {/* Header Island */}
      <div 
        className={`flex items-center justify-between bg-black/20 border-b border-[var(--border-color)] relative z-10 rounded-t-2xl ${
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
              <h4 className={`font-sans font-bold text-[var(--accent3)] truncate ${parentGroupsCols === 3 ? "text-[11px]" : "text-sm"}`}>{id}</h4>
              <span className="text-[9px] theme-text-muted mt-0.5 whitespace-nowrap block">({segmentCount} دستگاه)</span>
           </div>
        </div>

        <div className={`flex items-center shrink-0 ${parentGroupsCols === 3 ? "gap-1" : "gap-3"}`}>
           {/* Layout selector */}
           <div className={`${parentGroupsCols === 3 ? "hidden select-none pointer-events-none" : "hidden sm:flex"} items-center gap-1.5 p-1 bg-black/30 border border-[var(--border-color)] backdrop-blur-sm`} style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}>
              <button
                onClick={() => onColsChange(1)}
                className={`p-1.5 flex items-center justify-center transition-colors ${maxCols === 1 ? 'text-[var(--accent3)] bg-[var(--accent3-transparent)]' : 'text-gray-500 hover:text-gray-300'}`}
                style={{ clipPath: "polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)" }}
                title="تک ستونه"
              >
                <div className="w-4 h-3 flex flex-col gap-[2px]">
                  <div className="w-full h-full bg-current rounded-[1px]" />
                </div>
              </button>
              <button
                onClick={() => onColsChange(2)}
                className={`p-1.5 flex items-center justify-center transition-colors ${maxCols === 2 ? 'text-[var(--accent3)] bg-[var(--accent3-transparent)]' : 'text-gray-500 hover:text-gray-300'}`}
                style={{ clipPath: "polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)" }}
                title="دو ستونه"
              >
                <div className="w-4 h-3 flex gap-[2px]">
                  <div className="w-1/2 h-full bg-current rounded-[1px]" />
                  <div className="w-1/2 h-full bg-current rounded-[1px]" />
                </div>
              </button>
              <button
                onClick={() => onColsChange(3)}
                className={`p-1.5 flex items-center justify-center transition-colors ${maxCols === 3 ? 'text-[var(--accent3)] bg-[var(--accent3-transparent)]' : 'text-gray-500 hover:text-gray-300'}`}
                style={{ clipPath: "polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)" }}
                title="سه ستونه"
              >
                <div className="w-4 h-3 flex gap-[2px]">
                  <div className="w-1/3 h-full bg-current rounded-[1px]" />
                  <div className="w-1/3 h-full bg-current rounded-[1px]" />
                  <div className="w-1/3 h-full bg-current rounded-[1px]" />
                </div>
              </button>
           </div>

          {/* Add Placeholder Handle */}
          <button
             onClick={() => onAddPlaceholder(id)}
             className={parentGroupsCols === 3 ? "p-1 hover:bg-[var(--accent3-transparent)] text-[var(--accent3)] cursor-pointer transition-colors backdrop-blur-sm" : "p-1.5 hover:bg-[var(--accent3-transparent)] text-[var(--accent3)] cursor-pointer transition-colors backdrop-blur-sm"}
             style={{ clipPath: "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)" }}
             title="اضافه کردن فضای خالی"
          >
             <Plus className={parentGroupsCols === 3 ? "w-4 h-4" : "w-5 h-5"} />
          </button>

          {/* Delete Group Handle */}
          <button
             onClick={() => onDeleteGroup(id)}
             className={parentGroupsCols === 3 ? "p-1 hover:bg-red-500/20 text-red-500 cursor-pointer transition-colors backdrop-blur-sm" : "p-1.5 hover:bg-red-500/20 text-red-500 cursor-pointer transition-colors backdrop-blur-sm"}
             style={{ clipPath: "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)" }}
             title="پاک کردن گروه و تمام محتوای درون آن"
          >
             <Trash2 className={parentGroupsCols === 3 ? "w-4 h-4" : "w-5 h-5"} />
          </button>

          {/* Group Drag Handle */}
          <div 
            {...attributes} 
            {...listeners}
            className={parentGroupsCols === 3 ? "p-1 hover:bg-[var(--accent3-transparent)] text-[var(--accent3-heavy)] hover:text-[var(--accent3)] cursor-grab active:cursor-grabbing transition-colors backdrop-blur-sm" : "p-1.5 hover:bg-[var(--accent3-transparent)] text-[var(--accent3-heavy)] hover:text-[var(--accent3)] cursor-grab active:cursor-grabbing transition-colors backdrop-blur-sm"}
            style={{ clipPath: "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)" }}
            title="جابه‌جایی کل گروه"
          >
            <GripVertical className={parentGroupsCols === 3 ? "w-4 h-4" : "w-5 h-5"} />
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
            {children}
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
