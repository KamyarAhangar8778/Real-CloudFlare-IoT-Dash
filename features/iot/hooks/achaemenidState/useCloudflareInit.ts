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

const IGNORE_CONFIG_FETCH_ERROR = true;

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
    setSyncStatus(false, 100, "تایید هویت مستقل.");
    setIsFullyReady(true);
  }, [handleApplyEspConfig, setSyncStatus]);

  const initCloudflareSync = useCallback(async () => {
    let attemptCount = 0;
    
    // Continuous loop until successfully fetched configuration or bypassed
    while (!bypassedRef.current) {
      attemptCount++;
      setSyncStatus(
        true,
        Math.min(10 + attemptCount * 5, 95),
        `در حال دریافت تنظیمات از ورکر کلودفلر (تلاش ${attemptCount})...`,
      );

      try {
        const cfConfig = await fetchConfigFromCloudflare();
        if (cfConfig && cfConfig.segments && cfConfig.segments.length > 0) {
          if (bypassedRef.current) return;
          if (cfConfig.worker_url) {
            handleWorkerUrlChange(cfConfig.worker_url);
          }
          handleApplyEspConfig(cfConfig);
          setSyncStatus(false, 100, "همگام‌سازی چیدمان و تنظیمات از کلودفلر انجام شد.");
          setIsFullyReady(true);
          return;
        } else if (IGNORE_CONFIG_FETCH_ERROR) {
          console.warn("Ignoring Cloudflare config fetch error (empty config), bypassing sync.");
          handleBypassSync();
          return;
        }
      } catch (e) {
        console.error(`Attempt ${attemptCount} failed to sync from Cloudflare:`, e);
        if (IGNORE_CONFIG_FETCH_ERROR) {
          console.warn("Ignoring Cloudflare config fetch error, bypassing sync.");
          handleBypassSync();
          return;
        }
      }

      if (bypassedRef.current) return;

      // If configuration could not be loaded, wait 3 seconds and retry continuously
      setSyncStatus(
        true,
        Math.min(10 + attemptCount * 5, 95),
        `تنظیمات اولیه یافت نشد؛ در حال تلاش مجدد... (تلاش ${attemptCount + 1})`,
      );
      await new Promise((resolve) => setTimeout(resolve, 3000));
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
