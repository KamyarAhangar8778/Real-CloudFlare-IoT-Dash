"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import { Cpu, WifiOff } from "lucide-react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { persianSymbols, PersianSymbol } from "@/features/encyclopedia/data/symbols";
import { 
  CLIP_DIAGONAL_TL_BR, 
  CLIP_DIAGONAL_TR_BL,
  BUTTON_CLIP
} from "@/lib/presets";
import dynamic from "next/dynamic";

const SettingsDrawer = dynamic(() => import("@/features/settings/components/SettingsDrawer"), { ssr: false });
const ModulesDrawer = dynamic(() => import("@/features/iot/components/ModulesDrawer"), { ssr: false });
const EspSyncDrawer = dynamic(() => import("@/features/iot/components/EspSyncDrawer"), { ssr: false });
import { EspConfig, DEFAULT_ESP_CONFIG } from "@/features/iot/services/esp32Config";
import SortableSegmentCard from "@/features/iot/components/SortableSegmentCard";
import SortableGroup from "@/features/iot/components/SortableGroup";
import TrashDropZone from "@/features/iot/components/TrashDropZone";
import { SortableContext, verticalListSortingStrategy, rectSortingStrategy } from "@dnd-kit/sortable";

import MasterHeader from "@/components/MasterHeader";
import WelcomePortal from "@/features/iot/components/WelcomePortal";
import EncyclopediaSection from "@/features/encyclopedia/components/EncyclopediaSection";

export default function Home() {
  return (
    <React.Suspense fallback={
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0b0c10] text-[#c5a880] select-none font-sans">
        <div className="relative w-16 h-16 flex items-center justify-center mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-amber-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-t-amber-500 border-r-transparent animate-spin" />
          <div className="w-5 h-5 bg-amber-500 rotate-45 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
        </div>
        <h3 className="text-sm font-sans font-black tracking-widest text-[#c5a880] uppercase">
          سامانه هوشمند هخامنشی
        </h3>
        <p className="text-[10px] text-gray-500 font-mono tracking-wider mt-2 animate-pulse uppercase">
          Achaemenid IoT System Connecting...
        </p>
      </div>
    }>
      <AchaemenidDashboard />
    </React.Suspense>
  );
}

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

function AchaemenidDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Sync state with URL Query Params (Server-First state synchronization)
  const symbolParam = searchParams.get("symbol") || "";
  const selectedSymbol = persianSymbols.find((s) => s.id === symbolParam) || persianSymbols[0];

  const setSelectedSymbol = (sym: PersianSymbol) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("symbol", sym.id);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModulesMenuOpen, setIsModulesMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isSymbolsSectionExpanded, setIsSymbolsSectionExpanded] = useState(false);

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

  // NextJS + TanStack Query for modern client fetching (with Low Data Mode Support)
  const { data: iotData, refetch: refetchIot, isPending } = useQuery({
    queryKey: ["iotState"],
    queryFn: async () => {
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("achaemenid_dashboard_pins_cache");
        if (cached) {
          try {
            return { pins: JSON.parse(cached) };
          } catch (e) {
            console.error("Error parsing local pins cache", e);
          }
        }
      }
      return { pins: pinsState };
    },
    refetchInterval: false, // Purely client-side standalone mode, no background polling needed
  });

  // Automatically sync incoming Server updates into our Local Store & cached cache
  useEffect(() => {
    if (iotData && iotData.pins) {
      setPinsState(iotData.pins);
    }
  }, [iotData, setPinsState]);

  // Handle global page initialization loader
  useEffect(() => {
    if (mounted && !isInitialSyncLoading && (!isPending || iotData)) {
      const timer = setTimeout(() => {
        setIsFullyReady(true);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [mounted, isInitialSyncLoading, isPending, iotData]);

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

  // Initial synchronization simulation on dashboard startup - wait for ESP packet
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    
    const startSyncSequence = async () => {
      let currentProgress = 0;
      progressInterval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 14) + 6;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(progressInterval);
        }
        setSyncStatus(currentProgress < 100, currentProgress, getSyncMessage(currentProgress));
      }, 140);

      await new Promise(r => setTimeout(r, 600));
      setSyncStatus(true, 30, "ارتباط با موفقیت بر روی ردیف رادیویی برقرار شد. بازیابی فایل config.json...");
      
      await new Promise(r => setTimeout(r, 800));
      setSyncStatus(true, 70, "دریافت بسته‌ها کامل شد. موتور تولیدگر در حال تفصیر آرایه‌های قالب JSON است...");

      await new Promise(r => setTimeout(r, 700));
      
      const savedSegments = localStorage.getItem("achaemenid_dashboard_segments");
      if (!savedSegments) {
        // If they have no saved configuration, we dynamically apply the DEFAULT_ESP_CONFIG!
        handleApplyEspConfig(DEFAULT_ESP_CONFIG);
      }
      
      setSyncStatus(false, 100, "انتقال داده‌ها کامل شد.");
    };

    const getSyncMessage = (prog: number) => {
      if (prog < 30) return "در حال جستجوی تراشه ESP32 در شبکه محلی پادشاهی...";
      if (prog < 70) return "ارتباط با موفقیت بر روی ردیف رادیویی برقرار شد. بازیابی فایل config.json...";
      return "دریافت بسته‌ها کامل شد. موتور تولیدگر در حال تفصیر آرایه‌های قالب JSON است...";
    };

    startSyncSequence();

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load segments from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSegments = localStorage.getItem("achaemenid_dashboard_segments");
      const savedGroups = localStorage.getItem("achaemenid_dashboard_groups");
      const savedConfigs = localStorage.getItem("achaemenid_dashboard_group_configs");
      let initialSegments = [];
      if (savedSegments) {
        try {
          initialSegments = JSON.parse(savedSegments);
          setSegments(initialSegments);
        } catch (e) {
          console.error("Error loading segments", e);
        }
      }
      
      if (savedGroups) {
         try {
            setGroupsOrder(JSON.parse(savedGroups));
         } catch(e) {
            console.error("Error loading groups", e);
         }
      } else {
         const uniqueGroups = Array.from(new Set(initialSegments.map((s: any) => s.group || "Test"))) as string[];
         setGroupsOrder(uniqueGroups);
      }

      if (savedConfigs) {
         try {
            setGroupConfigs(JSON.parse(savedConfigs));
         } catch(e) {
            console.error("Error loading group configs", e);
         }
      }

      const savedGroupsCols = localStorage.getItem("achaemenid_dashboard_groups_cols");
      if (savedGroupsCols) {
         setGroupsCols(parseInt(savedGroupsCols, 10) || 1);
      }

      const savedHeaderAnim = localStorage.getItem("achaemenid_header_anim");
      if (savedHeaderAnim === "fade" || savedHeaderAnim === "chase") {
        setHeaderAnimationType(savedHeaderAnim);
      }

      const savedLowDataMode = localStorage.getItem("achaemenid_low_data_mode");
      if (savedLowDataMode) {
        setLowDataMode(savedLowDataMode === "true");
      }

      const savedHeaderTitle = localStorage.getItem("achaemenid_header_title");
      if (savedHeaderTitle) {
        setHeaderTitle(savedHeaderTitle);
      }

      const savedHeaderPos = localStorage.getItem("cloudflare_layout_header_position");
      if (savedHeaderPos === "top" || savedHeaderPos === "left") {
        setHeaderPosition(savedHeaderPos);
      }

      const savedPinsState = localStorage.getItem("achaemenid_dashboard_pins_cache");
      if (savedPinsState) {
        try {
          setPinsState(JSON.parse(savedPinsState));
        } catch (e) {
          console.error("Error loading cached pins state", e);
        }
      }
    }
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
        const newGroups = [...prev, finalGroup];
        if (typeof window !== "undefined") {
          localStorage.setItem("achaemenid_dashboard_groups", JSON.stringify(newGroups));
        }
        return newGroups;
      }
      return prev;
    });

    let updated = [...segments];
    
    if (targetPlaceholderId) {
      const index = updated.findIndex(s => s.id === targetPlaceholderId);
      if (index !== -1) {
        newSeg.group = updated[index].group || "Test"; // Keep the group of the placeholder
        updated[index] = newSeg;
      } else {
        updated.push(newSeg);
      }
      setTargetPlaceholderId(null);
    } else {
      updated.push(newSeg);
    }
    
    setSegments(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("achaemenid_dashboard_segments", JSON.stringify(updated));
    }

    // Provision the pin on the server with initial state (false)
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
    if (typeof window !== "undefined") {
      localStorage.setItem("achaemenid_dashboard_segments", JSON.stringify(updated));
    }
  };

  const handleSetupPlaceholder = (id: string) => {
     setTargetPlaceholderId(id);
     setIsModulesMenuOpen(true);
  };

  const handleGroupColsChange = (group: string, maxCols: number) => {
    setGroupConfigs(prev => {
      const updated = { ...prev, [group]: { ...prev[group], maxCols } };
      if (typeof window !== "undefined") {
        localStorage.setItem("achaemenid_dashboard_group_configs", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleRemoveSegment = (id: string) => {
    const updated = segments.filter((s) => s.id !== id);
    setSegments(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("achaemenid_dashboard_segments", JSON.stringify(updated));
    }
  };

  const handleUpdateSegmentMode = (id: string, mode: "switch" | "push") => {
    setSegments((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, mode } : s));
      if (typeof window !== "undefined") {
        localStorage.setItem("achaemenid_dashboard_segments", JSON.stringify(next));
      }
      return next;
    });
  };

  const handleRemoveGroup = (groupId: string) => {
    setGroupsOrder((prev) => {
      const updated = prev.filter((g) => g !== groupId);
      if (typeof window !== "undefined") {
        localStorage.setItem("achaemenid_dashboard_groups", JSON.stringify(updated));
      }
      return updated;
    });
    setSegments((prev) => {
      const updated = prev.filter((s) => (s.group || "Test") !== groupId);
      if (typeof window !== "undefined") {
        localStorage.setItem("achaemenid_dashboard_segments", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updatePinOnServer = async (pin: string, pinState: boolean) => {
    try {
      setIsLoadingIoT(true);
      setPinsState((prev) => {
        const next = { ...prev, [pin]: pinState };
        if (typeof window !== "undefined") {
          localStorage.setItem("achaemenid_dashboard_pins_cache", JSON.stringify(next));
        }
        return next;
      });
      refetchIot();
    } catch (err) {
      console.error("Failed to update pin state in local storage", err);
    } finally {
      setIsLoadingIoT(false);
    }
  };

  const handleTogglePin = async (pin: string) => {
    const nextState = !pinsState[pin];
    // Optimistic UI toggle state
    setPinsState((prev) => ({ ...prev, [pin]: nextState }));
    await updatePinOnServer(pin, nextState);
  };

  const handleSetPinState = async (pin: string, state: boolean) => {
    setPinsState((prev) => ({ ...prev, [pin]: state }));
    await updatePinOnServer(pin, state);
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
      if (typeof window !== "undefined") {
        setSegments((prev) => {
          localStorage.setItem("achaemenid_dashboard_segments", JSON.stringify(prev));
          return prev;
        });
        setGroupsOrder((prev) => {
          localStorage.setItem("achaemenid_dashboard_groups", JSON.stringify(prev));
          return prev;
        });
      }
      return;
    }

    const type = active.data.current?.type;

    // Handle Group Reordering
    if (type === "Group") {
      const activeIdStr = active.id.toString().replace("group-", "");
      const overIdStr = over.id.toString().replace("group-", "");
      
      if (activeIdStr !== overIdStr) {
        setGroupsOrder((prev) => {
          const activeIndex = prev.indexOf(activeIdStr);
          const overIndex = prev.indexOf(overIdStr);
          
          if (activeIndex !== -1 && overIndex !== -1) {
            const newGroups = arrayMove(prev, activeIndex, overIndex);
            if (typeof window !== "undefined") {
              localStorage.setItem("achaemenid_dashboard_groups", JSON.stringify(newGroups));
            }
            return newGroups;
          }
          return prev;
        });
      }
      return;
    }

    // Handle Segment Reordering
    if (type === "Segment") {
      const activeId = active.id;
      const overId = over.id;

      if (activeId !== overId) {
        setSegments((prev) => {
          const activeSeg = prev.find(s => s.id === activeId);
          const overSeg = prev.find(s => s.id === overId);
          
          // Enforce rule: segments can only be reordered within the same group
          if (activeSeg && overSeg && (activeSeg.group || "Test") === (overSeg.group || "Test")) {
            const activeIndex = prev.findIndex(s => s.id === activeId);
            const overIndex = prev.findIndex(s => s.id === overId);
            
            let newSegs = prev;
            if (overIndex !== -1 && activeIndex !== -1) {
              newSegs = arrayMove(prev, activeIndex, overIndex);
            }
            
            if (typeof window !== "undefined") {
              localStorage.setItem("achaemenid_dashboard_segments", JSON.stringify(newSegs));
            }
            return newSegs;
          }
          return prev;
        });
      }
    }
  };

  if (!mounted) {
    return (
      <div 
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden" 
        style={{ 
          background: "radial-gradient(ellipse_at_center, #0c0f1d 0%, #030408 100%)"
        }}
      >
        <div className="relative w-20 h-20 mb-8 shrink-0 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/50 animate-spin" style={{ animationDuration: "12s" }} />
          <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>

        <div className="space-y-3 max-w-lg">
          <h3 className="text-lg font-bold tracking-wide font-sans text-white">
            داشبورد هوشمند اینترنت اشیا
          </h3>
          <p className="text-xs text-slate-400">
            در حال بارگذاری ایمن ماژول‌ها و منابع سیستم...
          </p>

          <div className="w-48 h-1 bg-black/50 border border-gray-800/60 rounded-full overflow-hidden mx-auto mt-2">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500" style={{ width: "45%" }} />
          </div>
        </div>
      </div>
    );
  }

  // Optimized native cursors used for max performance across all devices.
  const defaultCursorSvg = "";
  const pointerCursorSvg = "";

  // Synchronized with local assets and presets

  return (
    <MotionConfig reducedMotion={animationsEnabled ? "user" : "always"}>
      <div className="theme-bg-main theme-text-secondary min-h-screen overflow-x-hidden relative font-sans leading-relaxed selection:bg-[var(--accent3-transparent)] selection:text-[var(--accent3)] transition-colors duration-500">
        
        {/* Fullscreen Initial ESP32 Configuration Sync Overlay */}
        <AnimatePresence>
          {!isFullyReady && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden"
              style={{
                background: "radial-gradient(ellipse_at_center, #0c0f1d 0%, #030408 100%)",
                fontFamily: "var(--font-vazir)"
              }}
            >
              {/* Modern rotating loading ring */}
              <div className="relative w-24 h-24 mb-6 shrink-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-dashed border-cyan-500/40"
                />
                <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
              </div>

              {/* Loader description & Persian Title */}
              <div className="space-y-3 max-w-lg">
                <h3 className="text-xl font-bold text-white tracking-wide font-sans">
                  سامانه یکپارچه مانیتورینگ اینترنت اشیا
                </h3>
                <p className="text-xs text-slate-400">
                  {syncMessage}
                </p>

                {/* Progress bar container */}
                <div className="w-64 h-1 bg-black/50 border border-gray-800/60 rounded-full overflow-hidden mx-auto relative mt-2">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${syncProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                
                <div className="text-[10px] text-zinc-500 font-mono">
                  {syncProgress}% • CONNECTED ON STANDALONE_PORT
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => {
                      const savedSegments = localStorage.getItem("achaemenid_dashboard_segments");
                      if (!savedSegments) {
                        handleApplyEspConfig(DEFAULT_ESP_CONFIG);
                      }
                      setSyncStatus(false, 100, "تایید هویت مستقل.");
                      setIsFullyReady(true);
                    }}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all text-[10px] font-bold"
                    style={{ clipPath: BUTTON_CLIP }}
                  >
                    دور زدن و ورود آفلاین (Standalone)
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4-Color system custom parameters generated dynamically & Dual Theme Variable solvers */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Lalezar&family=Vazirmatn:wght@100..900&family=JetBrains+Mono:wght@100..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Space+Grotesk:wght@300..700&family=Cairo:wght@200..1000&family=Amiri:ital,wght@0,400..700;1,400..700&family=Changa:wght@200..800&family=Reem+Kufi:wght@400..700&display=swap');

          /* Custom cursor personalizations */
          html, body {
            cursor: url("${defaultCursorSvg}"), auto;
          }
          a, button, select, input, [role="button"], .cursor-pointer, [draggable="true"] {
            cursor: url("${pointerCursorSvg}"), pointer !important;
          }

          /* Dropdown, Input, & Form Beautifications */
          select, input, textarea {
            transition: border-color 0.3s, box-shadow 0.3s, background-color 0.3s !important;
          }
          select:focus, input:focus, textarea:focus {
            border-color: var(--accent4) !important;
            box-shadow: 0 0 12px var(--accent4-transparent) !important;
            outline: none;
          }
          select:hover, input:hover {
            border-color: var(--accent3) !important;
          }
          select option {
            background-color: ${isDark ? "#080c14" : "#ffffff"} !important;
            color: ${isDark ? "var(--text-primary)" : "#1e293b"} !important;
            padding: 12px !important;
            font-size: 13px !important;
          }

          /* Custom Royal scrollbar styling */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          ::-webkit-scrollbar-track {
            background: var(--bg-main);
          }
          ::-webkit-scrollbar-thumb {
            background: var(--accent3-medium);
            border-radius: 4px;
            border: 2px solid var(--bg-main);
          }
          ::-webkit-scrollbar-thumb:hover {
            background: var(--accent3);
          }

          :root {
            /* Selected Font Custom Configuration */
            --font-vazir: 'Vazirmatn', sans-serif;
            --font-lalezar: 'Lalezar', cursive;
            --font-mono: 'JetBrains Mono', monospace;
            --font-playfair: 'Playfair Display', serif;
            --font-space: 'Space Grotesk', sans-serif;
            --font-cairo: 'Cairo', sans-serif;
            --font-amiri: 'Amiri', serif;
            --font-changa: 'Changa', sans-serif;
            --font-reem: 'Reem Kufi', sans-serif;

            --selected-font: ${
              selectedFont === "vazir" ? "var(--font-vazir)" :
              selectedFont === "lalezar" ? "var(--font-lalezar)" :
              selectedFont === "mono" ? "var(--font-mono)" :
              selectedFont === "playfair" ? "var(--font-playfair)" :
              selectedFont === "space" ? "var(--font-space)" :
              selectedFont === "cairo" ? "var(--font-cairo)" :
              selectedFont === "amiri" ? "var(--font-amiri)" :
              selectedFont === "changa" ? "var(--font-changa)" :
              selectedFont === "reem" ? "var(--font-reem)" : "var(--font-vazir)"
            };

            --accent3: ${accent3};
            --accent4: ${accent4};
            --accent3-transparent: ${accent3}18;
            --accent4-transparent: ${accent4}18;
            --accent3-medium: ${accent3}44;
            --accent4-medium: ${accent4}44;
            --accent3-heavy: ${accent3}99;
            --accent4-heavy: ${accent4}99;

            /* Dynamic Theme Solvers */
            --bg-main: ${isDark ? "#050609" : "#f4f5f7"};
            --bg-gradient-from: ${isDark ? "#0d0f19" : "#ebedf0"};
            --bg-gradient-via: ${isDark ? "#050608" : "#f3f4f6"};
            --bg-gradient-to: ${isDark ? "#010203" : "#fcfdfe"};

            --card-bg: ${isDark ? "rgba(9, 11, 17, 0.55)" : "rgba(252, 253, 254, 0.65)"};
            --card-bg-solid: ${isDark ? "#0b0c13" : "#fbfcfd"};
            --card-hover-bg: ${isDark ? "rgba(12, 14, 22, 0.7)" : "rgba(241, 243, 247, 0.8)"};

            --text-primary: ${isDark ? "#ffffff" : "#090a10"};
            --text-secondary: ${isDark ? "#e2e8f0" : "#2d3748"};
            --text-tertiary: ${isDark ? "#94a3b8" : "#4a5568"};
            --text-muted: ${isDark ? "#64748b" : "#718096"};

            --border-color: ${isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(9, 10, 16, 0.1)"};
            --drawer-gradient-from: ${isDark ? "#090a10" : "#fcfdfe"};
            --drawer-gradient-to: ${isDark ? "#020304" : "#ecf0f5"};
          }

          html, body, button, h1, h2, h3, h4, h5, h6, select, span, input, textarea, .font-sans {
            font-family: var(--selected-font) !important;
          }

          /* Active Performance Settings - Disabling CSS animations on demmand */
          ${!animationsEnabled ? `
            *, *::before, *::after {
              animation-delay: 0s !important;
              animation-duration: 0s !important;
              animation-iteration-count: 1 !important;
              transition-delay: 0s !important;
              transition-duration: 0s !important;
              animation: none !important;
              transition: none !important;
            }
          ` : ""}

          ${isDark ? `
            div:nth-of-type(2) > div:nth-of-type(4) > main:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) {
              background-color: var(--card-bg) !important;
            }
            div:nth-of-type(2) > div:nth-of-type(4) > main:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(5) {
              background-color: var(--card-bg) !important;
            }
          ` : ""}

          .theme-bg-main { background-color: var(--bg-main); }
        .theme-text-primary { color: var(--text-primary); }
        .theme-text-secondary { color: var(--text-secondary); }
        .theme-text-tertiary { color: var(--text-tertiary); }
        .theme-text-muted { color: var(--text-muted); }
        .theme-card-bg { background-color: var(--card-bg); }
        .theme-card-bg-solid { background-color: var(--card-bg-solid); }
        .theme-card-hover-bg { background-color: var(--card-hover-bg); }
        .theme-border { border-color: var(--border-color); }

        .text-accent3 { color: var(--accent3); }
        .text-accent4 { color: var(--accent4); }
        .bg-accent3 { background-color: var(--accent3); }
        .bg-accent4 { background-color: var(--accent4); }
        .border-accent3 { border-color: var(--accent3); }
        .border-accent4 { border-color: var(--accent4); }
        .border-accent3-medium { border-color: var(--accent3-medium); }
        .border-accent4-medium { border-color: var(--accent4-medium); }

        @keyframes golden-royal-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .golden-royal-text-shimmer {
          background: linear-gradient(
            120deg,
            var(--accent3) 0%,
            ${isDark ? "#ffd700" : "#d4af37"} 25%,
            var(--accent3) 50%,
            ${isDark ? "#ffffff" : "#b8860b"} 75%,
            var(--accent3) 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          animation: golden-royal-shimmer 5s linear infinite;
        }

        @keyframes header-glow {
          0%, 100% {
            filter: drop-shadow(0 0 1px rgba(212, 175, 55, 0.1));
            opacity: 0.95;
          }
          50% {
            filter: drop-shadow(0 0 6px var(--accent3-medium));
            opacity: 1;
          }
        }
        .header-noble-glow {
          animation: header-glow 4s ease-in-out infinite;
          background-size: 200% auto;
        }

        /* Static background image to eliminate frame-rate drops and constant page repaints */
        .cuneiform-scroll-container {
          background-position: center;
        }
      `}</style>

      {/* Absolute Luxurious Persepolis Stone Relief Background Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--bg-gradient-from)] via-[var(--bg-gradient-via)] to-[var(--bg-gradient-to)] opacity-95 z-0 pointer-events-none transition-colors duration-500" />
      
      {/* Drifting ancient Achaemenid cuneiform background with custom opacity and hue control */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none transition-all duration-1000"
        style={{ opacity: cuneiformOpacity }}
      >
        <div 
          className="absolute inset-0 cuneiform-scroll-container"
          style={{
            backgroundImage: "url('/cuneiform_pattern.png')",
            backgroundSize: "600px 600px",
            backgroundRepeat: "repeat",
            mixBlendMode: isDark ? "screen" : "multiply",
            filter: cuneiformColor === "muted" ? "grayscale(100%)" :
                    cuneiformColor === "accent4" ? "hue-rotate(120deg) saturate(1.8)" :
                    cuneiformColor === "white" ? "grayscale(100%) brightness(1.8)" : "none"
          }}
        />
        {/* Color overlay to apply the exact custom color selectively */}
        <div 
          className="absolute inset-0 mix-blend-color pointer-events-none" 
          style={{ 
            backgroundColor: cuneiformColorValue,
            opacity: isDark ? 0.35 : 0.65 
          }} 
        />
      </div>
      
      <div 
        className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-accent3 to-transparent z-0 transition-colors duration-500"
        style={{ backgroundColor: "var(--accent3)", opacity: 0.15 }} 
      />

      {/* Main Container */}
      <div className={`relative z-10 w-full min-h-screen transition-all duration-500 ${
        headerPosition === "left"
          ? "flex flex-col md:flex-row-reverse items-stretch"
          : "flex flex-col max-w-6xl mx-auto px-6 py-6 md:py-8 justify-between gap-12"
      }`}>

        {/* Desktop Left Sidebar Navigation Frame */}
        {headerPosition === "left" && (
          <aside className="hidden md:flex md:w-72 md:shrink-0 md:sticky md:top-0 md:h-screen p-6 border-r border-[var(--border-color)] bg-[var(--card-bg-solid)] flex-col justify-between overflow-y-auto">
            <MasterHeader 
              isDark={isDark} 
              setIsDark={setIsDark} 
              setIsModulesMenuOpen={setIsModulesMenuOpen} 
              setIsMenuOpen={setIsMenuOpen} 
              setIsEspDrawerOpen={setIsEspDrawerOpen}
              headerAnimationType={headerAnimationType}
              headerTitle={headerTitle}
              groupsCols={groupsCols}
              setGroupsCols={setGroupsCols}
              headerPosition={headerPosition}
              setHeaderPosition={setHeaderPosition}
            />
          </aside>
        )}

        {/* Dynamic Workspace Container layout */}
        <div className={`flex-1 flex flex-col justify-between gap-12 ${
          headerPosition === "left" ? "p-6 md:p-8 max-w-5xl w-full mx-auto" : "w-full"
        }`}>

          {/* Standard Top Header (Shows on mobile when left sidebar is selected) */}
          {(headerPosition === "top" || headerPosition === "left") && (
            <div className={headerPosition === "left" ? "md:hidden w-full" : "w-full"}>
              <MasterHeader 
                isDark={isDark} 
                setIsDark={setIsDark} 
                setIsModulesMenuOpen={setIsModulesMenuOpen} 
                setIsMenuOpen={setIsMenuOpen} 
                setIsEspDrawerOpen={setIsEspDrawerOpen}
                headerAnimationType={headerAnimationType}
                headerTitle={headerTitle}
                groupsCols={groupsCols}
                setGroupsCols={setGroupsCols}
                headerPosition="top"
                setHeaderPosition={setHeaderPosition}
              />
            </div>
          )}

          {/* LOW DATA MODE NOTIFICATION & MANUAL REFRESH BUTTON */}
          {lowDataMode && (
            <motion.div 
              initial={animationsEnabled ? { opacity: 0, y: -10 } : {}}
              animate={animationsEnabled ? { opacity: 1, y: 0 } : {}}
              className="flex flex-col sm:flex-row items-center justify-between px-5 py-3 theme-card-bg-solid border border-accent3/20 rounded-lg text-right text-xs theme-text-secondary gap-3 max-w-2xl mx-auto w-full transition-all duration-300 shadow-lg"
              style={{ clipPath: "polygon(1% 0, 99% 0, 100% 50%, 99% 100%, 1% 100%, 0 50%)" }}
            >
              <button
                onClick={() => {
                  refetchIot();
                }}
                className="px-4 py-1.5 bg-accent3/20 border border-accent3 text-accent3 hover:bg-accent3/30 transition-all text-xs font-bold cursor-pointer"
                style={{ clipPath: BUTTON_CLIP }}
              >
                به‌روزرسانی کنونی
              </button>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-400">
                  حالت صرفه‌جویی در مصرف اینترنت فعال است. دریافت خودکار داده‌ها متوقف شده است.
                </span>
                <WifiOff className="w-4 h-4 text-accent3 animate-pulse" />
              </div>
            </motion.div>
          )}

          {/* WORKSPACE AREA */}
          <main className="flex-1 flex flex-col justify-center items-center text-center max-w-4xl mx-auto space-y-8 py-4 w-full relative">
            <AnimatePresence mode="wait">
              {segments.length === 0 ? (
                <WelcomePortal 
                  setIsMenuOpen={setIsMenuOpen} 
                  setIsModulesMenuOpen={setIsModulesMenuOpen} 
                />
              ) : (
                <motion.div 
                  key="modular-workspace"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4 }}
                  className="w-full space-y-6"
                >
                  {/* Grid of Interactive Modules */}
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext 
                      items={groupsOrder.map(g => `group-${g}`)} 
                      strategy={groupsCols > 1 ? rectSortingStrategy : verticalListSortingStrategy}
                    >
                      <div className={
                        groupsCols === 3 ? "grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-start" :
                        groupsCols === 2 ? "grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-start" :
                        "w-full space-y-8 items-start"
                      }>
                        {groupsOrder.map((groupName) => {
                          const groupSegments = segments.filter(s => (s.group || "Test") === groupName);
                          return (
                            <div key={groupName} className="space-y-3 w-full">
                              <SortableGroup 
                                id={groupName} 
                                items={groupSegments.map(s => s.id)} 
                                segmentCount={groupSegments.length}
                                maxCols={groupConfigs[groupName]?.maxCols || 3}
                                onColsChange={(cols) => handleGroupColsChange(groupName, cols)}
                                onAddPlaceholder={handleAddPlaceholder}
                                onDeleteGroup={handleRemoveGroup}
                                parentGroupsCols={groupsCols}
                              >
                                {groupSegments.map((seg) => (
                                  <SortableSegmentCard
                                    key={seg.id}
                                    segment={seg}
                                    isPinOn={!!pinsState[seg.pin]}
                                    onRemove={handleRemoveSegment}
                                    onTogglePin={handleTogglePin}
                                    onSetPinState={handleSetPinState}
                                    onUpdateSegmentMode={handleUpdateSegmentMode}
                                    isLoadingIoT={isLoadingIoT}
                                    onSetupPlaceholder={handleSetupPlaceholder}
                                    parentGroupsCols={groupsCols}
                                    groupMaxCols={groupConfigs[groupName]?.maxCols || 3}
                                  >
                                  </SortableSegmentCard>
                                ))}
                              </SortableGroup>
                            </div>
                          );
                        })}
                      </div>
                    </SortableContext>
                    <DragOverlay>
                      {activeSegmentId ? (
                        (() => {
                          const seg = segments.find(s => s.id === activeSegmentId);
                          if (!seg) return null;
                          const originalGroupCols = groupConfigs[seg.group || "Test"]?.maxCols || 3;
                          return (
                            <div style={{ opacity: 0.8, cursor: "grabbing" }}>
                              <SortableSegmentCard
                                  segment={seg}
                                  isPinOn={!!pinsState[seg.pin]}
                                  onRemove={handleRemoveSegment}
                                  onTogglePin={handleTogglePin}
                                  onSetPinState={handleSetPinState}
                                  onUpdateSegmentMode={handleUpdateSegmentMode}
                                  isLoadingIoT={isLoadingIoT}
                                  parentGroupsCols={groupsCols}
                                  groupMaxCols={originalGroupCols}
                              />
                            </div>
                          );
                        })()
                      ) : null}
                      {activeGroupId ? (
                        (() => {
                          const groupId = activeGroupId.replace("group-", "");
                          const groupSegments = segments.filter(s => (s.group || "Test") === groupId);
                          return (
                            <div style={{ opacity: 0.8, cursor: "grabbing" }}>
                              <SortableGroup 
                                id={groupId} 
                                items={groupSegments.map(s => s.id)} 
                                segmentCount={groupSegments.length}
                                maxCols={groupConfigs[groupId]?.maxCols || 3}
                                parentGroupsCols={groupsCols}
                                onColsChange={() => {}}
                                onAddPlaceholder={() => {}}
                                onDeleteGroup={() => {}}
                              >
                                <></>
                              </SortableGroup>
                            </div>
                          );
                        })()
                      ) : null}
                    </DragOverlay>
                    <TrashDropZone activeId={activeSegmentId || activeGroupId} />
                  </DndContext>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* ENCYCLOPEDIA SECTION */}
          <EncyclopediaSection 
            selectedSymbol={selectedSymbol} 
            setSelectedSymbol={setSelectedSymbol} 
            isSymbolsSectionExpanded={isSymbolsSectionExpanded} 
            setIsSymbolsSectionExpanded={setIsSymbolsSectionExpanded} 
          />

          {/* Elegant Minimalist Footer Wrapped as a Floating Island Card with diagonal corners */}
          <footer 
            className="text-center text-[10px] theme-text-muted font-sans border border-[var(--border-color)] bg-[var(--card-bg-solid)] py-4 px-6 mt-12 mb-4 mx-auto max-w-4xl shadow-sm hover:shadow-md rounded-xl transition-all duration-300"
          >
            سامانه هوشمند و داشبورد تعاملی مانیتورینگ صنعت اینترنت اشیاء (الهام گرفته از طراحی کلودفلر)
          </footer>
        </div>
      </div>

      {/* Settings configuration Drawer */}
      <SettingsDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        accent3={accent3}
        setAccent3={setAccent3}
        accent4={accent4}
        setAccent4={setAccent4}
        selectedFont={selectedFont}
        setSelectedFont={setSelectedFont}
        animationsEnabled={animationsEnabled}
        setAnimationsEnabled={setAnimationsEnabled}
        headerAnimationType={headerAnimationType}
        setHeaderAnimationType={setHeaderAnimationType}
        headerTitle={headerTitle}
        setHeaderTitle={setHeaderTitle}
        cuneiformOpacity={cuneiformOpacity}
        setCuneiformOpacity={setCuneiformOpacity}
        cuneiformColor={cuneiformColor}
        setCuneiformColor={setCuneiformColor}
        isDark={isDark}
        headerPosition={headerPosition}
        setHeaderPosition={setHeaderPosition}
      />

      {/* Modules management Drawer */}
      <ModulesDrawer
        isOpen={isModulesMenuOpen}
        onClose={() => setIsModulesMenuOpen(false)}
        onAddSegment={handleAddSegment}
        segments={segments}
        onRemoveSegment={handleRemoveSegment}
      />

      {/* ESP32 Synchronization Gateway and Builder Core System */}
      <EspSyncDrawer
        isOpen={isEspDrawerOpen}
        onClose={() => setIsEspDrawerOpen(false)}
        isDark={isDark}
        accent3={accent3}
        accent4={accent4}
        selectedFont={selectedFont}
        animationsEnabled={animationsEnabled}
        headerAnimationType={headerAnimationType}
        headerTitle={headerTitle}
        cuneiformOpacity={cuneiformOpacity}
        cuneiformColor={cuneiformColor}
        segments={segments}
        groupsOrder={groupsOrder}
        groupConfigs={groupConfigs}
        groupsCols={groupsCols}
        pinsState={pinsState}
        onApplyConfig={handleApplyEspConfig}
      />
    </div>
    </MotionConfig>
  );
}
