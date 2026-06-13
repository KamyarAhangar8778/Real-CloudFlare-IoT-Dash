"use client";

import { useState } from "react";

export function useAestheticState() {
  const [isDark, setIsDark] = useState(true);
  const [accent3, setAccent3] = useState("#D4AF37");
  const [accent4, setAccent4] = useState("#10B981");
  const [selectedFont, setSelectedFont] = useState("vazir");
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [headerAnimationType, setHeaderAnimationType] = useState<"fade" | "chase">("fade");
  const [headerTitle, setHeaderTitle] = useState("سامانه هوشمند پادشاهی هخامنش");
  const [cuneiformOpacity, setCuneiformOpacity] = useState(0.08); 
  const [cuneiformColor, setCuneiformColor] = useState<"accent3" | "accent4" | "white" | "muted">("accent3");
  const [headerPosition, setHeaderPosition] = useState<"top" | "left">("top");

  const cuneiformColorValue = 
    cuneiformColor === "accent3" ? accent3 :
    cuneiformColor === "accent4" ? accent4 :
    cuneiformColor === "white" ? (isDark ? "#ffffff" : "#1e293b") :
    (isDark ? "#475569" : "#94a3b8");

  return {
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
    headerPosition,
    setHeaderPosition,
    cuneiformColorValue,
  };
}
