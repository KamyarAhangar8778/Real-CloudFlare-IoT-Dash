"use client";

import React, { useState } from "react";
import { Settings2, X, Info, Plus, Trash2 } from "lucide-react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { publishUpdateRuleCommand } from "@/features/iot/services/mqttService";
import { validateEsp32Pin } from "@/features/iot/utils/pinValidation";

export default function GlobalRuleSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const segments = useIoTStore((state) => state.segments);
  const updateSegmentRule = useIoTStore((state) => state.updateSegmentRule);
  const showToast = useIoTStore((state) => state.showToast);

  // Local state for tracking edited rules
  const [localRules, setLocalRules] = useState<Record<string, {
    highActions: Array<{ reqHold: number; targetPin: string; actionOn: boolean; actionType?: number; delay?: number; }>;
    lowActions: Array<{ reqHold: number; targetPin: string; actionOn: boolean; actionType?: number; delay?: number; }>;
  }>>({});

  const inputSegments = segments.filter((s) => s.type === "input");

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-slate-700 dark:text-gray-300 hover:border-[var(--accent3)] hover:text-[var(--accent3)] transition-all shadow-sm"
        title="تنظیمات شرط‌ها"
      >
        <Settings2 className="w-4 h-4" />
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-[var(--card-bg-solid)]">
              <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">مدیریت شرط‌ها (Rules)</h2>
              <button onClick={() => setIsOpen(false)} className="p-1.5 text-slate-500 hover:text-red-500 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 space-y-6" dir="rtl">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 p-3 rounded-lg text-xs flex gap-2 items-start">
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                <p>
                  در این بخش می‌توانید برای زمان‌های مختلف نگه‌داشتن کلید (مثلاً 0، 3، 5 یا 10 ثانیه) عملیات متفاوتی تعریف کنید. 
                  شما می‌توانید برای هر وضعیت (روشن شدن یا خاموش شدن) چندین عملیات بسازید تا هرکدام روی یک پایه‌ی مجزا تاثیر بگذارند.
                </p>
              </div>

              {inputSegments.length === 0 ? (
                <p className="text-center text-slate-500 text-sm py-8">هیچ ورودی (سنسور/کلید) در داشبورد وجود ندارد.</p>
              ) : (
                inputSegments.map(segment => {
                  const originalRule = segment.rule || { highActions: [], lowActions: [] };
                  const rule = localRules[segment.id] || { 
                    highActions: originalRule.highActions || [], 
                    lowActions: originalRule.lowActions || [] 
                  };
                  
                  const handleSave = () => {
                    // Validate all pins
                    const allActions = [...(rule.highActions || []), ...(rule.lowActions || [])];
                    for (const action of allActions) {
                      if (action.targetPin) {
                        const val = validateEsp32Pin(action.targetPin, "output");
                        if (!val.isValid) {
                          showToast(`خطا در پایه: ${val.message}`, "error");
                          return;
                        }
                      }
                    }
                    
                    updateSegmentRule(segment.id, rule);
                    publishUpdateRuleCommand(
                      segment.id, 
                      rule.highActions,
                      rule.lowActions
                    );
                    showToast("شرط‌ها با موفقیت ثبت و به دستگاه ارسال شدند.", "success");
                  };

                  const renderActionsList = (type: "high" | "low") => {
                    const actions = type === "high" ? rule.highActions : rule.lowActions;
                    const isHigh = type === "high";
                    const colorClasses = isHigh ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400";
                    const bgClass = isHigh ? "bg-emerald-500" : "bg-rose-500";
                    const borderClass = isHigh ? "border-emerald-100 dark:border-emerald-900/30" : "border-rose-100 dark:border-rose-900/30";
                    const containerBg = isHigh ? "bg-emerald-50/50 dark:bg-emerald-950/20" : "bg-rose-50/50 dark:bg-rose-950/20";
                    const focusClass = isHigh ? "focus:border-emerald-500" : "focus:border-rose-500";

                    const addAction = () => {
                      if (actions.length >= 4) {
                        showToast("حداکثر ۴ عملیات برای هر وضعیت مجاز است", "error");
                        return;
                      }
                      const availableHolds = [0, 3, 5, 10].filter(h => !actions.some(a => a.reqHold === h));
                      if (availableHolds.length === 0) return;

                      const newAction = { reqHold: availableHolds[0], targetPin: "", actionOn: true, actionType: 0, delay: 0 };
                      setLocalRules(prev => ({
                        ...prev,
                        [segment.id]: {
                          ...rule,
                          [isHigh ? "highActions" : "lowActions"]: [...actions, newAction]
                        }
                      }));
                    };

                    const removeAction = (index: number) => {
                      const newArray = [...actions];
                      newArray.splice(index, 1);
                      setLocalRules(prev => ({
                        ...prev,
                        [segment.id]: {
                          ...rule,
                          [isHigh ? "highActions" : "lowActions"]: newArray
                        }
                      }));
                    };

                    const updateAction = (index: number, updates: any) => {
                      const newArray = [...actions];
                      newArray[index] = { ...newArray[index], ...updates };
                      setLocalRules(prev => ({
                        ...prev,
                        [segment.id]: {
                          ...rule,
                          [isHigh ? "highActions" : "lowActions"]: newArray
                        }
                      }));
                    };

                    return (
                      <div className={`border ${borderClass} ${containerBg} p-4 rounded-xl`}>
                        <div className="flex justify-between items-center mb-4">
                          <h4 className={`${colorClasses} font-medium text-sm flex items-center gap-2`}>
                            <span className={`w-2 h-2 rounded-full ${bgClass}`}></span>
                            هنگام {isHigh ? "فعال شدن (HIGH)" : "غیرفعال شدن (LOW)"}
                          </h4>
                          <button 
                            onClick={addAction}
                            disabled={actions.length >= 4}
                            className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md border ${isHigh ? "border-emerald-200 text-emerald-600 hover:bg-emerald-100 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/50" : "border-rose-200 text-rose-600 hover:bg-rose-100 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-900/50"} transition-colors disabled:opacity-50`}
                          >
                            <Plus className="w-3 h-3" /> افزودن عملیات
                          </button>
                        </div>

                        {actions.length === 0 ? (
                          <div className="text-center py-4 text-slate-400 text-xs bg-white/50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                            هیچ عملیاتی تعریف نشده است
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {actions.map((action, idx) => (
                              <div key={idx} className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 relative shadow-sm">
                                <button 
                                  onClick={() => removeAction(idx)}
                                  className="absolute top-2 left-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                  title="حذف"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pr-2">
                                  <div>
                                    <label className="block text-slate-500 mb-1">زمان نگه‌داشتن:</label>
                                    <select
                                      value={action.reqHold}
                                      onChange={(e) => {
                                        const val = parseInt(e.target.value, 10);
                                        // Prevent duplicate holds
                                        if (actions.some((a, i) => i !== idx && a.reqHold === val)) {
                                          showToast("این زمان قبلاً استفاده شده است", "error");
                                          return;
                                        }
                                        updateAction(idx, { reqHold: val });
                                      }}
                                      className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-2 rounded-md focus:outline-none ${focusClass}`}
                                    >
                                      <option value={0}>بدون نیاز به نگه‌داشتن (فوری)</option>
                                      <option value={3}>۳ ثانیه</option>
                                      <option value={5}>۵ ثانیه</option>
                                      <option value={10}>۱۰ ثانیه</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-slate-500 mb-1">پایه هدف (GPIO):</label>
                                    <input
                                      type="text"
                                      placeholder="مثال: 4"
                                      value={action.targetPin}
                                      onChange={(e) => updateAction(idx, { targetPin: e.target.value })}
                                      className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-2 rounded-md text-left focus:outline-none ${focusClass}`}
                                      dir="ltr"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-slate-500 mb-1">وضعیت بشود:</label>
                                    <select
                                      value={action.actionOn ? "1" : "0"}
                                      onChange={(e) => updateAction(idx, { actionOn: e.target.value === "1" })}
                                      className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-2 rounded-md focus:outline-none ${focusClass}`}
                                    >
                                      <option value="1">روشن (HIGH)</option>
                                      <option value="0">خاموش (LOW)</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-slate-500 mb-1">نوع عملیات:</label>
                                    <select
                                      value={action.actionType || 0}
                                      onChange={(e) => updateAction(idx, { actionType: parseInt(e.target.value, 10) })}
                                      className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-2 rounded-md focus:outline-none ${focusClass}`}
                                    >
                                      <option value={0}>همان لحظه تغییر کند</option>
                                      <option value={1}>بعد از زمان تعیین‌شده تغییر کند</option>
                                      <option value={2}>فقط برای مدت معین بماند</option>
                                    </select>
                                  </div>
                                </div>

                                {(action.actionType || 0) > 0 && (
                                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/50 w-full sm:w-1/2 lg:w-1/4">
                                    <label className="block text-slate-500 mb-1 text-xs">زمان عملیات (بین ۱ تا ۶۰ ثانیه):</label>
                                    <input
                                      type="number"
                                      min="1"
                                      max="60"
                                      value={action.delay || 10}
                                      onChange={(e) => updateAction(idx, { delay: parseInt(e.target.value, 10) })}
                                      className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-2 rounded-md text-left text-xs focus:outline-none ${focusClass}`}
                                      dir="ltr"
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  };

                  return (
                    <div key={segment.id} className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-[var(--card-bg)] shadow-sm flex flex-col gap-5">
                      <div className="font-bold text-sm text-[var(--accent3)] flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/50 pb-3">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent3)]"></span>
                        {segment.title} (ورودی پایه: {segment.pin})
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                        {renderActionsList("high")}
                        {renderActionsList("low")}
                      </div>

                      <div className="flex justify-end mt-2">
                        <button 
                          onClick={handleSave}
                          className="px-6 py-2 bg-[var(--accent3)] hover:bg-[var(--accent2)] text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                        >
                          ثبت و ارسال به دستگاه
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
