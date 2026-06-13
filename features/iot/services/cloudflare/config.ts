const DEFAULT_WORKER_URL = "https://durable-object-worker.kamyarahangar157.workers.dev";

let inMemoryWorkerUrl = typeof process !== "undefined" && process.env ? (process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || DEFAULT_WORKER_URL) : DEFAULT_WORKER_URL;

export function getCloudflareWorkerUrl(): string {
  return inMemoryWorkerUrl;
}

export function setCloudflareWorkerUrl(url: string) {
  inMemoryWorkerUrl = url;
}

/**
 * Checks if the Cloudflare Worker URL is actually customized/active rather than the placeholder.
 */
export function isCloudflareEnabled(): boolean {
  const url = getCloudflareWorkerUrl();
  return url !== "" && !url.includes("YOUR_SUBDOMAIN");
}
