"use client";

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
    targetPlaceholderId,
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
    handleRemoveGroup,
    handleRemoveSegment,
  });

  return {
    ...menu,
    ...aesthetic,
    isLoadingIoT,
    mounted,
    refetchIot,
    isFullyReady,
    setIsFullyReady,
    ...dnd,
    targetPlaceholderId,
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
  };
}
