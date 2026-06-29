"use client";

import React from "react";
import WelcomePortal from "@/features/iot/components/WelcomePortal";
import IoTWorkspace from "@/features/iot/components/IoTWorkspace";
import MacroSidebar from "./MacroSidebar";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";

export default function DashboardWorkspace() {
  const {
    segments,
    isDark,
    accent3,
    accent4,
    setIsMenuOpen,
    setIsModulesMenuOpen,
    animationsEnabled,
    selectedGroupFilter,
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
    handleUpdateSegmentAutoOff,
    handleUpdateSegmentRule,
    handleSetupPlaceholder,
    headerPosition,
  } = useDashboard();

  const isLeftHeader = headerPosition === "left";

  return (
    <div className={`w-full flex ${isLeftHeader ? "flex-col items-center" : "flex-row-reverse items-start justify-center gap-6"} max-w-[80rem] mx-auto`}>
      <MacroSidebar />
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
              selectedGroupFilter={selectedGroupFilter}
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
