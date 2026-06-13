import React from "react";
import { BUTTON_CLIP } from "@/lib/presets";

interface PwmSliderProps {
  localPwm: number;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRelease: () => Promise<void>;
}

export const PwmSlider: React.FC<PwmSliderProps> = ({
  localPwm,
  loading,
  onChange,
  onRelease,
}) => {
  return (
    <div 
      className="bg-[var(--card-bg-solid)] p-4 border border-[var(--border-color)] space-y-3"
      style={{ clipPath: BUTTON_CLIP }}
    >
      <div className="flex items-center justify-between">
        <span className="font-sans font-medium text-xs theme-text-primary">کنترل دیمر PWM (شدت روشنایی ال‌دی)</span>
        <span 
          className="font-mono text-xs font-bold bg-[var(--card-bg)] px-2 py-0.5 border border-[var(--border-color)]"
          style={{ color: "var(--accent3)", clipPath: BUTTON_CLIP }}
        >
          {Math.round((localPwm / 255) * 100)}%
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[10px] theme-text-muted uppercase font-mono">0</span>
        <input
          type="range"
          min="0"
          max="255"
          value={localPwm}
          onChange={onChange}
          onMouseUp={onRelease}
          onTouchEnd={onRelease}
          disabled={loading}
          className="w-full h-1.5 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer"
          style={{ accentColor: "var(--accent3)" }}
        />
        <span className="text-[10px] theme-text-muted uppercase font-mono">255</span>
      </div>
      <div className="text-[9px] theme-text-muted text-right leading-relaxed font-sans">
        تغییر این نوار لغزنده، پالس سینوسی موج خروجی را بین ۰ ولت الی ۳.۳ ولت به رگولاتور ESP32 صادر می‌نماید.
      </div>
    </div>
  );
};
