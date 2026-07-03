"use client";

import React from "react";
import { Sparkles, Move, MousePointer2 } from "lucide-react";

interface MatrixSectionProps {
  matrixDensity: number;
  setMatrixDensity: (val: number) => void;
  matrixSize: number;
  setMatrixSize: (val: number) => void;
  matrixHoverSize: number;
  setMatrixHoverSize: (val: number) => void;
  matrixOpacity: number;
  setMatrixOpacity: (val: number) => void;
  matrixColor: string;
  setMatrixColor: (val: string) => void;
  matrixMoving: boolean;
  setMatrixMoving: (val: boolean) => void;
  matrixMouseEffect: boolean;
  setMatrixMouseEffect: (val: boolean) => void;
  matrixTwinkleEffect: boolean;
  setMatrixTwinkleEffect: (val: boolean) => void;
  matrixTwinkleSpeed: number;
  setMatrixTwinkleSpeed: (val: number) => void;
  hideHeader?: boolean;
  accent3?: string;
  accent4?: string;
  isDark?: boolean;
  dashboardBgColor?: string;
  setDashboardBgColor?: (val: string) => void;
  dashboardBgOpacity?: number;
  setDashboardBgOpacity?: (val: number) => void;
}

export default function MatrixSection({
  matrixDensity,
  setMatrixDensity,
  matrixSize,
  setMatrixSize,
  matrixHoverSize,
  setMatrixHoverSize,
  matrixOpacity,
  setMatrixOpacity,
  matrixColor,
  setMatrixColor,
  matrixMoving,
  setMatrixMoving,
  matrixMouseEffect,
  setMatrixMouseEffect,
  matrixTwinkleEffect,
  setMatrixTwinkleEffect,
  matrixTwinkleSpeed,
  setMatrixTwinkleSpeed,
  hideHeader = false,
  accent3 = "#10b981",
  accent4 = "#3b82f6",
  isDark = true,
  dashboardBgColor = "default",
  setDashboardBgColor,
  dashboardBgOpacity = 10,
  setDashboardBgOpacity,
}: MatrixSectionProps) {
  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {!hideHeader && (
        <div className="flex items-center gap-3 text-accent3 mb-6">
          <Sparkles className="w-5 h-5" />
          <h2 className="text-xl font-bold">تنظیمات انیمیشن پس‌زمینه ماتریکس</h2>
        </div>
      )}

      <div className="space-y-6">
        {/* Density */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-center mb-4 relative z-10">
            <label className="text-sm font-bold text-[var(--text-primary)]">تراکم ماتریکس</label>
            <span className="text-xs font-mono text-accent3 bg-accent3/10 px-2 py-1 rounded-md">
              {matrixDensity}px
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={matrixDensity}
            onChange={(e) => setMatrixDensity(Number(e.target.value))}
            className="w-full accent-accent3 relative z-10 cursor-pointer"
            dir="ltr"
          />
          <p className="text-[10px] text-[var(--text-secondary)] mt-2">
            فاصله بین علامت‌های (+) در پس‌زمینه را تعیین می‌کند. (مقدار کمتر = تراکم بیشتر)
          </p>
        </div>

        {/* Size */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-center mb-4 relative z-10">
            <label className="text-sm font-bold text-[var(--text-primary)]">اندازه پایه (+)</label>
            <span className="text-xs font-mono text-accent3 bg-accent3/10 px-2 py-1 rounded-md">
              {matrixSize}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={matrixSize}
            onChange={(e) => setMatrixSize(Number(e.target.value))}
            className="w-full accent-accent3 relative z-10 cursor-pointer"
            dir="ltr"
          />
        </div>

        {/* Hover Size */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-center mb-4 relative z-10">
            <label className="text-sm font-bold text-[var(--text-primary)]">میزان بزرگ‌نمایی در صورت جابجایی موس</label>
            <span className="text-xs font-mono text-accent3 bg-accent3/10 px-2 py-1 rounded-md">
              {matrixHoverSize}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={matrixHoverSize}
            onChange={(e) => setMatrixHoverSize(Number(e.target.value))}
            className="w-full accent-accent3 relative z-10 cursor-pointer"
            dir="ltr"
          />
        </div>

        {/* Opacity */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-center mb-4 relative z-10">
            <label className="text-sm font-bold text-[var(--text-primary)]">شفافیت ماتریکس (%)</label>
            <span className="text-xs font-mono text-accent3 bg-accent3/10 px-2 py-1 rounded-md">
              {matrixOpacity}%
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={matrixOpacity}
            onChange={(e) => setMatrixOpacity(Number(e.target.value))}
            className="w-full accent-accent3 relative z-10 cursor-pointer"
            dir="ltr"
          />
        </div>

        {/* Color */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-lg">
          <label className="text-sm font-bold text-[var(--text-primary)] mb-4 block">رنگ ماتریکس</label>
          <div className="flex items-center gap-3 w-full" dir="ltr">
            <button
              onClick={() => setMatrixColor("#888888")}
              className={`flex-1 h-12 rounded-xl border-2 transition-all duration-300 flex items-center justify-center ${
                matrixColor === "#888888" 
                  ? "border-[var(--text-primary)] scale-[1.02] shadow-md" 
                  : "border-transparent hover:scale-105 opacity-60 hover:opacity-100"
              }`}
              style={{ backgroundColor: "#888888" }}
              title="خاکستری"
            />
            
            <button
              onClick={() => setMatrixColor(accent3)}
              className={`flex-1 h-12 rounded-xl border-2 transition-all duration-300 flex items-center justify-center ${
                matrixColor === accent3 
                  ? "border-[var(--text-primary)] scale-[1.02] shadow-md" 
                  : "border-transparent hover:scale-105 opacity-60 hover:opacity-100"
              }`}
              style={{ backgroundColor: accent3 }}
              title="رنگ سوم"
            />
            
            <button
              onClick={() => setMatrixColor(accent4)}
              className={`flex-1 h-12 rounded-xl border-2 transition-all duration-300 flex items-center justify-center ${
                matrixColor === accent4 
                  ? "border-[var(--text-primary)] scale-[1.02] shadow-md" 
                  : "border-transparent hover:scale-105 opacity-60 hover:opacity-100"
              }`}
              style={{ backgroundColor: accent4 }}
              title="رنگ چهارم"
            />
          </div>
        </div>

        {/* Dashboard Background Color */}
        {setDashboardBgColor && setDashboardBgOpacity && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-lg space-y-6">
            <div>
              <label className="text-sm font-bold text-[var(--text-primary)] mb-4 block">رنگ پس‌زمینه داشبورد</label>
              <div className="flex items-center gap-3 w-full" dir="ltr">
                <button
                  onClick={() => setDashboardBgColor("default")}
                  className={`flex-1 h-12 rounded-xl border-2 transition-all duration-300 flex items-center justify-center ${
                    dashboardBgColor === "default"
                      ? "border-[var(--text-primary)] scale-[1.02] shadow-md"
                      : "border-transparent hover:scale-105 opacity-60 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: isDark ? "#050609" : "#f4f5f7" }}
                  title="پیش‌فرض"
                >
                  <span className="text-[10px] font-bold text-gray-500">پیش‌فرض</span>
                </button>
                <button
                  onClick={() => setDashboardBgColor("#888888")}
                  className={`flex-1 h-12 rounded-xl border-2 transition-all duration-300 flex items-center justify-center ${
                    dashboardBgColor === "#888888"
                      ? "border-[var(--text-primary)] scale-[1.02] shadow-md"
                      : "border-transparent hover:scale-105 opacity-60 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: "#888888" }}
                  title="خاکستری"
                />
                <button
                  onClick={() => setDashboardBgColor("accent3")}
                  className={`flex-1 h-12 rounded-xl border-2 transition-all duration-300 flex items-center justify-center ${
                    dashboardBgColor === "accent3"
                      ? "border-[var(--text-primary)] scale-[1.02] shadow-md"
                      : "border-transparent hover:scale-105 opacity-60 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: accent3 }}
                  title="رنگ سوم"
                />
                <button
                  onClick={() => setDashboardBgColor("accent4")}
                  className={`flex-1 h-12 rounded-xl border-2 transition-all duration-300 flex items-center justify-center ${
                    dashboardBgColor === "accent4"
                      ? "border-[var(--text-primary)] scale-[1.02] shadow-md"
                      : "border-transparent hover:scale-105 opacity-60 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: accent4 }}
                  title="رنگ چهارم"
                />
              </div>
            </div>

            {/* Dashboard Background Opacity */}
            <div className="pt-2 border-t border-[var(--border-color)]">
              <div className="flex justify-between items-center mb-4 relative z-10">
                <label className="text-sm font-bold text-[var(--text-primary)]">شفافیت پس‌زمینه داشبورد (%)</label>
                <span className="text-xs font-mono text-accent3 bg-accent3/10 px-2 py-1 rounded-md">
                  {dashboardBgOpacity}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={dashboardBgOpacity}
                onChange={(e) => setDashboardBgOpacity(Number(e.target.value))}
                className="w-full accent-accent3 relative z-10 cursor-pointer"
                dir="ltr"
              />
            </div>
          </div>
        )}

        {/* Toggles */}
        <div className="space-y-3">
          <label className="flex items-center justify-between p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl cursor-pointer hover:border-accent3/50 transition-colors">
            <div className="flex items-center gap-3">
              <Move className={`w-5 h-5 ${matrixMoving ? 'text-accent3' : 'text-[var(--text-secondary)]'}`} />
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)]">متحرک بودن ماتریکس</div>
                <div className="text-[10px] text-[var(--text-secondary)]">جابجایی پیوسته نقاط در پس‌زمینه</div>
              </div>
            </div>
            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${matrixMoving ? 'bg-accent3' : 'bg-[var(--bg-surface)] border border-[var(--border-color)]'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${matrixMoving ? '-translate-x-4' : 'translate-x-0'}`} />
            </div>
            <input
              type="checkbox"
              checked={matrixMoving}
              onChange={(e) => setMatrixMoving(e.target.checked)}
              className="hidden"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl cursor-pointer hover:border-accent3/50 transition-colors">
            <div className="flex items-center gap-3">
              <MousePointer2 className={`w-5 h-5 ${matrixMouseEffect ? 'text-accent3' : 'text-[var(--text-secondary)]'}`} />
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)]">افکت پویای موس</div>
                <div className="text-[10px] text-[var(--text-secondary)]">بزرگ‌نمایی نقاط اطراف موس</div>
              </div>
            </div>
            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${matrixMouseEffect ? 'bg-accent3' : 'bg-[var(--bg-surface)] border border-[var(--border-color)]'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${matrixMouseEffect ? '-translate-x-4' : 'translate-x-0'}`} />
            </div>
            <input
              type="checkbox"
              checked={matrixMouseEffect}
              onChange={(e) => setMatrixMouseEffect(e.target.checked)}
              className="hidden"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl cursor-pointer hover:border-accent3/50 transition-colors">
            <div className="flex items-center gap-3">
              <Sparkles className={`w-5 h-5 ${matrixTwinkleEffect ? 'text-accent3' : 'text-[var(--text-secondary)]'}`} />
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)]">چشمک‌زن ستاره‌ای</div>
                <div className="text-[10px] text-[var(--text-secondary)]">روشن و خاموش شدن تصادفی نقطه‌ها</div>
              </div>
            </div>
            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${matrixTwinkleEffect ? 'bg-accent3' : 'bg-[var(--bg-surface)] border border-[var(--border-color)]'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${matrixTwinkleEffect ? '-translate-x-4' : 'translate-x-0'}`} />
            </div>
            <input
              type="checkbox"
              checked={matrixTwinkleEffect}
              onChange={(e) => setMatrixTwinkleEffect(e.target.checked)}
              className="hidden"
            />
          </label>
        </div>

        {/* Twinkle Speed (Only shown if effect is active) */}
        {matrixTwinkleEffect && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-lg relative overflow-hidden animate-fade-in">
            <div className="flex justify-between items-center mb-4 relative z-10">
              <label className="text-sm font-bold text-[var(--text-primary)]">سرعت چشمک‌زدن</label>
              <span className="text-xs font-mono text-accent3 bg-accent3/10 px-2 py-1 rounded-md">
                {matrixTwinkleSpeed}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={matrixTwinkleSpeed}
              onChange={(e) => setMatrixTwinkleSpeed(Number(e.target.value))}
              className="w-full accent-accent3 relative z-10 cursor-pointer"
              dir="ltr"
            />
          </div>
        )}
      </div>
    </div>
  );
}
