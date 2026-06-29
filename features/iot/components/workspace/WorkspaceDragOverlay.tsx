import React from "react";
import { DragOverlay } from "@dnd-kit/core";
import SortableGroup from "../SortableGroup";
import SortableSegmentCard from "../SortableSegmentCard";
import { IoTWorkspaceProps } from "./types";

type WorkspaceDragOverlayProps = Pick<
  IoTWorkspaceProps,
  | "activeSegmentId"
  | "activeGroupId"
  | "segments"
  | "groupConfigs"
  | "pinsState"
  | "isLoadingIoT"
  | "groupsCols"
  | "animationsEnabled"
  | "handleRemoveSegment"
  | "handleTogglePin"
  | "handleSetPinState"
  | "handleUpdateSegmentMode"
  | "handleUpdateSegmentAutoOff"
  | "handleUpdateSegmentRule"
>;

export default function WorkspaceDragOverlay({
  activeSegmentId,
  activeGroupId,
  segments,
  groupConfigs,
  pinsState,
  isLoadingIoT,
  groupsCols,
  animationsEnabled,
  handleRemoveSegment,
  handleTogglePin,
  handleSetPinState,
  handleUpdateSegmentMode,
  handleUpdateSegmentAutoOff,
  handleUpdateSegmentRule,
}: WorkspaceDragOverlayProps) {
  return (
    <DragOverlay>
      {activeSegmentId ? (
        (() => {
          const seg = segments.find(s => s.id === activeSegmentId);
          if (!seg) return null;
          const groupSegments = segments.filter(s => (s.group || "Test") === (seg.group || "Test"));
          const index = groupSegments.findIndex(s => s.id === activeSegmentId);
          const originalGroupCols = groupConfigs[seg.group || "Test"]?.maxCols || 3;
          
          const groupsOrder = Array.from(new Set(segments.map(s => s.group || "Test")));
          let actualParentGroupsCols = groupsCols;

          if (groupsCols > 1 && groupsOrder.length > 0) {
            const groupIndex = groupsOrder.indexOf(seg.group || "Test");
            if (groupIndex !== -1) {
              const totalRows = Math.ceil(groupsOrder.length / groupsCols);
              const currentRow = Math.floor(groupIndex / groupsCols);
              const isLastRow = currentRow === totalRows - 1;
              
              if (isLastRow) {
                const itemsInLastRow = groupsOrder.length % groupsCols || groupsCols;
                actualParentGroupsCols = itemsInLastRow;
              }
            }
          }

          const effectiveGroupsCols = Math.min(groupsOrder.length, actualParentGroupsCols);

          return (
            <div style={{ opacity: 0.8, cursor: "grabbing" }}>
              <SortableSegmentCard
                segment={seg}
                isPinOn={!!pinsState[seg.pin]}
                onRemove={handleRemoveSegment}
                onTogglePin={handleTogglePin}
                onSetPinState={handleSetPinState}
                onUpdateSegmentMode={handleUpdateSegmentMode}
                onUpdateSegmentAutoOff={handleUpdateSegmentAutoOff}
                onUpdateSegmentRule={handleUpdateSegmentRule}
                isLoadingIoT={isLoadingIoT}
                parentGroupsCols={effectiveGroupsCols}
                groupMaxCols={originalGroupCols}
                groupItemsCount={groupSegments.length}
                index={index >= 0 ? index : 0}
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
                icon={groupConfigs[groupId]?.icon}
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
  );
}
