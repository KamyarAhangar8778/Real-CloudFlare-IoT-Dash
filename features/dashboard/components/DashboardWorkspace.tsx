"use client";

import React, { useState } from "react";
import WelcomePortal from "@/features/iot/components/WelcomePortal";
import IoTWorkspace from "@/features/iot/components/IoTWorkspace";
import WorkspaceSkeleton from "@/features/iot/components/workspace/WorkspaceSkeleton";
import MacroSidebar from "./MacroSidebar";
import GroupFilterSelector from "@/components/MasterHeader/GroupFilterSelector";
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
    setSelectedGroupFilter,
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
    dashboardWidth,
    isFullyReady,
    isGroupsCompactLayout,
    isSegmentsCompactLayout,
  } = useDashboard();

  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number, y: number } | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    
    // Only trigger horizontal swipe if X movement is greater than Y movement
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      const isLeftSwipe = distanceX > minSwipeDistance;
      const isRightSwipe = distanceX < -minSwipeDistance;
      
      if (isLeftSwipe || isRightSwipe) {
        const allGroups = [null, ...groupsOrder];
        const currIndex = allGroups.findIndex((g) => g === selectedGroupFilter);
        const safeCurrIndex = currIndex === -1 ? 0 : currIndex;
        
        if (isRightSwipe) {
          // swipe right (finger moves right) means push current to right, reveal left
          // In RTL, left is Next
          const nextIndex = (safeCurrIndex + 1) % allGroups.length;
          setSelectedGroupFilter(allGroups[nextIndex]);
        } else if (isLeftSwipe) {
          // swipe left (finger moves left) means push current to left, reveal right
          // In RTL, right is Prev
          const prevIndex = (safeCurrIndex - 1 + allGroups.length) % allGroups.length;
          setSelectedGroupFilter(allGroups[prevIndex]);
        }
      }
    }
  };

  const isLeftHeader = headerPosition === "left";

  const getOuterWidthClass = (width: number) => {
    switch (width) {
      case 1: return "max-w-[80rem]"; // 1280px (Current default)
      case 2: return "max-w-[90rem]"; // 1440px
      case 3: return "max-w-[100rem]"; // 1600px
      case 4: return "max-w-[110rem]"; // 1760px
      case 5: return "max-w-full";
      default: return "max-w-[80rem]";
    }
  };

  const getInnerWidthClass = (width: number) => {
    switch (width) {
      case 1: return "max-w-4xl"; // 896px (Current default)
      case 2: return "max-w-5xl"; // 1024px
      case 3: return "max-w-6xl"; // 1152px
      case 4: return "max-w-7xl"; // 1280px
      case 5: return "max-w-full";
      default: return "max-w-4xl";
    }
  };

  return (
    <div 
      className={`w-full flex ${isLeftHeader ? "flex-col items-center" : "flex-row-reverse items-start justify-center gap-6"} ${getOuterWidthClass(dashboardWidth)} mx-auto transition-all duration-500`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="hidden lg:block pt-[115px]">
        <MacroSidebar />
      </div>
      <main className={`flex-1 flex flex-col justify-center items-center text-center ${getInnerWidthClass(dashboardWidth)} mx-auto space-y-8 py-4 w-full relative transition-all duration-500`}>
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
              {/* On mobile, show MacroSidebar in this center spot */}
              <div className="block md:hidden w-full">
                <MacroSidebar forceHorizontal={true} />
              </div>
              {/* On desktop, show GroupFilterSelector in this center spot */}
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
