"use client";

import React from "react";
import { 
  DndContext, 
  closestCenter, 
  DragOverlay,
  DragStartEvent,
  DragEndEvent
} from "@dnd-kit/core";
import { 
  SortableContext, 
  verticalListSortingStrategy, 
  rectSortingStrategy 
} from "@dnd-kit/sortable";
import SortableGroup from "./SortableGroup";
import SortableSegmentCard from "./SortableSegmentCard";
import TrashDropZone from "./TrashDropZone";

interface IoTWorkspaceProps {
  sensors: any;
  groupsOrder: string[];
  groupsCols: number;
  segments: any[];
  groupConfigs: Record<string, { maxCols: number }>;
  pinsState: Record<string, boolean>;
  isLoadingIoT: boolean;
  activeSegmentId: string | null;
  activeGroupId: string | null;
  animationsEnabled?: boolean;
  
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleGroupColsChange: (groupName: string, cols: number) => void;
  handleAddPlaceholder: (groupId: string) => void;
  handleRemoveGroup: (groupId: string) => void;
  handleRemoveSegment: (id: string) => void;
  handleTogglePin: (pin: string) => void;
  handleSetPinState: (pin: string, state: boolean) => void;
  handleUpdateSegmentMode: (id: string, mode: "switch" | "push") => void;
  handleSetupPlaceholder: (id: string) => void;
}

export default function IoTWorkspace({
  sensors,
  groupsOrder,
  groupsCols,
  segments,
  groupConfigs,
  pinsState,
  isLoadingIoT,
  activeSegmentId,
  activeGroupId,
  animationsEnabled,
  handleDragStart,
  handleDragEnd,
  handleGroupColsChange,
  handleAddPlaceholder,
  handleRemoveGroup,
  handleRemoveSegment,
  handleTogglePin,
  handleSetPinState,
  handleUpdateSegmentMode,
  handleSetupPlaceholder,
}: IoTWorkspaceProps) {
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={groupsOrder.map(g => `group-${g}`)} 
        strategy={groupsCols > 1 ? rectSortingStrategy : verticalListSortingStrategy}
      >
        <div className={
          groupsCols === 3 ? "grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-start" :
          groupsCols === 2 ? "grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-start" :
          "w-full space-y-8 items-start"
        }>
          {groupsOrder.map((groupName) => {
            const groupSegments = segments.filter(s => (s.group || "Test") === groupName);
            return (
              <div key={groupName} className="space-y-3 w-full">
                <SortableGroup 
                  id={groupName} 
                  items={groupSegments.map(s => s.id)} 
                  segmentCount={groupSegments.length}
                  maxCols={groupConfigs[groupName]?.maxCols || 3}
                  onColsChange={(cols) => handleGroupColsChange(groupName, cols)}
                  onAddPlaceholder={handleAddPlaceholder}
                  onDeleteGroup={handleRemoveGroup}
                  parentGroupsCols={groupsCols}
                >
                  {groupSegments.map((seg) => (
                    <SortableSegmentCard
                      key={seg.id}
                      segment={seg}
                      isPinOn={!!pinsState[seg.pin]}
                      onRemove={handleRemoveSegment}
                      onTogglePin={handleTogglePin}
                      onSetPinState={handleSetPinState}
                      onUpdateSegmentMode={handleUpdateSegmentMode}
                      isLoadingIoT={isLoadingIoT}
                      onSetupPlaceholder={handleSetupPlaceholder}
                      parentGroupsCols={groupsCols}
                      groupMaxCols={groupConfigs[groupName]?.maxCols || 3}
                      animationsEnabled={animationsEnabled}
                    />
                  ))}
                </SortableGroup>
              </div>
            );
          })}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeSegmentId ? (
          (() => {
            const seg = segments.find(s => s.id === activeSegmentId);
            if (!seg) return null;
            const originalGroupCols = groupConfigs[seg.group || "Test"]?.maxCols || 3;
            return (
              <div style={{ opacity: 0.8, cursor: "grabbing" }}>
                <SortableSegmentCard
                  segment={seg}
                  isPinOn={!!pinsState[seg.pin]}
                  onRemove={handleRemoveSegment}
                  onTogglePin={handleTogglePin}
                  onSetPinState={handleSetPinState}
                  onUpdateSegmentMode={handleUpdateSegmentMode}
                  isLoadingIoT={isLoadingIoT}
                  parentGroupsCols={groupsCols}
                  groupMaxCols={originalGroupCols}
                  animationsEnabled={animationsEnabled}
                />
              </div>
            );
          })()
        ) : null}
        {activeGroupId ? (
          (() => {
            const groupId = activeGroupId.replace("group-", "");
            const groupSegments = segments.filter(s => (s.group || "Test") === groupId);
            return (
              <div style={{ opacity: 0.8, cursor: "grabbing" }}>
                <SortableGroup 
                  id={groupId} 
                  items={groupSegments.map(s => s.id)} 
                  segmentCount={groupSegments.length}
                  maxCols={groupConfigs[groupId]?.maxCols || 3}
                  parentGroupsCols={groupsCols}
                  onColsChange={() => {}}
                  onAddPlaceholder={() => {}}
                  onDeleteGroup={() => {}}
                >
                  <></>
                </SortableGroup>
              </div>
            );
          })()
        ) : null}
      </DragOverlay>
      <TrashDropZone activeId={activeSegmentId || activeGroupId} />
    </DndContext>
  );
}
