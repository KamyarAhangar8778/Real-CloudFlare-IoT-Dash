import React from "react";
import Image from "next/image";
import { PanelRightClose, PanelLeftClose } from "lucide-react";
import GroupFilterSelector from "../GroupFilterSelector";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import HeaderIslandPattern from "../HeaderIslandPattern";
import { BrandBoxProps } from "./types";

export default function VerticalBrandBox({
  headerTitle,
  animationsEnabled,
  groupsOrder,
  selectedGroupFilter,
  setSelectedGroupFilter,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}: Omit<BrandBoxProps, "variant">) {
  const { isFullyReady } = useDashboard();

  if (isSidebarCollapsed) {
    return (
      <div className="relative group rounded-2xl transition-all duration-350 md:hover:-translate-y-1.5 md:hover:shadow-xl">
        {animationsEnabled && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 opacity-60" xmlns="http://www.w3.org/2000/svg">
            <rect 
              x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" 
              rx="14" ry="14" 
              fill="none" 
              stroke="var(--accent3)" 
              strokeWidth="1.5" 
              pathLength="100"
              strokeDasharray="15 85"
              className="animate-[svg-border-spin_10s_linear_infinite]"
            />
          </svg>
        )}
        <div className="relative z-10 h-full bg-[var(--card-bg-solid)]/90 backdrop-blur-md border border-[var(--border-color)] p-2.5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 overflow-hidden shadow-sm md:hover:border-[var(--accent3)]/50">
          <HeaderIslandPattern variant="vertical" />
          <div className="w-10 h-10 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-xl shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
            <Image
              src="/logo.png"
              alt="Logo"
              width={26}
              height={26}
              className="object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          {setIsSidebarCollapsed && (
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="relative z-10 p-2 text-[var(--text-secondary)] md:hover:text-[var(--accent3)] rounded-xl border border-[var(--border-color)] bg-[var(--card-bg-solid)] md:hover:border-[var(--accent3)]/50 transition-all duration-300 cursor-pointer"
              title="باز کردن منوی کناری"
            >
              <PanelLeftClose className="w-4 h-4 rotate-180" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative group rounded-2xl transition-all duration-350 md:hover:-translate-y-1.5 md:hover:shadow-xl">
      {animationsEnabled && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 opacity-60" xmlns="http://www.w3.org/2000/svg">
          <rect 
            x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" 
            rx="14" ry="14" 
            fill="none" 
            stroke="var(--accent3)" 
            strokeWidth="1.5" 
            pathLength="100"
            strokeDasharray="15 85"
            className="animate-[svg-border-spin_10s_linear_infinite]"
          />
        </svg>
      )}
      <div className="relative z-10 h-full bg-[var(--card-bg-solid)]/90 backdrop-blur-md border border-[var(--border-color)] px-4 py-4 rounded-2xl flex items-center justify-between gap-3 transition-all duration-300 overflow-hidden shadow-sm md:hover:border-[var(--accent3)]/50">
        <HeaderIslandPattern variant="vertical" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-xl shrink-0 flex items-center justify-center overflow-hidden shadow-sm md:hover:border-[var(--accent4)] transition-all">
            <Image
              src="/logo.png"
              alt="Logo"
              width={26}
              height={26}
              className="object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <h1 className="font-sans font-extrabold text-[13.5px] tracking-tight leading-tight select-none transition-all duration-300 md:hover:scale-[1.02] title-animated">
              {isFullyReady ? headerTitle : <div className="w-32 h-4 bg-[var(--text-muted)] opacity-20 rounded animate-pulse" />}
            </h1>
            {groupsOrder && setSelectedGroupFilter ? (
              <div className="mt-1 block md:hidden">
                <GroupFilterSelector
                  groupsOrder={groupsOrder}
                  selectedGroupFilter={selectedGroupFilter || null}
                  setSelectedGroupFilter={setSelectedGroupFilter}
                  animationsEnabled={animationsEnabled}
                  isCompact={true}
                />
              </div>
            ) : null}
          </div>
        </div>

        {setIsSidebarCollapsed && (
          <button
            onClick={() => setIsSidebarCollapsed(true)}
            className="relative z-10 p-2 text-[var(--text-secondary)] md:hover:text-[var(--accent3)] rounded-xl border border-[var(--border-color)] bg-[var(--card-bg-solid)] md:hover:border-[var(--accent3)]/50 transition-all duration-300 cursor-pointer"
            title="بستن منوی کناری"
          >
            <PanelRightClose className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
