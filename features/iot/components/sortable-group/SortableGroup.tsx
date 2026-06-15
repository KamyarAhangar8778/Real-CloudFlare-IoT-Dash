"use client";

import React from "react";
import { useSortable, SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence } from "motion/react";
import { SortableGroupProps } from "./types";
import GroupHeader from "./GroupHeader";

export default function SortableGroup({
  id,
  items,
  segmentCount,
  maxCols,
  onColsChange,
  onAddPlaceholder,
  onDeleteGroup,
  parentGroupsCols = 1,
  animationsEnabled = true,
  children,
}: SortableGroupProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `group-${id}`,
    data: {
      type: "Group",
      group: id,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: animationsEnabled
      ? transition || "transform 350ms cubic-bezier(0.16, 1, 0.3, 1)"
      : "none",
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group/group-card w-full mb-6 touch-none flex flex-col border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-md rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-350 hover:-translate-y-1 hover:border-[var(--accent3)]"
    >
      <GroupHeader
        id={id}
        segmentCount={segmentCount}
        maxCols={maxCols}
        onColsChange={onColsChange}
        onAddPlaceholder={onAddPlaceholder}
        onDeleteGroup={onDeleteGroup}
        parentGroupsCols={parentGroupsCols}
        attributes={attributes}
        listeners={listeners}
      />

      {/* Body Island */}
      <div className="w-full relative group/body flex-grow">
        <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
          <div
            className={`flex flex-wrap gap-4 w-full text-right p-4 relative z-10 group-layout-${id.replace(
              /\s+/g,
              "-",
            )}`}
          >
            <style
              dangerouslySetInnerHTML={{
                __html: `
              .group-layout-${id.replace(/\s+/g, "-")} > * {
                flex-grow: 1;
                flex-shrink: 0;
                flex-basis: ${
                  maxCols === 1
                    ? "100%"
                    : maxCols === 2
                      ? "calc(50% - 0.5rem)"
                      : "calc(33.333% - 0.75rem)"
                };
                max-width: 100%;
              }
            `,
              }}
            />
            <AnimatePresence mode="popLayout">{children}</AnimatePresence>
          </div>
        </SortableContext>
      </div>

      {/* Footer Island */}
      <div className="p-3 bg-black/10 border-t border-[var(--border-color)] flex justify-between flex-row-reverse items-center relative z-10">
        <div className="flex gap-1.5 opacity-50 px-2 transition-opacity group-hover/group-card:opacity-100">
          {Array.from({ length: maxCols }).map((_, idx) => (
            <div key={idx} className="w-2 h-1 bg-[var(--accent3)]" />
          ))}
        </div>
      </div>
    </div>
  );
}
