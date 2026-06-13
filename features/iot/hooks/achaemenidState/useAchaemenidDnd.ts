"use client";

import { useState } from "react";
import { KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverEvent } from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

export function useAchaemenidDnd({
  segments, setSegments, groupsOrder, setGroupsOrder, handleRemoveGroup, handleRemoveSegment
}: {
  segments: any[];
  setSegments: (segments: any[] | ((prev: any[]) => any[])) => void;
  groupsOrder: string[];
  setGroupsOrder: (order: string[] | ((prev: string[]) => string[])) => void;
  handleRemoveGroup: (groupId: string) => void;
  handleRemoveSegment: (id: string) => void;
}) {
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.type === "Group") setActiveGroupId(e.active.id as string);
    else setActiveSegmentId(e.active.id as string);
  };

  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over || active.data.current?.type === "Group" || over.data.current?.type === "Group") return;

    const activeSeg = segments.find(s => s.id === active.id);
    if (!activeSeg) return;
    const overSeg = segments.find(s => s.id === over.id);

    if (overSeg) {
      const activeGroup = activeSeg.group || "Test";
      const overGroup = overSeg.group || "Test";
      setSegments((prev) => {
        const activeIdx = prev.findIndex(s => s.id === active.id);
        const overIdx = prev.findIndex(s => s.id === over.id);
        if (activeIdx === -1 || overIdx === -1) return prev;
        if (activeGroup !== overGroup) {
          const updated = [...prev];
          updated[activeIdx] = { ...updated[activeIdx], group: overGroup };
          const [moved] = updated.splice(activeIdx, 1);
          updated.splice(overIdx, 0, moved);
          return updated;
        }
        return activeIdx !== overIdx ? arrayMove(prev, activeIdx, overIdx) : prev;
      });
    } else {
      const overIdStr = over.id.toString();
      const targetGroup = overIdStr.startsWith("group-") ? overIdStr.replace("group-", "") : (groupsOrder.includes(overIdStr) ? overIdStr : "");
      if (targetGroup && (activeSeg.group || "Test") !== targetGroup) {
        setSegments((prev) => {
          const idx = prev.findIndex(s => s.id === active.id);
          if (idx === -1) return prev;
          const updated = [...prev];
          updated[idx] = { ...updated[idx], group: targetGroup };
          return updated;
        });
      }
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveSegmentId(null);
    setActiveGroupId(null);
    const { active, over } = e;
    if (!over) return;
    if (over.id === "trash-dropzone") {
      if (active.data.current?.type === "Group") handleRemoveGroup(active.id.toString().replace("group-", ""));
      else if (active.data.current?.type === "Segment") handleRemoveSegment(active.id.toString());
      return;
    }
    if (active.data.current?.type === "Group") {
      const activeIdStr = active.id.toString().replace("group-", "");
      const overIdStr = over.id.toString().replace("group-", "");
      if (activeIdStr !== overIdStr) {
        setGroupsOrder((prev) => {
          const activeIdx = prev.indexOf(activeIdStr);
          const overIdx = prev.indexOf(overIdStr);
          return (activeIdx !== -1 && overIdx !== -1) ? arrayMove(prev, activeIdx, overIdx) : prev;
        });
      }
    }
  };

  return { sensors, activeSegmentId, activeGroupId, handleDragStart, handleDragOver, handleDragEnd };
}
