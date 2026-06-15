"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableSegmentCardProps } from "./types";
import PlaceholderCard from "./PlaceholderCard";
import ActiveCard from "./ActiveCard";

export default function SortableSegmentCard(props: SortableSegmentCardProps) {
  const { segment, parentGroupsCols = 1, groupMaxCols = 3, animationsEnabled = true } = props;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: segment.id,
    data: {
      type: "Segment",
      group: segment.group || "Test",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: animationsEnabled
      ? transition || "transform 350ms cubic-bezier(0.16, 1, 0.3, 1)"
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
        <PlaceholderCard
          segment={segment}
          onRemove={props.onRemove}
          onSetupPlaceholder={props.onSetupPlaceholder}
          attributes={attributes}
          listeners={listeners}
          isCompact={isCompact}
          isUltraCompact={isUltraCompact}
          animationsEnabled={animationsEnabled}
        />
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className="touch-none w-full relative h-full">
      <ActiveCard
        {...props}
        isCompact={isCompact}
        isUltraCompact={isUltraCompact}
        attributes={attributes}
        listeners={listeners}
      />
    </div>
  );
}
