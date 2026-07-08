import mqtt from "mqtt";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { getMqttClient, setMqttClient, getMqttSettings, stateCallbacks } from "./client";

// Queue for batched state updates
const pendingStateUpdates = new Map<string, boolean>();
let updateRafId: number | null = null;

const flushStateUpdates = () => {
  updateRafId = null;
  if (pendingStateUpdates.size === 0) return;
  
  const updatesToProcess = new Map(pendingStateUpdates);
  pendingStateUpdates.clear();
  
  stateCallbacks.forEach((cb) => {
    updatesToProcess.forEach((state, pinId) => {
      cb(pinId, state);
    });
  });
};

const queueStateUpdate = (pinId: string, state: boolean) => {
  pendingStateUpdates.set(pinId, state);
  if (!updateRafId && typeof window !== "undefined") {
    updateRafId = requestAnimationFrame(flushStateUpdates);
  }
};

export const initMqtt = () => {
  let client = getMqttClient();
  if (!client) {
    const settings = getMqttSettings();
    const commandTopic = `${settings.baseTopic}/Command`;
    const stateTopic = `${settings.baseTopic}/State`;
    const qos = settings.qos;

    client = mqtt.connect(settings.brokerUrl, {
      clientId: "dashboard_" + Math.random().toString(16).substring(2, 10),
      reconnectPeriod: 5000,
    });
    setMqttClient(client);

    client.on("connect", () => {
      console.log(`[MQTT] Connected to ${settings.brokerUrl}!`);
      client?.subscribe(stateTopic);
      
      queueMicrotask(() => {
        const isPageVisible = useIoTStore.getState().isPageVisible;
        const presenceBuf = new Uint8Array([0x04, isPageVisible ? 0x01 : 0x00]);
        client?.publish(commandTopic, presenceBuf as Buffer, { qos });
      });
    });

    client.on("message", (topic, payload) => {
      if (topic === stateTopic) {
        try {
          if (payload.length > 0) {
            const cmdType = payload[0];
            
            if (cmdType === 0x07) {
              queueMicrotask(() => {
                const isPageVisible = useIoTStore.getState().isPageVisible;
                const presenceBuf = new Uint8Array([0x04, isPageVisible ? 0x01 : 0x00]);
                client?.publish(commandTopic, presenceBuf as Buffer, { qos });
              });
            } 
            else if (cmdType === 0x06 && payload.length >= 3) {
              const pinNum = payload[1];
              const state = payload[2] === 0x01;
              queueStateUpdate(pinNum.toString(), state);
            }
            else if (payload[0] === 123) {
              const data = JSON.parse(payload.toString());
              if (data.command === "ping") {
                queueMicrotask(() => {
                  const isPageVisible = useIoTStore.getState().isPageVisible;
                  const presenceBuf = new Uint8Array([0x04, isPageVisible ? 0x01 : 0x00]);
                  client?.publish(commandTopic, presenceBuf as Buffer, { qos });
                });
              } else if (data.id !== undefined && data.value !== undefined) {
                queueStateUpdate(data.id.toString(), data.value);
              }
            }
          }
        } catch (e) {
          console.error("Failed to parse MQTT state message", e);
        }
      }
    });

    client.on("error", (err) => {
      console.error("[MQTT] Connection error:", err);
    });
  }
};

export const reconnectMqtt = () => {
  const client = getMqttClient();
  if (client) {
    client.end(true);
    setMqttClient(null);
  }
  initMqtt();
};
