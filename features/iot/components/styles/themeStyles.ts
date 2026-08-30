interface ThemeStylesParams {
  accent3?: string;
  accent4?: string;
  isDark?: boolean;
  dashboardBgColor?: string;
  dashboardBgOpacity?: number;
}

/**
 * Generates unified CSS tokens strictly conforming to DESIGN.md
 * Ultra-Deep Carbon Dark & High-Contrast Ruby/Phosphor System.
 */
export function getThemeStyles({
  accent3 = "#FF1756",
  accent4 = "#00FF88",
}: ThemeStylesParams = {}): string {
  return `
    :root {
      /* Typography */
      --font-vazir: var(--font-vazirmatn), 'Vazirmatn', system-ui, -apple-system, sans-serif;
      --selected-font: var(--font-vazirmatn), 'Vazirmatn', system-ui, -apple-system, sans-serif;
      
      /* Surface & Elevation Tokens - Ultra-Deep Carbon & Obsidian */
      --canvas-base: #030407;
      --surface-panel: #07090F;
      --surface-card: #0D1017;
      --surface-glass: rgba(13, 16, 23, 0.88);
      --surface-elevated: #141824;
      --border-subtle: rgba(255, 255, 255, 0.10);
      --border-highlight: rgba(255, 255, 255, 0.22);

      /* Typography & High Contrast Tokens */
      --text-primary: #FFFFFF;
      --text-secondary: #E2E8F0;
      --text-tertiary: #94A3B8;
      --text-muted: #64748B;
      --text-disabled: #334155;

      /* High-Contrast Neon & Vivid Accents */
      --accent-ruby: #FF1756;
      --accent-ruby-pulse: #FF4D7D;
      --accent-ruby-glow: rgba(255, 23, 86, 0.4);
      --accent-phosphor: #00FF88;
      --accent-phosphor-pulse: #5CFFB0;
      --accent-phosphor-glow: rgba(0, 255, 136, 0.4);
      --accent-cyan: #00F0FF;
      --accent-cyan-pulse: #38E1FF;
      --accent-amber: #FBBF24;
      --accent-amber-pulse: #FDE047;
      --accent-rose: #FF1756;
      --accent-rose-pulse: #FF4D7D;
      --accent-indigo: #818CF8;
      --accent-indigo-pulse: #A5B4FC;
      --accent-carbon: #030407;

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
      --bg-main: #030407;
      --bg-gradient-from: #080A10;
      --bg-gradient-via: #030407;
      --bg-gradient-to: #010204;
      --card-bg: rgba(13, 16, 23, 0.88);
      --card-bg-solid: #0D1017;
      --card-hover-bg: #161B28;
      --border-color: rgba(255, 255, 255, 0.10);
      --drawer-gradient-from: #080A10;
      --drawer-gradient-to: #030407;
    }
    
    html, body, button, h1, h2, h3, h4, h5, h6, select, span, input, textarea, .font-sans {
      font-family: var(--font-vazirmatn), 'Vazirmatn', system-ui, -apple-system, sans-serif !important;
    }
  `;
}
