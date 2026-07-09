import { isCloudflareEnabled, updatePinOnCloudflare, updateBatchPinsOnCloudflare } from "@/features/iot/services/cloudflareService";
import { publishPinCommand, publishBatchPinCommand } from "@/features/iot/services/mqttService";

export async function syncSinglePin(pin: string, state: boolean, preventMqtt: boolean, autoOff: number | undefined, isPushMode: boolean, showToast: any) {
  // داشبورد web فقط از MQTT استفاده می‌کند (Local WS مخصوص اپ موبایل است)
  if (!preventMqtt) {
    publishPinCommand(pin, state, autoOff);
  }

  if (isCloudflareEnabled() && !isPushMode) {
    try {
      const result = await updatePinOnCloudflare(pin, state);
      if (result.success) {
        showToast(result.message, "success");
      } else {
        showToast(result.message, "error");
      }
    } catch (e) {
      console.error(`Failed to sync pin ${pin} value to Cloudflare:`, e);
    }
  }
}

export async function syncBatchPins(actions: any[], segments: any[], isCfEnabled: boolean, showToast: any) {
  const mqttActions: { pin: string; state: boolean; timer?: number }[] = [];
  const cfActions: { pin: string; state: boolean }[] = [];

  for (const action of actions) {
    const segment = segments.find((s: any) => s.pin === action.targetPin);
    mqttActions.push({ pin: action.targetPin, state: action.actionOn, timer: segment?.auto_off });

    if (isCfEnabled && segment?.mode !== "push") {
      cfActions.push({ pin: action.targetPin, state: action.actionOn });
    }
  }

  // داشبورد web فقط از MQTT استفاده می‌کند
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
    }
  }
}
