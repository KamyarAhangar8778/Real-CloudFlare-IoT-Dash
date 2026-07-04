import { MqttClient } from "mqtt";

export let client: MqttClient | null = null;

export type StateChangeCallback = (pinId: string, state: boolean) => void;
export const stateCallbacks: StateChangeCallback[] = [];

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

export const getMqttClient = () => client;
export const setMqttClient = (newClient: MqttClient | null) => {
  client = newClient;
};
