"use client";

import React from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import TrashDropZone from "./TrashDropZone";
import { WorkspaceGrid, WorkspaceDragOverlay, IoTWorkspaceProps } from "./workspace";

export type { IoTWorkspaceProps };

export default function IoTWorkspace(props: IoTWorkspaceProps) {
  return (
    <DndContext
      sensors={props.sensors}
      collisionDetection={closestCorners}
      autoScroll={{ layoutShiftCompensation: false }}
      onDragStart={props.handleDragStart}
      onDragOver={props.handleDragOver}
      onDragEnd={props.handleDragEnd}
    >
      <WorkspaceGrid {...props} />
      <WorkspaceDragOverlay {...props} />
      <TrashDropZone activeId={props.activeSegmentId || props.activeGroupId} />

      {/* Force grabbing cursor globally during drag to prevent underlying elements from overriding it */}
      {(props.activeSegmentId || props.activeGroupId) && (
        <style dangerouslySetInnerHTML={{ __html: `* { cursor: grabbing !important; }` }} />
      )}
    </DndContext>
  );
}
