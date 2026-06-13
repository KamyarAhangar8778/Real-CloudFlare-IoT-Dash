"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { EspConfig, DEFAULT_ESP_CONFIG } from "@/features/iot/services/esp32Config";
import {
  isCloudflareEnabled,
  fetchConfigFromCloudflare,
  saveConfigToCloudflare,
  updatePinOnCloudflare,
  fetchPinsFromCloudflare
} from "@/features/iot/services/cloudflareService";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

export function useAchaemenidState() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModulesMenuOpen, setIsModulesMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Dynamic 3rd and 4th theme color accents (Defaults to Gold & Emerald)
  const [accent3, setAccent3] = useState("#D4AF37");
  const [accent4, setAccent4] = useState("#10B981");

  const [selectedFont, setSelectedFont] = useState("vazir");
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [headerAnimationType, setHeaderAnimationType] = useState<"fade" | "chase">("fade");
  const [headerTitle, setHeaderTitle] = useState("سامانه هوشمند پادشاهی هخامنش");

  // Cuneiform Drift background custom aesthetics (Opacity & Colors)
  const [cuneiformOpacity, setCuneiformOpacity] = useState(0.08); 
  const [cuneiformColor, setCuneiformColor] = useState<"accent3" | "accent4" | "white" | "muted">("accent3");

  // ESP32 Integration Gate and builder states
  const [isEspDrawerOpen, setIsEspDrawerOpen] = useState(false);

  // Layout presentation model: top header or left sidebar
  const [headerPosition, setHeaderPosition] = useState<"top" | "left">("top");

  // Zustand state manager for clean global configurations
  const {
    segments,
    setSegments,
    groupsOrder,
    setGroupsOrder,
    groupConfigs,
    setGroupConfigs,
    groupsCols,
    setGroupsCols,
    pinsState,
    setPinsState,
    isInitialSyncLoading,
    syncProgress,
    syncMessage,
    setSyncStatus,
    lowDataMode,
    setLowDataMode,
    applyEspConfig,
  } = useIoTStore();

  const [isLoadingIoT, setIsLoadingIoT] = useState(false);
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [targetPlaceholderId, setTargetPlaceholderId] = useState<string | null>(null);

  const [mounted, setMounted] = useState(false);
  const [isFullyReady, setIsFullyReady] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const cuneiformColorValue = 
    cuneiformColor === "accent3" ? accent3 :
    cuneiformColor === "accent4" ? accent4 :
    cuneiformColor === "white" ? (isDark ? "#ffffff" : "#1e293b") :
    (isDark ? "#475569" : "#94a3b8");

  // NextJS + TanStack Query for modern client fetching
  const { data: iotData, refetch: refetchIot } = useQuery({
    queryKey: ["iotState", segments.map(s => s.pin).join(",")],
    queryFn: async () => {
      // 1. If Cloudflare is enabled, try to fetch pins from Cloudflare
      if (isCloudflareEnabled()) {
        try {
          const cfPins = await fetchPinsFromCloudflare(segments);
          if (cfPins) {
            return { pins: cfPins };
          }
        } catch (e) {
          console.error("Error fetching pins from Cloudflare:", e);
        }
      }

      return { pins: pinsState };
    },
    refetchInterval: isCloudflareEnabled() && !lowDataMode ? 3000 : false, // Poll every 3 seconds if cloudflare is active and low data mode is off
  });

  // Automatically sync incoming Server updates into our Local Store & cached cache
  useEffect(() => {
    if (iotData && iotData.pins) {
      setPinsState(iotData.pins);
    }
  }, [iotData, setPinsState]);

  // Handle global page initialization loader
  useEffect(() => {
    if (mounted && !isInitialSyncLoading) {
      const timer = setTimeout(() => {
        setIsFullyReady(true);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [mounted, isInitialSyncLoading]);

  // Configuration Parser Engine (تفسیر کننده بومی قالب پیکربندی ESP32)
  const handleApplyEspConfig = (config: EspConfig) => {
    if (!config) return;
    
    // Apply preferences
    setIsDark(config.preferences.theme_mode === "dark");
    setAccent3(config.preferences.accent_color_3);
    setAccent4(config.preferences.accent_color_4);
    setSelectedFont(config.preferences.font_family);
    setAnimationsEnabled(config.preferences.animations_enabled);
    setHeaderAnimationType(config.preferences.header_animation);
    setHeaderTitle(config.preferences.header_title);
    setCuneiformOpacity(config.preferences.cuneiform_opacity);
    setCuneiformColor(config.preferences.cuneiform_color);

    // Apply segments & structure
    applyEspConfig(config);
  };

  // Initial synchronization simulation on dashboard startup - load from Cloudflare if active
  useEffect(() => {
    const initCloudflareSync = async () => {
      if (isCloudflareEnabled()) {
        setSyncStatus(true, 15, "در حال برقراری ارتباط زنده با سرور کلودفلر...");
        try {
          const cfConfig = await fetchConfigFromCloudflare();
          if (cfConfig) {
            handleApplyEspConfig(cfConfig);
            setSyncStatus(false, 100, "همگام‌سازی چیدمان و تنظیمات از کلودفلر انجام شد.");
            setIsFullyReady(true);
            return;
          }
        } catch (e) {
          console.error("Failed to fetch initial configuration from Cloudflare:", e);
        }
      }

      // Offline fallback startup
      setSyncStatus(false, 100, "انتقال داده‌های محلی کامل شد.");
      setIsFullyReady(true);
      handleApplyEspConfig(DEFAULT_ESP_CONFIG);
    };

    initCloudflareSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Synchronize configuration schema to Cloudflare Worker secure KV store
  const triggerCloudflarePush = async () => {
    if (!isCloudflareEnabled() || !isFullyReady) return;
    
    const currentConfig: EspConfig = {
      version: "1.2.0-Achaemenid",
      device: {
        name: "سامانه مرزی پاسارگاد",
        chip: "ESP32-S3-WROOM-1",
        firmware: "v3.4.1-Achaemenid-OS",
        reboot_count: 0,
        last_boot: new Date().toISOString()
      },
      preferences: {
        theme_mode: isDark ? "dark" : "light",
        accent_color_3: accent3,
        accent_color_4: accent4,
        font_family: selectedFont,
        animations_enabled: animationsEnabled,
        header_animation: headerAnimationType,
        header_title: headerTitle,
        cuneiform_opacity: cuneiformOpacity,
        cuneiform_color: cuneiformColor
      },
      layout: {
        groups_order: groupsOrder,
        groups_cols: groupsCols,
        group_configs: groupConfigs
      },
      segments: segments
    };
    
    await saveConfigToCloudflare(currentConfig);
  };

  // Debounced push of layout configuration to Cloudflare on local state change
  useEffect(() => {
    if (!isFullyReady) return;
    
    const handler = setTimeout(() => {
      triggerCloudflarePush();
    }, 1200);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isDark,
    accent3,
    accent4,
    selectedFont,
    animationsEnabled,
    headerAnimationType,
    headerTitle,
    cuneiformOpacity,
    cuneiformColor,
    groupsOrder,
    groupsCols,
    groupConfigs,
    segments,
    isFullyReady
  ]);

  // No mount-time loading from localStorage is needed as state is kept in memory only
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddSegment = (type: string, pin: string, title?: string, group?: string, mode?: "switch" | "push") => {
    // eslint-disable-next-line react-hooks/purity
    const randomId = Math.random().toString(36).substring(2, 9);
    const finalGroup = group || "Test";
    const newSeg = {
      id: randomId,
      type,
      pin,
      title: title || `کنترل پایه دیجیتال (GPIO ${pin})`,
      group: finalGroup,
      mode: mode || "switch",
    };
    
    setGroupsOrder(prev => {
      if (!prev.includes(finalGroup)) {
        return [...prev, finalGroup];
      }
      return prev;
    });

    let updated = [...segments];
    
    if (targetPlaceholderId) {
      const index = updated.findIndex(s => s.id === targetPlaceholderId);
      if (index !== -1) {
        newSeg.group = updated[index].group || "Test";
        updated[index] = newSeg;
      } else {
        updated.push(newSeg);
      }
      setTargetPlaceholderId(null);
    } else {
      updated.push(newSeg);
    }
    
    setSegments(updated);

    if (pinsState[pin] === undefined) {
      updatePinOnServer(pin, false);
    }
  };

  const handleAddPlaceholder = (groupId: string) => {
    const randomId = Math.random().toString(36).substring(2, 9);
    const placeholderSeg = {
      id: randomId,
      type: "placeholder",
      pin: "",
      title: "جایگاه خالی",
      group: groupId,
    };
    
    const updated = [...segments, placeholderSeg];
    setSegments(updated);
  };

  const handleSetupPlaceholder = (id: string) => {
     setTargetPlaceholderId(id);
     setIsModulesMenuOpen(true);
  };

  const handleGroupColsChange = (group: string, maxCols: number) => {
    setGroupConfigs(prev => {
      return { ...prev, [group]: { ...prev[group], maxCols } };
    });
  };

  const handleRemoveSegment = (id: string) => {
    const updated = segments.filter((s) => s.id !== id);
    setSegments(updated);
  };

  const handleUpdateSegmentMode = (id: string, mode: "switch" | "push") => {
    setSegments((prev) => {
      return prev.map((s) => (s.id === id ? { ...s, mode } : s));
    });
  };

  const handleRemoveGroup = (groupId: string) => {
    setGroupsOrder((prev) => {
      return prev.filter((g) => g !== groupId);
    });
    setSegments((prev) => {
      return prev.filter((s) => (s.group || "Test") !== groupId);
    });
  };

  const updatePinOnServer = async (pin: string, pinState: boolean) => {
    try {
      setIsLoadingIoT(true);
      setPinsState((prev) => {
        return { ...prev, [pin]: pinState };
      });

      // Synchronize live pin value with Cloudflare Durable Objects if connected
      if (isCloudflareEnabled()) {
        try {
          await updatePinOnCloudflare(pin, pinState);
        } catch (e) {
          console.error(`Failed to sync pin ${pin} value to Cloudflare:`, e);
        }
      }

      refetchIot();
    } catch (err) {
      console.error("Failed to update pin state in local storage", err);
    } finally {
      setIsLoadingIoT(false);
    }
  };

  const handleTogglePin = async (pin: string) => {
    const nextState = !pinsState[pin];
    setPinsState((prev) => ({ ...prev, [pin]: nextState }));
    await updatePinOnServer(pin, nextState);
  };

  const handleSetPinState = async (pin: string, state: boolean) => {
    setPinsState((prev) => ({ ...prev, [pin]: state }));
    await updatePinOnServer(pin, state);
  };

  const handleBypassSync = () => {
    handleApplyEspConfig(DEFAULT_ESP_CONFIG);
    setSyncStatus(false, 100, "تایید هویت مستقل.");
    setIsFullyReady(true);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const type = active.data.current?.type;
    
    if (type === "Group") {
      setActiveGroupId(active.id as string);
    } else {
      setActiveSegmentId(active.id as string);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (active.data.current?.type === "Group" || over.data.current?.type === "Group") {
      return;
    }

    const activeSeg = segments.find(s => s.id === activeId);
    if (!activeSeg) return;

    const overSeg = segments.find(s => s.id === overId);

    if (overSeg) {
      const activeGroup = activeSeg.group || "Test";
      const overGroup = overSeg.group || "Test";

      if (activeGroup !== overGroup) {
        setSegments((prev) => {
          const activeIndex = prev.findIndex(s => s.id === activeId);
          const overIndex = prev.findIndex(s => s.id === overId);
          if (activeIndex !== -1 && overIndex !== -1) {
            const updated = [...prev];
            updated[activeIndex] = { ...updated[activeIndex], group: overGroup };
            const [moved] = updated.splice(activeIndex, 1);
            updated.splice(overIndex, 0, moved);
            return updated;
          }
          return prev;
        });
      } else {
        setSegments((prev) => {
          const activeIndex = prev.findIndex(s => s.id === activeId);
          const overIndex = prev.findIndex(s => s.id === overId);
          if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
            return arrayMove(prev, activeIndex, overIndex);
          }
          return prev;
        });
      }
    } else {
      const overIdStr = overId.toString();
      let targetGroup = "";
      if (overIdStr.startsWith("group-")) {
        targetGroup = overIdStr.replace("group-", "");
      } else if (groupsOrder.includes(overIdStr)) {
        targetGroup = overIdStr;
      }

      if (targetGroup && (activeSeg.group || "Test") !== targetGroup) {
        setSegments((prev) => {
          const activeIndex = prev.findIndex(s => s.id === activeId);
          if (activeIndex !== -1) {
            const updated = [...prev];
            updated[activeIndex] = { ...updated[activeIndex], group: targetGroup };
            return updated;
          }
          return prev;
        });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveSegmentId(null);
    setActiveGroupId(null);
    const { active, over } = event;
    
    if (over && over.id === "trash-dropzone") {
      const type = active.data.current?.type;
      if (type === "Group") {
        const groupId = active.id.toString().replace("group-", "");
        handleRemoveGroup(groupId);
      } else if (type === "Segment") {
        handleRemoveSegment(active.id.toString());
      }
      return;
    }

    if (!over) {
      return;
    }

    const type = active.data.current?.type;

    if (type === "Group") {
      const activeIdStr = active.id.toString().replace("group-", "");
      const overIdStr = over.id.toString().replace("group-", "");
      
      if (activeIdStr !== overIdStr) {
        setGroupsOrder((prev) => {
          const activeIndex = prev.indexOf(activeIdStr);
          const overIndex = prev.indexOf(overIdStr);
          
          if (activeIndex !== -1 && overIndex !== -1) {
            return arrayMove(prev, activeIndex, overIndex);
          }
          return prev;
        });
      }
      return;
    }
  };

  return {
    isMenuOpen,
    setIsMenuOpen,
    isModulesMenuOpen,
    setIsModulesMenuOpen,
    isDark,
    setIsDark,
    accent3,
    setAccent3,
    accent4,
    setAccent4,
    selectedFont,
    setSelectedFont,
    animationsEnabled,
    setAnimationsEnabled,
    headerAnimationType,
    setHeaderAnimationType,
    headerTitle,
    setHeaderTitle,
    cuneiformOpacity,
    setCuneiformOpacity,
    cuneiformColor,
    setCuneiformColor,
    isEspDrawerOpen,
    setIsEspDrawerOpen,
    headerPosition,
    setHeaderPosition,
    segments,
    groupsOrder,
    groupConfigs,
    groupsCols,
    setGroupsCols,
    pinsState,
    lowDataMode,
    isLoadingIoT,
    activeSegmentId,
    activeGroupId,
    mounted,
    isFullyReady,
    setIsFullyReady,
    syncProgress,
    syncMessage,
    sensors,
    cuneiformColorValue,
    refetchIot,
    handleApplyEspConfig,
    handleAddSegment,
    handleAddPlaceholder,
    handleSetupPlaceholder,
    handleGroupColsChange,
    handleRemoveSegment,
    handleUpdateSegmentMode,
    handleRemoveGroup,
    handleTogglePin,
    handleSetPinState,
    handleBypassSync,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
