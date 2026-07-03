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
    animations_fps?: number;
    header_animation: "fade" | "chase";
    header_title: string;
    matrix_density: number;
    matrix_size: number;
    matrix_hover_size: number;
    matrix_color: string;
    matrix_moving: boolean;
    matrix_mouse_effect: boolean;
    matrix_twinkle_effect?: boolean;
    matrix_twinkle_speed?: number;
    cuneiform_opacity?: number; // legacy
    cuneiform_color?: "accent3" | "accent4" | "white" | "muted"; // legacy
    header_position?: "top" | "left";
    manual_save_mode?: boolean;
    dashboard_width?: 1 | 2 | 3 | 4 | 5;
    dashboard_bg_color?: string;
    dashboard_bg_opacity?: number;
    groups_compact_layout?: boolean;
    segments_compact_layout?: boolean;
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
    icon?: string;
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
  automations?: Array<{
    id: string;
    title: string;
    time: string; // "HH:MM" in 24h format
    days: number[]; // 0=Sun, 1=Mon, etc.
    enabled: boolean;
    repeatCount?: number;
    intervalMinutes?: number;
    conditionType?: 'time' | 'weather';
    city?: string;
    temperatureThreshold?: number;
    temperatureCondition?: 'greater' | 'less';
    actions: Array<{
      targetPin?: string;
      targetMacro?: string;
      actionOn?: boolean;
    }>;
  }>;
  macros?: Array<{
    id: string;
    title: string;
    icon?: string;
    actions: Array<{
      targetPin: string;
      actionOn: boolean;
    }>;
  }>;
  voiceCommands?: Array<{
    id: string;
    phrase: string;
    actions: Array<{
      targetPin?: string;
      targetMacro?: string;
      actionOn?: boolean;
    }>;
  }>;
  mqtt?: {
    broker_ws_url: string;
    broker_host: string;
    broker_port: number;
    base_topic: string;
    qos: 0 | 1 | 2;
  };
  wifi?: {
    networks: Array<{
      id: string;
      ssid: string;
      password?: string;
    }>;
  };
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
    animations_fps: 60,
    header_animation: "fade",
    header_title: "سامانه هوشمند پادشاهی هخامنش",
    matrix_density: 40,
    matrix_size: 4,
    matrix_hover_size: 3,
    matrix_color: "#D4AF37",
    matrix_moving: true,
    matrix_mouse_effect: true,
    matrix_twinkle_effect: false,
    matrix_twinkle_speed: 50,
    header_position: "top",
    manual_save_mode: false,
    groups_compact_layout: false,
    segments_compact_layout: false,
  },
  layout: {
    groups_order: [],
    groups_cols: 1,
    group_configs: {},
  },
  segments: [],
  automations: [],
  macros: [],
  voiceCommands: [],
  mqtt: {
    broker_ws_url: "wss://broker.emqx.io:8084/mqtt",
    broker_host: "broker.emqx.io",
    broker_port: 1883,
    base_topic: "KamyarIoT/Achaemenid",
    qos: 1,
  },
  wifi: {
    networks: [],
  },
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
