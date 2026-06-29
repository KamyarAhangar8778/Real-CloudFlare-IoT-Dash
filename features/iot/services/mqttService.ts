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

export const getMqttSettings = () => {
  if (typeof window === 'undefined') {
    return {
      brokerUrl: "wss://broker.emqx.io:8084/mqtt",
      baseTopic: "KamyarIoT/Achaemenid",
      qos: 1 as 0 | 1 | 2
    };
  }
  
  return {
    brokerUrl: localStorage.getItem("mqtt_broker_url") || "wss://broker.emqx.io:8084/mqtt",
    baseTopic: localStorage.getItem("mqtt_base_topic") || "KamyarIoT/Achaemenid",
    qos: (parseInt(localStorage.getItem("mqtt_qos") || "1", 10) as 0 | 1 | 2)
  };
};

/**
 * CUSTOM BINARY PROTOCOL DEFINITION:
 * Extensibility Note: The first byte defines the Command Type (CMD). 
 * This makes it fully backward-compatible if new commands are added later.
 * 
 * CMD 0x01: Toggle Pin [cmd(1), pin(1), state(1), timer(4, int32 little-endian)]
 * CMD 0x02: Add Segment [cmd(1), pin(1), state(1), id(null-term), type(null-term)]
 * CMD 0x03: Delete Segment [cmd(1), id(null-term)]
 * CMD 0x04: Dashboard Presence [cmd(1), status(1)]
 * CMD 0x05: Update Rule [cmd(1), id(null-term), highCount(1), [highActions(11 each)], lowCount(1), [lowActions(11 each)]]
 * CMD 0x06: State Report (ESP->DB) [cmd(1), pin(1), state(1)]
 * CMD 0x07: Ping (ESP->DB) [cmd(1)]
 */

export const initMqtt = () => {
  if (!client) {
    const settings = getMqttSettings();
    const commandTopic = `${settings.baseTopic}/Command`;
    const stateTopic = `${settings.baseTopic}/State`;
    const qos = settings.qos;

    client = mqtt.connect(settings.brokerUrl, {
      clientId: "dashboard_" + Math.random().toString(16).substring(2, 10),
      reconnectPeriod: 5000,
    });

    client.on("connect", () => {
      console.log(`[MQTT] Connected to ${settings.brokerUrl}!`);
      client?.subscribe(stateTopic);
      
      // Announce presence immediately (CMD 0x04: Dashboard Presence)
      const presenceBuf = new Uint8Array([0x04, 0x01]);
      client?.publish(commandTopic, presenceBuf as Buffer, { qos });
    });

    client.on("message", (topic, payload) => {
      if (topic === stateTopic) {
        try {
          if (payload.length > 0) {
            const cmdType = payload[0];
            
            // CMD 0x07: Ping from ESP
            if (cmdType === 0x07) {
              const presenceBuf = new Uint8Array([0x04, 0x01]);
              client?.publish(commandTopic, presenceBuf as Buffer, { qos });
            } 
            // CMD 0x06: State Report
            else if (cmdType === 0x06 && payload.length >= 3) {
              const pinNum = payload[1];
              const state = payload[2] === 0x01;
              stateCallbacks.forEach((cb) => cb(pinNum.toString(), state));
            }
            // Fallback for legacy JSON (if first char is '{')
            else if (payload[0] === 123) {
              const data = JSON.parse(payload.toString());
              if (data.command === "ping") {
                const presenceBuf = new Uint8Array([0x04, 0x01]);
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
  if (client) {
    client.end(true);
    client = null;
  }
  initMqtt();
};

export const publishPinCommand = (pinId: string, value: boolean, timer?: number) => {
  if (!client) initMqtt();

  if (client?.connected) {
    const settings = getMqttSettings();
    const commandTopic = `${settings.baseTopic}/Command`;
    
    // CMD 0x01: Toggle Pin [cmd(1), pin(1), state(1), timer(4)] = 7 bytes
    const buf = new Uint8Array(7);
    const view = new DataView(buf.buffer);
    buf[0] = 0x01;
    buf[1] = parseInt(pinId, 10) || 0;
    buf[2] = value ? 0x01 : 0x00;
    view.setInt32(3, timer !== undefined ? timer : -1, true); // true = little-endian
    
    client.publish(commandTopic, buf as Buffer, { qos: settings.qos });
    console.log(`[MQTT Binary] Published toggle command: pin=${buf[1]} state=${value} timer=${timer}`);
  } else {
    console.warn("[MQTT] Client not connected. Cannot publish.");
  }
};

export const publishAddSegmentCommand = (id: string, type: string, pin: number, value: boolean) => {
  if (!client) initMqtt();
  if (client?.connected) {
    const settings = getMqttSettings();
    const commandTopic = `${settings.baseTopic}/Command`;
    
    // CMD 0x02: Add Segment [cmd(1), pin(1), state(1), id(null-term), type(null-term)]
    const idBytes = new TextEncoder().encode(id);
    const typeBytes = new TextEncoder().encode(type);
    
    const buf = new Uint8Array(3 + idBytes.length + 1 + typeBytes.length + 1);
    buf[0] = 0x02;
    buf[1] = pin;
    buf[2] = value ? 0x01 : 0x00;
    
    let offset = 3;
    buf.set(idBytes, offset); offset += idBytes.length;
    buf[offset++] = 0; // null term
    buf.set(typeBytes, offset); offset += typeBytes.length;
    buf[offset++] = 0; // null term

    client.publish(commandTopic, buf as Buffer, { qos: settings.qos });
    console.log(`[MQTT Binary] Published add_segment: pin=${pin} id=${id}`);
  }
};

export const publishDeleteSegmentCommand = (id: string) => {
  if (!client) initMqtt();
  if (client?.connected) {
    const settings = getMqttSettings();
    const commandTopic = `${settings.baseTopic}/Command`;
    
    // CMD 0x03: Delete Segment [cmd(1), id(null-term)]
    const idBytes = new TextEncoder().encode(id);
    const buf = new Uint8Array(1 + idBytes.length + 1);
    buf[0] = 0x03;
    buf.set(idBytes, 1);
    buf[1 + idBytes.length] = 0; // null term
    
    client.publish(commandTopic, buf as Buffer, { qos: settings.qos });
    console.log(`[MQTT Binary] Published delete_segment: id=${id}`);
  }
};

export const publishUpdateRuleCommand = (
  id: string, 
  highActions: Array<{
    reqHold: number;
    targetPin: string;
    actionOn: boolean;
    actionType?: number;
    delay?: number;
  }> = [],
  lowActions: Array<{
    reqHold: number;
    targetPin: string;
    actionOn: boolean;
    actionType?: number;
    delay?: number;
  }> = []
) => {
  if (!client) initMqtt();
  if (client?.connected) {
    const settings = getMqttSettings();
    const commandTopic = `${settings.baseTopic}/Command`;
    const idBytes = new TextEncoder().encode(id);
    
    // CMD 0x05: Update Rule 
    // Size = cmd(1) + id + null(1) + highCount(1) + (high*11) + lowCount(1) + (low*11)
    const bufSize = 1 + idBytes.length + 1 + 1 + (highActions.length * 11) + 1 + (lowActions.length * 11);
    const buf = new Uint8Array(bufSize);
    const view = new DataView(buf.buffer);
    
    buf[0] = 0x05;
    let offset = 1;
    buf.set(idBytes, offset); offset += idBytes.length;
    buf[offset++] = 0; // null term
    
    buf[offset++] = highActions.length;
    highActions.forEach(a => {
        // targetPin(1), reqHold(4), actionOn(1), actionType(1), delay(4) = 11 bytes
        buf[offset++] = parseInt(a.targetPin || "-1", 10) & 0xFF;
        view.setInt32(offset, a.reqHold || 0, true); offset += 4;
        buf[offset++] = a.actionOn ? 1 : 0;
        buf[offset++] = a.actionType || 0;
        view.setInt32(offset, a.delay || 0, true); offset += 4;
    });
    
    buf[offset++] = lowActions.length;
    lowActions.forEach(a => {
        buf[offset++] = parseInt(a.targetPin || "-1", 10) & 0xFF;
        view.setInt32(offset, a.reqHold || 0, true); offset += 4;
        buf[offset++] = a.actionOn ? 1 : 0;
        buf[offset++] = a.actionType || 0;
        view.setInt32(offset, a.delay || 0, true); offset += 4;
    });

    client.publish(commandTopic, buf as Buffer, { qos: settings.qos });
    console.log(`[MQTT Binary] Published update_rule: id=${id} size=${bufSize}b`);
  }
};
