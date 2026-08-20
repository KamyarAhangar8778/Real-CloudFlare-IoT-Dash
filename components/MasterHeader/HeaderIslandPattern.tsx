"use client";

import React from "react";

interface HeaderIslandPatternProps {
  className?: string;
  variant?: "horizontal" | "vertical" | "compact";
}

export default function HeaderIslandPattern({
  className = "",
  variant = "horizontal",
}: HeaderIslandPatternProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none rounded-2xl z-0 transition-opacity duration-500 ${className}`}
      aria-hidden="true"
    >
      {/* Ambient Gradient Glows (Theme-aware accents) */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-2xl opacity-20 dark:opacity-30 transition-all duration-500 md:group-hover:opacity-45 md:group-hover:scale-110 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--accent3) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-2xl opacity-15 dark:opacity-25 transition-all duration-500 md:group-hover:opacity-35 md:group-hover:scale-110 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--accent4) 0%, transparent 70%)",
        }}
      />

      {/* Specular Inner Rim Light */}
      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] pointer-events-none" />

      {/* SVG Micro-Pattern: Persian Cuneiform / Geometric Lattice Matrix */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.06] dark:opacity-[0.10] md:group-hover:opacity-[0.14] transition-opacity duration-500"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id={`header-island-pattern-${variant}`}
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            {/* Geometric diamond & micro-connector lattice */}
            <path
              d="M 12 0 L 24 12 L 12 24 L 0 12 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
              className="text-[var(--accent3)]"
            />
            <circle
              cx="12"
              cy="12"
              r="1"
              className="fill-[var(--accent4)]"
            />
            <path
              d="M 6 6 L 18 18 M 18 6 L 6 18"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="1 3"
              className="text-[var(--text-tertiary)]"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#header-island-pattern-${variant})`}
        />
      </svg>

      {/* Subtle bottom-edge ambient shimmer */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--accent3-transparent)] to-transparent opacity-50 md:group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
