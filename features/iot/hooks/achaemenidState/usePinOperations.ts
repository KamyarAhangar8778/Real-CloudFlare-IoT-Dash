"use client";

import { useState } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { isCloudflareEnabled, updatePinOnCloudflare } from "@/features/iot/services/cloudflareService";

interface UsePinOperationsProps {
  refetchIot: () => void;
}

export function usePinOperations({ refetchIot }: UsePinOperationsProps) {
  const { pinsState, setPinsState, showToast } = useIoTStore();
  const [isLoadingIoT, setIsLoadingIoT] = useState(false);

  const updatePinOnServer = async (pin: string, pinState: boolean) => {
    setIsLoadingIoT(true);
    try {
      setPinsState((prev) => ({ ...prev, [pin]: pinState }));

      if (isCloudflareEnabled()) {
        try {
          const result = await updatePinOnCloudflare(pin, pinState);
          if (result.success) {
            showToast(result.message, "success");
          } else {
            showToast(result.message, "error");
          }
        } catch (e) {
          console.error(`Failed to sync pin ${pin} value to Cloudflare:`, e);
          showToast(`تغییرات پین ${pin} بنا به دلایل فنی ذخیره نشد.`, "error");
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
      await refetchIot();
    } catch (error) {
      console.error("Failed to update pin value:", error);
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
