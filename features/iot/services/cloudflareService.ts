import { EspConfig } from "@/features/iot/services/esp32Config";

const DEFAULT_WORKER_URL = "https://durable-object-worker.kamyarahangar157.workers.dev";

export function getCloudflareWorkerUrl(): string {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("cloudflare_worker_url");
    if (saved) return saved;
  }
  return process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || DEFAULT_WORKER_URL;
}

export function setCloudflareWorkerUrl(url: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("cloudflare_worker_url", url);
  }
}

/**
 * Maps our dashboard-stored state schema to the agreed Cloudflare config format.
 */
function serializeToCloudflare(config: any): any {
  return {
    version: config.version || "1.2.0-Achaemenid",
    device: config.device || {
      name: "سامانه مرزی پاسارگاد",
      chip: "ESP32-S3-WROOM-1",
      firmware: "v3.4.1-Achaemenid-OS",
      reboot_count: 0,
      last_boot: new Date().toISOString()
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
      cuneiform_color: config.preferences?.cuneiform_color || "accent3"
    },
    layout: {
      groups_order: config.layout?.groups_order || [],
      groups_cols: config.layout?.groups_cols || 1,
      group_configs: config.layout?.group_configs || {}
    },
    // Map 'segments' list from our dashboard to 'segments_definition' key
    segments_definition: config.segments || []
  };
}

/**
 * Maps the Cloudflare config structure back to our native dashboard format.
 */
function deserializeFromCloudflare(cfData: any): EspConfig {
  return {
    version: cfData.version || "1.2.0-Achaemenid",
    device: cfData.device || {
      name: "سامانه مرزی پاسارگاد",
      chip: "ESP32-S3-WROOM-1",
      firmware: "v3.4.1-Achaemenid-OS",
      reboot_count: 0,
      last_boot: new Date().toISOString()
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
      cuneiform_color: cfData.preferences?.cuneiform_color || "accent3"
    },
    layout: {
      groups_order: cfData.layout?.groups_order || [],
      groups_cols: cfData.layout?.groups_cols || 1,
      group_configs: cfData.layout?.group_configs || {}
    },
    // Load from 'segments_definition' and fall back to 'segments'
    segments: cfData.segments_definition || cfData.segments || []
  };
}

/**
 * Checks if the Cloudflare Worker URL is actually customized/active rather than the placeholder.
 */
export function isCloudflareEnabled(): boolean {
  const url = getCloudflareWorkerUrl();
  return url !== "" && !url.includes("YOUR_SUBDOMAIN");
}

/**
 * Fetch the latest config from Cloudflare Worker.
 */
export async function fetchConfigFromCloudflare(): Promise<EspConfig | null> {
  if (!isCloudflareEnabled()) return null;
  const baseUrl = getCloudflareWorkerUrl().replace(/\/$/, "");
  
  try {
    const res = await fetch(`${baseUrl}/config`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch Cloudflare config: ${res.statusText}`);
    }
    
    const data = await res.json();
    return deserializeFromCloudflare(data);
  } catch (error) {
    console.error("Cloudflare fetchConfig error:", error);
    throw error;
  }
}

/**
 * Save configuration to Cloudflare Worker.
 */
export async function saveConfigToCloudflare(config: EspConfig): Promise<boolean> {
  if (!isCloudflareEnabled()) return false;
  const baseUrl = getCloudflareWorkerUrl().replace(/\/$/, "");
  const payload = serializeToCloudflare(config);
  
  try {
    const res = await fetch(`${baseUrl}/config`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    
    return res.ok;
  } catch (error) {
    console.error("Cloudflare saveConfig error:", error);
    return false;
  }
}

/**
 * Update pin state on Durable Objects via Cloudflare Worker.
 */
export async function updatePinOnCloudflare(pin: string, value: boolean): Promise<boolean> {
  if (!isCloudflareEnabled()) return false;
  const baseUrl = getCloudflareWorkerUrl().replace(/\/$/, "");
  
  try {
    const res = await fetch(`${baseUrl}/pins/${pin}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value }),
    });
    
    return res.ok;
  } catch (error) {
    console.error(`Cloudflare updatePinOnCloudflare error for pin ${pin}:`, error);
    return false;
  }
}

/**
 * Fetch states for all configured pins from Durable Objects.
 */
export async function fetchPinsFromCloudflare(segments: any[]): Promise<Record<string, boolean> | null> {
  if (!isCloudflareEnabled()) return null;
  const baseUrl = getCloudflareWorkerUrl().replace(/\/$/, "");
  
  try {
    const pinsToFetch = Array.from(new Set(segments.map(s => s.pin).filter(Boolean))) as string[];
    const result: Record<string, boolean> = {};
    
    await Promise.all(
      pinsToFetch.map(async (pin) => {
        try {
          const pinRes = await fetch(`${baseUrl}/pins/${pin}`);
          if (pinRes.ok) {
            const data = await pinRes.json();
            if (data && typeof data.value === "boolean") {
              result[pin] = data.value;
            }
          }
        } catch (e) {
          console.warn(`Could not fetch state for pin ${pin}:`, e);
        }
      })
    );
    
    return result;
  } catch (error) {
    console.error("Could not complete fetchPinsFromCloudflare:", error);
    return null;
  }
}
