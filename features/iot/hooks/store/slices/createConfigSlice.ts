import { StateCreator } from "zustand";
import { IoTStoreState, ConfigSlice } from "../types";

export const createConfigSlice: StateCreator<IoTStoreState, [], [], ConfigSlice> = (set) => ({
  applyEspConfig: (config) => {
    if (!config) return;

    set({
      segments: config.segments,
      groupsOrder: config.layout.groups_order,
      groupConfigs: config.layout.group_configs,
      groupsCols: config.layout.groups_cols || 1,
      automations: config.automations || [],
      macros: config.macros || [],
      voiceCommands: config.voiceCommands || [],
      wifiNetworks: config.wifi?.networks || [],
    });

    if (config.mqtt && typeof window !== "undefined") {
      set({ mqttConfig: config.mqtt });
      const { broker_ws_url, base_topic, qos } = config.mqtt;
      let changed = false;
      
      if (broker_ws_url && broker_ws_url !== localStorage.getItem("mqtt_broker_url")) {
        localStorage.setItem("mqtt_broker_url", broker_ws_url);
        changed = true;
      }
      if (base_topic && base_topic !== localStorage.getItem("mqtt_base_topic")) {
        localStorage.setItem("mqtt_base_topic", base_topic);
        changed = true;
      }
      if (qos !== undefined && qos.toString() !== localStorage.getItem("mqtt_qos")) {
        localStorage.setItem("mqtt_qos", qos.toString());
        changed = true;
      }
      
      if (changed) {
        import("@/features/iot/services/mqttService")
          .then((m) => {
            if (m.reconnectMqtt) m.reconnectMqtt();
          })
          .catch((e) => console.error("Failed to load mqttService for reconnect:", e));
      }
    }

    const importedPins: Record<string, boolean> = {};
    config.segments.forEach((s) => {
      if (s.pin && s.state !== undefined) {
        importedPins[s.pin] = s.state;
      }
      
      // Backward compatibility for old rule schema
      if (s.rule && "targetPin" in s.rule) {
        const oldRule: any = s.rule;
        const triggerState = oldRule.triggerState ?? true;
        
        s.rule = {
          highActions: triggerState && oldRule.targetPin ? [{
            reqHold: 0,
            targetPin: oldRule.targetPin,
            actionOn: oldRule.actionState ?? true,
            actionType: 0,
            delay: 0
          }] : [],
          lowActions: !triggerState && oldRule.targetPin ? [{
            reqHold: 0,
            targetPin: oldRule.targetPin,
            actionOn: oldRule.actionState ?? false,
            actionType: 0,
            delay: 0
          }] : []
        };
      } else if (s.rule && "targetPinHigh" in s.rule) {
        const oldRule: any = s.rule;
        s.rule = {
          highActions: oldRule.targetPinHigh ? [{
            reqHold: oldRule.reqHoldHigh || 0,
            targetPin: oldRule.targetPinHigh,
            actionOn: oldRule.actionOnHigh ?? true,
            actionType: oldRule.actionTypeHigh || 0,
            delay: oldRule.delayHigh || 0
          }] : [],
          lowActions: oldRule.targetPinLow ? [{
            reqHold: oldRule.reqHoldLow || 0,
            targetPin: oldRule.targetPinLow,
            actionOn: oldRule.actionOnLow ?? false,
            actionType: oldRule.actionTypeLow || 0,
            delay: oldRule.delayLow || 0
          }] : []
        };
      } else if (s.rule) {
        // Ensure arrays exist
        if (!s.rule.highActions) s.rule.highActions = [];
        if (!s.rule.lowActions) s.rule.lowActions = [];
      }
    });

    if (Object.keys(importedPins).length > 0) {
      set((state) => {
        const next = { ...state.pinsState, ...importedPins };
        return { pinsState: next };
      });
    }
  },
});
