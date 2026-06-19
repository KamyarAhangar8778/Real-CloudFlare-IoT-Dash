export interface EspConfig {
  version: string;
  device: {
    name: string;
    chip: string;
    firmware: string;
    reboot_count: number;
    last_boot: string;
  };
  preferences: {
    theme_mode: "dark" | "light";
    accent_color_3: string; // Golden primary color
    accent_color_4: string; // Secondary status/emerald color
    font_family: string; // e.g. "vazir", "lalezar", "cairo", "mono"
    animations_enabled: boolean;
    header_animation: "fade" | "chase";
    header_title: string;
    cuneiform_opacity: number;
    cuneiform_color: "accent3" | "accent4" | "white" | "muted";
    header_position?: "top" | "left";
    manual_save_mode?: boolean;
  };
  layout: {
    groups_order: string[];
    groups_cols: number;
    group_configs: Record<string, { maxCols: number }>;
  };
  segments: Array<{
    id: string;
    type: string;
    pin: string;
    title: string;
    group: string;
    state?: boolean;
    mode?: "switch" | "push";
    auto_off?: number;
    rule?: {
      highActions?: Array<{
        reqHold: number;
        targetPin: string;
        actionOn: boolean;
        actionType?: number;
        delay?: number;
      }>;
      lowActions?: Array<{
        reqHold: number;
        targetPin: string;
        actionOn: boolean;
        actionType?: number;
        delay?: number;
      }>;
      // Also allow old schema to exist so TS doesn't complain when reading old KV data
      targetPinHigh?: string;
      actionOnHigh?: boolean;
      actionTypeHigh?: number;
      delayHigh?: number;
      reqHoldHigh?: number;
      targetPinLow?: string;
      actionOnLow?: boolean;
      actionTypeLow?: number;
      delayLow?: number;
      reqHoldLow?: number;
      targetPin?: string;
      triggerState?: boolean;
      actionState?: boolean;
    };
  }>;
  /** آدرس ورکر Cloudflare - ذخیره در KV تا بعد از refresh باقی بماند */
  worker_url?: string;
}

export const DEFAULT_ESP_CONFIG: EspConfig = {
  version: "1.2.0-Achaemenid",
  device: {
    name: "سامانه مرزی پاسارگاد",
    chip: "ESP32-S3-WROOM-1",
    firmware: "v3.4.1-Achaemenid-OS",
    reboot_count: 14,
    last_boot: "2026-05-26T20:55:00Z",
  },
  preferences: {
    theme_mode: "dark",
    accent_color_3: "#D4AF37",
    accent_color_4: "#10B981",
    font_family: "vazir",
    animations_enabled: true,
    header_animation: "fade",
    header_title: "سامانه هوشمند پادشاهی هخامنش",
    cuneiform_opacity: 0.08,
    cuneiform_color: "accent3",
    header_position: "top",
    manual_save_mode: false,
  },
  layout: {
    groups_order: ["بخش فرماندهی"],
    groups_cols: 1,
    group_configs: {
      "بخش فرماندهی": { maxCols: 3 },
    },
  },
  segments: [
    {
      id: "control_lamp",
      type: "روشنایی تالار آپادانا",
      pin: "2",
      title: "روشنایی تالار آپادانا",
      group: "بخش فرماندهی",
    },
    {
      id: "main_gate",
      type: "دروازه ملل کلاچ",
      pin: "4",
      title: "دروازه ملل کلاچ",
      group: "بخش فرماندهی",
    },
    {
      id: "water_pump",
      type: "پمپ آب پردیس شاهنشاهی",
      pin: "12",
      title: "پمپ حوض‌های پردیس",
      group: "بخش فرماندهی",
    },
  ],
};

/**
 * Validates whether the provided object stands up to the EspConfig schema.
 */
export function validateEspConfig(config: any): config is EspConfig {
  if (!config) return false;
  if (typeof config !== "object") return false;
  if (!config.version || typeof config.version !== "string") return false;
  if (!config.preferences || typeof config.preferences !== "object") return false;
  if (!config.layout || typeof config.layout !== "object") return false;
  if (!Array.isArray(config.segments)) return false;

  const prefs = config.preferences;
  if (typeof prefs.theme_mode !== "string") return false;
  if (typeof prefs.accent_color_3 !== "string") return false;
  if (typeof prefs.accent_color_4 !== "string") return false;
  if (typeof prefs.font_family !== "string") return false;

  return true;
}
