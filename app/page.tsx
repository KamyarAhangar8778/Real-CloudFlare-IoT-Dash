"use client";

import React from "react";
import { MotionConfig } from "motion/react";
import dynamic from "next/dynamic";

// Next.js dynamic chunks for optimal first-contentful-paint (FCP) and tiny initial bundle size
const SettingsDrawer = dynamic(() => import("@/features/settings/components/SettingsDrawer"), { ssr: false });
const ModulesDrawer = dynamic(() => import("@/features/iot/components/ModulesDrawer"), { ssr: false });
const EspSyncDrawer = dynamic(() => import("@/features/iot/components/EspSyncDrawer"), { ssr: false });

import MasterHeader from "@/components/MasterHeader";
import WelcomePortal from "@/features/iot/components/WelcomePortal";
import EncyclopediaSection from "@/features/encyclopedia/components/EncyclopediaSection";
import MountingLoader from "@/features/iot/components/MountingLoader";
import SyncOverlay from "@/features/iot/components/SyncOverlay";
import DashboardStyles from "@/features/iot/components/DashboardStyles";
import LowDataModeBanner from "@/features/iot/components/LowDataModeBanner";
import IoTWorkspace from "@/features/iot/components/IoTWorkspace";
import CuneiformBackground from "@/features/iot/components/CuneiformBackground";

// Import our cohesive state orchestrator
import { useAchaemenidState } from "@/features/iot/hooks/useAchaemenidState";

export default function Home() {
  return (
    <React.Suspense fallback={<MountingLoader />}>
      <AchaemenidDashboard />
    </React.Suspense>
  );
}

function AchaemenidDashboard() {
  const {
    selectedSymbol,
    setSelectedSymbol,
    isMenuOpen,
    setIsMenuOpen,
    isModulesMenuOpen,
    setIsModulesMenuOpen,
    isDark,
    setIsDark,
    isSymbolsSectionExpanded,
    setIsSymbolsSectionExpanded,
    accent3,
    setAccent3,
    accent4,
    setAccent4,
    selectedFont,
    setSelectedFont,
    animationsEnabled,
    setAnimationsEnabled,
    headerAnimationType,
    setHeaderAnimationType,
    headerTitle,
    setHeaderTitle,
    cuneiformOpacity,
    setCuneiformOpacity,
    cuneiformColor,
    setCuneiformColor,
    isEspDrawerOpen,
    setIsEspDrawerOpen,
    headerPosition,
    setHeaderPosition,
    segments,
    groupsOrder,
    groupConfigs,
    groupsCols,
    setGroupsCols,
    pinsState,
    lowDataMode,
    isLoadingIoT,
    activeSegmentId,
    activeGroupId,
    mounted,
    isFullyReady,
    syncProgress,
    syncMessage,
    sensors,
    cuneiformColorValue,
    refetchIot,
    handleApplyEspConfig,
    handleAddSegment,
    handleAddPlaceholder,
    handleSetupPlaceholder,
    handleGroupColsChange,
    handleRemoveSegment,
    handleUpdateSegmentMode,
    handleRemoveGroup,
    handleTogglePin,
    handleSetPinState,
    handleBypassSync,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useAchaemenidState();

  if (!mounted) {
    return <MountingLoader />;
  }

  return (
    <MotionConfig reducedMotion={animationsEnabled ? "user" : "always"}>
      <div className="theme-bg-main theme-text-secondary min-h-screen overflow-x-hidden relative font-sans leading-relaxed selection:bg-[var(--accent3-transparent)] selection:text-[var(--accent3)] transition-colors duration-500">
        
        {/* Fullscreen Initial ESP32 Configuration Sync Overlay */}
        <SyncOverlay
          isFullyReady={isFullyReady}
          syncMessage={syncMessage}
          syncProgress={syncProgress}
          onBypass={handleBypassSync}
        />

        {/* Dynamic Theme CSS-in-JS Injector Component */}
        <DashboardStyles
          accent3={accent3}
          accent4={accent4}
          isDark={isDark}
          selectedFont={selectedFont}
          animationsEnabled={animationsEnabled}
        />

        {/* Polished Persian Stones & Cuneiform Background Subsystem */}
        <CuneiformBackground
          isDark={isDark}
          cuneiformColor={cuneiformColor}
          cuneiformOpacity={cuneiformOpacity}
          cuneiformColorValue={cuneiformColorValue}
          accent3={accent3}
          animationsEnabled={animationsEnabled}
        />

        {/* Main Flexible Container Grid (Supports responsive top header / left sidebar dynamically) */}
        <div className={`relative z-10 w-full min-h-screen transition-all duration-500 ${
          headerPosition === "left"
            ? "flex flex-col md:flex-row-reverse items-stretch"
            : "flex flex-col max-w-6xl mx-auto px-6 py-6 md:py-8 justify-between gap-12"
        }`}>

          {/* Desktop Left Sidebar Frame */}
          {headerPosition === "left" && (
            <aside className="hidden md:flex md:w-72 md:shrink-0 md:sticky md:top-4 md:h-fit p-1 flex-col justify-start overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] gap-4">
              <MasterHeader 
                isDark={isDark} 
                setIsDark={setIsDark} 
                setIsModulesMenuOpen={setIsModulesMenuOpen} 
                setIsMenuOpen={setIsMenuOpen} 
                setIsEspDrawerOpen={setIsEspDrawerOpen}
                headerAnimationType={headerAnimationType}
                headerTitle={headerTitle}
                groupsCols={groupsCols}
                setGroupsCols={setGroupsCols}
                headerPosition={headerPosition}
                setHeaderPosition={setHeaderPosition}
                animationsEnabled={animationsEnabled}
              />
            </aside>
          )}

          {/* Workspace & Main Control Sections */}
          <div className={`flex-1 flex flex-col justify-between gap-12 ${
            headerPosition === "left" ? "p-6 md:p-8 max-w-5xl w-full mx-auto" : "w-full"
          }`}>

            {/* Top Header Section (Shows on mobile when left sidebar layout is configured) */}
            {(headerPosition === "top" || headerPosition === "left") && (
              <div className={headerPosition === "left" ? "md:hidden w-full" : "w-full"}>
                <MasterHeader 
                  isDark={isDark} 
                  setIsDark={setIsDark} 
                  setIsModulesMenuOpen={setIsModulesMenuOpen} 
                  setIsMenuOpen={setIsMenuOpen} 
                  setIsEspDrawerOpen={setIsEspDrawerOpen}
                  headerAnimationType={headerAnimationType}
                  headerTitle={headerTitle}
                  groupsCols={groupsCols}
                  setGroupsCols={setGroupsCols}
                  headerPosition="top"
                  setHeaderPosition={setHeaderPosition}
                  animationsEnabled={animationsEnabled}
                />
              </div>
            )}

            {/* Smart Connection Banner */}
            {segments.length > 0 && (
              <LowDataModeBanner
                lowDataMode={lowDataMode}
                animationsEnabled={animationsEnabled}
                refetchIot={refetchIot}
                headerPosition={headerPosition}
              />
            )}

            {/* IoT Main Active Drag-and-Drop Workspace Canvas */}
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

            {/* Interactive Encyclopedia Knowledge Section */}
            <EncyclopediaSection 
              selectedSymbol={selectedSymbol} 
              setSelectedSymbol={setSelectedSymbol} 
              isSymbolsSectionExpanded={isSymbolsSectionExpanded} 
              setIsSymbolsSectionExpanded={setIsSymbolsSectionExpanded} 
            />

            {/* Elegant Footer */}
            <footer 
              className="text-center text-[10px] theme-text-secondary font-sans border border-[var(--border-color)] bg-[var(--card-bg)]/80 backdrop-blur-md py-4 px-6 mt-12 mb-4 mx-auto max-w-4xl shadow-sm hover:shadow-lg rounded-xl transition-all duration-300 footer-animated-border"
            >
              <span className="footer-animated-text block">
                سامانه هوشمند و داشبورد تعاملی مانیتورینگ صنعت اینترنت اشیاء (الهام گرفته از طراحی کلودفلر)
              </span>
            </footer>
          </div>
        </div>

        {/* Global Configuration drawer elements */}
        <SettingsDrawer
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          accent3={accent3}
          setAccent3={setAccent3}
          accent4={accent4}
          setAccent4={setAccent4}
          selectedFont={selectedFont}
          setSelectedFont={setSelectedFont}
          animationsEnabled={animationsEnabled}
          setAnimationsEnabled={setAnimationsEnabled}
          headerAnimationType={headerAnimationType}
          setHeaderAnimationType={setHeaderAnimationType}
          headerTitle={headerTitle}
          setHeaderTitle={setHeaderTitle}
          cuneiformOpacity={cuneiformOpacity}
          setCuneiformOpacity={setCuneiformOpacity}
          cuneiformColor={cuneiformColor}
          setCuneiformColor={setCuneiformColor}
          isDark={isDark}
          headerPosition={headerPosition}
          setHeaderPosition={setHeaderPosition}
        />

        {/* Pin modules addition system drawer */}
        <ModulesDrawer
          isOpen={isModulesMenuOpen}
          onClose={() => setIsModulesMenuOpen(false)}
          onAddSegment={handleAddSegment}
          segments={segments}
          onRemoveSegment={handleRemoveSegment}
          isDark={isDark}
          accent3={accent3}
          accent4={accent4}
          animationsEnabled={animationsEnabled}
        />

        {/* Custom ESP32 Sync and Packet Importer system */}
        <EspSyncDrawer
          isOpen={isEspDrawerOpen}
          onClose={() => setIsEspDrawerOpen(false)}
          isDark={isDark}
          accent3={accent3}
          accent4={accent4}
          selectedFont={selectedFont}
          animationsEnabled={animationsEnabled}
          headerAnimationType={headerAnimationType}
          headerTitle={headerTitle}
          cuneiformOpacity={cuneiformOpacity}
          cuneiformColor={cuneiformColor}
          segments={segments}
          groupsOrder={groupsOrder}
          groupConfigs={groupConfigs}
          groupsCols={groupsCols}
          pinsState={pinsState}
          onApplyConfig={handleApplyEspConfig}
        />
      </div>
    </MotionConfig>
  );
}
