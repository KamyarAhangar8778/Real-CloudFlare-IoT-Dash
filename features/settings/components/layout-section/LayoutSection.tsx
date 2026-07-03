import React from "react";
import { Maximize2, LayoutGrid } from "lucide-react";
import HeaderSettingsContent from "../header-settings/HeaderSettingsContent";

interface LayoutSectionProps {
  headerPosition: "top" | "left";
  setHeaderPosition: (val: "top" | "left") => void;
  headerTitle: string;
  setHeaderTitle: (val: string) => void;
  dashboardWidth: 1 | 2 | 3 | 4 | 5;
  setDashboardWidth: (val: 1 | 2 | 3 | 4 | 5) => void;
  isGroupsCompactLayout: boolean;
  setIsGroupsCompactLayout: (val: boolean) => void;
  isSegmentsCompactLayout: boolean;
  setIsSegmentsCompactLayout: (val: boolean) => void;
}

export default function LayoutSection({
  headerPosition,
  setHeaderPosition,
  headerTitle,
  setHeaderTitle,
  dashboardWidth,
  setDashboardWidth,
  isGroupsCompactLayout,
  setIsGroupsCompactLayout,
  isSegmentsCompactLayout,
  setIsSegmentsCompactLayout,
}: LayoutSectionProps) {
  return (
    <div className="space-y-6">
      <div className="bg-[var(--card-bg-solid)] border border-[var(--border-color)] p-4 space-y-4 rounded-2xl text-right">
        <HeaderSettingsContent
          headerPosition={headerPosition}
          setHeaderPosition={setHeaderPosition}
          headerTitle={headerTitle}
          setHeaderTitle={setHeaderTitle}
        />
      </div>

      <div className="bg-[var(--card-bg-solid)] border border-[var(--border-color)] p-4 space-y-5 rounded-2xl text-right">
        <div className="flex items-center gap-2 justify-end mb-1">
          <span className="text-sm font-bold text-[var(--text-primary)]">عرض داشبورد</span>
          <Maximize2 className="w-4 h-4 text-[var(--accent4)]" />
        </div>
        
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          با تغییر این مقدار می‌توانید فضای خالی کنار داشبورد را کاهش داده و المان‌ها را عریض‌تر کنید.
        </p>

        <div className="px-2 pt-2 pb-6">
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={dashboardWidth}
            onChange={(e) => setDashboardWidth(parseInt(e.target.value) as 1|2|3|4|5)}
            className="w-full h-2 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent3)] accent-[var(--accent3)]"
            dir="ltr"
          />
          <div className="flex justify-between text-[10px] text-[var(--text-tertiary)] mt-2 font-bold px-1" dir="ltr">
            <span>متمرکز</span>
            <span>۲</span>
            <span>۳</span>
            <span>۴</span>
            <span>تمام‌عرض</span>
          </div>
        </div>
        
        <div className="border-t border-[var(--border-color)] pt-4 mt-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-right flex-1 ml-4">
              <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">چیدمان فشرده گروه‌ها</h4>
              <p className="text-[10px] text-[var(--text-secondary)]">حذف فضاهای خالی بین ستون‌های گروه‌ها</p>
            </div>
            <button
              onClick={() => setIsGroupsCompactLayout(!isGroupsCompactLayout)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                isGroupsCompactLayout ? "bg-[var(--accent4)]" : "bg-[var(--border-color)]"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  isGroupsCompactLayout ? "-translate-x-6" : "-translate-x-1"
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-right flex-1 ml-4">
              <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">چیدمان فشرده سگمنت‌ها</h4>
              <p className="text-[10px] text-[var(--text-secondary)]">حذف فضاهای خالی درون گروه‌ها</p>
            </div>
            <button
              onClick={() => setIsSegmentsCompactLayout(!isSegmentsCompactLayout)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                isSegmentsCompactLayout ? "bg-[var(--accent4)]" : "bg-[var(--border-color)]"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  isSegmentsCompactLayout ? "-translate-x-6" : "-translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
