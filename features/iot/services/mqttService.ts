import mqtt, { MqttClient } from "mqtt";

let client: MqttClient | null = null;

export const initMqtt = () => {
  if (!client) {
    // استفاده از broker.emqx.io چون داشبورد نیازمند اتصال WebSocket ایمن (WSS) است.
    client = mqtt.connect("wss://broker.emqx.io:8084/mqtt", {
      clientId: "dashboard_" + Math.random().toString(16).substr(2, 8),
      reconnectPeriod: 5000,
    });

    client.on("connect", () => {
      console.log("[MQTT] Connected to EMQX via WSS!");
    });

    client.on("error", (err) => {
      console.error("[MQTT] Connection error:", err);
    });
  }
};

export const publishPinCommand = (pinId: string, value: boolean) => {
  if (!client) {
    initMqtt();
  }
  
  if (client?.connected) {
    const payload = JSON.stringify({ id: pinId, value });
    client.publish("KamyarIoT/Achaemenid/Command", payload, { qos: 1 });
    console.log(`[MQTT] Published command: ${payload}`);
  } else {
    console.warn("[MQTT] Client not connected. Cannot publish.");
  }
};
