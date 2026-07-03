"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, X, Plus, Trash2, Edit2, Play, Square, Info, Layers, Thermometer, MapPin } from "lucide-react";
import { useAchaemenidState } from "@/features/iot/hooks/useAchaemenidState";

interface AutomationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  animationsEnabled?: boolean;
}

const DAYS_MAP = [
  { value: 6, label: "شنبه" },
  { value: 0, label: "یکشنبه" },
  { value: 1, label: "دوشنبه" },
  { value: 2, label: "سه‌شنبه" },
  { value: 3, label: "چهارشنبه" },
  { value: 4, label: "پنج‌شنبه" },
  { value: 5, label: "جمعه" },
];

export default function AutomationsDrawer({ isOpen, onClose, isDark, animationsEnabled }: AutomationsDrawerProps) {
  const { automations, setAutomations, segments, macros, showToast } = useAchaemenidState();
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [days, setDays] = useState<number[]>([]);
  const [repeatCount, setRepeatCount] = useState<number | "">("");
  
  const [autoType, setAutoType] = useState<"schedule" | "timer" | "weather">("schedule");
  const [delayHours, setDelayHours] = useState<number | "">("");
  const [delayMinutes, setDelayMinutes] = useState<number | "">("");
  
  const [city, setCity] = useState("");
  const [temperatureThreshold, setTemperatureThreshold] = useState<number | "">("");
  const [temperatureCondition, setTemperatureCondition] = useState<"greater" | "less">("greater");
  
  const [intervalMinutes, setIntervalMinutes] = useState<number | "">("");
  const [hasWeatherCondition, setHasWeatherCondition] = useState<boolean>(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Actions state
  const [actions, setActions] = useState<Array<{
    targetPin?: string;
    targetMacro?: string;
    actionOn?: boolean;
  }>>([]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      showToast("مرورگر شما از قابلیت مکان‌یابی پشتیبانی نمی‌کند.", "error");
      return;
    }
    
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(4);
        const lon = position.coords.longitude.toFixed(4);
        setCity(`${lat},${lon}`);
        setIsGettingLocation(false);
        showToast("مکان شما با موفقیت ثبت شد.", "success");
      },
      (error) => {
        setIsGettingLocation(false);
        showToast("خطا در دریافت مکان. لطفاً دسترسی دستگاه را بررسی کنید.", "error");
      }
    );
  };

  const resetForm = () => {
    setTitle("");
    setTime("");
    setDays([]);
    setRepeatCount("");
    setAutoType("schedule");
    setDelayHours("");
    setDelayMinutes("");
    setCity("");
    setTemperatureThreshold("");
    setTemperatureCondition("greater");
    setIntervalMinutes("");
    setHasWeatherCondition(false);
    setActions([]);
    setEditingId(null);
  };

  const handleEdit = (auto: any) => {
    setEditingId(auto.id);
    setTitle(auto.title);
    setTime(auto.time || "");
    setDays(auto.days ? [...auto.days] : []);
    setRepeatCount(auto.repeatCount || "");
    setIntervalMinutes(auto.intervalMinutes || "");
    
    if (auto.city && auto.temperatureThreshold !== undefined) {
      setHasWeatherCondition(true);
      setCity(auto.city);
      setTemperatureThreshold(auto.temperatureThreshold);
      setTemperatureCondition(auto.temperatureCondition || "greater");
    } else {
      setHasWeatherCondition(false);
      setCity("");
      setTemperatureThreshold("");
    }

    if (auto.intervalMinutes) {
      setAutoType("weather");
    } else if (auto.repeatCount) {
      setAutoType("timer");
    } else {
      setAutoType("schedule");
    }
    
    setActions(auto.actions ? [...auto.actions] : []);
  };

  const handleSave = () => {
    let finalTime = time;
    let finalDays = [...days];
    let finalRepeatCount = typeof repeatCount === 'number' && repeatCount > 0 ? repeatCount : undefined;
    let finalConditionType: "time" | "weather" = "time";
    let finalCity = city;
    let finalTempThresh = typeof temperatureThreshold === 'number' ? temperatureThreshold : undefined;
    let finalTempCond = temperatureCondition;

    let finalIntervalMinutes = typeof intervalMinutes === 'number' && intervalMinutes > 0 ? intervalMinutes : undefined;

    if (autoType === "timer") {
      const dHours = Number(delayHours) || 0;
      const dMins = Number(delayMinutes) || 0;
      
      if (dHours === 0 && dMins === 0) {
        showToast("لطفاً زمان تاخیر را مشخص کنید.", "error");
        return;
      }
      
      const now = new Date();
      now.setHours(now.getHours() + dHours);
      now.setMinutes(now.getMinutes() + dMins);
      
      finalTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      finalDays = [now.getDay()]; // 0=Sun, 1=Mon, etc. Matches DAYS_MAP
      finalRepeatCount = 1;
    } else if (autoType === "weather") {
      if (!city || finalTempThresh === undefined || !finalIntervalMinutes) {
        showToast("لطفاً شهر، شرط دما و دوره بررسی را مشخص کنید.", "error");
        return;
      }
      finalConditionType = "weather";
      finalTime = ""; // Weather condition might not need time, or we can make it check interval. We'll leave it empty.
      finalDays = [];
    } else {
      if (!time || days.length === 0) {
        showToast("لطفاً زمان و روزهای هفته را مشخص کنید.", "error");
        return;
      }
    }

    if ((autoType === "timer" || autoType === "schedule") && hasWeatherCondition) {
      if (!city || finalTempThresh === undefined) {
        showToast("لطفاً شهر و شرط دما را مشخص کنید.", "error");
        return;
      }
      finalConditionType = "weather";
    } else if (autoType !== "weather") {
      finalConditionType = "time";
    }

    if (!title) {
      showToast("لطفاً عنوان را وارد کنید.", "error");
      return;
    }
    
    if (actions.length === 0) {
      showToast("حداقل یک عملیات مشخص کنید.", "error");
      return;
    }

    const newAuto = {
      id: editingId || `auto_${Date.now()}`,
      title,
      time: finalTime,
      days: finalDays,
      repeatCount: finalRepeatCount,
      intervalMinutes: finalIntervalMinutes,
      conditionType: finalConditionType,
      city: finalCity,
      temperatureThreshold: finalTempThresh,
      temperatureCondition: finalTempCond,
      actions,
      enabled: true,
    };

    if (editingId) {
      setAutomations(automations.map(a => a.id === editingId ? { ...newAuto, enabled: a.enabled } : a));
    } else {
      setAutomations([...automations, newAuto]);
    }
    resetForm();
    showToast("اتوماسیون با موفقیت ثبت شد.", "success");
  };

  const handleDelete = (id: string) => {
    setAutomations(automations.filter(a => a.id !== id));
    showToast("اتوماسیون حذف شد.", "success");
  };

  const handleToggle = (id: string, enabled: boolean) => {
    setAutomations(automations.map(a => a.id === id ? { ...a, enabled } : a));
  };

  const addAction = (type: "pin" | "macro") => {
    if (type === "pin") {
      setActions([...actions, { targetPin: segments[0]?.pin || "2", actionOn: true }]);
    } else {
      setActions([...actions, { targetMacro: macros[0]?.id || "" }]);
    }
  };

  const updateAction = (index: number, updates: any) => {
    const newActions = [...actions];
    newActions[index] = { ...newActions[index], ...updates };
    setActions(newActions);
  };

  const removeAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const backdropBackground = isDark
    ? `radial-gradient(circle at center, rgba(16,185,129,0.15) 0%, rgba(5,6,9,0.8) 100%)`
    : `radial-gradient(circle at center, rgba(16,185,129,0.05) 0%, rgba(244,245,247,0.7) 100%)`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="automations-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ backdropFilter: "blur(16px)", background: backdropBackground }}
          className="fixed inset-0 z-50 cursor-pointer"
        />
      )}
      {isOpen && (
        <motion.div
          key="automations-panel"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 24, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-gradient-to-b from-[var(--drawer-gradient-from)] to-[var(--drawer-gradient-to)] border-l border-[var(--accent3-medium)] rounded-l-[2.5rem] shadow-2xl z-50 flex flex-col transition-colors duration-500 overflow-hidden"
            dir="rtl"
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--card-bg-solid)] shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--accent3-transparent)] text-[var(--accent3)]">
                  <Clock className={`w-5 h-5 ${animationsEnabled ? "animate-[pulse_3s_ease-in-out_infinite]" : ""}`} />
                </div>
                <h2 className="font-bold text-lg text-[var(--text-primary)]">مدیریت اتوماسیون‌ها</h2>
              </div>
              <button onClick={onClose} className="p-2 text-[var(--text-muted)] md:hover:text-red-500 bg-[var(--card-hover-bg)] rounded-xl transition-all md:hover:rotate-90">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] p-6 space-y-8">
              
              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 p-4 rounded-2xl text-xs flex gap-3 items-start leading-relaxed shadow-sm">
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                <p>
                  در این بخش می‌توانید عملیات‌های زمانی تعریف کنید. سرور ابری پادشاهی در زمان مشخص شده، چندین دستور را همزمان به دستگاه ارسال خواهد کرد.
                </p>
              </div>

              {/* Form Section */}
              <div className="bg-[var(--card-bg-solid)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1 h-full bg-[var(--accent3)]" />
                <h3 className="font-semibold text-sm text-[var(--text-primary)] flex items-center gap-2">
                  {editingId ? <Edit2 className="w-4 h-4 text-[var(--accent3)]" /> : <Plus className="w-4 h-4 text-[var(--accent3)]" />}
                  {editingId ? "ویرایش اتوماسیون" : "افزودن اتوماسیون جدید"}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">عنوان (دلخواه):</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="مثال: روشن کردن پمپ آبیاری"
                      className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
                    />
                  </div>

                  {/* Auto Type Toggle */}
                  <div className="col-span-2 flex bg-[var(--card-bg)] p-1 rounded-xl border border-[var(--border-color)] overflow-hidden">
                    <button
                      onClick={() => setAutoType("schedule")}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${autoType === "schedule" ? "bg-[var(--accent3)] text-white shadow-sm" : "text-[var(--text-muted)] md:hover:text-[var(--text-primary)]"}`}
                    >
                      زمان‌بندی دوره‌ای
                    </button>
                    <button
                      onClick={() => setAutoType("timer")}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${autoType === "timer" ? "bg-[var(--accent3)] text-white shadow-sm" : "text-[var(--text-muted)] md:hover:text-[var(--text-primary)]"}`}
                    >
                      تایمر یک‌بار مصرف
                    </button>
                    <button
                      onClick={() => setAutoType("weather")}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${autoType === "weather" ? "bg-[var(--accent3)] text-white shadow-sm" : "text-[var(--text-muted)] md:hover:text-[var(--text-primary)]"}`}
                    >
                      مبتنی بر دما
                    </button>
                  </div>

                  {autoType === "schedule" && (
                    <>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">زمان (ساعت):</label>
                        <input 
                          type="time" 
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
                          dir="ltr"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">تعداد تکرار:</label>
                        <input 
                          type="number" 
                          min="0"
                          value={repeatCount}
                          onChange={(e) => setRepeatCount(e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="0 (بی‌نهایت)"
                          className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">روزهای هفته:</label>
                        <div className="flex flex-wrap justify-center gap-2">
                          {DAYS_MAP.map((d) => (
                            <button
                              key={d.value}
                              onClick={() => {
                                if (days.includes(d.value)) setDays(days.filter(x => x !== d.value));
                                else setDays([...days, d.value].sort());
                              }}
                              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${days.includes(d.value) ? "bg-[var(--accent3)] text-white shadow-md shadow-[var(--accent3-transparent)]" : "bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-secondary)] md:hover:border-[var(--accent3)]"}`}
                            >
                              {d.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {autoType === "timer" && (
                    <>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">تاخیر (ساعت):</label>
                        <input 
                          type="number" 
                          min="0"
                          value={delayHours}
                          onChange={(e) => setDelayHours(e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="مثال: 10"
                          className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">تاخیر (دقیقه):</label>
                        <input 
                          type="number" 
                          min="0"
                          max="59"
                          value={delayMinutes}
                          onChange={(e) => setDelayMinutes(e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="مثال: 30"
                          className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
                        />
                      </div>
                    </>
                  )}

                  {autoType === "weather" && (
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">دوره بررسی (ساعت):</label>
                      <select 
                        value={intervalMinutes ? intervalMinutes / 60 : ""}
                        onChange={(e) => setIntervalMinutes(e.target.value === "" ? "" : Number(e.target.value) * 60)}
                        className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
                      >
                        <option value="" disabled>انتخاب کنید...</option>
                        {Array.from({length: 24}, (_, i) => i + 1).map(h => (
                          <option key={h} value={h}>هر {h} ساعت</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {(autoType === "timer" || autoType === "schedule") && (
                    <div className="col-span-2 pt-2 border-t border-[var(--border-color)] mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={hasWeatherCondition}
                          onChange={(e) => setHasWeatherCondition(e.target.checked)}
                          className="w-4 h-4 text-[var(--accent3)] rounded focus:ring-[var(--accent3)]"
                        />
                        <span className="text-sm font-medium text-[var(--text-primary)]">اضافه کردن شرط آب‌وهوایی (اختیاری)</span>
                      </label>
                    </div>
                  )}

                  {(autoType === "weather" || hasWeatherCondition) && (
                    <>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">نام شهر یا مختصات (انگلیسی):</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="مثال: Tehran یا 36.26,59.61"
                            className="flex-1 bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
                            dir="ltr"
                          />
                          <button
                            type="button"
                            onClick={handleGetLocation}
                            disabled={isGettingLocation}
                            className={`p-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center min-w-[44px] ${isGettingLocation ? "bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-muted)] cursor-not-allowed" : "bg-[var(--card-hover-bg)] border-[var(--border-color)] text-[var(--text-secondary)] md:hover:border-[var(--accent3)] md:hover:text-[var(--accent3)]"}`}
                            title="دریافت مکان فعلی"
                          >
                            {isGettingLocation ? (
                              <div className="w-5 h-5 border-2 border-[var(--accent3)] border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <MapPin className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="col-span-2 flex gap-3">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">شرط دما:</label>
                          <select
                            value={temperatureCondition}
                            onChange={(e) => setTemperatureCondition(e.target.value as "greater" | "less")}
                            className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
                          >
                            <option value="greater">بیشتر از</option>
                            <option value="less">کمتر از</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">دما (°C):</label>
                          <input 
                            type="number" 
                            value={temperatureThreshold}
                            onChange={(e) => setTemperatureThreshold(e.target.value === "" ? "" : Number(e.target.value))}
                            placeholder="مثال: 30"
                            className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
                            dir="ltr"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Actions Section */}
                  <div className="col-span-2 space-y-3 pt-2">
                    <label className="block text-xs font-medium text-[var(--text-secondary)]">عملیات‌ها ({actions.length}):</label>
                    
                    {actions.map((act, index) => (
                      <div key={index} className="flex flex-col gap-2 p-3 bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] relative group">
                        <button 
                          onClick={() => removeAction(index)}
                          className="absolute -top-2 -left-2 p-1.5 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        >
                          <X className="w-3 h-3" />
                        </button>

                        {act.targetPin !== undefined ? (
                          // Pin Action
                          <>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-[var(--accent3)] bg-[var(--accent3-transparent)] px-2 py-1 rounded-md">پایه</span>
                              <select 
                                value={act.targetPin}
                                onChange={(e) => updateAction(index, { targetPin: e.target.value })}
                                className="flex-1 bg-[var(--card-bg-solid)] border border-[var(--border-color)] p-2 rounded-lg focus:outline-none focus:border-[var(--accent3)] text-xs transition-colors text-[var(--text-primary)]"
                              >
                                {segments.map(seg => (
                                  <option key={seg.id} value={seg.pin}>{seg.title} (پایه {seg.pin})</option>
                                ))}
                                {/* Fallback options if custom pin is needed */}
                                {(!segments.find(s => s.pin === act.targetPin)) && (
                                  <option value={act.targetPin}>پایه دستی: {act.targetPin}</option>
                                )}
                              </select>
                            </div>
                            <div className="flex gap-2 p-1 bg-[var(--card-bg-solid)] rounded-lg border border-[var(--border-color)]">
                              <button 
                                onClick={() => updateAction(index, { actionOn: true })}
                                className={`flex-1 py-1.5 rounded-md text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all ${act.actionOn ? "bg-emerald-500 text-white shadow-sm" : "text-[var(--text-muted)] md:hover:text-emerald-500"}`}
                              >
                                <Play className="w-3 h-3" /> روشن
                              </button>
                              <button 
                                onClick={() => updateAction(index, { actionOn: false })}
                                className={`flex-1 py-1.5 rounded-md text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all ${!act.actionOn ? "bg-rose-500 text-white shadow-sm" : "text-[var(--text-muted)] md:hover:text-rose-500"}`}
                              >
                                <Square className="w-3 h-3" /> خاموش
                              </button>
                            </div>
                          </>
                        ) : (
                          // Macro Action
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded-md flex items-center gap-1">
                              <Layers className="w-3 h-3" />
                              ماکرو
                            </span>
                            <select 
                              value={act.targetMacro}
                              onChange={(e) => updateAction(index, { targetMacro: e.target.value })}
                              className="flex-1 bg-[var(--card-bg-solid)] border border-[var(--border-color)] p-2 rounded-lg focus:outline-none focus:border-indigo-500/50 text-xs transition-colors text-[var(--text-primary)]"
                            >
                              <option value="" disabled>یک ماکرو انتخاب کنید</option>
                              {macros.map(m => (
                                <option key={m.id} value={m.id}>{m.title}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="flex gap-2">
                      <button 
                        onClick={() => addAction("pin")}
                        className="flex-1 py-2 border border-dashed border-[var(--border-color)] rounded-xl text-xs text-[var(--text-muted)] md:hover:text-[var(--accent3)] md:hover:border-[var(--accent3)] transition-colors flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> پایه
                      </button>
                      <button 
                        onClick={() => addAction("macro")}
                        className="flex-1 py-2 border border-dashed border-[var(--border-color)] rounded-xl text-xs text-[var(--text-muted)] md:hover:text-indigo-400 md:hover:border-indigo-400 transition-colors flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> ماکرو
                      </button>
                    </div>
                  </div>

                </div>

                <div className="flex gap-2 pt-2">
                  <button onClick={handleSave} className="flex-1 py-2.5 bg-[var(--accent3)] md:hover:bg-[var(--accent2)] text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-[0.98]">
                    {editingId ? "ذخیره تغییرات" : "افزودن به لیست"}
                  </button>
                  {editingId && (
                    <button onClick={resetForm} className="px-4 py-2.5 bg-[var(--card-hover-bg)] text-[var(--text-secondary)] border border-[var(--border-color)] md:hover:text-[var(--text-primary)] font-bold rounded-xl text-sm transition-all active:scale-[0.98]">
                      انصراف
                    </button>
                  )}
                </div>
              </div>

              {/* List Section */}
              <div className="space-y-4 mt-6 border-t border-[var(--border-color)] pt-6">
                <div className="flex items-center justify-between px-1">
                  <h3 className="font-bold text-[var(--text-primary)]">مدیریت اتوماسیون‌ها</h3>
                  <span className="text-xs font-mono bg-[var(--card-hover-bg)] text-[var(--text-secondary)] px-2 py-0.5 rounded-full">
                    {automations.length} مورد
                  </span>
                </div>
                
                {automations.length === 0 ? (
                  <div className="text-center py-10 bg-[var(--card-bg-solid)] rounded-2xl border border-dashed border-[var(--border-color)] text-[var(--text-muted)] text-sm flex flex-col items-center justify-center gap-2">
                    <Clock className="w-8 h-8 opacity-20" />
                    هیچ اتوماسیونی ثبت نشده است.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {automations.map((auto) => {
                      const hasMacros = auto.actions?.some(a => a.targetMacro);
                      return (
                        <div key={auto.id} className={`flex flex-col p-4 rounded-2xl border transition-all shadow-sm ${auto.enabled ? "bg-[var(--card-bg-solid)] border-[var(--border-color)]" : "bg-[var(--card-bg)] border-[var(--border-color)] opacity-70"}`}>
                          
                          {/* Card Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${auto.enabled ? (hasMacros ? "bg-indigo-500 shadow-indigo-500/40" : (auto.actions?.[0]?.actionOn ? "bg-emerald-500 shadow-emerald-500/40" : "bg-rose-500 shadow-rose-500/40")) : "bg-slate-500 shadow-slate-500/40"}`} />
                              <h4 className="font-bold text-[var(--text-primary)] text-sm">{auto.title}</h4>
                            </div>
                            
                            {/* Toggle Switch */}
                            <button 
                              onClick={() => handleToggle(auto.id, !auto.enabled)}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${auto.enabled ? "bg-[var(--accent3)]" : "bg-[var(--border-color)]"}`}
                            >
                              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${auto.enabled ? "translate-x-1" : "translate-x-4"}`} />
                            </button>
                          </div>

                          {/* Card Body - Time & Details */}
                          <div className="flex items-center justify-between mb-4 bg-[var(--card-hover-bg)] p-3 rounded-xl">
                            {auto.intervalMinutes ? (
                              <div className="flex items-center gap-2">
                                <Thermometer className="w-5 h-5 text-[var(--accent3)]" />
                                <span className="text-sm font-bold text-[var(--text-primary)]">
                                  {auto.city}: دما {auto.temperatureCondition === "greater" ? "بیشتر از" : "کمتر از"} <span className="font-mono text-lg" dir="ltr">{auto.temperatureThreshold}°C</span>
                                  <span className="text-xs text-[var(--text-secondary)] block mt-1">هر {auto.intervalMinutes / 60} ساعت</span>
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-[var(--accent3)]" />
                                <span className="text-xl font-bold font-mono text-[var(--text-primary)] tracking-wider" dir="ltr">{auto.time}</span>
                                {auto.conditionType === "weather" && auto.city && (
                                  <div className="flex flex-col mr-2 text-[10px] text-[var(--text-secondary)]">
                                    <span>شرط: {auto.city}</span>
                                    <span>دما {auto.temperatureCondition === "greater" ? ">" : "<"} {auto.temperatureThreshold}°C</span>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            <div className="flex flex-col items-end gap-1.5">
                              {auto.intervalMinutes ? (
                                <span className="text-[10px] bg-blue-500/15 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md font-bold">
                                  دما محور (دوره‌ای)
                                </span>
                              ) : auto.repeatCount ? (
                                <span className="text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <Info className="w-3 h-3" />
                                  یک‌بار مصرف ({auto.repeatCount} بار)
                                </span>
                              ) : (
                                <span className="text-[10px] bg-[var(--accent3-transparent)] text-[var(--accent3)] px-2 py-0.5 rounded-md font-bold">
                                  دوره‌ای
                                </span>
                              )}
                              
                              {!auto.intervalMinutes && auto.days && auto.days.length > 0 && (
                                <div className="flex flex-wrap justify-end gap-1 max-w-[150px]">
                                  {auto.days.map(d => (
                                    <span key={d} className="text-[9px] bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--border-color)] px-1.5 py-0.5 rounded">
                                      {DAYS_MAP.find(m => m.value === d)?.label}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Card Footer - Actions summary & controls */}
                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border-color)]">
                            <div className="text-xs text-[var(--text-secondary)] font-medium flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 opacity-70" />
                              <span>{auto.actions?.length || 0} عملیات تنظیم شده</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleEdit(auto)} className="p-2 text-[var(--text-muted)] md:hover:text-blue-500 md:hover:bg-blue-500/10 rounded-lg transition-colors" title="ویرایش">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(auto.id)} className="p-2 text-[var(--text-muted)] md:hover:text-rose-500 md:hover:bg-rose-500/10 rounded-lg transition-colors" title="حذف">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </motion.div>
      )}
    </AnimatePresence>
  );
}
