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
      cuneiform_opacity: cfData.preferences?.cuneiform_opacity ?? 0.08,
      cuneiform_color: cfData.preferences?.cuneiform_color || "accent3",
    },
    layout: {
      groups_order: cfData.layout?.groups_order || [],
      groups_cols: cfData.layout?.groups_cols || 1,
      group_configs: cfData.layout?.group_configs || {},
    },
    // Load from 'segments_definition' and fall back to 'segments'
    segments: cfData.segments_definition || cfData.segments || [],
    // آدرس ورکر ذخیره‌شده
    worker_url: cfData.worker_url || undefined,
  };
}
