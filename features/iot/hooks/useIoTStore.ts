import { create } from "zustand";
import { EspConfig } from "@/features/iot/services/esp32Config";

interface IoTStoreState {
  segments: Array<{
    id: string;
    type: string;
    pin: string;
    title: string;
    group: string;
    icon?: string;
    state?: boolean;
    mode?: "switch" | "push";
    auto_off?: number;
    rule?: {
      highActions?: Array<{
        reqHold: number;
        targetPin: string;
        actionOn: boolean;
        actionType?: number;
        delay?: number;
      }>;
      lowActions?: Array<{
        reqHold: number;
        targetPin: string;
        actionOn: boolean;
        actionType?: number;
        delay?: number;
      }>;
    };
  }>;
  groupsOrder: string[];
  groupConfigs: Record<string, { maxCols: number; icon?: string }>;
  groupsCols: number;
  pinsState: Record<string, boolean>;
  isInitialSyncLoading: boolean;
  syncProgress: number;
  syncMessage: string;
  lowDataMode: boolean;
  manualSaveMode: boolean;
  unsavedChangesCount: number;
  automations: Array<{
    id: string;
    title: string;
    time: string;
    days: number[];
    enabled: boolean;
    repeatCount?: number;
    intervalMinutes?: number;
    conditionType?: 'time' | 'weather';
    city?: string;
    temperatureThreshold?: number;
    temperatureCondition?: 'greater' | 'less';
    actions: Array<{
      targetPin?: string;
      targetMacro?: string;
      actionOn?: boolean;
    }>;
  }>;
  macros: Array<{
    id: string;
    title: string;
    icon?: string;
    actions: Array<{
      targetPin: string;
      actionOn: boolean;
    }>;
  }>;

  voiceCommands: Array<{
    id: string;
    phrase: string;
    actions: Array<{
      targetPin?: string;
      targetMacro?: string;
      actionOn?: boolean;
    }>;
  }>;
  wifiNetworks: Array<{
    id: string;
    ssid: string;
    password?: string;
  }>;
  mqttConfig: {
    broker_ws_url: string;
    broker_host: string;
    broker_port: number;
    base_topic: string;
    qos: 0 | 1 | 2;
  } | null;
  selectedGroupFilter: string | null;
  isPageVisible: boolean;
  // Actions
  setSegments: (segments: any[] | ((prev: any[]) => any[])) => void;
  setSelectedGroupFilter: (group: string | null) => void;
  setIsPageVisible: (visible: boolean) => void;
  setGroupsOrder: (order: string[] | ((prev: string[]) => string[])) => void;
  setGroupConfigs: (
    configs:
      | Record<string, { maxCols: number }>
      | ((prev: Record<string, { maxCols: number }>) => Record<string, { maxCols: number }>),
  ) => void;
  setGroupsCols: (cols: number) => void;
  setPinsState: (
    pins: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>),
  ) => void;
  updateSegmentMode: (id: string, mode: "switch" | "push") => void;
  updateSegmentRule: (id: string, rule: {
    highActions?: Array<{
      reqHold: number;
      targetPin: string;
      actionOn: boolean;
      actionType?: number;
      delay?: number;
    }>;
    lowActions?: Array<{
      reqHold: number;
      targetPin: string;
      actionOn: boolean;
      actionType?: number;
      delay?: number;
    }>;
  }) => void;
  setSyncStatus: (loading: boolean, progress: number, message: string) => void;
  setLowDataMode: (enabled: boolean) => void;
  toast: { message: string; type: "success" | "error" } | null;
  showToast: (message: string, type: "success" | "error") => void;
  clearToast: () => void;
  applyEspConfig: (config: EspConfig) => void;
  setManualSaveMode: (enabled: boolean) => void;
  incrementUnsavedChanges: () => void;
  resetUnsavedChanges: () => void;
  setAutomations: (
    automations: any[] | ((prev: any[]) => any[]),
  ) => void;
  setMacros: (
    macros: any[] | ((prev: any[]) => any[]),
  ) => void;
  setVoiceCommands: (
    voiceCommands: any[] | ((prev: any[]) => any[]),
  ) => void;
  setWifiNetworks: (
    networks: any[] | ((prev: any[]) => any[]),
  ) => void;
  isListening: boolean;
  setIsListening: (b: boolean) => void;
  voiceTranscript: string;
  setVoiceTranscript: (t: string) => void;
  setMqttConfig: (config: any) => void;
}

export const useIoTStore = create<IoTStoreState>((set, get) => ({
  segments: [],
  groupsOrder: [],
  groupConfigs: {},
  groupsCols: 1,
  pinsState: {},
  isInitialSyncLoading: false,
  syncProgress: 0,
  syncMessage: "در حال جستجوی تراشه ESP32 در شبکه محلی پادشاهی...",
  lowDataMode: false,
  manualSaveMode: false,
  unsavedChangesCount: 0,
  toast: null,
  automations: [],
  macros: [],
  voiceCommands: [],
  wifiNetworks: [],
  mqttConfig: null,
  isListening: false,
  voiceTranscript: "",
  selectedGroupFilter: null,
  isPageVisible: true,

  setSelectedGroupFilter: (group) => {
    set({ selectedGroupFilter: group });
  },

  setIsPageVisible: (visible) => {
    set({ isPageVisible: visible });
  },

  setSegments: (segments) => {
    set((state) => {
      const next = typeof segments === "function" ? segments(state.segments) : segments;
      return { segments: next };
    });
  },

  setGroupsOrder: (groupsOrder) => {
    set((state) => {
      const next = typeof groupsOrder === "function" ? groupsOrder(state.groupsOrder) : groupsOrder;
      return { groupsOrder: next };
    });
  },

  setGroupConfigs: (groupConfigs) => {
    set((state) => {
      const next =
        typeof groupConfigs === "function" ? groupConfigs(state.groupConfigs) : groupConfigs;
      return { groupConfigs: next };
    });
  },

  setGroupsCols: (groupsCols) => {
    set({ groupsCols });
  },

  setPinsState: (pins) => {
    set((state) => {
      const nextPins = typeof pins === "function" ? pins(state.pinsState) : pins;
      return { pinsState: nextPins };
    });
  },

  updateSegmentMode: (id, mode) => {
    set((state) => {
      const updated = state.segments.map((seg) => (seg.id === id ? { ...seg, mode } : seg));
      return { segments: updated };
    });
  },

  updateSegmentRule: (id, rule) => {
    set((state) => {
      const updated = state.segments.map((seg) =>
        seg.id === id ? { ...seg, rule } : seg
      );
      return { segments: updated };
    });
  },

  setSyncStatus: (isInitialSyncLoading, syncProgress, syncMessage) => {
    set({ isInitialSyncLoading, syncProgress, syncMessage });
  },

  setLowDataMode: (enabled) => {
    set({ lowDataMode: enabled });
  },

  showToast: (message, type) => {
    set({ toast: { message, type } });
  },

  clearToast: () => {
    set({ toast: null });
  },

  setManualSaveMode: (enabled) => {
    set({ manualSaveMode: enabled });
  },

  incrementUnsavedChanges: () => {
    set((state) => ({ unsavedChangesCount: state.unsavedChangesCount + 1 }));
  },

  resetUnsavedChanges: () => {
    set({ unsavedChangesCount: 0 });
  },

  setAutomations: (automations) => {
    set((state) => {
      const next = typeof automations === "function" ? automations(state.automations) : automations;
      return { automations: next };
    });
  },

  setMacros: (macros) => {
    set((state) => {
      const next = typeof macros === "function" ? macros(state.macros) : macros;
      return { macros: next };
    });
  },

  setVoiceCommands: (voiceCommands) => {
    set((state) => {
      const next = typeof voiceCommands === "function" ? voiceCommands(state.voiceCommands) : voiceCommands;
      return { voiceCommands: next };
    });
  },

  setWifiNetworks: (networks) => {
    set((state) => {
      const next = typeof networks === "function" ? networks(state.wifiNetworks) : networks;
      return { wifiNetworks: next };
    });
  },

  setIsListening: (b) => set({ isListening: b }),
  setVoiceTranscript: (t) => set({ voiceTranscript: t }),
  setMqttConfig: (config) => set({ mqttConfig: config }),
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
}));
