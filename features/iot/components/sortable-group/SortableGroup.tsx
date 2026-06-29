"use client";

import React from "react";
import {
  useSortable,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
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
  icon,
  children,
}: SortableGroupProps) {
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
      className="relative group/group-card w-full mb-6 touch-none flex flex-col gap-2 transition-all duration-350 md:hover:-translate-y-1.5"
    >
      <GroupHeader
        id={id}
        segmentCount={segmentCount}
        maxCols={maxCols}
        icon={icon}
        onColsChange={onColsChange}
        onAddPlaceholder={onAddPlaceholder}
        onDeleteGroup={onDeleteGroup}
        parentGroupsCols={parentGroupsCols}
        attributes={attributes}
        listeners={listeners}
      />

      {/* Body Island */}
      <div className="w-full relative group/body flex-grow bg-[var(--card-bg)] backdrop-blur-md border border-[var(--border-color)] shadow-sm rounded-lg transition-colors duration-350 md:group-hover/group-card:border-[var(--accent3)] md:group-hover/group-card:shadow-xl">
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
                min-width: 0;
                flex-basis: ${
                  maxCols === 1
                    ? "100%"
                    : maxCols === 2
                      ? "calc(50% - 0.5rem - 0.1px)"
                      : "calc(33.3333% - 0.6667rem - 0.1px)"
                };
              }
            `,
              }}
            />
            <AnimatePresence mode="popLayout">{children}</AnimatePresence>
          </div>
        </SortableContext>
      </div>

      {/* Footer Island */}
      <div className="p-3 bg-[var(--card-bg)] backdrop-blur-md border border-[var(--border-color)] shadow-sm transition-colors duration-350 md:group-hover/group-card:border-[var(--accent3)] md:group-hover/group-card:shadow-xl flex justify-between flex-row-reverse items-center relative z-10 rounded-b-2xl rounded-t-none">
        <div className="flex gap-1.5 opacity-50 px-2 transition-opacity md:group-hover/group-card:opacity-100">
          {Array.from({ length: maxCols }).map((_, idx) => (
            <div key={idx} className="w-2 h-1 bg-[var(--accent3)] rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
