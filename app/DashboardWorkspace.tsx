"use client";

import React from "react";
import WelcomePortal from "@/features/iot/components/WelcomePortal";
import IoTWorkspace from "@/features/iot/components/IoTWorkspace";
import { useDashboard } from "./DashboardContext";

export default function DashboardWorkspace() {
  const {
    segments,
    isDark,
    accent3,
    accent4,
    setIsMenuOpen,
    setIsModulesMenuOpen,
    animationsEnabled,
    sensors,
    groupsOrder,
    groupsCols,
    groupConfigs,
    pinsState,
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
    handleSetupPlaceholder,
  } = useDashboard();

  return (
    <main className="flex-1 flex flex-col justify-center items-center text-center max-w-4xl mx-auto space-y-8 py-4 w-full relative">
      {segments.length === 0 ? (
        <WelcomePortal 
          setIsMenuOpen={setIsMenuOpen} 
          setIsModulesMenuOpen={setIsModulesMenuOpen} 
          accent3={accent3}
          accent4={accent4}
          animationsEnabled={animationsEnabled}
          isDark={isDark}
        />
      ) : (
        <div className="w-full space-y-6">
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
            handleSetupPlaceholder={handleSetupPlaceholder}
          />
        </div>
      )}
    </main>
  );
}
