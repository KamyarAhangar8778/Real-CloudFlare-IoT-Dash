"use client";

import React from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import TrashDropZone from "./TrashDropZone";
import { WorkspaceGrid, WorkspaceDragOverlay, IoTWorkspaceProps } from "./workspace";

export type { IoTWorkspaceProps };

export default function IoTWorkspace(props: IoTWorkspaceProps) {
  return (
    <DndContext
      sensors={props.sensors}
      collisionDetection={closestCenter}
      onDragStart={props.handleDragStart}
      onDragOver={props.handleDragOver}
      onDragEnd={props.handleDragEnd}
    >
      <WorkspaceGrid {...props} />
      <WorkspaceDragOverlay {...props} />
      <TrashDropZone activeId={props.activeSegmentId || props.activeGroupId} />
    </DndContext>
  );
}
