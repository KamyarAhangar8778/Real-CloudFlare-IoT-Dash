import mqtt from "mqtt";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { getMqttClient, setMqttClient, getMqttSettings, stateCallbacks } from "./client";

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
      
      const isPageVisible = useIoTStore.getState().isPageVisible;
      const presenceBuf = new Uint8Array([0x04, isPageVisible ? 0x01 : 0x00]);
      client?.publish(commandTopic, presenceBuf as Buffer, { qos });
    });

    client.on("message", (topic, payload) => {
      if (topic === stateTopic) {
        try {
          if (payload.length > 0) {
            const cmdType = payload[0];
            
            if (cmdType === 0x07) {
              const isPageVisible = useIoTStore.getState().isPageVisible;
              const presenceBuf = new Uint8Array([0x04, isPageVisible ? 0x01 : 0x00]);
              client?.publish(commandTopic, presenceBuf as Buffer, { qos });
            } 
            else if (cmdType === 0x06 && payload.length >= 3) {
              const pinNum = payload[1];
              const state = payload[2] === 0x01;
              stateCallbacks.forEach((cb) => cb(pinNum.toString(), state));
            }
            else if (payload[0] === 123) {
              const data = JSON.parse(payload.toString());
              if (data.command === "ping") {
                const isPageVisible = useIoTStore.getState().isPageVisible;
                const presenceBuf = new Uint8Array([0x04, isPageVisible ? 0x01 : 0x00]);
                client?.publish(commandTopic, presenceBuf as Buffer, { qos });
              } else if (data.id !== undefined && data.value !== undefined) {
                stateCallbacks.forEach((cb) => cb(data.id.toString(), data.value));
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
