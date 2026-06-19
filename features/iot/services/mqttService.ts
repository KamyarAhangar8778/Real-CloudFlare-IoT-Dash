import mqtt, { MqttClient } from "mqtt";

let client: MqttClient | null = null;

type StateChangeCallback = (pinId: string, state: boolean) => void;
const stateCallbacks: StateChangeCallback[] = [];

export const onMqttStateChange = (cb: StateChangeCallback) => {
  stateCallbacks.push(cb);
  return () => {
    const idx = stateCallbacks.indexOf(cb);
    if (idx > -1) stateCallbacks.splice(idx, 1);
  };
};

export const initMqtt = () => {
  if (!client) {
    // استفاده از broker.emqx.io چون داشبورد نیازمند اتصال WebSocket ایمن (WSS) است.
    client = mqtt.connect("wss://broker.emqx.io:8084/mqtt", {
      clientId: "dashboard_" + Math.random().toString(16).substr(2, 8),
      reconnectPeriod: 5000,
    });

    client.on("connect", () => {
      console.log("[MQTT] Connected to EMQX via WSS!");
      client?.subscribe("KamyarIoT/Achaemenid/State");
      // Announce presence immediately upon connection
      client?.publish(
        "KamyarIoT/Achaemenid/Command",
        JSON.stringify({ command: "dashboard_presence", status: "online" }),
        { qos: 1 }
      );
    });

    client.on("message", (topic, payload) => {
      if (topic === "KamyarIoT/Achaemenid/State") {
        try {
          const data = JSON.parse(payload.toString());
          if (data.command === "ping") {
            client?.publish(
              "KamyarIoT/Achaemenid/Command",
              JSON.stringify({ command: "dashboard_presence", status: "online" }),
              { qos: 1 }
            );
          } else if (data.id !== undefined && data.value !== undefined) {
            stateCallbacks.forEach((cb) => cb(data.id.toString(), data.value));
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

export const publishUpdateRuleCommand = (
  id: string, 
  targetPinHigh: string, 
  actionOnHigh: boolean, 
  actionTypeHigh: number = 0,
  delayHigh: number = 0,
  reqHoldHigh: number = 0,
  targetPinLow: string, 
  actionOnLow: boolean,
  actionTypeLow: number = 0,
  delayLow: number = 0,
  reqHoldLow: number = 0
) => {
  if (!client) initMqtt();
  if (client?.connected) {
    const payload = JSON.stringify({ 
      command: "update_rule", 
      id, 
      targetPinHigh: parseInt(targetPinHigh || "-1", 10), 
      actionOnHigh,
      actionTypeHigh,
      delayHigh,
      reqHoldHigh,
      targetPinLow: parseInt(targetPinLow || "-1", 10),
      actionOnLow,
      actionTypeLow,
      delayLow,
      reqHoldLow
    });
    client.publish("KamyarIoT/Achaemenid/Command", payload, { qos: 1 });
    console.log(`[MQTT] Published update_rule: ${payload}`);
  }
};
