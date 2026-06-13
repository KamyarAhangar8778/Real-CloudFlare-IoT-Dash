"use client";

import { useState } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { isCloudflareEnabled, updatePinOnCloudflare } from "@/features/iot/services/cloudflareService";

interface UsePinOperationsProps {
  refetchIot: () => void;
}

export function usePinOperations({ refetchIot }: UsePinOperationsProps) {
  const { pinsState, setPinsState } = useIoTStore();
  const [isLoadingIoT, setIsLoadingIoT] = useState(false);

  const updatePinOnServer = async (pin: string, pinState: boolean) => {
    try {
      setIsLoadingIoT(true);
      setPinsState((prev) => ({ ...prev, [pin]: pinState }));

      if (isCloudflareEnabled()) {
        try {
          await updatePinOnCloudflare(pin, pinState);
        } catch (e) {
          console.error(`Failed to sync pin ${pin} value to Cloudflare:`, e);
        }
      }

      refetchIot();
    } catch (err) {
      console.error("Failed to update pin state", err);
    } finally {
      setIsLoadingIoT(false);
    }
  };

  const handleTogglePin = async (pin: string) => {
    const nextState = !pinsState[pin];
    setPinsState((prev) => ({ ...prev, [pin]: nextState }));
    await updatePinOnServer(pin, nextState);
  };

  const handleSetPinState = async (pin: string, state: boolean) => {
    setPinsState((prev) => ({ ...prev, [pin]: state }));
    await updatePinOnServer(pin, state);
  };

  return {
    isLoadingIoT,
    updatePinOnServer,
    handleTogglePin,
    handleSetPinState,
  };
}
