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
}: WorkspaceDragOverlayProps) {
  return (
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
                onUpdateSegmentAutoOff={props.handleUpdateSegmentAutoOff}
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
  );
}
