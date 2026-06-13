import React from "react";
import { Palette, Type, Activity, LayoutGrid, Sparkles } from "lucide-react";

export interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  accent3: string;
  setAccent3: (val: string) => void;
  accent4: string;
  setAccent4: (val: string) => void;
  selectedFont: string;
  setSelectedFont: (val: string) => void;
  animationsEnabled: boolean;
  setAnimationsEnabled: (val: boolean) => void;
  headerAnimationType: "fade" | "chase";
  setHeaderAnimationType: (val: "fade" | "chase") => void;
  headerTitle: string;
  setHeaderTitle: (val: string) => void;
  cuneiformOpacity: number;
  setCuneiformOpacity: (val: number) => void;
  cuneiformColor: "accent3" | "accent4" | "white" | "muted";
  setCuneiformColor: (val: "accent3" | "accent4" | "white" | "muted") => void;
  isDark: boolean;
  headerPosition: "top" | "left";
  setHeaderPosition: (val: "top" | "left") => void;
}

export const SETTINGS_TABS = [
  { id: "colors", title: "تنظیم تنوع رنگ و تضاد", compactTitle: "رنگ ۳ و رنگ ۴ بورد", Icon: Palette },
  { id: "fonts", title: "مدیریت قلم و تایپوگرافی", compactTitle: "قلم و فونت‌های سلطنتی", Icon: Type },
  { id: "animations", title: "کنترل پایداری و بهینه‌سازی", compactTitle: "فریم‌ریت و مصرف سرویس", Icon: Activity },
  { id: "header-settings", title: "موقعیت و تنظیمات هدر", compactTitle: "طرح قرارگیری هدر بورد", Icon: LayoutGrid },
  { id: "cuneiform", title: "تنظیمات کتیبه خط میخی", compactTitle: "پدیداری و کنتراست پس‌زمینه", Icon: Sparkles }
];
