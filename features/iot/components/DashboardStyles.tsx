"use client";

import React from "react";

interface DashboardStylesProps {
  accent3: string;
  accent4: string;
  isDark: boolean;
  selectedFont: string;
  animationsEnabled: boolean;
}

export default function DashboardStyles({
  accent3,
  accent4,
  isDark,
  selectedFont,
  animationsEnabled,
}: DashboardStylesProps) {
  const cuneiformColorValue = 
    isDark ? accent3 : "#1e293b"; // matching how cuneiformColor gets mapped or we can use generic placeholders

  return (
    <style dangerouslySetInnerHTML={{ __html: `
      @import url('https://fonts.googleapis.com/css2?family=Lalezar&family=Vazirmatn:wght@100..900&family=JetBrains+Mono:wght@100..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Space+Grotesk:wght@300..700&family=Cairo:wght@200..1000&family=Amiri:ital,wght@0,400..700;1,400..700&family=Changa:wght@200..800&family=Reem+Kufi:wght@400..700&display=swap');

      /* Custom cursor personalizations */
      html, body {
        cursor: auto;
      }
      a, button, select, input, [role="button"], .cursor-pointer, [draggable="true"] {
        cursor: pointer !important;
      }

      /* Dropdown, Input, & Form Beautifications */
      select, input, textarea {
        transition: border-color 0.3s, box-shadow 0.3s, background-color 0.3s !important;
      }
      select:focus, input:focus, textarea:focus {
        border-color: var(--accent4) !important;
        box-shadow: 0 0 12px var(--accent4-transparent) !important;
        outline: none;
      }
      select:hover, input:hover {
        border-color: var(--accent3) !important;
      }
      select option {
        background-color: ${isDark ? "#080c14" : "#ffffff"} !important;
        color: ${isDark ? "var(--text-primary)" : "#1e293b"} !important;
        padding: 12px !important;
        font-size: 13px !important;
      }

      /* Custom Royal scrollbar styling */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      ::-webkit-scrollbar-track {
        background: var(--bg-main);
      }
      ::-webkit-scrollbar-thumb {
        background: var(--accent3-medium);
        border-radius: 4px;
        border: 2px solid var(--bg-main);
      }
      ::-webkit-scrollbar-thumb:hover {
        background: var(--accent3);
      }

      :root {
        /* Selected Font Custom Configuration */
        --font-vazir: 'Vazirmatn', sans-serif;
        --font-lalezar: 'Lalezar', cursive;
        --font-mono: 'JetBrains Mono', monospace;
        --font-playfair: 'Playfair Display', serif;
        --font-space: 'Space Grotesk', sans-serif;
        --font-cairo: 'Cairo', sans-serif;
        --font-amiri: 'Amiri', serif;
        --font-changa: 'Changa', sans-serif;
        --font-reem: 'Reem Kufi', sans-serif;

        --selected-font: ${
          selectedFont === "vazir" ? "var(--font-vazir)" :
          selectedFont === "lalezar" ? "var(--font-lalezar)" :
          selectedFont === "mono" ? "var(--font-mono)" :
          selectedFont === "playfair" ? "var(--font-playfair)" :
          selectedFont === "space" ? "var(--font-space)" :
          selectedFont === "cairo" ? "var(--font-cairo)" :
          selectedFont === "amiri" ? "var(--font-amiri)" :
          selectedFont === "changa" ? "var(--font-changa)" :
          selectedFont === "reem" ? "var(--font-reem)" : "var(--font-vazir)"
        };

        --accent3: ${accent3};
        --accent4: ${accent4};
        --accent3-transparent: ${accent3}18;
        --accent4-transparent: ${accent4}18;
        --accent3-medium: ${accent3}44;
        --accent4-medium: ${accent4}44;
        --accent3-heavy: ${accent3}99;
        --accent4-heavy: ${accent4}99;

        /* Dynamic Theme Solvers */
        --bg-main: ${isDark ? "#050609" : "#f4f5f7"};
        --bg-gradient-from: ${isDark ? "#0d0f19" : "#ebedf0"};
        --bg-gradient-via: ${isDark ? "#050608" : "#f3f4f6"};
        --bg-gradient-to: ${isDark ? "#010203" : "#fcfdfe"};

        --card-bg: ${isDark ? "rgba(9, 11, 17, 0.55)" : "rgba(252, 253, 254, 0.65)"};
        --card-bg-solid: ${isDark ? "#0b0c13" : "#fbfcfd"};
        --card-hover-bg: ${isDark ? "rgba(12, 14, 22, 0.7)" : "rgba(241, 243, 247, 0.8)"};

        --text-primary: ${isDark ? "#ffffff" : "#090a10"};
        --text-secondary: ${isDark ? "#e2e8f0" : "#2d3748"};
        --text-tertiary: ${isDark ? "#94a3b8" : "#4a5568"};
        --text-muted: ${isDark ? "#64748b" : "#718096"};

        --border-color: ${isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(9, 10, 16, 0.1)"};
        --drawer-gradient-from: ${isDark ? "#090a10" : "#fcfdfe"};
        --drawer-gradient-to: ${isDark ? "#020304" : "#ecf0f5"};
      }

      html, body, button, h1, h2, h3, h4, h5, h6, select, span, input, textarea, .font-sans {
        font-family: var(--selected-font) !important;
      }

      /* Active Performance Settings - Disabling CSS animations on demand */
      ${!animationsEnabled ? `
        *, *::before, *::after {
          animation-delay: 0s !important;
          animation-duration: 0s !important;
          animation-iteration-count: 1 !important;
          transition-delay: 0s !important;
          transition-duration: 0s !important;
          animation: none !important;
          transition: none !important;
        }
      ` : ""}

      ${isDark ? `
        div:nth-of-type(2) > div:nth-of-type(4) > main:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) {
          background-color: var(--card-bg) !important;
        }
        div:nth-of-type(2) > div:nth-of-type(4) > main:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(5) {
          background-color: var(--card-bg) !important;
        }
      ` : ""}

      .theme-bg-main { background-color: var(--bg-main); }
      .theme-text-primary { color: var(--text-primary); }
      .theme-text-secondary { color: var(--text-secondary); }
      .theme-text-tertiary { color: var(--text-tertiary); }
      .theme-text-muted { color: var(--text-muted); }
      .theme-card-bg { background-color: var(--card-bg); }
      .theme-card-bg-solid { background-color: var(--card-bg-solid); }
      .theme-card-hover-bg { background-color: var(--card-hover-bg); }
      .theme-border { border-color: var(--border-color); }

      .text-accent3 { color: var(--accent3); }
      .text-accent4 { color: var(--accent4); }
      .bg-accent3 { background-color: var(--accent3); }
      .bg-accent4 { background-color: var(--accent4); }
      .border-accent3 { border-color: var(--accent3)0; }
      .border-accent4 { border-color: var(--accent4); }
      .border-accent3-medium { border-color: var(--accent3-medium); }
      .border-accent4-medium { border-color: var(--accent4-medium); }

      @keyframes golden-royal-shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      .golden-royal-text-shimmer {
        background: linear-gradient(
          120deg,
          var(--accent3) 0%,
          ${isDark ? "#ffd700" : "#d4af37"} 25%,
          var(--accent3) 50%,
          ${isDark ? "#ffffff" : "#b8860b"} 75%,
          var(--accent3) 100%
        );
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
        animation: golden-royal-shimmer 5s linear infinite;
      }

      @keyframes header-glow {
        0%, 100% {
          filter: drop-shadow(0 0 1px rgba(212, 175, 55, 0.1));
          opacity: 0.95;
        }
        50% {
          filter: drop-shadow(0 0 6px var(--accent3-medium));
          opacity: 1;
        }
      }
      .header-noble-glow {
        animation: header-glow 4s ease-in-out infinite;
        background-size: 200% auto;
      }

      /* Static background image to eliminate frame-rate drops and constant page repaints */
      .cuneiform-scroll-container {
        background-position: center;
      }
    `}} />
  );
}
