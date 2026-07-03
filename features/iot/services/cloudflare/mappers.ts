import { EspConfig } from "@/features/iot/services/esp32Config";
import { getCloudflareWorkerUrl } from "./config";

/**
 * Maps our dashboard-stored state schema to the agreed Cloudflare config format.
 */
export function serializeToCloudflare(config: any): any {
  return {
    version: config.version || "1.2.0-Achaemenid",
    device: config.device || {
      name: "سامانه مرزی پاسارگاد",
      chip: "ESP32-S3-WROOM-1",
      firmware: "v3.4.1-Achaemenid-OS",
      reboot_count: 0,
      last_boot: new Date().toISOString(),
    },
    preferences: {
      theme_mode: config.preferences?.theme_mode || "dark",
      accent_color_3: config.preferences?.accent_color_3 || "#D4AF37",
      accent_color_4: config.preferences?.accent_color_4 || "#10B981",
      font_family: config.preferences?.font_family || "vazir",
      animations_enabled: config.preferences?.animations_enabled ?? true,
      header_animation: config.preferences?.header_animation || "fade",
      header_title: config.preferences?.header_title || "سامانه هوشمند پادشاهی هخامنش",
      cuneiform_opacity: config.preferences?.cuneiform_opacity ?? 0.08,
      cuneiform_color: config.preferences?.cuneiform_color || "accent3",
    },
    layout: {
      groups_order: config.layout?.groups_order || [],
      groups_cols: config.layout?.groups_cols || 1,
      group_configs: config.layout?.group_configs || {},
    },
    // Map 'segments' list from our dashboard to 'segments_definition' key
    segments_definition: config.segments || [],
    automations: config.automations || [],
    macros: config.macros || [],
    voiceCommands: config.voiceCommands || [],
    mqtt: config.mqtt,
    // آدرس ورکر فعلی را ذخیره کن تا بعد از refresh باقی بماند
    worker_url: config.worker_url || getCloudflareWorkerUrl(),
  };
}

/**
 * Maps the Cloudflare config structure back to our native dashboard format.
 */
export function deserializeFromCloudflare(cfData: any): EspConfig {
  return {
    version: cfData.version || "1.2.0-Achaemenid",
    device: cfData.device || {
      name: "سامانه مرزی پاسارگاد",
      chip: "ESP32-S3-WROOM-1",
      firmware: "v3.4.1-Achaemenid-OS",
      reboot_count: 0,
      last_boot: new Date().toISOString(),
    },
    preferences: {
      theme_mode: cfData.preferences?.theme_mode || "dark",
      accent_color_3: cfData.preferences?.accent_color_3 || "#D4AF37",
      accent_color_4: cfData.preferences?.accent_color_4 || "#10B981",
      font_family: cfData.preferences?.font_family || "vazir",
      animations_enabled: cfData.preferences?.animations_enabled ?? true,
      header_animation: cfData.preferences?.header_animation || "fade",
      header_title: cfData.preferences?.header_title || "سامانه هوشمند پادشاهی هخامنش",
      matrix_density: cfData.preferences?.matrix_density ?? 40,
      matrix_size: cfData.preferences?.matrix_size ?? 4,
      matrix_hover_size: cfData.preferences?.matrix_hover_size ?? 3,
      matrix_color: cfData.preferences?.matrix_color || "#D4AF37",
      matrix_moving: cfData.preferences?.matrix_moving ?? true,
      matrix_mouse_effect: cfData.preferences?.matrix_mouse_effect ?? true,
      header_position: cfData.preferences?.header_position || "top",
      dashboard_width: cfData.preferences?.dashboard_width || 1,
    },
    layout: {
      groups_order: cfData.layout?.groups_order || [],
      groups_cols: cfData.layout?.groups_cols || 1,
      group_configs: cfData.layout?.group_configs || {},
    },
    // Load from 'segments_definition' and fall back to 'segments'
    segments: cfData.segments_definition || cfData.segments || [],
    automations: (cfData.automations || []).map((auto: any) => {
      // Migrate old schema to new multiple-actions schema
      if (auto.targetPin !== undefined && !auto.actions) {
        const { targetPin, actionOn, ...rest } = auto;
        return {
          ...rest,
          actions: [{ targetPin, actionOn }],
        };
      }
      return auto;
    }),
    macros: cfData.macros || [],
    voiceCommands: cfData.voiceCommands || [],
    mqtt: cfData.mqtt,
    // آدرس ورکر ذخیره‌شده
    worker_url: cfData.worker_url || undefined,
  };
}
