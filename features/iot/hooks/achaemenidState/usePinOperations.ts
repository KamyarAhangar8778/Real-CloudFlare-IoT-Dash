"use client";

import { useState, useEffect } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import {
  isCloudflareEnabled,
  updatePinOnCloudflare,
  updateBatchPinsOnCloudflare,
} from "@/features/iot/services/cloudflareService";
import { publishPinCommand, publishBatchPinCommand, initMqtt, onMqttStateChange } from "@/features/iot/services/mqttService";
import { soundManager } from "@/lib/audio";

interface UsePinOperationsProps {
  refetchIot: () => void;
}

export function usePinOperations({ refetchIot }: UsePinOperationsProps) {
  const { pinsState, setPinsState, showToast } = useIoTStore();
  const [isLoadingIoT, setIsLoadingIoT] = useState(false);

  useEffect(() => {
    initMqtt();
    const unsubscribe = onMqttStateChange((pin, state) => {
      setPinsState((prev) => ({ ...prev, [pin]: state }));
    });
    return () => unsubscribe();
  }, [setPinsState]);

  const updatePinOnServer = async (
    pin: string,
    pinState: boolean,
    preventMqtt: boolean = false,
    timer?: number,
  ) => {
    setIsLoadingIoT(true);
    try {
      setPinsState((prev) => ({ ...prev, [pin]: pinState }));

      if (!preventMqtt) {
        // انتشار فرمان سریعاً در MQTT (سرعت بالا بدون منتظر ماندن برای سرور)
        publishPinCommand(pin, pinState, timer);
      }

      const segment = useIoTStore.getState().segments.find((s) => s.pin === pin);
      const isPushMode = segment?.mode === "push";

      if (isCloudflareEnabled() && !isPushMode) {
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
    if (nextState) soundManager.playToggleOn();
    else soundManager.playToggleOff();
    setPinsState((prev) => ({ ...prev, [pin]: nextState }));
    const segment = useIoTStore.getState().segments.find((s) => s.pin === pin);
    await updatePinOnServer(pin, nextState, false, segment?.auto_off);
  };

  const handleSetPinState = async (pin: string, state: boolean, preventMqtt: boolean = false) => {
    if (state !== pinsState[pin]) {
      if (state) soundManager.playToggleOn();
      else soundManager.playToggleOff();
    }
    setPinsState((prev) => ({ ...prev, [pin]: state }));
    const segment = useIoTStore.getState().segments.find((s) => s.pin === pin);
    await updatePinOnServer(pin, state, preventMqtt, segment?.auto_off);
  };

  const handleBatchPinState = async (actions: Array<{ targetPin: string; actionOn: boolean }>) => {
    setIsLoadingIoT(true);
    try {
      let soundPlayed = false;
      const stateUpdates: Record<string, boolean> = {};
      const mqttActions: Array<{ pin: string; state: boolean; timer?: number }> = [];
      const cfActions: Array<{ pin: string; state: boolean }> = [];

      for (const action of actions) {
        if (action.actionOn !== pinsState[action.targetPin]) {
          soundPlayed = true;
        }
        stateUpdates[action.targetPin] = action.actionOn;
        
        const segment = useIoTStore.getState().segments.find((s) => s.pin === action.targetPin);
        
        mqttActions.push({
          pin: action.targetPin,
          state: action.actionOn,
          timer: segment?.auto_off
        });

        if (isCloudflareEnabled() && segment?.mode !== "push") {
          cfActions.push({ pin: action.targetPin, state: action.actionOn });
        }
      }

      if (soundPlayed) soundManager.playToggleOn();
      
      setPinsState((prev) => ({ ...prev, ...stateUpdates }));
      
      publishBatchPinCommand(mqttActions);

      if (cfActions.length > 0) {
        try {
          const result = await updateBatchPinsOnCloudflare(cfActions);
          if (result.success) {
            showToast(result.message, "success");
          } else {
            showToast(result.message, "error");
          }
        } catch (e) {
          console.error(`Failed to batch sync pins to Cloudflare:`, e);
          showToast(`تغییرات گروهی بنا به دلایل فنی ذخیره نشد.`, "error");
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
      await refetchIot();
    } catch (error) {
      console.error("Failed to update batch pin values:", error);
    } finally {
      setIsLoadingIoT(false);
    }
  };

  return {
    isLoadingIoT,
    updatePinOnServer,
    handleTogglePin,
    handleSetPinState,
    handleBatchPinState,
  };
}
