import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableGroup from "../SortableGroup";
import SortableSegmentCard from "../SortableSegmentCard";
import { IoTWorkspaceProps } from "./types";

type WorkspaceGridProps = Omit<
  IoTWorkspaceProps,
  | "sensors"
  | "handleDragStart"
  | "handleDragOver"
  | "handleDragEnd"
  | "activeSegmentId"
  | "activeGroupId"
>;

export default function WorkspaceGrid({
  groupsOrder,
  groupsCols,
  segments,
  groupConfigs,
  pinsState,
  isLoadingIoT,
  animationsEnabled,
  handleGroupColsChange,
  handleAddPlaceholder,
  handleRemoveGroup,
  handleRemoveSegment,
  handleTogglePin,
  handleSetPinState,
  handleUpdateSegmentMode,
  handleUpdateSegmentAutoOff,
  handleSetupPlaceholder,
}: WorkspaceGridProps) {
  return (
    <SortableContext
      items={groupsOrder.map((g) => `group-${g}`)}
      strategy={groupsCols > 1 ? rectSortingStrategy : verticalListSortingStrategy}
    >
      <div
        className={
          groupsCols === 3
            ? "grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-start"
            : groupsCols === 2
              ? "grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-start"
              : "w-full space-y-8 items-start"
        }
      >
        {groupsOrder.map((groupName) => {
          const groupSegments = segments.filter((s) => (s.group || "Test") === groupName);
          return (
            <div key={groupName} className="space-y-3 w-full">
              <SortableGroup
                id={groupName}
                items={groupSegments.map((s) => s.id)}
                segmentCount={groupSegments.length}
                maxCols={groupConfigs[groupName]?.maxCols || 3}
                onColsChange={(cols) => handleGroupColsChange(groupName, cols)}
                onAddPlaceholder={handleAddPlaceholder}
                onDeleteGroup={handleRemoveGroup}
                parentGroupsCols={groupsCols}
                animationsEnabled={animationsEnabled}
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
                    onUpdateSegmentAutoOff={handleUpdateSegmentAutoOff}
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
  );
}
