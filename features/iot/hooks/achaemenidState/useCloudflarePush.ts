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
  animationsFps: number;
  headerAnimationType: "fade" | "chase";
  headerTitle: string;
  matrixDensity: number;
  matrixSize: number;
  matrixHoverSize: number;
  matrixColor: string;
  matrixMoving: boolean;
  matrixMouseEffect: boolean;
  matrixTwinkleEffect: boolean;
  matrixTwinkleSpeed: number;
  headerPosition: "top" | "left";
  dashboardWidth: 1 | 2 | 3 | 4 | 5;
  dashboardBgColor: string;
  dashboardBgOpacity: number;
  isGroupsCompactLayout: boolean;
  isSegmentsCompactLayout: boolean;
}

export function useCloudflarePush({
  isFullyReady,
  isDark,
  accent3,
  accent4,
  selectedFont,
  animationsEnabled,
  animationsFps,
  headerAnimationType,
  headerTitle,
  matrixDensity,
  matrixSize,
  matrixHoverSize,
  matrixColor,
  matrixMoving,
  matrixMouseEffect,
  matrixTwinkleEffect,
  matrixTwinkleSpeed,
  headerPosition,
  dashboardWidth,
  dashboardBgColor,
  dashboardBgOpacity,
  isGroupsCompactLayout,
  isSegmentsCompactLayout,
}: UseCloudflarePushProps) {
  const {
    segments,
    groupsOrder,
    groupConfigs,
    groupsCols,
    showToast,
    manualSaveMode,
    incrementUnsavedChanges,
    resetUnsavedChanges,
    automations,
    macros,
    voiceCommands,
    wifiNetworks,
    mqttConfig,
  } = useIoTStore();
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
        last_boot: new Date().toISOString(),
      },
      preferences: {
        theme_mode: isDark ? "dark" : "light",
        accent_color_3: accent3,
        accent_color_4: accent4,
        font_family: selectedFont,
        animations_enabled: animationsEnabled,
        animations_fps: animationsFps,
        header_animation: headerAnimationType,
        header_title: headerTitle,
        matrix_density: matrixDensity,
        matrix_size: matrixSize,
        matrix_hover_size: matrixHoverSize,
        matrix_color: matrixColor,
        matrix_moving: matrixMoving,
        matrix_mouse_effect: matrixMouseEffect,
        matrix_twinkle_effect: matrixTwinkleEffect,
        matrix_twinkle_speed: matrixTwinkleSpeed,
        header_position: headerPosition,
        dashboard_width: dashboardWidth,
        dashboard_bg_color: dashboardBgColor,
        dashboard_bg_opacity: dashboardBgOpacity,
        manual_save_mode: manualSaveMode,
        groups_compact_layout: isGroupsCompactLayout,
        segments_compact_layout: isSegmentsCompactLayout,
      },
      layout: {
        groups_order: groupsOrder,
        groups_cols: groupsCols,
        group_configs: groupConfigs,
      },
      segments: segments,
      automations: automations,
      macros: macros,
      voiceCommands: voiceCommands,
      wifi: {
        networks: wifiNetworks,
      },
      mqtt: mqttConfig || undefined,
      worker_url: getCloudflareWorkerUrl(),
    };

    const result = await saveConfigToCloudflare(currentConfig);
    if (result.success) {
      showToast(result.message, "success");
      resetUnsavedChanges();
    } else {
      showToast(result.message, "error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isFullyReady,
    isDark,
    accent3,
    accent4,
    selectedFont,
    animationsEnabled,
    animationsFps,
    headerAnimationType,
    headerTitle,
    matrixDensity,
    matrixSize,
    matrixHoverSize,
    matrixColor,
    matrixMoving,
    matrixMouseEffect,
    matrixTwinkleEffect,
    matrixTwinkleSpeed,
    headerPosition,
    dashboardWidth,
    dashboardBgColor,
    dashboardBgOpacity,
    isGroupsCompactLayout,
    isSegmentsCompactLayout,
    manualSaveMode,
    segments,
    groupsOrder,
    groupConfigs,
    groupsCols,
    showToast,
    resetUnsavedChanges,
    automations,
    macros,
    voiceCommands,
    wifiNetworks,
    mqttConfig,
  ]);

  useEffect(() => {
    if (!isFullyReady) return;

    // جلوگیری از push در رندر اول (init)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const handler = setTimeout(() => {
      if (manualSaveMode) {
        incrementUnsavedChanges();
      } else {
        triggerCloudflarePush();
      }
    }, 1200);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isFullyReady,
    isDark,
    accent3,
    accent4,
    selectedFont,
    animationsEnabled,
    animationsFps,
    headerAnimationType,
    headerTitle,
    matrixDensity,
    matrixSize,
    matrixHoverSize,
    matrixColor,
    matrixMoving,
    matrixMouseEffect,
    matrixTwinkleEffect,
    matrixTwinkleSpeed,
    headerPosition,
    dashboardWidth,
    dashboardBgColor,
    dashboardBgOpacity,
    isGroupsCompactLayout,
    isSegmentsCompactLayout,
    segments,
    groupsOrder,
    groupConfigs,
    groupsCols,
    automations,
    macros,
    voiceCommands,
    wifiNetworks,
    mqttConfig,
  ]);

  return {
    triggerCloudflarePush,
  };
}
