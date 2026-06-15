"use client";

import React from "react";

interface CuneiformBackgroundProps {
  isDark: boolean;
  cuneiformColor: "accent3" | "accent4" | "white" | "muted";
  cuneiformOpacity: number;
  cuneiformColorValue: string;
  accent3: string;
  animationsEnabled?: boolean;
}

export default function CuneiformBackground({
  isDark,
  cuneiformColor,
  cuneiformOpacity,
  cuneiformColorValue,
  accent3,
  animationsEnabled = true,
}: CuneiformBackgroundProps) {
  return (
    <>
      {/* Absolute Luxurious Persepolis Stone Relief Background Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--bg-gradient-from)] via-[var(--bg-gradient-via)] to-[var(--bg-gradient-to)] opacity-95 z-0 pointer-events-none transition-colors duration-500" />

      {/* Drifting ancient Achaemenid cuneiform background with custom opacity and hue control */}
      <div
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none transition-all duration-1000"
        style={{ opacity: cuneiformOpacity }}
      >
        <div
          className={`absolute inset-0 cuneiform-scroll-container ${animationsEnabled ? "cuneiform-scroll-animated" : ""}`}
          style={{
            backgroundImage: isDark
              ? "url('/Backgrand-Transition-Dark.jpg')"
              : "url('/Backgrand-Transition-Light.jpg')",
            backgroundSize: "400px 400px",
            backgroundPosition: "0 0",
            backgroundRepeat: "repeat",
            mixBlendMode: isDark ? "screen" : "multiply",
            filter:
              cuneiformColor === "muted"
                ? "grayscale(100%)"
                : cuneiformColor === "accent4"
                  ? "hue-rotate(120deg) saturate(1.8)"
                  : cuneiformColor === "white"
                    ? "grayscale(100%) brightness(1.8)"
                    : "none",
          }}
        />
        <div
          className="absolute inset-0 mix-blend-color pointer-events-none"
          style={{
            backgroundColor: cuneiformColorValue,
            opacity: isDark ? 0.35 : 0.65,
          }}
        />
      </div>

      <div
        className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-accent3 to-transparent z-0 transition-colors duration-500"
        style={{ backgroundColor: accent3, opacity: 0.15 }}
      />
    </>
  );
}
