"use client";

import React from "react";
import WelcomePortal from "@/features/iot/components/welcome-portal";
import IoTWorkspace from "@/features/iot/components/IoTWorkspace";
import SettingsWorkspace from "@/features/settings/components/SettingsWorkspace";
import ModulesWorkspace from "@/features/iot/components/modules-workspace";
import AutomationsWorkspace from "@/features/iot/components/automations-workspace";
import { WorkspaceSkeleton } from "@/features/iot/components/workspace";
import MacroSidebar from "../widgets/MacroSidebar";
import GroupFilterSelector from "@/components/MasterHeader/GroupFilterSelector";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { useWorkspaceSwipe } from "../../hooks/useWorkspaceSwipe";
import { useDashboardLayout } from "../../hooks/useDashboardLayout";
import { motion, AnimatePresence } from "motion/react";

export default function DashboardWorkspace() {
  const {
    sensors,
    isLoadingIoT,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleGroupColsChange,
    handleAddSegment,
    handleAddPlaceholder,
    handleRemoveGroup,
    handleRemoveSegment,
    handleTogglePin,
    handleSetPinState,
    handleUpdateSegmentMode,
    handleUpdateSegmentAutoOff,
    handleUpdateSegmentRule,
    handleSetupPlaceholder,
    isFullyReady,
  } = useDashboard();

  const isMenuOpen = useIoTStore(s => s.isMenuOpen);
  const isModulesMenuOpen = useIoTStore(s => s.isModulesMenuOpen);
  const setIsModulesMenuOpen = useIoTStore(s => s.setIsModulesMenuOpen);
  const isAutomationsMenuOpen = useIoTStore(s => s.isAutomationsMenuOpen);
  const setIsAutomationsMenuOpen = useIoTStore(s => s.setIsAutomationsMenuOpen);
  const segments = useIoTStore(s => s.segments);
  const isDark = useIoTStore(s => s.isDark);
  const accent3 = useIoTStore(s => s.accent3);
  const setAccent3 = useIoTStore(s => s.setAccent3);
  const accent4 = useIoTStore(s => s.accent4);
  const setAccent4 = useIoTStore(s => s.setAccent4);
  const setIsMenuOpen = useIoTStore(s => s.setIsMenuOpen);
  const animationsEnabled = useIoTStore(s => s.animationsEnabled);
  const setAnimationsEnabled = useIoTStore(s => s.setAnimationsEnabled);
  const selectedFont = useIoTStore(s => s.selectedFont);
  const setSelectedFont = useIoTStore(s => s.setSelectedFont);
  const animationsFps = useIoTStore(s => s.animationsFps);
  const setAnimationsFps = useIoTStore(s => s.setAnimationsFps);
  const headerAnimationType = useIoTStore(s => s.headerAnimationType);
  const setHeaderAnimationType = useIoTStore(s => s.setHeaderAnimationType);
  const headerTitle = useIoTStore(s => s.headerTitle);
  const setHeaderTitle = useIoTStore(s => s.setHeaderTitle);
  const matrixDensity = useIoTStore(s => s.matrixDensity);
  const setMatrixDensity = useIoTStore(s => s.setMatrixDensity);
  const matrixSize = useIoTStore(s => s.matrixSize);
  const setMatrixSize = useIoTStore(s => s.setMatrixSize);
  const matrixHoverSize = useIoTStore(s => s.matrixHoverSize);
  const setMatrixHoverSize = useIoTStore(s => s.setMatrixHoverSize);
  const matrixOpacity = useIoTStore(s => s.matrixOpacity);
  const setMatrixOpacity = useIoTStore(s => s.setMatrixOpacity);
  const matrixColor = useIoTStore(s => s.matrixColor);
  const setMatrixColor = useIoTStore(s => s.setMatrixColor);
  const matrixMoving = useIoTStore(s => s.matrixMoving);
  const setMatrixMoving = useIoTStore(s => s.setMatrixMoving);
  const matrixMouseEffect = useIoTStore(s => s.matrixMouseEffect);
  const setMatrixMouseEffect = useIoTStore(s => s.setMatrixMouseEffect);
  const matrixTwinkleEffect = useIoTStore(s => s.matrixTwinkleEffect);
  const setMatrixTwinkleEffect = useIoTStore(s => s.setMatrixTwinkleEffect);
  const matrixTwinkleSpeed = useIoTStore(s => s.matrixTwinkleSpeed);
  const setMatrixTwinkleSpeed = useIoTStore(s => s.setMatrixTwinkleSpeed);
  const dashboardBgColor = useIoTStore(s => s.dashboardBgColor);
  const setDashboardBgColor = useIoTStore(s => s.setDashboardBgColor);
  const dashboardBgOpacity = useIoTStore(s => s.dashboardBgOpacity);
  const setDashboardBgOpacity = useIoTStore(s => s.setDashboardBgOpacity);
  const headerPosition = useIoTStore(s => s.headerPosition);
  const setHeaderPosition = useIoTStore(s => s.setHeaderPosition);
  const dashboardWidth = useIoTStore(s => s.dashboardWidth);
  const setDashboardWidth = useIoTStore(s => s.setDashboardWidth);
  const isGroupsCompactLayout = useIoTStore(s => s.isGroupsCompactLayout);
  const setIsGroupsCompactLayout = useIoTStore(s => s.setIsGroupsCompactLayout);
  const isSegmentsCompactLayout = useIoTStore(s => s.isSegmentsCompactLayout);
  const setIsSegmentsCompactLayout = useIoTStore(s => s.setIsSegmentsCompactLayout);
  const activeSegmentId = useIoTStore(s => s.activeSegmentId);
  const activeGroupId = useIoTStore(s => s.activeGroupId);

  const segmentsLength = useIoTStore(s => s.segments.length);
  const selectedGroupFilter = useIoTStore(s => s.selectedGroupFilter);
  const setSelectedGroupFilter = useIoTStore(s => s.setSelectedGroupFilter);
  const groupsOrder = useIoTStore(s => s.groupsOrder);
  const groupsCols = useIoTStore(s => s.groupsCols);
  const groupConfigs = useIoTStore(s => s.groupConfigs);

  const { onTouchStart, onTouchMove, onTouchEnd } = useWorkspaceSwipe(selectedGroupFilter, setSelectedGroupFilter, groupsOrder);
  const { innerWidthClass, outerWidthClass } = useDashboardLayout(dashboardWidth);

  const isLeftHeader = headerPosition === "left";

  const settingsProps = {
    animationsEnabled,
    setAnimationsEnabled,
    isDark,
    accent3,
    setAccent3,
    accent4,
    setAccent4,
    selectedFont,
    setSelectedFont,
    animationsFps,
    setAnimationsFps,
    headerAnimationType,
    setHeaderAnimationType,
    headerTitle,
    setHeaderTitle,
    matrixDensity,
    setMatrixDensity,
    matrixSize,
    setMatrixSize,
    matrixHoverSize,
    setMatrixHoverSize,
    matrixOpacity,
    setMatrixOpacity,
    matrixColor,
    setMatrixColor,
    matrixMoving,
    setMatrixMoving,
    matrixMouseEffect,
    setMatrixMouseEffect,
    matrixTwinkleEffect,
    setMatrixTwinkleEffect,
    matrixTwinkleSpeed,
    setMatrixTwinkleSpeed,
    dashboardBgColor,
    setDashboardBgColor,
    dashboardBgOpacity,
    setDashboardBgOpacity,
    headerPosition,
    setHeaderPosition,
    dashboardWidth,
    setDashboardWidth,
    isGroupsCompactLayout,
    setIsGroupsCompactLayout,
    isSegmentsCompactLayout,
    setIsSegmentsCompactLayout,
  };

  return (
    <div 
      className={`w-full flex ${isLeftHeader ? "flex-col items-center" : "flex-row-reverse items-start justify-center gap-6"} ${outerWidthClass} mx-auto transition-all duration-500`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <main className={`flex-1 flex flex-col justify-center items-center text-center ${innerWidthClass} mx-auto space-y-8 py-4 w-full relative transition-all duration-500`}>
        {!isFullyReady ? (
          <div className="w-full flex flex-col gap-4">
            <div className="-mt-6 sm:-mt-10 mb-2 w-full flex justify-center">
               <div className="w-32 h-10 bg-[var(--card-bg)] rounded-2xl animate-pulse border border-[var(--border-color)]" />
            </div>
            <WorkspaceSkeleton groupsCols={groupsCols} />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {isMenuOpen ? (
              <motion.div
                key="settings-workspace-mode"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full"
              >
                <SettingsWorkspace {...settingsProps} />
              </motion.div>
            ) : isModulesMenuOpen ? (
              <motion.div
                key="modules-workspace-mode"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full"
              >
                <ModulesWorkspace
                  onClose={() => setIsModulesMenuOpen(false)}
                  onAddSegment={handleAddSegment}
                  segments={segments}
                  onRemoveSegment={handleRemoveSegment}
                  animationsEnabled={animationsEnabled}
                  accent3={accent3}
                />
              </motion.div>
            ) : isAutomationsMenuOpen ? (
              <motion.div
                key="automations-workspace-mode"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full"
              >
                <AutomationsWorkspace onClose={() => setIsAutomationsMenuOpen(false)} />
              </motion.div>
            ) : segmentsLength === 0 ? (
              <motion.div
                key="welcome-portal-mode"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <React.Suspense fallback={<div className="w-full h-96 flex items-center justify-center"><div className="w-12 h-12 rounded-full border-2 border-[var(--accent3)] border-t-transparent animate-spin" /></div>}>
                  <WelcomePortal
                    setIsMenuOpen={setIsMenuOpen}
                    setIsModulesMenuOpen={setIsModulesMenuOpen}
                    accent3={accent3}
                    accent4={accent4}
                    animationsEnabled={animationsEnabled}
                    isDark={isDark}
                  />
                </React.Suspense>
              </motion.div>
            ) : (
              <motion.div
                key="home-workspace-mode"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full flex flex-col gap-4"
              >
                <div className="-mt-6 sm:-mt-10 mb-2 w-full flex justify-center">
                  <GroupFilterSelector
                    groupsOrder={groupsOrder}
                    selectedGroupFilter={selectedGroupFilter}
                    setSelectedGroupFilter={setSelectedGroupFilter}
                    animationsEnabled={animationsEnabled}
                  />
                </div>

                <IoTWorkspace
                  sensors={sensors}
                  groupsOrder={groupsOrder}
                  groupsCols={groupsCols}
                  groupConfigs={groupConfigs}
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

                <div className="w-full flex justify-center mt-6 pt-2">
                  <React.Suspense fallback={<div className="h-12 w-full" />}>
                    <MacroSidebar />
                  </React.Suspense>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
