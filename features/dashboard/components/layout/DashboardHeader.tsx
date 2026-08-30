"use client";

import React from "react";
import MasterHeader from "@/components/MasterHeader";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

interface DashboardHeaderProps {
  className?: string;
  position?: string;
}

export default function DashboardHeader({ className = "" }: DashboardHeaderProps) {
  const isDark = useIoTStore((s) => s.isDark);
  const setIsDark = useIoTStore((s) => s.setIsDark);
  const setIsModulesMenuOpen = useIoTStore((s) => s.setIsModulesMenuOpen);
  const setIsMenuOpen = useIoTStore((s) => s.setIsMenuOpen);
  const headerAnimationType = useIoTStore((s) => s.headerAnimationType);
  const headerTitle = useIoTStore((s) => s.headerTitle);
  const animationsEnabled = useIoTStore((s) => s.animationsEnabled);
  const isSidebarCollapsed = useIoTStore((s) => s.isSidebarCollapsed);
  const setIsSidebarCollapsed = useIoTStore((s) => s.setIsSidebarCollapsed);
  
  const groupsCols = useIoTStore((s) => s.groupsCols);
  const setGroupsCols = useIoTStore((s) => s.setGroupsCols);
  const groupsOrder = useIoTStore((s) => s.groupsOrder);
  const selectedGroupFilter = useIoTStore((s) => s.selectedGroupFilter);
  const setSelectedGroupFilter = useIoTStore((s) => s.setSelectedGroupFilter);

  return (
    <aside 
      className={`shrink-0 sticky top-0 h-screen p-0 flex flex-col justify-start overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] z-30 transition-all duration-300 ${
        isSidebarCollapsed ? "w-16 md:w-20" : "w-64 md:w-72"
      } ${className}`}
    >
      <MasterHeader
        isDark={isDark}
        setIsDark={setIsDark}
        setIsModulesMenuOpen={setIsModulesMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        headerAnimationType={headerAnimationType}
        headerTitle={headerTitle}
        groupsCols={groupsCols}
        setGroupsCols={setGroupsCols}
        animationsEnabled={animationsEnabled}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        groupsOrder={groupsOrder}
        selectedGroupFilter={selectedGroupFilter}
        setSelectedGroupFilter={setSelectedGroupFilter}
      />
    </aside>
  );
}
