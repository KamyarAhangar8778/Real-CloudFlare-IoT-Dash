import React from "react";
import { Lightbulb } from "lucide-react";
import { BUTTON_CLIP } from "@/lib/presets";

interface LedSwitchProps {
  localLed: boolean;
  loading: boolean;
  onToggle: () => Promise<void>;
}

export const LedSwitch: React.FC<LedSwitchProps> = ({ localLed, loading, onToggle }) => {
  return (
    <div 
      className="flex items-center justify-between bg-[var(--card-bg-solid)] p-4 border border-[var(--border-color)]"
      style={{ clipPath: BUTTON_CLIP }}
    >
      <div className="flex items-center gap-3">
        <div 
          className={`p-2 transition-colors ${localLed ? "bg-[var(--accent3-transparent)] text-accent3" : "bg-gray-800/20 text-gray-500"}`}
          style={{ clipPath: BUTTON_CLIP, color: localLed ? "var(--accent3)" : undefined }}
        >
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <span className="block font-sans font-medium text-xs theme-text-primary">چراغ ال‌دی اصلی (دیجیتال ۲)</span>
          <span className="block text-[10px] theme-text-muted mt-0.5">GPIO2 Pin On/Off Trigger</span>
        </div>
      </div>

      <button
        onClick={onToggle}
        disabled={loading}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 focus:outline-none hover:scale-110 active:scale-95 hover:brightness-110 ${
          localLed ? "bg-accent3" : "bg-[#1c1d29]"
        }`}
        style={localLed ? { backgroundColor: "var(--accent3)" } : {}}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${
            localLed ? "-translate-x-5 bg-[#0d0e12]" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};
