import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableGroup from "../SortableGroup";
import SortableSegmentCard from "../SortableSegmentCard";
import { IoTWorkspaceProps } from "./types";
import { useMediaQuery } from "../../hooks/useMediaQuery";

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
  const isMobilePortrait = useMediaQuery("(max-width: 767px) and (orientation: portrait)");
  
  const filteredGroupsOrder = selectedGroupFilter
    ? groupsOrder.filter((g) => g === selectedGroupFilter)
    : groupsOrder;

  const groupsCols = isMobilePortrait ? 1 : (selectedGroupFilter ? 1 : initialGroupsCols);

  const itemsInLastRow = filteredGroupsOrder.length % groupsCols;
  const hasSingleItemInLastRow = itemsInLastRow === 1;

  const masonryGroups = hasSingleItemInLastRow
    ? filteredGroupsOrder.slice(0, -1)
    : filteredGroupsOrder;

  const lastRowGroup = hasSingleItemInLastRow
    ? filteredGroupsOrder[filteredGroupsOrder.length - 1]
    : null;

  // Distribute items into columns to create a masonry effect while maintaining left-to-right order
  const columns: string[][] = Array.from({ length: groupsCols }, () => []);
  masonryGroups.forEach((groupName, index) => {
    columns[index % groupsCols].push(groupName);
  });

  const renderGroup = (groupName: string, groupIndex: number) => {
    const groupSegments = segments.filter(
      (s) => (s.group || "Test") === groupName,
    );
    let actualParentGroupsCols = groupsCols;

    if (groupsCols > 1 && filteredGroupsOrder.length > 0) {
      const totalRows = Math.ceil(filteredGroupsOrder.length / groupsCols);
      const currentRow = Math.floor(groupIndex / groupsCols);
      const isLastRow = currentRow === totalRows - 1;

      if (isLastRow) {
        const itemsInLastRow =
          filteredGroupsOrder.length % groupsCols || groupsCols;
        actualParentGroupsCols = itemsInLastRow;
      }
    }

    const effectiveGroupsCols = Math.min(
      filteredGroupsOrder.length,
      actualParentGroupsCols,
    );

    return (
      <div key={groupName} className={isGroupsCompactLayout ? "space-y-3" : ""}>
        <SortableGroup
          id={groupName}
          items={groupSegments.map((s) => s.id)}
          segmentCount={groupSegments.length}
          maxCols={groupConfigs[groupName]?.maxCols || 3}
          icon={groupConfigs[groupName]?.icon}
          onColsChange={(cols) => handleGroupColsChange(groupName, cols)}
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
        <div className="flex flex-wrap gap-8 w-full items-start workspace-grid-layout">
          <style
            dangerouslySetInnerHTML={{
              __html: `
                .workspace-grid-layout > * {
                  flex-grow: 1;
                  flex-shrink: 0;
                  min-width: 0;
                  flex-basis: ${
                    groupsCols === 1
                      ? "100%"
                      : groupsCols === 2
                        ? "calc(50% - 1rem - 0.1px)"
                        : "calc(33.3333% - 1.3333rem - 0.1px)"
                  };
                  max-width: 100%;
                }
                @media (max-width: 767px) and (orientation: portrait) {
                  .workspace-grid-layout > * {
                    flex-basis: 100%;
                  }
                }
              `,
            }}
          />
          {filteredGroupsOrder.map((groupName, groupIndex) => renderGroup(groupName, groupIndex))}
        </div>
      )}
    </SortableContext>
  );
}
