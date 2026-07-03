"use client";

import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { useAestheticState } from "./achaemenidState/useAestheticState";
import { useEspMenuState } from "./achaemenidState/useEspMenuState";
import { usePinOperations } from "./achaemenidState/usePinOperations";
import { useSegmentManagement } from "./achaemenidState/useSegmentManagement";
import { useCloudflareQuery } from "./achaemenidState/useCloudflareQuery";
import { useCloudflareInit } from "./achaemenidState/useCloudflareInit";
import { useCloudflarePush } from "./achaemenidState/useCloudflarePush";
import { useAchaemenidDnd } from "./achaemenidState/useAchaemenidDnd";
import { EspConfig } from "@/features/iot/services/esp32Config";

export function useAchaemenidState() {
  const store = useIoTStore();
  const aesthetic = useAestheticState();
  const menu = useEspMenuState();

  const { mounted, refetchIot } = useCloudflareQuery();

  const handleApplyEspConfig = (config: EspConfig) => {
    if (!config) return;
    aesthetic.setIsDark(config.preferences.theme_mode === "dark");
    aesthetic.setAccent3(config.preferences.accent_color_3);
    aesthetic.setAccent4(config.preferences.accent_color_4);
    aesthetic.setSelectedFont(config.preferences.font_family);
    aesthetic.setAnimationsEnabled(config.preferences.animations_enabled);
    if (config.preferences.animations_fps !== undefined) aesthetic.setAnimationsFps(config.preferences.animations_fps);
    aesthetic.setHeaderAnimationType(config.preferences.header_animation);
    aesthetic.setHeaderTitle(config.preferences.header_title);
    if (config.preferences.matrix_density !== undefined) aesthetic.setMatrixDensity(config.preferences.matrix_density);
    if (config.preferences.matrix_size !== undefined) aesthetic.setMatrixSize(config.preferences.matrix_size);
    if (config.preferences.matrix_hover_size !== undefined) aesthetic.setMatrixHoverSize(config.preferences.matrix_hover_size);
    if (config.preferences.matrix_color !== undefined) aesthetic.setMatrixColor(config.preferences.matrix_color);
    if (config.preferences.matrix_moving !== undefined) aesthetic.setMatrixMoving(config.preferences.matrix_moving);
    if (config.preferences.matrix_mouse_effect !== undefined) aesthetic.setMatrixMouseEffect(config.preferences.matrix_mouse_effect);
    if (config.preferences.matrix_twinkle_effect !== undefined) aesthetic.setMatrixTwinkleEffect(config.preferences.matrix_twinkle_effect);
    if (config.preferences.matrix_twinkle_speed !== undefined) aesthetic.setMatrixTwinkleSpeed(config.preferences.matrix_twinkle_speed);
    if (config.preferences.header_position) {
      aesthetic.setHeaderPosition(config.preferences.header_position);
    }
    if (config.preferences.dashboard_bg_color) {
      aesthetic.setDashboardBgColor(config.preferences.dashboard_bg_color);
    }
    if (config.preferences.dashboard_bg_opacity !== undefined) {
      aesthetic.setDashboardBgOpacity(config.preferences.dashboard_bg_opacity);
    }
    if (config.preferences.dashboard_width) {
      aesthetic.setDashboardWidth(config.preferences.dashboard_width);
    }
    if (config.preferences.manual_save_mode !== undefined) {
      store.setManualSaveMode(config.preferences.manual_save_mode);
    }
    if (config.preferences.groups_compact_layout !== undefined) {
      aesthetic.setIsGroupsCompactLayout(config.preferences.groups_compact_layout);
    }
    if (config.preferences.segments_compact_layout !== undefined) {
      aesthetic.setIsSegmentsCompactLayout(config.preferences.segments_compact_layout);
    }
    store.applyEspConfig(config);
  };

  const {
    isFullyReady,
    setIsFullyReady,
    handleBypassSync,
    workerUrl,
    setWorkerUrl,
    handleRetrySync,
  } = useCloudflareInit({
    mounted,
    handleApplyEspConfig,
  });

  const { triggerCloudflarePush } = useCloudflarePush({
    isFullyReady,
    ...aesthetic,
  });

  const { isLoadingIoT, updatePinOnServer, handleTogglePin, handleSetPinState, handleBatchPinState } = usePinOperations({
    refetchIot,
  });

  const {
    handleAddSegment,
    handleAddPlaceholder,
    handleSetupPlaceholder,
    handleGroupColsChange,
    handleRemoveSegment,
    handleUpdateSegmentMode,
    handleUpdateSegmentRule,
    handleUpdateSegmentAutoOff,
    handleRemoveGroup,
  } = useSegmentManagement({
    setIsModulesMenuOpen: menu.setIsModulesMenuOpen,
    updatePinOnServer,
  });

  const dnd = useAchaemenidDnd({
    segments: store.segments,
    setSegments: store.setSegments,
    groupsOrder: store.groupsOrder,
    setGroupsOrder: store.setGroupsOrder,
    handleRemoveGroup,
    handleRemoveSegment,
  });

  return {
    ...menu,
    ...aesthetic,
    ...store,
    isLoadingIoT,
    mounted,
    refetchIot,
    isFullyReady,
    setIsFullyReady,
    ...dnd,
    handleApplyEspConfig,
    handleAddSegment,
    handleAddPlaceholder,
    handleSetupPlaceholder,
    handleGroupColsChange,
    handleRemoveSegment,
    handleUpdateSegmentMode,
    handleUpdateSegmentRule,
    handleUpdateSegmentAutoOff,
    handleRemoveGroup,
    handleTogglePin,
    handleSetPinState,
    handleBatchPinState,
    handleBypassSync,
    workerUrl,
    setWorkerUrl,
    handleRetrySync,
    triggerCloudflarePush,
    automations: store.automations,
    setAutomations: store.setAutomations,
    macros: store.macros,
    setMacros: store.setMacros,
  };
}
