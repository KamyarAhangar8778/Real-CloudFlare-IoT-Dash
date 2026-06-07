"use client";

import React, { useMemo } from "react";
import { Flame, Droplets, Wind, Sun, AlertTriangle } from "lucide-react";

import { 
  CLIP_DIAGONAL_TL_BR, 
  CLIP_DIAGONAL_TR_BL, 
  CLIP_GATE_ARCH, 
  CLIP_PEDESTAL 
} from "@/lib/presets";

interface SensorReadoutProps {
  sensors: {
    atarTemp: number;
    anahitaMoisture: number;
    vayuAirQuality: number;
    mithraLight: number;
  };
}

export const SensorReadout: React.FC<SensorReadoutProps> = ({ sensors }) => {
  // Compute safety statuses or Persian explanations
  const temperatureStatus = useMemo(() => {
    if (sensors.atarTemp > 35) return { label: "حرارت فزاینده (پرخطر)", color: "text-red-400" };
    if (sensors.atarTemp < 15) return { label: "سرمای پاییزه (خنک)", color: "text-blue-300" };
    return { label: "دما معتدل و فرخنده", color: "text-emerald-400" };
  }, [sensors.atarTemp]);

  const moistureStatus = useMemo(() => {
    if (sensors.anahitaMoisture < 30) return { label: "خاک تشنه و خشک", color: "text-amber-400" };
    if (sensors.anahitaMoisture > 75) return { label: "آب غرقاب و اشباع", color: "text-cyan-400" };
    return { label: "سیراب و شاداب", color: "text-emerald-400" };
  }, [sensors.anahitaMoisture]);

  const airStatus = useMemo(() => {
    if (sensors.vayuAirQuality > 150) return { label: "هوای غبارآلود و کدر", color: "text-amber-500" };
    return { label: "نفحات پاک و عاری از آلایندگی", color: "text-emerald-400" };
  }, [sensors.vayuAirQuality]);

  const lightStatus = useMemo(() => {
    if (sensors.mithraLight < 300) return { label: "تاریکی شبانه / سایه‌سار", color: "text-blue-400" };
    if (sensors.mithraLight > 800) return { label: "پرتوافشانی تابان خورشید", color: "text-amber-300" };
    return { label: "گرگ‌ومیش متعادل", color: "text-emerald-400" };
  }, [sensors.mithraLight]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* 1. ATAR: Fire / Temp Sensor */}
      <div 
        className="relative group bg-[var(--card-bg)] backdrop-blur-md border border-[var(--accent3-medium)] p-5 hover:border-[var(--accent3)] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.65)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.75)] hover:-translate-y-[2px]"
        style={{ clipPath: CLIP_DIAGONAL_TL_BR }}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-all pointer-events-none" />
        <div className="flex items-center justify-between z-10">
          <span className="text-xs font-mono theme-text-muted uppercase tracking-widest">Atar Node</span>
          <div className="p-2.5 bg-red-500/10 rounded-xl text-red-500">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
        </div>
        <div className="mt-4 z-10">
          <p className="text-3xl font-mono font-medium theme-text-primary flex items-baseline gap-1">
            {sensors.atarTemp}
            <span className="text-sm theme-text-muted">°C</span>
          </p>
          <h4 className="font-sans font-medium text-accent3 text-sm mt-2" style={{ color: "var(--accent3)" }}>سنسور حرارتی آذر (دما)</h4>
          <p className="text-[10px] theme-text-muted mt-1 uppercase tracking-wide">Fire Guard Sensor</p>
        </div>
        <div className="mt-4 pt-3 border-t border-[var(--accent3-transparent)] flex items-center justify-between text-[11px] z-10">
          <span className="theme-text-muted">منزلت پایگاه:</span>
          <span className={`font-medium ${temperatureStatus.color}`}>{temperatureStatus.label}</span>
        </div>
      </div>

      {/* 2. ANAHITA: Water / Moisture Sensor */}
      <div 
        className="relative group bg-[var(--card-bg)] backdrop-blur-md border border-[var(--accent3-medium)] p-5 hover:border-[var(--accent3)] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.65)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.75)] hover:-translate-y-[2px]"
        style={{ clipPath: CLIP_DIAGONAL_TR_BL }}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all pointer-events-none" />
        <div className="flex items-center justify-between z-10">
          <span className="text-xs font-mono theme-text-muted uppercase tracking-widest">Anahita Node</span>
          <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400">
            <Droplets className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 z-10">
          <p className="text-3xl font-mono font-medium theme-text-primary flex items-baseline gap-1">
            {sensors.anahitaMoisture}
            <span className="text-sm theme-text-muted">%</span>
          </p>
          <h4 className="font-sans font-medium text-accent3 text-sm mt-2" style={{ color: "var(--accent3)" }}>رطوبت خاک آناهیتا</h4>
          <p className="text-[10px] theme-text-muted mt-1 uppercase tracking-wide">Water Guard Sensor</p>
        </div>
        <div className="mt-4 pt-3 border-t border-[var(--accent3-transparent)] flex items-center justify-between text-[11px] z-10">
          <span className="theme-text-muted">منزلت پایگاه:</span>
          <span className={`font-medium ${moistureStatus.color}`}>{moistureStatus.label}</span>
        </div>
      </div>

      {/* 3. VAYU: Wind / Air Quality Sensor */}
      <div 
        className="relative group bg-[var(--card-bg)] backdrop-blur-md border border-[var(--accent3-medium)] p-5 hover:border-[var(--accent3)] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.65)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.75)] hover:-translate-y-[2px]"
        style={{ clipPath: CLIP_GATE_ARCH }}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all pointer-events-none" />
        <div className="flex items-center justify-between z-10">
          <span className="text-xs font-mono theme-text-muted uppercase tracking-widest">Vayu Node</span>
          <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400">
            <Wind className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 z-10">
          <p className="text-3xl font-mono font-medium theme-text-primary flex items-baseline gap-1">
            {sensors.vayuAirQuality}
            <span className="text-sm theme-text-muted">AQI</span>
          </p>
          <h4 className="font-sans font-medium text-accent3 text-sm mt-2" style={{ color: "var(--accent3)" }}>شاخص پاکی باد وایو</h4>
          <p className="text-[10px] theme-text-muted mt-1 uppercase tracking-wide">Atmospheric Node</p>
        </div>
        <div className="mt-4 pt-3 border-t border-[var(--accent3-transparent)] flex items-center justify-between text-[11px] z-10">
          <span className="theme-text-muted">منزلت پایگاه:</span>
          <span className={`font-medium ${airStatus.color}`}>{airStatus.label}</span>
        </div>
      </div>

      {/* 4. MITHRA: Light / LDR Sensor */}
      <div 
        className="relative group bg-[var(--card-bg)] backdrop-blur-md border border-[var(--accent3-medium)] p-5 hover:border-[var(--accent3)] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.65)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.75)] hover:-translate-y-[2px]"
        style={{ clipPath: CLIP_PEDESTAL }}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all pointer-events-none" />
        <div className="flex items-center justify-between z-10">
          <span className="text-xs font-mono theme-text-muted uppercase tracking-widest">Mithra Node</span>
          <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400">
            <Sun className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 z-10">
          <p className="text-3xl font-mono font-medium theme-text-primary flex items-baseline gap-1">
            {sensors.mithraLight}
            <span className="text-sm theme-text-muted">Lux</span>
          </p>
          <h4 className="font-sans font-medium text-accent3 text-sm mt-2" style={{ color: "var(--accent3)" }}>سنجش شدت نور مهر</h4>
          <p className="text-[10px] theme-text-muted mt-1 uppercase tracking-wide">Solar Radiance Node</p>
        </div>
        <div className="mt-4 pt-3 border-t border-[var(--accent3-transparent)] flex items-center justify-between text-[11px] z-10">
          <span className="theme-text-muted">منزلت پایگاه:</span>
          <span className={`font-medium ${lightStatus.color}`}>{lightStatus.label}</span>
        </div>
      </div>
    </div>
  );
};
