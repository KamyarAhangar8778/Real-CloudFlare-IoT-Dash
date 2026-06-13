import { EspConfig } from "@/features/iot/services/esp32Config";
import { getCloudflareWorkerUrl, isCloudflareEnabled } from "./config";
import { serializeToCloudflare, deserializeFromCloudflare } from "./mappers";

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
