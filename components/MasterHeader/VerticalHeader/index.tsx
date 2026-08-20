import React from "react";
import { MasterHeaderProps } from "../types";
import BrandBox from "../BrandBox";
import ControlsIsland from "./ControlsIsland";
import HeaderIslandPattern from "../HeaderIslandPattern";

export default function VerticalHeader(props: MasterHeaderProps) {
  const { isSidebarCollapsed } = props;

  return (
    <header
      id="vertical-master-header"
      className={`relative w-full h-full min-h-screen flex flex-col justify-start text-right font-sans bg-[var(--card-bg-solid)]/95 backdrop-blur-md border-r border-[var(--border-color)] shadow-xl transition-all duration-350 overflow-hidden md:hover:border-[var(--accent3)]/40 ${
        isSidebarCollapsed ? "p-2 gap-2 rounded-r-xl" : "p-3.5 gap-3.5 rounded-r-2xl"
      }`}
      dir="rtl"
    >
      {/* Premium unified micro-dot pattern for the entire header */}
      <HeaderIslandPattern variant="vertical" className="opacity-80" />

      <BrandBox 
        headerTitle={props.headerTitle} 
        variant="vertical" 
        animationsEnabled={props.animationsEnabled}
        groupsOrder={props.groupsOrder}
        selectedGroupFilter={props.selectedGroupFilter}
        setSelectedGroupFilter={props.setSelectedGroupFilter}
        isSidebarCollapsed={props.isSidebarCollapsed}
        setIsSidebarCollapsed={props.setIsSidebarCollapsed}
      />

      {/* Elegant divider */}
      <div className="w-full h-px bg-[var(--border-color)]/40 shrink-0" />

      <ControlsIsland props={props} />
    </header>
  );
}

