"use client";

import { useState, useEffect } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { EspConfig, DEFAULT_ESP_CONFIG } from "@/features/iot/services/esp32Config";
import { isCloudflareEnabled, fetchConfigFromCloudflare } from "@/features/iot/services/cloudflareService";

interface UseCloudflareInitProps {
  mounted: boolean;
  handleApplyEspConfig: (config: EspConfig) => void;
}

export function useCloudflareInit({ mounted, handleApplyEspConfig }: UseCloudflareInitProps) {
  const { isInitialSyncLoading, setSyncStatus } = useIoTStore();
  const [isFullyReady, setIsFullyReady] = useState(false);

  useEffect(() => {
    if (mounted && !isInitialSyncLoading) {
      const timer = setTimeout(() => {
        setIsFullyReady(true);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [mounted, isInitialSyncLoading]);

  useEffect(() => {
    const initCloudflareSync = async () => {
      if (isCloudflareEnabled()) {
        setSyncStatus(true, 15, "در حال برقراری ارتباط زنده با سرور کلودفلر...");
        try {
          const cfConfig = await fetchConfigFromCloudflare();
          if (cfConfig) {
            handleApplyEspConfig(cfConfig);
            setSyncStatus(false, 100, "همگام‌سازی چیدمان و تنظیمات از کلودفلر انجام شد.");
            setIsFullyReady(true);
            return;
          }
        } catch (e) {
          console.error("Failed to fetch initial configuration from Cloudflare:", e);
        }
      }
      setSyncStatus(false, 100, "انتقال داده‌های محلی کامل شد.");
      setIsFullyReady(true);
      handleApplyEspConfig(DEFAULT_ESP_CONFIG);
    };

    initCloudflareSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBypassSync = () => {
    handleApplyEspConfig(DEFAULT_ESP_CONFIG);
    setSyncStatus(false, 100, "تایید هویت مستقل.");
    setIsFullyReady(true);
  };

  return {
    isFullyReady,
    setIsFullyReady,
    handleBypassSync,
  };
}
