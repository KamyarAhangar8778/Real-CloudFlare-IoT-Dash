import React from "react";
import { MasterHeaderProps } from "../types";
import BrandBox from "../BrandBox";
import ControlsIsland from "./ControlsIsland";

export default function VerticalHeader(props: MasterHeaderProps) {
  return (
    <header
      id="vertical-master-header"
      className="w-full h-full flex flex-col justify-stretch gap-4 text-right font-sans"
      dir="rtl"
    >
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

      <ControlsIsland props={props} />
    </header>
  );
}
