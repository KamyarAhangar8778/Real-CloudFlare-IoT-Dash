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
  isInitialSyncLoading: true,
  syncProgress: 0,
  syncMessage: "در حال جستجوی تراشه ESP32 در شبکه محلی پادشاهی...",
  lowDataMode: false,

  setSegments: (segments) => {
    set((state) => {
      const next = typeof segments === "function" ? segments(state.segments) : segments;
      if (typeof window !== "undefined") {
        localStorage.setItem("achaemenid_dashboard_segments", JSON.stringify(next));
      }
      return { segments: next };
    });
  },

  setGroupsOrder: (groupsOrder) => {
    set((state) => {
      const next = typeof groupsOrder === "function" ? groupsOrder(state.groupsOrder) : groupsOrder;
      if (typeof window !== "undefined") {
        localStorage.setItem("achaemenid_dashboard_groups", JSON.stringify(next));
      }
      return { groupsOrder: next };
    });
  },

  setGroupConfigs: (groupConfigs) => {
    set((state) => {
      const next = typeof groupConfigs === "function" ? groupConfigs(state.groupConfigs) : groupConfigs;
      if (typeof window !== "undefined") {
        localStorage.setItem("achaemenid_dashboard_group_configs", JSON.stringify(next));
      }
      return { groupConfigs: next };
    });
  },

  setGroupsCols: (groupsCols) => {
    set({ groupsCols });
    if (typeof window !== "undefined") {
      localStorage.setItem("achaemenid_dashboard_groups_cols", String(groupsCols));
    }
  },

  setPinsState: (pins) => {
    set((state) => {
      const nextPins = typeof pins === "function" ? pins(state.pinsState) : pins;
      if (typeof window !== "undefined") {
        localStorage.setItem("achaemenid_dashboard_pins_cache", JSON.stringify(nextPins));
      }
      return { pinsState: nextPins };
    });
  },

  updateSegmentMode: (id, mode) => {
    set((state) => {
      const updated = state.segments.map((seg) =>
        seg.id === id ? { ...seg, mode } : seg
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("achaemenid_dashboard_segments", JSON.stringify(updated));
      }
      return { segments: updated };
    });
  },

  setSyncStatus: (isInitialSyncLoading, syncProgress, syncMessage) => {
    set({ isInitialSyncLoading, syncProgress, syncMessage });
  },

  setLowDataMode: (enabled) => {
    set({ lowDataMode: enabled });
    if (typeof window !== "undefined") {
      localStorage.setItem("achaemenid_low_data_mode", String(enabled));
    }
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
        if (typeof window !== "undefined") {
          localStorage.setItem("achaemenid_dashboard_pins_cache", JSON.stringify(next));
        }
        return { pinsState: next };
      });
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("achaemenid_dashboard_segments", JSON.stringify(config.segments));
      localStorage.setItem("achaemenid_dashboard_groups", JSON.stringify(config.layout.groups_order));
      localStorage.setItem("achaemenid_dashboard_group_configs", JSON.stringify(config.layout.group_configs));
      localStorage.setItem("achaemenid_dashboard_groups_cols", String(config.layout.groups_cols || 1));
      localStorage.setItem("achaemenid_header_anim", config.preferences.header_animation);
      localStorage.setItem("achaemenid_header_title", config.preferences.header_title);
    }
  },
}));
