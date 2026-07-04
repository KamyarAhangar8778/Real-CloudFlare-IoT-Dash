"use client";

import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { useAestheticState } from "./achaemenidState/useAestheticState";
import { useEspMenuState } from "./achaemenidState/useEspMenuState";
import { usePinOperations } from "./achaemenidState/usePinOperations";
import { useSegmentManagement } from "./achaemenidState/useSegmentManagement";
import { useSegmentUpdates } from "./achaemenidState/useSegmentUpdates";
import { useCloudflareQuery } from "./achaemenidState/useCloudflareQuery";
import { useCloudflareInit } from "./achaemenidState/useCloudflareInit";
import { useCloudflarePush } from "./achaemenidState/useCloudflarePush";
import { useAchaemenidDnd } from "./achaemenidState/useAchaemenidDnd";
import { useApplyEspConfig } from "./achaemenidState/useApplyEspConfig";

export function useAchaemenidState() {
  const store = useIoTStore();
  const aesthetic = useAestheticState();
  const menu = useEspMenuState();

  const { mounted, refetchIot } = useCloudflareQuery();
  const { handleApplyEspConfig } = useApplyEspConfig(aesthetic);

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
    handleRemoveGroup,
  } = useSegmentManagement({
    setIsModulesMenuOpen: menu.setIsModulesMenuOpen,
    updatePinOnServer,
  });

  const {
    handleUpdateSegmentMode,
    handleUpdateSegmentRule,
    handleUpdateSegmentAutoOff,
  } = useSegmentUpdates();

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
