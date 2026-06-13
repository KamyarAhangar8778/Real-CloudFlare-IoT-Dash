import React from "react";
import { Sliders, RefreshCw } from "lucide-react";
import { BUTTON_CLIP } from "@/lib/presets";

interface CardHeaderProps {
  localLed: boolean;
  loading: boolean;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ localLed, loading }) => {
  return (
    <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
      <div className="flex items-center gap-3">
        <div 
          className={`p-2 transition-all ${localLed ? "text-accent3 bg-[var(--accent3-transparent)]" : "bg-[var(--card-bg-solid)] text-gray-500"}`}
          style={{ clipPath: BUTTON_CLIP, color: localLed ? "var(--accent3)" : undefined }}
        >
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-sans font-medium text-accent3 text-sm tracking-wide" style={{ color: "var(--accent3)" }}>فرامین خروجی هوشمند (عوامل محرک)</h3>
          <p className="text-[10px] theme-text-muted font-sans mt-0.5">کنترل پایه‌ها و دیمر متصل به قطعات سخت‌افزاری</p>
        </div>
      </div>
      {loading && <RefreshCw className="w-4 h-4 text-accent3 animate-spin" style={{ color: "var(--accent3)" }} />}
    </div>
  );
};
