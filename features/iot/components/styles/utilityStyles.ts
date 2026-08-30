interface UtilityStylesParams {
  isDark: boolean;
  animationsEnabled: boolean;
}

/**
 * Generates runtime utility CSS classes matching the high-contrast dark theme.
 *
 * @param {UtilityStylesParams} params - Dynamic state parameters.
 * @returns {string} Injected utility CSS class rules.
 */
export function getUtilityStyles({ isDark, animationsEnabled }: UtilityStylesParams): string {
  return `
    /* Active Performance Settings - Disabling CSS animations on demand */
    ${
      !animationsEnabled
        ? `
      *, *::before, *::after {
        animation-delay: 0s !important;
        animation-duration: 0s !important;
        animation-iteration-count: 1 !important;
        transition-delay: 0s !important;
        transition-duration: 0s !important;
        animation: none !important;
        transition: none !important;
      }
    `
        : ""
    }

    ${
      isDark
        ? `
      div:nth-of-type(2) > div:nth-of-type(4) > main:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) {
        background-color: var(--card-bg) !important;
      }
      div:nth-of-type(2) > div:nth-of-type(4) > main:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(5) {
        background-color: var(--card-bg) !important;
      }
    `
        : ""
    }

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
    .border-accent3 { border-color: var(--accent3); }
    .border-accent4 { border-color: var(--accent4); }
    .border-accent3-medium { border-color: var(--accent3-medium); }
    .border-accent4-medium { border-color: var(--accent4-medium); }

    .text-cyan { color: var(--accent-cyan); }
    .bg-cyan { background-color: var(--accent-cyan); }
    .border-cyan { border-color: var(--accent-cyan); }
    .shadow-cyan-glow { box-shadow: 0 0 16px var(--accent-cyan-glow); }

    .text-emerald { color: var(--accent-emerald); }
    .bg-emerald { background-color: var(--accent-emerald); }
    .border-emerald { border-color: var(--accent-emerald); }
    .shadow-emerald-glow { box-shadow: 0 0 16px var(--accent-emerald-glow); }

    .text-rose { color: var(--accent-rose); }
    .bg-rose { background-color: var(--accent-rose); }
    .border-rose { border-color: var(--accent-rose); }
    .shadow-rose-glow { box-shadow: 0 0 16px var(--accent-rose-glow); }

    .bg-carbon { background-color: var(--accent-carbon); }
  `;
}
