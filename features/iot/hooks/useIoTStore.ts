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
  }>;
  groupsOrder: string[];
  groupConfigs: Record<string, { maxCols: number }>;
  groupsCols: number;
  pinsState: Record<string, boolean>;
  isInitialSyncLoading: boolean;
  syncProgress: number;
  syncMessage: string;
  lowDataMode: boolean;

  // Actions
  setSegments: (segments: any[] | ((prev: any[]) => any[])) => void;
  setGroupsOrder: (order: string[] | ((prev: string[]) => string[])) => void;
  setGroupConfigs: (configs: Record<string, { maxCols: number }> | ((prev: Record<string, { maxCols: number }>) => Record<string, { maxCols: number }>)) => void;
  setGroupsCols: (cols: number) => void;
  setPinsState: (pins: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)) => void;
  updateSegmentMode: (id: string, mode: "switch" | "push") => void;
  setSyncStatus: (loading: boolean, progress: number, message: string) => void;
  setLowDataMode: (enabled: boolean) => void;
  applyEspConfig: (config: EspConfig) => void;
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
      const next = typeof groupConfigs === "function" ? groupConfigs(state.groupConfigs) : groupConfigs;
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
      const updated = state.segments.map((seg) =>
        seg.id === id ? { ...seg, mode } : seg
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
    });

    if (Object.keys(importedPins).length > 0) {
      set((state) => {
        const next = { ...state.pinsState, ...importedPins };
        return { pinsState: next };
      });
    }
  },
}));
