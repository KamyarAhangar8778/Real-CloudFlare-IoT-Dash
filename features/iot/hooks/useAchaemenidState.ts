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
    aesthetic.setHeaderAnimationType(config.preferences.header_animation);
    aesthetic.setHeaderTitle(config.preferences.header_title);
    aesthetic.setCuneiformOpacity(config.preferences.cuneiform_opacity);
    aesthetic.setCuneiformColor(config.preferences.cuneiform_color);
    store.applyEspConfig(config);
  };

  const { isFullyReady, setIsFullyReady, handleBypassSync } = useCloudflareInit({
    mounted,
    handleApplyEspConfig,
  });

  useCloudflarePush({
    isFullyReady,
    ...aesthetic,
  });

  const {
    isLoadingIoT,
    updatePinOnServer,
    handleTogglePin,
    handleSetPinState,
  } = usePinOperations({ refetchIot });

  const {
    handleAddSegment,
    handleAddPlaceholder,
    handleSetupPlaceholder,
    handleGroupColsChange,
    handleRemoveSegment,
    handleUpdateSegmentMode,
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
    handleRemoveGroup,
    handleTogglePin,
    handleSetPinState,
    handleBypassSync,
  };
}
