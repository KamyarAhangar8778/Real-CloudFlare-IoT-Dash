import { PanelLeftClose, PanelRightClose } from "lucide-react";
import Image from "next/image";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import GroupFilterSelector from "../GroupFilterSelector";
import type { BrandBoxProps } from "./types";

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
      <div className="relative z-10 w-full flex flex-col items-center justify-center gap-3 py-1">
        {setIsSidebarCollapsed && (
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(false)}
            className="p-2 text-[var(--text-secondary)] md:hover:text-[var(--accent3)] rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]/80 md:hover:bg-[var(--card-hover-bg)] md:hover:border-[var(--accent3)]/50 md:hover:shadow-[0_0_12px_var(--accent3-transparent)] transition-all duration-300 cursor-pointer active:scale-95"
            title="باز کردن منوی کناری"
          >
            <PanelLeftClose className="w-4 h-4 rotate-180" />
          </button>
        )}
        <div className="w-9 h-9 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shrink-0 flex items-center justify-center overflow-hidden shadow-sm ring-1 ring-[var(--accent3)]/20 p-1">
          <Image
            src="/logo.png"
            alt="Logo"
            width={22}
            height={22}
            className="object-contain drop-shadow"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full flex items-center justify-between gap-2.5 py-1 px-0.5">
      {setIsSidebarCollapsed && (
        <button
          type="button"
          onClick={() => setIsSidebarCollapsed(true)}
          className="p-2 text-[var(--text-secondary)] md:hover:text-[var(--accent3)] rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]/80 md:hover:bg-[var(--card-hover-bg)] md:hover:border-[var(--accent3)]/50 md:hover:shadow-[0_0_12px_var(--accent3-transparent)] transition-all duration-300 cursor-pointer active:scale-95"
          title="بستن منوی کناری"
        >
          <PanelRightClose className="w-4 h-4" />
        </button>
      )}

      <div className="relative z-10 flex items-center gap-2.5">
        <div className="text-right flex flex-col items-end gap-0.5">
          <h1 className="font-sans font-bold text-[13px] tracking-tight leading-tight select-none transition-all duration-300 md:hover:scale-[1.01] title-animated text-[var(--text-primary)]">
            {isFullyReady ? (
              headerTitle
            ) : (
              <div className="w-24 h-3.5 bg-[var(--text-muted)] opacity-20 rounded animate-pulse" />
            )}
          </h1>
          {groupsOrder && setSelectedGroupFilter ? (
            <div className="mt-0.5 block md:hidden">
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
        <div className="w-9 h-9 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shrink-0 flex items-center justify-center overflow-hidden shadow-sm md:hover:border-[var(--accent4)] transition-all ring-1 ring-[var(--accent3)]/20 p-1">
          <Image
            src="/logo.png"
            alt="Logo"
            width={22}
            height={22}
            className="object-contain drop-shadow"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  );
}
