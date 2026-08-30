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
      className={`w-full h-full flex flex-col justify-between text-right font-sans bg-[var(--card-bg)]/90 backdrop-blur-2xl border-l border-[var(--border-color)] ${
        isSidebarCollapsed ? "px-2 py-4" : "px-3.5 py-4"
      } shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all duration-350 overflow-hidden relative select-none`}
      dir="rtl"
    >
      <HeaderIslandPattern variant="vertical" />

      <div className="relative z-10 flex flex-col h-full justify-between gap-3">
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

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent opacity-60 shrink-0 my-0.5" />

        <ControlsIsland props={props} />
      </div>
    </header>
  );
}
