"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { EspConfig, DEFAULT_ESP_CONFIG } from "@/features/iot/services/esp32Config";
import {
  isCloudflareEnabled,
  fetchConfigFromCloudflare,
  getCloudflareWorkerUrl,
  setCloudflareWorkerUrl,
} from "@/features/iot/services/cloudflareService";

interface UseCloudflareInitProps {
  mounted: boolean;
  handleApplyEspConfig: (config: EspConfig) => void;
}

export function useCloudflareInit({ mounted, handleApplyEspConfig }: UseCloudflareInitProps) {
  const { isInitialSyncLoading, setSyncStatus } = useIoTStore();
  const [isFullyReady, setIsFullyReady] = useState(false);
  const [workerUrl, setWorkerUrlState] = useState(() => getCloudflareWorkerUrl());
  const bypassedRef = useRef(false);

  const handleWorkerUrlChange = (url: string) => {
    setWorkerUrlState(url);
    setCloudflareWorkerUrl(url);
  };

  const handleBypassSync = useCallback(() => {
    bypassedRef.current = true;
    handleApplyEspConfig(DEFAULT_ESP_CONFIG);
    setSyncStatus(false, 100, "تایید هویت مستقل. تنظیمات پیش‌فرض بارگذاری شد.");
    setIsFullyReady(true);
  }, [handleApplyEspConfig, setSyncStatus]);

  const initCloudflareSync = useCallback(async () => {
    let attemptCount = 0;
    const maxAttempts = 5;
    
    while (!bypassedRef.current && attemptCount < maxAttempts) {
      attemptCount++;
      setSyncStatus(
        true,
        Math.min(10 + attemptCount * 15, 95),
        `در حال دریافت تنظیمات از کلودفلر (تلاش ${attemptCount} از ${maxAttempts})...`,
      );

      try {
        const cfConfig = await fetchConfigFromCloudflare();
        if (cfConfig && cfConfig.segments && cfConfig.segments.length > 0) {
          if (bypassedRef.current) return;
          if (cfConfig.worker_url) {
            handleWorkerUrlChange(cfConfig.worker_url);
          }
          handleApplyEspConfig(cfConfig);
          setSyncStatus(false, 100, "همگام‌سازی تنظیمات از کلودفلر انجام شد.");
          setIsFullyReady(true);
          return;
        }
      } catch (e) {
        console.error(`Attempt ${attemptCount} failed to sync from Cloudflare:`, e);
      }

      if (bypassedRef.current) return;

      if (attemptCount < maxAttempts) {
        setSyncStatus(
          true,
          Math.min(10 + attemptCount * 15, 95),
          `دریافت تنظیمات ناموفق بود. در حال تلاش مجدد...`,
        );
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    if (!bypassedRef.current) {
      console.warn("Failed to fetch Cloudflare config after 5 attempts, loading default empty config.");
      handleBypassSync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleApplyEspConfig, setSyncStatus, handleBypassSync]);

  useEffect(() => {
    initCloudflareSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isFullyReady,
    setIsFullyReady,
    handleBypassSync,
    workerUrl,
    setWorkerUrl: handleWorkerUrlChange,
    handleRetrySync: initCloudflareSync,
  };
}
