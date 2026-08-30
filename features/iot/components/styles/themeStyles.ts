interface ThemeStylesParams {
  accent3?: string;
  accent4?: string;
  isDark?: boolean;
  dashboardBgColor?: string;
  dashboardBgOpacity?: number;
}

/**
 * Generates unified CSS tokens strictly conforming to DESIGN.md.
 * Ultra-Deep Obsidian Dark with Maximum Contrast and a Restrained Palette.
 *
 * @param {ThemeStylesParams} params - Dynamic theme parameters including accents and background opacity.
 * @returns {string} Injected CSS string with root custom properties.
 */
export function getThemeStyles({
  accent3 = "#00F0FF",
  accent4 = "#10B981",
}: ThemeStylesParams = {}): string {
  return `
    :root {
      /* Typography */
      --font-vazir: var(--font-vazirmatn), 'Vazirmatn', system-ui, -apple-system, sans-serif;
      --selected-font: var(--font-vazirmatn), 'Vazirmatn', system-ui, -apple-system, sans-serif;
      
      /* Surface & Elevation Tokens — Ultra-Deep Obsidian & True Dark Slate */
      --canvas-base: #020306;
      --surface-panel: #06080D;
      --surface-card: #0A0D14;
      --surface-glass: rgba(10, 13, 20, 0.92);
      --surface-elevated: #121620;
      --border-subtle: rgba(255, 255, 255, 0.08);
      --border-highlight: rgba(255, 255, 255, 0.18);

      /* Typography & Maximum Contrast Tokens */
      --text-primary: #FFFFFF;
      --text-secondary: #F1F5F9;
      --text-tertiary: #94A3B8;
      --text-muted: #64748B;
      --text-disabled: #334155;

      /* Disciplined Restrained Semantic Accents (Minimal Color Clutter) */
      --accent-cyan: #00F0FF;
      --accent-cyan-pulse: #38E1FF;
      --accent-cyan-glow: rgba(0, 240, 255, 0.35);
      --accent-emerald: #10B981;
      --accent-emerald-pulse: #34D399;
      --accent-emerald-glow: rgba(16, 185, 129, 0.35);
      --accent-rose: #EF4444;
      --accent-rose-pulse: #F87171;
      --accent-rose-glow: rgba(239, 68, 68, 0.35);
      --accent-carbon: #020306;

      /* Dynamic Accent Mapping */
      --accent3: ${accent3};
      --accent4: ${accent4};
      --accent3-transparent: ${accent3}22;
      --accent4-transparent: ${accent4}22;
      --accent3-medium: ${accent3}55;
      --accent4-medium: ${accent4}55;
      --accent3-heavy: ${accent3}AA;
      --accent4-heavy: ${accent4}AA;

      /* Semantic Layout Aliases */
      --bg-main: #020306;
      --bg-gradient-from: #06080D;
      --bg-gradient-via: #020306;
      --bg-gradient-to: #010103;
      --card-bg: rgba(10, 13, 20, 0.92);
      --card-bg-solid: #0A0D14;
      --card-hover-bg: #121620;
      --border-color: rgba(255, 255, 255, 0.08);
      --drawer-gradient-from: #06080D;
      --drawer-gradient-to: #020306;
    }
    
    html, body, button, h1, h2, h3, h4, h5, h6, select, span, input, textarea, .font-sans {
      font-family: var(--font-vazirmatn), 'Vazirmatn', system-ui, -apple-system, sans-serif !important;
    }
  `;
}
