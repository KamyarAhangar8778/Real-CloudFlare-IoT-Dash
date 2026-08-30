/**
 * Polygon clip-path presets for chiseled edge styling
 */
export const BOX_CLIP =
  "polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px)";
export const BUTTON_CLIP =
  "polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)";
export const ACCORDION_CLIP =
  "polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)";
export const THEME_ISLAND_CLIP =
  "polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)";

// Asymmetric location-specific Chiseled Clips for visual rhythm
// 1. Diagonal Primary - Only cuts Top-Left and Bottom-Right (Majestic stone orientation A)
export const CLIP_DIAGONAL_TL_BR =
  "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";

// 2. Diagonal Secondary - Only cuts Top-Right and Bottom-Left (Majestic stone orientation B)
export const CLIP_DIAGONAL_TR_BL =
  "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))";

// 3. Apadana Royal Gate Arch - Chiseled top corners, flat solid bottom (for top row headers/cards)
export const CLIP_GATE_ARCH = "polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)";

// 4. Persepolis Foundation Pedestal - Chiseled bottom corners, flat robust top (for bottom row cards)
export const CLIP_PEDESTAL =
  "polygon(0 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px))";

// 5. Single Corner Sentry - Only bevels the critical upper execution slot (for highlight/special actions)
export const CLIP_SENTRY_TR = "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)";
export const CLIP_SENTRY_BL = "polygon(0 0, 100% 0, 100% 100%, 20px 100%, 0 calc(100% - 20px))";
