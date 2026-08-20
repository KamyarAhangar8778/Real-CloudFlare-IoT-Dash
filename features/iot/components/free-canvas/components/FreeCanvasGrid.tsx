import React from "react";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { CanvasViewport } from "./CanvasViewport";
import { IoTWorkspaceProps } from "../../workspace/core/types";
import { useWorkspaceGrid } from "../../workspace/hooks/useWorkspaceGrid";
import SortableGroup from "../../SortableGroup";
import SortableSegmentCard from "../../SortableSegmentCard";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { useShallow } from "zustand/react/shallow";

const CanvasSegmentCard = React.memo((props: any) => {
  const segment = useIoTStore(
    React.useCallback((s) => s.segments.find((seg) => seg.id === props.segmentId), [props.segmentId])
  );
  if (!segment) return null;
  return <SortableSegmentCard segment={segment} {...props} />;
});

const CanvasGroup = React.memo((props: any) => {
  const {
    groupName,
    groupConfigs,
    handleGroupColsChange,
    handleAddPlaceholder,
    handleRemoveGroup,
    animationsEnabled,
    isSegmentsCompactLayout,
    segmentProps,
  } = props;

  const segmentIds = useIoTStore(
    useShallow((state) =>
      state.segments.filter((seg) => (seg.group || "Test") === groupName).map((seg) => seg.id)
    )
  );

  return (
    <div
      data-canvas-node="true"
      className="w-[360px] sm:w-[380px] shrink-0 transition-shadow select-none shadow-md rounded-2xl"
    >
      <SortableGroup
        id={groupName}
        items={segmentIds}
        segmentCount={segmentIds.length}
        maxCols={groupConfigs[groupName]?.maxCols || 2}
        icon={groupConfigs[groupName]?.icon}
        onColsChange={(cols: number) => handleGroupColsChange(groupName, cols)}
        onAddPlaceholder={handleAddPlaceholder}
        onDeleteGroup={handleRemoveGroup}
        parentGroupsCols={1}
        animationsEnabled={animationsEnabled}
        isSegmentsCompactLayout={isSegmentsCompactLayout}
      >
        {segmentIds.map((id: string, index: number) => (
          <CanvasSegmentCard
            {...segmentProps}
            key={id}
            segmentId={id}
            index={index}
            groupItemsCount={segmentIds.length}
            parentGroupsCols={1}
            groupMaxCols={groupConfigs[groupName]?.maxCols || 2}
            animationsEnabled={animationsEnabled}
            isMobilePortrait={false}
          />
        ))}
      </SortableGroup>
    </div>
  );
});

type FreeCanvasGridProps = Omit<
  IoTWorkspaceProps,
  | "sensors"
  | "handleDragStart"
  | "handleDragOver"
  | "handleDragEnd"
  | "activeSegmentId"
  | "activeGroupId"
>;

/**
 * Free-Canvas view mode rendering groups and segments on an infinite pan/zoom canvas.
 */
export function FreeCanvasGrid({
  groupsOrder,
  groupsCols: initialGroupsCols,
  groupConfigs,
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
  isSegmentsCompactLayout,
  dashboardWidth = 1,
}: FreeCanvasGridProps) {
  const { filteredGroupsOrder } = useWorkspaceGrid({
    groupsOrder,
    initialGroupsCols,
    selectedGroupFilter,
  });

  return (
    <CanvasViewport className="w-full h-full bg-[var(--bg-main)]">
      <SortableContext
        items={filteredGroupsOrder.map((g) => `group-${g}`)}
        strategy={rectSortingStrategy}
      >
        <div className="flex flex-row items-start gap-8 min-w-max p-4">
          {filteredGroupsOrder.map((groupName) => (
            <CanvasGroup
              key={groupName}
              groupName={groupName}
              groupConfigs={groupConfigs}
              handleGroupColsChange={handleGroupColsChange}
              handleAddPlaceholder={handleAddPlaceholder}
              handleRemoveGroup={handleRemoveGroup}
              animationsEnabled={animationsEnabled}
              isSegmentsCompactLayout={isSegmentsCompactLayout}
              segmentProps={{
                onRemove: handleRemoveSegment,
                onTogglePin: handleTogglePin,
                onSetPinState: handleSetPinState,
                onUpdateSegmentMode: handleUpdateSegmentMode,
                onUpdateSegmentAutoOff: handleUpdateSegmentAutoOff,
                onUpdateSegmentRule: handleUpdateSegmentRule,
                isLoadingIoT,
                onSetupPlaceholder: handleSetupPlaceholder,
                dashboardWidth,
              }}
            />
          ))}
        </div>
      </SortableContext>
    </CanvasViewport>
  );
}
