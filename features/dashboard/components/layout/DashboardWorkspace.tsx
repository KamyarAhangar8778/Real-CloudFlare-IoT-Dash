"use client";

import React from "react";
import WelcomePortal from "@/features/iot/components/welcome-portal";
import IoTWorkspace from "@/features/iot/components/IoTWorkspace";
import { WorkspaceSkeleton } from "@/features/iot/components/workspace";
import MacroSidebar from "../widgets/MacroSidebar";
import GroupFilterSelector from "@/components/MasterHeader/GroupFilterSelector";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { useWorkspaceSwipe } from "../../hooks/useWorkspaceSwipe";
import { useDashboardLayout } from "../../hooks/useDashboardLayout";

export default function DashboardWorkspace() {
  const {
    isDark,
    accent3,
    accent4,
    setIsMenuOpen,
    setIsModulesMenuOpen,
    animationsEnabled,
    sensors,
    isLoadingIoT,
    activeSegmentId,
    activeGroupId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
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
    headerPosition,
    dashboardWidth,
    isFullyReady,
    isGroupsCompactLayout,
    isSegmentsCompactLayout,
  } = useDashboard();

  const segments = useIoTStore(s => s.segments);
  const selectedGroupFilter = useIoTStore(s => s.selectedGroupFilter);
  const setSelectedGroupFilter = useIoTStore(s => s.setSelectedGroupFilter);
  const groupsOrder = useIoTStore(s => s.groupsOrder);
  const groupsCols = useIoTStore(s => s.groupsCols);
  const groupConfigs = useIoTStore(s => s.groupConfigs);
  const pinsState = useIoTStore(s => s.pinsState);

  const { onTouchStart, onTouchMove, onTouchEnd } = useWorkspaceSwipe(selectedGroupFilter, setSelectedGroupFilter, groupsOrder);
  const { innerWidthClass, outerWidthClass } = useDashboardLayout(dashboardWidth);

  const isLeftHeader = headerPosition === "left";

  return (
    <div 
      className={`w-full flex ${isLeftHeader ? "flex-col items-center" : "flex-row-reverse items-start justify-center gap-6"} ${outerWidthClass} mx-auto transition-all duration-500`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="hidden lg:block pt-[115px]">
        <MacroSidebar />
      </div>
      <main className={`flex-1 flex flex-col justify-center items-center text-center ${innerWidthClass} mx-auto space-y-8 py-4 w-full relative transition-all duration-500`}>
        {!isFullyReady ? (
          <div className="w-full flex flex-col gap-4">
            <div className="-mt-6 sm:-mt-10 mb-2 w-full flex justify-center">
               <div className="w-32 h-10 bg-[var(--card-bg)] rounded-2xl animate-pulse border border-[var(--border-color)]" />
            </div>
            <WorkspaceSkeleton groupsCols={groupsCols} />
          </div>
        ) : segments.length === 0 ? (
          <WelcomePortal
            setIsMenuOpen={setIsMenuOpen}
            setIsModulesMenuOpen={setIsModulesMenuOpen}
            accent3={accent3}
            accent4={accent4}
            animationsEnabled={animationsEnabled}
            isDark={isDark}
          />
        ) : (
          <div className="w-full flex flex-col gap-4">
            <div className="-mt-6 sm:-mt-10 mb-2 w-full flex justify-center">
              <div className="block md:hidden w-full">
                <MacroSidebar forceHorizontal={true} />
              </div>
              <div className="hidden md:flex w-full justify-center">
                <GroupFilterSelector
                  groupsOrder={groupsOrder}
                  selectedGroupFilter={selectedGroupFilter}
                  setSelectedGroupFilter={setSelectedGroupFilter}
                  animationsEnabled={animationsEnabled}
                />
              </div>
            </div>
            
            <IoTWorkspace
              sensors={sensors}
              groupsOrder={groupsOrder}
              groupsCols={groupsCols}
              segments={segments}
              groupConfigs={groupConfigs}
              pinsState={pinsState}
              isLoadingIoT={isLoadingIoT}
              activeSegmentId={activeSegmentId}
              activeGroupId={activeGroupId}
              animationsEnabled={animationsEnabled}
              selectedGroupFilter={selectedGroupFilter}
              isGroupsCompactLayout={isGroupsCompactLayout}
              isSegmentsCompactLayout={isSegmentsCompactLayout}
              dashboardWidth={dashboardWidth}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDragEnd={handleDragEnd}
              handleGroupColsChange={handleGroupColsChange}
              handleAddPlaceholder={handleAddPlaceholder}
              handleRemoveGroup={handleRemoveGroup}
              handleRemoveSegment={handleRemoveSegment}
              handleTogglePin={handleTogglePin}
              handleSetPinState={handleSetPinState}
              handleUpdateSegmentMode={handleUpdateSegmentMode}
              handleUpdateSegmentAutoOff={handleUpdateSegmentAutoOff}
              handleUpdateSegmentRule={handleUpdateSegmentRule}
              handleSetupPlaceholder={handleSetupPlaceholder}
            />
          </div>
        )}
      </main>
    </div>
  );
}
