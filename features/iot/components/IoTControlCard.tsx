"use client";

import React, { useState, useEffect } from "react";
import { Lightbulb, Info, RefreshCw, Power, Radio, Sliders } from "lucide-react";
import { CLIP_DIAGONAL_TR_BL, BUTTON_CLIP } from "@/lib/presets";

interface IoTControlCardProps {
  ledState: boolean;
  ledPwm: number;
  relayState: boolean;
  lastSeen: string | null;
  onUpdate: (payload: { ledState?: boolean; ledPwm?: number; relayState?: boolean }) => Promise<void>;
  loading: boolean;
}

export const IoTControlCard: React.FC<IoTControlCardProps> = ({
  ledState,
  ledPwm,
  relayState,
  lastSeen,
  onUpdate,
  loading,
}) => {
  const [localLed, setLocalLed] = useState(ledState);
  const [localRelay, setLocalRelay] = useState(relayState);
  const [localPwm, setLocalPwm] = useState(ledPwm);

  // Sync state changes from parent props
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalLed(ledState);
  }, [ledState]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalRelay(relayState);
  }, [relayState]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalPwm(ledPwm);
  }, [ledPwm]);

  const handleToggleLed = async () => {
    const nextState = !localLed;
    setLocalLed(nextState); // optimistic update
    await onUpdate({ ledState: nextState });
  };

  const handleToggleRelay = async () => {
    const nextState = !localRelay;
    setLocalRelay(nextState); // optimistic update
    await onUpdate({ relayState: nextState });
  };

  const handlePwmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setLocalPwm(val);
  };

  const handlePwmRelease = async () => {
    await onUpdate({ ledPwm: localPwm });
  };

  // Convert ISO string to beautiful Persian date or standard readable format
  const formatLastSeen = (isoStr: string | null) => {
    if (!isoStr) return "هنوز به برد متصل نشده- در انتظار فرکانس";
    const date = new Date(isoStr);
    return date.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <div 
      className="bg-[var(--card-bg)] backdrop-blur-md border border-[var(--accent3-medium)] p-6 flex flex-col justify-between h-full hover:border-[var(--accent3)] transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.65)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.75)] hover:-translate-y-[2px]"
      style={{ clipPath: CLIP_DIAGONAL_TR_BL }}
    >
      <div className="space-y-6">
        {/* Card Header */}
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

        {/* 1. LED Toggle Switch */}
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
            onClick={handleToggleLed}
            disabled={loading}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
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

        {/* 2. PWM LED Brightness Dimmer (0-255) */}
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
              onChange={handlePwmChange}
              onMouseUp={handlePwmRelease}
              onTouchEnd={handlePwmRelease}
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

        {/* 3. RELAY INDUSTRIAL SWITCH */}
        <div 
          className="flex items-center justify-between bg-[var(--card-bg-solid)] p-4 border border-[var(--border-color)]"
          style={{ clipPath: BUTTON_CLIP }}
        >
          <div className="flex items-center gap-3">
            <div 
              className={`p-2 transition-colors ${localRelay ? "bg-[var(--accent3-transparent)] text-accent3" : "bg-gray-800/20 text-gray-500"}`}
              style={{ clipPath: BUTTON_CLIP, color: localRelay ? "var(--accent3)" : undefined }}
            >
              <Power className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-sans font-medium text-xs theme-text-primary">رله فرمان صنعتی (دیجیتال ۵)</span>
              <span className="block text-[10px] theme-text-muted mt-0.5">High voltage relay switch GPIO5</span>
            </div>
          </div>

          <button
            onClick={handleToggleRelay}
            disabled={loading}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              localRelay ? "bg-accent3" : "bg-[#1c1d29]"
            }`}
            style={localRelay ? { backgroundColor: "var(--accent3)" } : {}}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${
                localRelay ? "-translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Network / Connection status block */}
      <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-sans">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-500 animate-ping" />
          <span className="theme-text-muted">آخرین پینگ فعال:</span>
        </div>
        <span 
          className="font-mono text-[11px] bg-[var(--card-bg-solid)] px-2 py-1 border border-[var(--border-color)]"
          style={{ color: "var(--accent3)", clipPath: BUTTON_CLIP }}
        >
          {formatLastSeen(lastSeen)}
        </span>
      </div>
    </div>
  );
};
