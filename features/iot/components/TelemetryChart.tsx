"use client";

import React, { useState, useMemo } from "react";
import { AreaChart, TrendingUp, Calendar, Zap, RefreshCw } from "lucide-react";
import { CLIP_GATE_ARCH, BUTTON_CLIP } from "@/lib/presets";

interface TelemetryChartProps {
  currentTemp: number;
  currentMoisture: number;
}

export const TelemetryChart: React.FC<TelemetryChartProps> = ({ currentTemp, currentMoisture }) => {
  const [activeKey, setActiveKey] = useState<"temp" | "moisture">("temp");

  // Generate responsive historic points based on current value plus random walk
  const dataPoints = useMemo(() => {
    const pointsCount = 10;
    const list = [];
    let val = activeKey === "temp" ? currentTemp : currentMoisture;
    const baseVariance = activeKey === "temp" ? 1.5 : 4;

    for (let i = pointsCount - 1; i >= 0; i--) {
      const timeStr = `${i * 5} ثانیه پیش`;
      list.push({
        label: timeStr,
        value: Number((val - (i * (Math.sin(i) * baseVariance * 0.4))).toFixed(1)),
      });
    }
    return list;
  }, [activeKey, currentTemp, currentMoisture]);

  // Math for drawing pure SVG chart
  const minVal = useMemo(() => Math.min(...dataPoints.map((d) => d.value)) * 0.95, [dataPoints]);
  const maxVal = useMemo(() => Math.max(...dataPoints.map((d) => d.value)) * 1.05, [dataPoints]);
  const valRange = maxVal - minVal || 1;

  const width = 600;
  const height = 180;
  const paddingX = 40;
  const paddingY = 20;

  const points = useMemo(() => {
    return dataPoints.map((d, index) => {
      const x = paddingX + (index * (width - paddingX * 2)) / (dataPoints.length - 1);
      const y = height - paddingY - ((d.value - minVal) * (height - paddingY * 2)) / valRange;
      return { x, y, value: d.value, label: d.label };
    });
  }, [dataPoints, minVal, valRange]);

  const pathD = useMemo(() => {
    if (points.length === 0) return "";
    return points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, "");
  }, [points]);

  const areaD = useMemo(() => {
    if (points.length === 0) return "";
    const startY = height - paddingY;
    const firstX = points[0].x;
    const lastX = points[points.length - 1].x;
    return `${pathD} L ${lastX} ${startY} L ${firstX} ${startY} Z`;
  }, [points, pathD]);

  return (
    <div 
      className="bg-[var(--card-bg)] backdrop-blur-md border border-[var(--accent3-medium)] p-6 hover:border-[var(--accent3)] transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.65)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.75)] hover:-translate-y-[2px]"
      style={{ clipPath: CLIP_GATE_ARCH }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="p-2 bg-[var(--accent3-transparent)] text-accent3"
            style={{ clipPath: BUTTON_CLIP }}
          >
            <TrendingUp className="w-5 h-5 text-accent3" style={{ color: "var(--accent3)" }} />
          </div>
          <div>
            <h3 className="font-sans font-medium text-accent3 text-sm tracking-wide" style={{ color: "var(--accent3)" }}>نمودار تلمتری تاریخی (در زمان واقعی)</h3>
            <p className="text-[10px] theme-text-muted font-sans mt-0.5">پایش تغییرات اخیر سنسورهای هخامنشی با مقاطع زمانی ۵ ثانیه‌ای</p>
          </div>
        </div>

        {/* Tab triggers */}
        <div 
          className="flex bg-[var(--card-bg-solid)] p-1 border border-[var(--border-color)] self-end sm:self-auto"
          style={{ clipPath: BUTTON_CLIP }}
        >
          <button
            onClick={() => setActiveKey("temp")}
            className={`px-4 py-1.5 text-xs font-sans transition-all cursor-pointer ${
              activeKey === "temp"
                ? "bg-accent3 text-black font-semibold"
                : "theme-text-muted hover:theme-text-primary"
            }`}
            style={{ 
              clipPath: BUTTON_CLIP,
              backgroundColor: activeKey === "temp" ? "var(--accent3)" : "transparent"
            }}
          >
            پایش حرارتی (آذر)
          </button>
          <button
            onClick={() => setActiveKey("moisture")}
            className={`px-4 py-1.5 text-xs font-sans transition-all cursor-pointer ${
              activeKey === "moisture"
                ? "bg-accent4 text-black font-semibold"
                : "theme-text-muted hover:theme-text-primary"
            }`}
            style={{ 
              clipPath: BUTTON_CLIP,
              backgroundColor: activeKey === "moisture" ? "var(--accent4)" : "transparent"
            }}
          >
            سیراب رطوبت (آناهیتا)
          </button>
        </div>
      </div>

      {/* SVG Chart Drawing Canvas */}
      <div 
        className="relative h-[200px] w-full mt-4 bg-[var(--card-bg-solid)] border border-[var(--border-color)] p-2 overflow-hidden"
        style={{ clipPath: BUTTON_CLIP }}
      >
        {/* Subtle grid indicators in the background */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-4 opacity-5">
          <div className="border-b border-white w-full" />
          <div className="border-b border-white w-full" />
          <div className="border-b border-white w-full" />
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="chart-gold-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent3)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--accent3)" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="curve-glow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--accent3)" />
              <stop offset="50%" stopColor="var(--accent4)" />
              <stop offset="100%" stopColor="var(--accent3)" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={paddingX} y1={(height) / 2} x2={width - paddingX} y2={(height) / 2} stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="var(--border-color)" strokeWidth="1" />

          {/* Area under the curve */}
          <path d={areaD} fill="url(#chart-gold-gradient)" />

          {/* The main curve */}
          <path d={pathD} fill="none" stroke="url(#curve-glow)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Glowing points and text labels */}
          {points.map((p, index) => (
            <g key={index} className="group/point cursor-pointer">
              <circle cx={p.x} cy={p.y} r="4" fill="var(--card-bg-solid)" stroke="var(--accent3)" strokeWidth="2" className="transition-all duration-300 group-hover/point:r-6" />
              <circle cx={p.x} cy={p.y} r="1" fill="#fff" />
              
              {/* Tooltip on hovering point */}
              <text
                x={p.x}
                y={p.y - 12}
                textAnchor="middle"
                className="fill-accent3 font-mono text-[10px] hidden group-hover/point:block px-1.5 py-0.5 border bg-[var(--card-bg-solid)] border-[var(--accent3-medium)]"
                style={{ clipPath: BUTTON_CLIP }}
              >
                {p.value}
              </text>
            </g>
          ))}

          {/* X Axis Labels */}
          {points.map((p, index) => {
            // Only draw every second label to avoid overlap
            if (index % 2 !== 0 && index !== points.length - 1) return null;
            return (
              <text key={index} x={p.x} y={height - 4} textAnchor="middle" className="fill-gray-500 font-sans text-[8px]">
                {p.label}
              </text>
            );
          })}
        </svg>

        {/* Dynamic metrics floating info */}
        <div 
          className="absolute bottom-3 left-4 flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--border-color)] px-3 py-1.5 text-[10px] theme-text-muted font-sans"
          style={{ clipPath: BUTTON_CLIP }}
        >
          <Zap className="w-3 h-3 text-accent3" style={{ color: "var(--accent3)" }} />
          <span>مقدار لحظه‌ای:</span>
          <strong className="text-accent3 font-mono" style={{ color: "var(--accent3)" }}>{activeKey === "temp" ? `${currentTemp}°C` : `${currentMoisture}%`}</strong>
        </div>
      </div>
    </div>
  );
};
