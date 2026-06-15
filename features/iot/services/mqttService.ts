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

export const publishPinCommand = (pinId: string, value: boolean, timer?: number) => {
  if (!client) {
    initMqtt();
  }

  if (client?.connected) {
    const payloadObj: any = { id: pinId, value };
    if (timer !== undefined) {
      payloadObj.timer = timer;
    }
    const payload = JSON.stringify(payloadObj);
    client.publish("KamyarIoT/Achaemenid/Command", payload, { qos: 1 });
    console.log(`[MQTT] Published command: ${payload}`);
  } else {
    console.warn("[MQTT] Client not connected. Cannot publish.");
  }
};

export const publishAddSegmentCommand = (id: string, type: string, pin: number, value: boolean) => {
  if (!client) initMqtt();
  if (client?.connected) {
    const payload = JSON.stringify({ command: "add_segment", id, type, pin, value });
    client.publish("KamyarIoT/Achaemenid/Command", payload, { qos: 1 });
    console.log(`[MQTT] Published add_segment: ${payload}`);
  }
};

export const publishDeleteSegmentCommand = (id: string) => {
  if (!client) initMqtt();
  if (client?.connected) {
    const payload = JSON.stringify({ command: "delete_segment", id });
    client.publish("KamyarIoT/Achaemenid/Command", payload, { qos: 1 });
    console.log(`[MQTT] Published delete_segment: ${payload}`);
  }
};
