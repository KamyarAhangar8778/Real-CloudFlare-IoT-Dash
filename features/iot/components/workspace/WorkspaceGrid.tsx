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
  handleUpdateSegmentRule,
  handleSetupPlaceholder,
}: WorkspaceGridProps) {
  return (
    <SortableContext
      items={groupsOrder.map((g) => `group-${g}`)}
      strategy={groupsCols > 1 ? rectSortingStrategy : verticalListSortingStrategy}
    >
      <div className="flex flex-wrap gap-8 w-full items-start workspace-grid-layout">
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .workspace-grid-layout > * {
                flex-grow: 1;
                flex-shrink: 0;
                flex-basis: ${
                  groupsCols === 1
                    ? "100%"
                    : groupsCols === 2
                      ? "calc(50% - 1rem)"
                      : "calc(33.3333% - 1.3333rem)"
                };
              }
            `,
          }}
        />
        {groupsOrder.map((groupName) => {
          const groupSegments = segments.filter((s) => (s.group || "Test") === groupName);
          const effectiveGroupsCols = Math.min(groupsOrder.length, groupsCols);
          
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
                parentGroupsCols={effectiveGroupsCols}
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
                    onUpdateSegmentRule={handleUpdateSegmentRule}
                    isLoadingIoT={isLoadingIoT}
                    onSetupPlaceholder={handleSetupPlaceholder}
                    parentGroupsCols={effectiveGroupsCols}
                    groupMaxCols={groupConfigs[groupName]?.maxCols || 3}
                    groupItemsCount={groupSegments.length}
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
