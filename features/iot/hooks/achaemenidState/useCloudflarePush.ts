"use client";

import { useCallback, useEffect, useRef } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { isCloudflareEnabled, saveConfigToCloudflare } from "@/features/iot/services/cloudflareService";
import { buildEspConfig } from "./core/buildEspConfig";

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

export function useCloudflarePush(props: UseCloudflarePushProps) {
  const store = useIoTStore();
  const isFirstRender = useRef(true);

  const triggerCloudflarePush = useCallback(async () => {
    if (!isCloudflareEnabled() || !props.isFullyReady) return;

    const currentConfig = buildEspConfig({ ...props, ...store });

    const result = await saveConfigToCloudflare(currentConfig);
    if (result.success) {
      store.showToast(result.message, "success");
      store.resetUnsavedChanges();
    } else {
      store.showToast(result.message, "error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props,
    store.manualSaveMode,
    store.segments,
    store.groupsOrder,
    store.groupConfigs,
    store.groupsCols,
    store.showToast,
    store.resetUnsavedChanges,
    store.automations,
    store.macros,
    store.voiceCommands,
    store.wifiNetworks,
    store.mqttConfig,
  ]);

  useEffect(() => {
    if (!props.isFullyReady) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const handler = setTimeout(() => {
      if (store.manualSaveMode) {
        store.incrementUnsavedChanges();
      } else {
        triggerCloudflarePush();
      }
    }, 1200);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props,
    store.segments,
    store.groupsOrder,
    store.groupConfigs,
    store.groupsCols,
    store.automations,
    store.macros,
    store.voiceCommands,
    store.wifiNetworks,
    store.mqttConfig,
  ]);

  return { triggerCloudflarePush };
}
