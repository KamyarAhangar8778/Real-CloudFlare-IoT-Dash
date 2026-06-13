import React from "react";
import { ESP32_COMMON_PINS } from "./constants";

interface PinSelectorProps {
  useCustomPinInput: boolean;
  setUseCustomPinInput: (val: boolean) => void;
  customPin: string;
  setCustomPin: (val: string) => void;
  selectedPin: string;
  setSelectedPin: (val: string) => void;
}

export default function PinSelector({
  useCustomPinInput,
  setUseCustomPinInput,
  customPin,
  setCustomPin,
  selectedPin,
  setSelectedPin,
}: PinSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setUseCustomPinInput(!useCustomPinInput)}
          className="text-[9px] text-accent4 font-bold underline cursor-pointer"
        >
          {useCustomPinInput ? "انتخاب از لیست پایه‌ها" : "وارد کردن دستی شماره پایه"}
        </button>
        <label className="text-[10px] theme-text-tertiary font-bold">
          تعیین پایه سخت‌افزاری ESP32:
        </label>
      </div>

      {useCustomPinInput ? (
        <input
          type="text"
          placeholder="مانند: 14"
          value={customPin}
          onChange={(e) => setCustomPin(e.target.value.replace(/[^0-9]/g, ""))}
          className="w-full h-10 px-3 text-xs bg-black/20 text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent3)] outline-none transition-all font-sans"
          dir="ltr"
        />
      ) : (
        <select
          value={selectedPin}
          onChange={(e) => setSelectedPin(e.target.value)}
          className="w-full h-10 px-3 text-xs bg-black/20 text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent3)] outline-none transition-all cursor-pointer font-sans"
        >
          {ESP32_COMMON_PINS.map((pin) => (
            <option key={pin.value} value={pin.value} className="bg-slate-900">
              {pin.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
