"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, X, Plus, Trash2, Edit2, Play, Square, Info, Layers } from "lucide-react";
import { useAchaemenidState } from "@/features/iot/hooks/useAchaemenidState";

interface AutomationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  animationsEnabled?: boolean;
}

const DAYS_MAP = [
  { value: 0, label: "ی" },
  { value: 1, label: "د" },
  { value: 2, label: "س" },
  { value: 3, label: "چ" },
  { value: 4, label: "پ" },
  { value: 5, label: "ج" },
  { value: 6, label: "ش" },
];

export default function AutomationsDrawer({ isOpen, onClose, isDark, animationsEnabled }: AutomationsDrawerProps) {
  const { automations, setAutomations, segments, macros, showToast } = useAchaemenidState();
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [days, setDays] = useState<number[]>([]);
  
  // Actions state
  const [actions, setActions] = useState<Array<{
    targetPin?: string;
    targetMacro?: string;
    actionOn?: boolean;
  }>>([]);

  const resetForm = () => {
    setTitle("");
    setTime("");
    setDays([]);
    setActions([]);
    setEditingId(null);
  };

  const handleEdit = (auto: any) => {
    setEditingId(auto.id);
    setTitle(auto.title);
    setTime(auto.time);
    setDays([...auto.days]);
    setActions(auto.actions ? [...auto.actions] : []);
  };

  const handleSave = () => {
    if (!title || !time || days.length === 0) {
      showToast("لطفاً تمامی فیلدها را پر کنید.", "error");
      return;
    }
    
    if (actions.length === 0) {
      showToast("حداقل یک عملیات مشخص کنید.", "error");
      return;
    }

    const newAuto = {
      id: editingId || `auto_${Date.now()}`,
      title,
      time,
      days,
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
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ backdropFilter: "blur(16px)", background: backdropBackground }}
            className="fixed inset-0 z-50 cursor-pointer"
          />

          <motion.div
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

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">زمان (ساعت):</label>
                    <input 
                      type="time" 
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
                      dir="ltr"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">روزهای هفته:</label>
                    <div className="flex justify-between gap-1">
                      {DAYS_MAP.map((d) => (
                        <button
                          key={d.value}
                          onClick={() => {
                            if (days.includes(d.value)) setDays(days.filter(x => x !== d.value));
                            else setDays([...days, d.value].sort());
                          }}
                          className={`w-9 h-9 rounded-full text-xs font-bold transition-all ${days.includes(d.value) ? "bg-[var(--accent3)] text-white shadow-md shadow-[var(--accent3-transparent)]" : "bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-secondary)] md:hover:border-[var(--accent3)]"}`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

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
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-[var(--text-secondary)] px-1">لیست اتوماسیون‌ها</h3>
                {automations.length === 0 ? (
                  <div className="text-center py-8 bg-[var(--card-bg-solid)] rounded-2xl border border-dashed border-[var(--border-color)] text-[var(--text-muted)] text-sm">
                    هیچ اتوماسیونی ثبت نشده است.
                  </div>
                ) : (
                  automations.map((auto) => {
                    const hasMacros = auto.actions?.some(a => a.targetMacro);
                    return (
                      <div key={auto.id} className={`p-4 rounded-2xl border transition-all shadow-sm flex items-center justify-between ${auto.enabled ? "bg-[var(--card-bg-solid)] border-[var(--border-color)]" : "bg-[var(--card-bg)] border-[var(--border-color)] opacity-60"}`}>
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className={`w-2 h-2 rounded-full ${hasMacros ? "bg-indigo-400" : (auto.actions?.[0]?.actionOn ? "bg-emerald-500" : "bg-rose-500")}`} />
                            <h4 className="font-bold text-[var(--text-primary)] text-sm">{auto.title}</h4>
                          </div>
                          <div className="text-xs text-[var(--text-secondary)] font-mono flex items-center gap-2">
                            <span className="bg-[var(--card-hover-bg)] px-2 py-0.5 rounded text-[var(--accent3)]">{auto.time}</span>
                            <span>عملیات: {auto.actions?.length || 0} مورد</span>
                            <span className="text-[10px] bg-[var(--card-hover-bg)] px-1.5 py-0.5 rounded">
                              {auto.days.map(d => DAYS_MAP.find(m => m.value === d)?.label).join("، ")}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => handleToggle(auto.id, !auto.enabled)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${auto.enabled ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 md:hover:bg-emerald-500/20" : "bg-slate-500/10 text-slate-500 border-slate-500/20 md:hover:bg-slate-500/20"}`}
                          >
                            {auto.enabled ? "فعال" : "غیرفعال"}
                          </button>
                          <button onClick={() => handleEdit(auto)} className="p-1.5 text-[var(--text-muted)] md:hover:text-blue-500 bg-[var(--card-hover-bg)] rounded-lg transition-colors">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(auto.id)} className="p-1.5 text-[var(--text-muted)] md:hover:text-red-500 bg-[var(--card-hover-bg)] rounded-lg transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
