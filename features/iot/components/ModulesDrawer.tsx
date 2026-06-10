"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Layers,
  Cpu,
  Plus,
  Trash2,
  Info,
  Sliders,
  ToggleLeft,
  ChevronDown
} from "lucide-react";

interface Segment {
  id: string;
  type: string;
  pin: string;
  title: string;
  group?: string;
  mode?: "switch" | "push";
}

interface ModulesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSegment: (type: string, pin: string, title?: string, group?: string, mode?: "switch" | "push") => void;
  segments: Segment[];
  onRemoveSegment: (id: string) => void;
  isDark: boolean;
  accent3: string;
  accent4: string;
  animationsEnabled?: boolean;
}

const ESP32_COMMON_PINS = [
  { value: "2", label: "GPIO 2 (چراغ ال‌دی توکار برد)" },
  { value: "4", label: "GPIO 4 (پایه عمومی دیجیتال)" },
  { value: "5", label: "GPIO 5 (رله یا خروجی جریان بالا)" },
  { value: "12", label: "GPIO 12 (پایه دیجیتال عمومی)" },
  { value: "13", label: "GPIO 13 (پایه دیجیتال عمومی)" },
  { value: "14", label: "GPIO 14 (پایه شیفت ریجستر/خط ترانزیستور)" },
  { value: "15", label: "GPIO 15 (کنترل بوق هشداری)" },
  { value: "16", label: "GPIO 16 (پایه فرستنده/گیرنده سریال ۲)" },
  { value: "17", label: "GPIO 17 (پایه فرستنده/گیرنده سریال ۲)" },
  { value: "18", label: "GPIO 18 (پروتکل ارتباطی SPI SCK)" },
  { value: "19", label: "GPIO 19 (پروتکل ارتباطی SPI MISO)" },
  { value: "21", label: "GPIO 21 (پروتکل ارتباطی I2C SDA)" },
  { value: "22", label: "GPIO 22 (پروتکل ارتباطی I2C SCL)" },
  { value: "23", label: "GPIO 23 (پروتکل ارتباطی SPI MOSI)" },
  { value: "25", label: "GPIO 25 (مبدل صوتی یا خروجی آنالوگ DAC1)" },
  { value: "26", label: "GPIO 26 (مبدل صوتی یا خروجی آنالوگ DAC2)" },
  { value: "27", label: "GPIO 27 (پایه دیجیتال عمومی)" },
  { value: "32", label: "GPIO 32 (پایه دیجیتال عمومی)" },
  { value: "33", label: "GPIO 33 (پایه دیجیتال عمومی)" },
];

export default function ModulesDrawer({
  isOpen,
  onClose,
  onAddSegment,
  segments,
  onRemoveSegment,
  isDark,
  accent3,
  accent4,
  animationsEnabled = true,
}: ModulesDrawerProps) {
  const [selectedType, setSelectedType] = useState("gpio_toggle");
  const [selectedPin, setSelectedPin] = useState("2");
  const [customPin, setCustomPin] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [groupName, setGroupName] = useState("Test");
  const [useCustomPinInput, setUseCustomPinInput] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [buttonMode, setButtonMode] = useState<"switch" | "push">("switch");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

    const targetPin = useCustomPinInput ? customPin.trim() : selectedPin;
    if (!targetPin) {
      setErrorText("لطفاً شماره پایه را مشخص کنید.");
      return;
    }

    // Check if duplicate segment on same pin
    const isDuplicate = segments.some(
      (s) => s.type === selectedType && s.pin === targetPin
    );
    if (isDuplicate) {
      setErrorText(`ماژولی برای پایه GPIO ${targetPin} قبلاً اضافه شده است.`);
      return;
    }

    const defaultTitle = `کنترل پایه دیجیتال (GPIO ${targetPin})`;
    const finalTitle = customTitle.trim() || defaultTitle;
    const finalGroup = groupName.trim() || "Test";

    onAddSegment(selectedType, targetPin, finalTitle, finalGroup, buttonMode);
    
    // Reset state after adding
    setCustomTitle("");
    setGroupName("Test");
    setCustomPin("");
    setButtonMode("switch");
    setErrorText("");
    
    // Auto close drawer after adding successfully to let user see their newly added module
    onClose();
  };

  const backdropBackground = isDark
    ? `radial-gradient(circle at center, ${accent3}15 0%, ${accent4}08 50%, rgba(5,6,9,0.65) 100%)`
    : `radial-gradient(circle at center, ${accent3}0a 0%, ${accent4}05 50%, rgba(244,245,247,0.7) 100%)`;

  const backdropStyle: React.CSSProperties = {
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    background: backdropBackground,
    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={backdropStyle}
            className="fixed inset-0 z-50 cursor-pointer"
          />

          {/* Left-Floating Modules Drawer (chiseled, elegant, high-contrast dark style with rounded corners) */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 24, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-full max-w-sm bg-gradient-to-b from-[var(--drawer-gradient-from)] to-[var(--drawer-gradient-to)] border-r border-accent3-medium rounded-r-[2.5rem] shadow-2xl z-50 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] px-6 py-8 text-right flex flex-col justify-between transition-colors duration-500"
          >
            {/* Drawer Content */}
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-accent3-medium pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 theme-card-bg-solid border border-accent3-medium text-accent3">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-sans font-black text-sm text-accent3" style={{ color: "var(--accent3)" }}>
                      منوی مدیریت ماژول‌ها و سگمنت‌ها
                    </h4>
                    <p className="text-[9px] theme-text-muted font-sans tracking-wide uppercase">
                      Modular IoT Panel Node
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={animationsEnabled ? { scale: 1.15, rotate: 90 } : undefined}
                  whileTap={animationsEnabled ? { scale: 0.9 } : undefined}
                  className="p-1.5 rounded-full theme-card-bg-solid border theme-border theme-text-tertiary hover:text-accent3 hover:border-accent3 transition-colors cursor-pointer focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Form to Add New Segment */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div 
                  className="border border-[var(--border-color)] bg-[var(--card-bg-solid)] p-4 space-y-4 rounded-2xl shadow-sm"
                >
                  <div className="flex items-center gap-2 text-accent3 border-b border-accent3-medium/30 pb-2">
                    <Plus className="w-4 h-4" />
                    <span className="text-xs font-bold font-sans">افزودن سگمنت جدید</span>
                  </div>

                  {/* 1. Select Segment Type */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] theme-text-tertiary font-bold block">
                      نوع سگمنت مانیتورینگ:
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full h-10 px-3 text-xs bg-black/20 text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent3)] outline-none transition-all cursor-pointer font-sans"
                    >
                      <option value="gpio_toggle" className="bg-slate-900">خاموش و روشن کردن یک پایه (GPIO Control)</option>
                    </select>
                  </div>

                  {/* 1.5. Button Mode Selector (Switch vs Shasti) */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] theme-text-tertiary font-bold block">
                      نوع عملکرد کلید کنترل:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <motion.button
                        type="button"
                        whileHover={animationsEnabled ? { scale: 1.03 } : undefined}
                        whileTap={animationsEnabled ? { scale: 0.97 } : undefined}
                        onClick={() => setButtonMode("switch")}
                        className={`py-2 text-[10px] font-bold font-sans transition-all border rounded-xl cursor-pointer ${
                          buttonMode === "switch"
                            ? "bg-[var(--accent3-transparent)] border-[var(--accent3)] text-[var(--accent3)] shadow-[0_0_12px_var(--accent3-transparent)]"
                            : "border-[var(--border-color)] bg-black/10 text-gray-400 hover:text-gray-300 hover:bg-black/20"
                        }`}
                      >
                        سوییچ (دائمی Toggle)
                      </motion.button>
                      <motion.button
                        type="button"
                        whileHover={animationsEnabled ? { scale: 1.03 } : undefined}
                        whileTap={animationsEnabled ? { scale: 0.97 } : undefined}
                        onClick={() => setButtonMode("push")}
                        className={`py-2 text-[10px] font-bold font-sans transition-all border rounded-xl cursor-pointer ${
                          buttonMode === "push"
                            ? "bg-[var(--accent3-transparent)] border-[var(--accent3)] text-[var(--accent3)] shadow-[0_0_12px_var(--accent3-transparent)]"
                            : "border-[var(--border-color)] bg-black/10 text-gray-400 hover:text-gray-300 hover:bg-black/20"
                        }`}
                      >
                        شستی (لحظه‌ای Shasti)
                      </motion.button>
                    </div>
                  </div>

                  {/* 2. Choose/Enter Pin Designation */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setUseCustomPinInput(!useCustomPinInput)}
                        className="text-[9px] text-accent4 font-bold underline cursor-pointer"
                      >
                        {useCustomPinInput ? "انتخاب از لیست پایه‌ها" : "وارد کردن دستی شماره پایه"}
                      </button>
                      <label className="text-[10px] theme-text-tertiary font-bold">
                        تعیین پایه سخت‌افزاری ESP32:
                      </label>
                    </div>

                    {useCustomPinInput ? (
                      <input
                        type="text"
                        placeholder="مانند: 14"
                        value={customPin}
                        onChange={(e) => setCustomPin(e.target.value.replace(/[^0-9]/g, ""))}
                        className="w-full h-10 px-3 text-xs bg-black/20 text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent3)] outline-none transition-all font-sans"
                        dir="ltr"
                      />
                    ) : (
                      <select
                        value={selectedPin}
                        onChange={(e) => setSelectedPin(e.target.value)}
                        className="w-full h-10 px-3 text-xs bg-black/20 text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent3)] outline-none transition-all cursor-pointer font-sans"
                      >
                        {ESP32_COMMON_PINS.map((pin) => (
                          <option key={pin.value} value={pin.value} className="bg-slate-900">
                            {pin.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* 3. Segment Custom Title */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] theme-text-muted">(اختیاری)</span>
                      <label className="text-[10px] theme-text-tertiary font-bold">
                        عنوان دلخواه برای سگمنت:
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="مثال: رله پمپ آب حیاط"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      className="w-full h-10 px-4 text-xs bg-black/20 text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent3)] outline-none transition-all font-sans text-right placeholder:text-right"
                    />
                  </div>

                  {/* 4. Group Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] theme-text-tertiary font-bold block">
                      نام گروه سگمنت:
                    </label>
                    <input
                      type="text"
                      placeholder="مانند: Test"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="w-full h-10 px-4 text-xs bg-black/20 text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent3)] outline-none transition-all font-sans text-right placeholder:text-right"
                    />
                  </div>

                  {errorText && (
                    <p className="text-[10px] text-red-500 font-sans mt-2">{errorText}</p>
                  )}

                  <motion.button
                    type="submit"
                    whileHover={animationsEnabled ? { scale: 1.02 } : undefined}
                    whileTap={animationsEnabled ? { scale: 0.98 } : undefined}
                    className="w-full py-2.5 bg-[var(--accent3)] text-black font-sans font-black text-xs hover:bg-opacity-90 transition-all duration-300 cursor-pointer text-center rounded-xl shadow-md shadow-[var(--accent3-transparent)] mt-2"
                  >
                    + تأیید و ایجاد سگمنت جدید
                  </motion.button>
                </div>
              </form>

              {/* Added Segments Manager List */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
                  <Sliders className="w-3.5 h-3.5 text-[var(--accent3)]" />
                  <span className="text-[11px] font-bold theme-text-secondary">سگمنت‌های مستقر در پیش‌نمایش ({segments.length})</span>
                </div>

                {segments.length === 0 ? (
                  <p className="text-[10px] theme-text-muted py-3 text-center border border-dashed border-[var(--border-color)] rounded-xl bg-black/10">
                    هیچ سگمنت سفارشی تعریف نشده است.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    <AnimatePresence>
                    {segments.map((seg) => (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={seg.id}
                        className="p-3 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-xl flex items-center justify-between gap-3 text-right group hover:border-[var(--accent3-medium)] transition-all shadow-sm"
                      >
                        <button
                          onClick={() => onRemoveSegment(seg.id)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 transition-colors cursor-pointer rounded-lg"
                          title="حذف سگمنت"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <span className="block text-xs font-bold theme-text-primary truncate">{seg.title}</span>
                          <span className="block text-[9px] theme-text-muted font-mono" dir="ltr">
                            GPIO {seg.pin} • {seg.mode === "push" ? "MOMENTARY PUSH" : "ON/OFF SWITCH"}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>

            {/* Note about real connection in preview limits */}
            <div 
              className="mt-6 bg-[var(--accent3-transparent)] border border-[var(--accent3-medium)] p-3 rounded-xl text-[10px] theme-text-tertiary leading-relaxed flex items-start gap-2 text-right"
            >
              <Info className="w-4 h-4 text-accent3 shrink-0 mt-0.5" />
              <span>
                با افزودن سگمنت، کدهای لازم برای پردازش پایه مورد نظر در فایل خروجی دانشنامه و کدهای ESP32 نیز ادغام می‌شوند تا ارتباط فیزیکی بی‌نقص برقرار بگردد.
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
