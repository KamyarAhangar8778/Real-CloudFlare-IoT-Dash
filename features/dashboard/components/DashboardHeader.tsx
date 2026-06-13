"use client";

import React from "react";
import MasterHeader from "@/components/MasterHeader";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";

interface DashboardHeaderProps {
  position: "left" | "topOrMobile";
}

export default function DashboardHeader({ position }: DashboardHeaderProps) {
  const {
    isDark,
    setIsDark,
    setIsModulesMenuOpen,
    setIsMenuOpen,
    headerAnimationType,
    headerTitle,
    groupsCols,
    setGroupsCols,
    headerPosition,
    setHeaderPosition,
    animationsEnabled,
  } = useDashboard();

  if (position === "left") {
    return (
      <aside className="hidden md:flex md:w-72 md:shrink-0 md:sticky md:top-4 md:h-fit p-1 flex-col justify-start overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] gap-4">
        <MasterHeader 
          isDark={isDark} 
          setIsDark={setIsDark} 
          setIsModulesMenuOpen={setIsModulesMenuOpen} 
          setIsMenuOpen={setIsMenuOpen} 
          headerAnimationType={headerAnimationType}
          headerTitle={headerTitle}
          groupsCols={groupsCols}
          setGroupsCols={setGroupsCols}
          headerPosition={headerPosition}
          setHeaderPosition={setHeaderPosition}
          animationsEnabled={animationsEnabled}
        />
      </aside>
    );
  }

  // position === "topOrMobile"
  const showHeader = headerPosition === "top" || headerPosition === "left";
  if (!showHeader) return null;

  return (
    <div className={headerPosition === "left" ? "md:hidden w-full" : "w-full"}>
      <MasterHeader 
        isDark={isDark} 
        setIsDark={setIsDark} 
        setIsModulesMenuOpen={setIsModulesMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        headerAnimationType={headerAnimationType}
        headerTitle={headerTitle}
        groupsCols={groupsCols}
        setGroupsCols={setGroupsCols}
        headerPosition={headerPosition === "left" ? "top" : headerPosition}
        setHeaderPosition={setHeaderPosition}
        animationsEnabled={animationsEnabled}
      />
    </div>
  );
}
