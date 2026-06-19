import { create } from "zustand";
import { EspConfig } from "@/features/iot/services/esp32Config";

interface IoTStoreState {
  segments: Array<{
    id: string;
    type: string;
    pin: string;
    title: string;
    group: string;
    state?: boolean;
    mode?: "switch" | "push";
    auto_off?: number;
    rule?: {
      targetPinHigh: string;
      actionOnHigh: boolean;
      actionTypeHigh?: number;
      delayHigh?: number;
      reqHoldHigh?: number;
      targetPinLow: string;
      actionOnLow: boolean;
      actionTypeLow?: number;
      delayLow?: number;
      reqHoldLow?: number;
    };
  }>;
  groupsOrder: string[];
  groupConfigs: Record<string, { maxCols: number }>;
  groupsCols: number;
  pinsState: Record<string, boolean>;
  isInitialSyncLoading: boolean;
  syncProgress: number;
  syncMessage: string;
  lowDataMode: boolean;
  manualSaveMode: boolean;
  unsavedChangesCount: number;

  // Actions
  setSegments: (segments: any[] | ((prev: any[]) => any[])) => void;
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
    targetPinHigh: string; 
    actionOnHigh: boolean; 
    actionTypeHigh?: number;
    delayHigh?: number;
    reqHoldHigh?: number;
    targetPinLow: string; 
    actionOnLow: boolean;
    actionTypeLow?: number;
    delayLow?: number;
    reqHoldLow?: number;
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

  applyEspConfig: (config) => {
    if (!config) return;

    set({
      segments: config.segments,
      groupsOrder: config.layout.groups_order,
      groupConfigs: config.layout.group_configs,
      groupsCols: config.layout.groups_cols || 1,
    });

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
          targetPinHigh: triggerState ? oldRule.targetPin : "",
          actionOnHigh: triggerState ? oldRule.actionState : true,
          actionTypeHigh: 0,
          delayHigh: 0,
          targetPinLow: !triggerState ? oldRule.targetPin : "",
          actionOnLow: !triggerState ? oldRule.actionState : false,
          actionTypeLow: 0,
          delayLow: 0,
          reqHoldHigh: 0,
          reqHoldLow: 0,
        };
      } else if (s.rule) {
        // Ensure new properties exist
        if (s.rule.actionTypeHigh === undefined) s.rule.actionTypeHigh = 0;
        if (s.rule.delayHigh === undefined) s.rule.delayHigh = 0;
        if (s.rule.reqHoldHigh === undefined) s.rule.reqHoldHigh = 0;
        if (s.rule.actionTypeLow === undefined) s.rule.actionTypeLow = 0;
        if (s.rule.delayLow === undefined) s.rule.delayLow = 0;
        if (s.rule.reqHoldLow === undefined) s.rule.reqHoldLow = 0;
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
