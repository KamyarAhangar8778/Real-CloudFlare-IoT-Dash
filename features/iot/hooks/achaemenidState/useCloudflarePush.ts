"use client";

import { useCallback, useEffect, useRef } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { EspConfig } from "@/features/iot/services/esp32Config";
import {
  getCloudflareWorkerUrl,
  isCloudflareEnabled,
  saveConfigToCloudflare,
} from "@/features/iot/services/cloudflareService";

interface UseCloudflarePushProps {
  isFullyReady: boolean;
  isDark: boolean;
  accent3: string;
  accent4: string;
  selectedFont: string;
  animationsEnabled: boolean;
  headerAnimationType: "fade" | "chase";
  headerTitle: string;
  cuneiformOpacity: number;
  cuneiformColor: "accent3" | "accent4" | "white" | "muted";
}

export function useCloudflarePush({
  isFullyReady,
  isDark,
  accent3,
  accent4,
  selectedFont,
  animationsEnabled,
  headerAnimationType,
  headerTitle,
  cuneiformOpacity,
  cuneiformColor
}: UseCloudflarePushProps) {
  const { segments, groupsOrder, groupConfigs, groupsCols, showToast } = useIoTStore();
  const isFirstRender = useRef(true);

  const triggerCloudflarePush = useCallback(async () => {
    if (!isCloudflareEnabled() || !isFullyReady) return;

    const currentConfig: EspConfig = {
      version: "1.2.0-Achaemenid",
      device: {
        name: "سامانه مرزی پاسارگاد",
        chip: "ESP32-S3-WROOM-1",
        firmware: "v3.4.1-Achaemenid-OS",
        reboot_count: 0,
        last_boot: new Date().toISOString()
      },
      preferences: {
        theme_mode: isDark ? "dark" : "light",
        accent_color_3: accent3,
        accent_color_4: accent4,
        font_family: selectedFont,
        animations_enabled: animationsEnabled,
        header_animation: headerAnimationType,
        header_title: headerTitle,
        cuneiform_opacity: cuneiformOpacity,
        cuneiform_color: cuneiformColor
      },
      layout: {
        groups_order: groupsOrder,
        groups_cols: groupsCols,
        group_configs: groupConfigs
      },
      segments: segments,
      worker_url: getCloudflareWorkerUrl(),
    };

    const result = await saveConfigToCloudflare(currentConfig);
    if (result.success) {
      showToast(result.message, "success");
    } else {
      showToast(result.message, "error");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullyReady, isDark, accent3, accent4, selectedFont, animationsEnabled, headerAnimationType, headerTitle, cuneiformOpacity, cuneiformColor, segments, groupsOrder, groupConfigs, groupsCols, showToast]);

  useEffect(() => {
    if (!isFullyReady) return;

    // جلوگیری از push در رندر اول (init)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const handler = setTimeout(() => {
      triggerCloudflarePush();
    }, 1200);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullyReady, isDark, accent3, accent4, selectedFont, animationsEnabled, headerAnimationType, headerTitle, cuneiformOpacity, cuneiformColor, segments, groupsOrder, groupConfigs, groupsCols]);

  return {
    triggerCloudflarePush,
  };
}

