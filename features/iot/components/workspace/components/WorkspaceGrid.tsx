import React, { useMemo } from "react";
import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableGroup from "../../SortableGroup";
import SortableSegmentCard from "../../SortableSegmentCard";
import { IoTWorkspaceProps } from "../core/types";
import { useWorkspaceGrid } from "../hooks/useWorkspaceGrid";
import { getEffectiveGroupsCols } from "../core/gridUtils";

type WorkspaceGridProps = Omit<
  IoTWorkspaceProps,
  | "sensors"
  | "handleDragStart"
  | "handleDragOver"
  | "handleDragEnd"
  | "activeSegmentId"
  | "activeGroupId"
> & {
  selectedGroupFilter?: string | null;
};

export default function WorkspaceGrid({
  groupsOrder,
  groupsCols: initialGroupsCols,
  segments,
  groupConfigs,
  pinsState,
  isLoadingIoT,
  animationsEnabled,
  selectedGroupFilter,
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
  isGroupsCompactLayout,
  isSegmentsCompactLayout,
  dashboardWidth = 1,
}: WorkspaceGridProps) {
  const {
    isMobilePortrait,
    filteredGroupsOrder,
    groupsCols,
    masonryGroups,
    lastRowGroup,
    columns,
  } = useWorkspaceGrid({
    groupsOrder,
    initialGroupsCols,
    selectedGroupFilter,
  });

  const segmentsByGroup = useMemo(() => {
    const map = new Map<string, typeof segments>();
    segments.forEach(seg => {
      const groupName = seg.group || "Test";
      if (!map.has(groupName)) {
        map.set(groupName, []);
      }
      map.get(groupName)!.push(seg);
    });
    return map;
  }, [segments]);

  const renderGroup = (groupName: string, groupIndex: number) => {
    const groupSegments = segmentsByGroup.get(groupName) || [];

    const effectiveGroupsCols = getEffectiveGroupsCols(
      groupIndex,
      filteredGroupsOrder.length,
      groupsCols
    );

    const flexBasis = isMobilePortrait || groupsCols === 1
      ? "100%"
      : groupsCols === 2
        ? "calc(50% - 1rem - 0.1px)"
        : "calc(33.3333% - 1.3333rem - 0.1px)";

    const baseClasses = isGroupsCompactLayout ? "space-y-3" : "flex-grow flex-shrink-0 min-w-0 max-w-full";
    const style = !isGroupsCompactLayout ? { flexBasis } : undefined;

    return (
      <div key={groupName} className={baseClasses} style={style}>
        <SortableGroup
          id={groupName}
          items={groupSegments.map((s) => s.id)}
          segmentCount={groupSegments.length}
          maxCols={groupConfigs[groupName]?.maxCols || 3}
          icon={groupConfigs[groupName]?.icon}
          onColsChange={(cols: number) => handleGroupColsChange(groupName, cols)}
          onAddPlaceholder={handleAddPlaceholder}
          onDeleteGroup={handleRemoveGroup}
          parentGroupsCols={effectiveGroupsCols}
          animationsEnabled={animationsEnabled}
          isSegmentsCompactLayout={isSegmentsCompactLayout}
        >
          {groupSegments.map((seg, index) => (
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
              index={index}
              animationsEnabled={animationsEnabled}
              dashboardWidth={dashboardWidth}
              isMobilePortrait={isMobilePortrait}
            />
          ))}
        </SortableGroup>
      </div>
    );
  };

  return (
    <SortableContext
      items={filteredGroupsOrder.map((g) => `group-${g}`)}
      strategy={isMobilePortrait ? () => null : rectSortingStrategy}
    >
      {isGroupsCompactLayout ? (
        <div className="flex flex-col gap-8 w-full items-start">
          {masonryGroups.length > 0 && (
            <div className="flex gap-8 w-full items-start">
              {columns.map((colGroups, colIndex) => (
                colGroups.length > 0 ? (
                  <div key={`col-${colIndex}`} className="flex-1 flex flex-col gap-8 min-w-0">
                    {colGroups.map((groupName, rowIdx) => {
                      const groupIndex = rowIdx * groupsCols + colIndex;
                      return renderGroup(groupName, groupIndex);
                    })}
                  </div>
                ) : null
              ))}
            </div>
          )}
          {lastRowGroup && (
            <div className="w-full">
              {renderGroup(lastRowGroup, filteredGroupsOrder.length - 1)}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-8 w-full items-start">
          {filteredGroupsOrder.map((groupName, groupIndex) => renderGroup(groupName, groupIndex))}
        </div>
      )}
    </SortableContext>
  );
}
