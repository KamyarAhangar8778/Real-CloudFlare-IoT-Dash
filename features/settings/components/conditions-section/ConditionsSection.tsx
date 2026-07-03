"use client";

import React, { useState } from "react";
import { Info, Plus, Trash2, Settings2 } from "lucide-react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { publishUpdateRuleCommand } from "@/features/iot/services/mqttService";
import { validateEsp32Pin } from "@/features/iot/utils/pinValidation";
import { motion, AnimatePresence } from "motion/react";

export default function ConditionsSection() {
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
    <div className="space-y-6">
      <div className="bg-[var(--accent3-transparent)] border border-[var(--accent3)] text-[var(--accent3)] p-4 rounded-xl text-xs flex gap-3 items-start">
        <Info className="w-5 h-5 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-medium">
          در این بخش می‌توانید برای زمان‌های مختلف نگه‌داشتن کلید (مثلاً 0، 3، 5 یا 10 ثانیه) عملیات متفاوتی تعریف کنید. 
          شما می‌توانید برای هر وضعیت چندین عملیات بسازید تا هرکدام روی یک پایه‌ی مجزا تاثیر بگذارند.
        </p>
      </div>

      {inputSegments.length === 0 ? (
        <div className="text-center py-8 bg-[var(--card-bg-solid)] rounded-2xl border border-dashed border-[var(--border-color)]">
          <Settings2 className="w-8 h-8 mx-auto mb-2 text-[var(--text-secondary)] opacity-50" />
          <p className="text-sm text-[var(--text-secondary)]">هیچ ورودی (سنسور/کلید) در داشبورد وجود ندارد.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {inputSegments.map(segment => {
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
              const colorClasses = isHigh ? "text-[var(--accent4)]" : "text-[var(--accent3)]";
              const bgClass = isHigh ? "bg-[var(--accent4)]" : "bg-[var(--accent3)]";
              const borderClass = isHigh ? "border-[var(--accent4-transparent)]" : "border-[var(--accent3-transparent)]";
              const containerBg = isHigh ? "bg-[var(--accent4-transparent)]" : "bg-[var(--accent3-transparent)]";

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
                    <h4 className={`${colorClasses} font-bold text-sm flex items-center gap-2`}>
                      <span className={`w-2 h-2 rounded-full ${bgClass}`}></span>
                      هنگام {isHigh ? "فعال شدن" : "غیرفعال شدن"}
                    </h4>
                    <button 
                      onClick={addAction}
                      disabled={actions.length >= 4}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors disabled:opacity-50 ${isHigh ? "border-[var(--accent4)] text-[var(--accent4)] hover:bg-[var(--accent4)] hover:text-white" : "border-[var(--accent3)] text-[var(--accent3)] hover:bg-[var(--accent3)] hover:text-white"}`}
                    >
                      <Plus className="w-3 h-3" /> افزودن
                    </button>
                  </div>

                  {actions.length === 0 ? (
                    <div className="text-center py-4 text-[var(--text-tertiary)] text-xs bg-[var(--card-bg-solid)] rounded-lg border border-dashed border-[var(--border-color)]">
                      هیچ عملیاتی تعریف نشده
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {actions.map((action, idx) => (
                        <div key={idx} className="bg-[var(--card-bg-solid)] p-4 rounded-xl border border-[var(--border-color)] relative shadow-sm">
                          <button 
                            onClick={() => removeAction(idx)}
                            className="absolute top-3 left-3 p-1.5 text-[var(--accent4)] hover:bg-[var(--accent4-transparent)] border border-transparent hover:border-[var(--accent4)] rounded-lg transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          
                          <div className="flex flex-col gap-3 text-xs pr-2">
                            <div>
                              <label className="block text-[var(--text-secondary)] font-semibold mb-1.5">زمان نگه‌داشتن:</label>
                              <select
                                value={action.reqHold}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (actions.some((a, i) => i !== idx && a.reqHold === val)) {
                                    showToast("این زمان قبلاً استفاده شده است", "error");
                                    return;
                                  }
                                  updateAction(idx, { reqHold: val });
                                }}
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg focus:outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all text-[var(--text-primary)]"
                              >
                                <option value={0}>بدون نیاز به نگه‌داشتن (فوری)</option>
                                <option value={3}>۳ ثانیه</option>
                                <option value={5}>۵ ثانیه</option>
                                <option value={10}>۱۰ ثانیه</option>
                              </select>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                              <div className="flex-1">
                                <label className="block text-[var(--text-secondary)] font-semibold mb-1.5">پایه هدف (GPIO):</label>
                                <input
                                  type="text"
                                  placeholder="مثال: 4"
                                  value={action.targetPin}
                                  onChange={(e) => updateAction(idx, { targetPin: e.target.value })}
                                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg focus:outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all text-[var(--text-primary)] text-left"
                                  dir="ltr"
                                />
                              </div>
                              <div className="flex-1">
                                <label className="block text-[var(--text-secondary)] font-semibold mb-1.5">وضعیت:</label>
                                <select
                                  value={action.actionOn ? "1" : "0"}
                                  onChange={(e) => updateAction(idx, { actionOn: e.target.value === "1" })}
                                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg focus:outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all text-[var(--text-primary)]"
                                >
                                  <option value="1">روشن (HIGH)</option>
                                  <option value="0">خاموش (LOW)</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[var(--text-secondary)] font-semibold mb-1.5">نوع عملیات:</label>
                              <select
                                value={action.actionType || 0}
                                onChange={(e) => updateAction(idx, { actionType: parseInt(e.target.value, 10) })}
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg focus:outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all text-[var(--text-primary)]"
                              >
                                <option value={0}>همان لحظه تغییر کند</option>
                                <option value={1}>بعد از زمان تعیین‌شده تغییر کند</option>
                                <option value={2}>فقط برای مدت معین بماند</option>
                              </select>
                            </div>

                            {(action.actionType || 0) > 0 && (
                              <div>
                                <label className="block text-[var(--text-secondary)] font-semibold mb-1.5">زمان عملیات (بین ۱ تا ۶۰ ثانیه):</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="60"
                                  value={action.delay || 10}
                                  onChange={(e) => updateAction(idx, { delay: parseInt(e.target.value, 10) })}
                                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg focus:outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all text-[var(--text-primary)] text-left"
                                  dir="ltr"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            };

            return (
              <div key={segment.id} className="p-5 border border-[var(--border-color)] rounded-2xl bg-[var(--card-bg-solid)] shadow-sm flex flex-col gap-5">
                <div className="font-bold text-sm text-[var(--accent3)] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                  <div className="p-1.5 rounded-lg bg-[var(--accent3-transparent)] text-[var(--accent3)]">
                    <Settings2 className="w-4 h-4" />
                  </div>
                  {segment.title} (پایه: {segment.pin})
                </div>

                <div className="flex flex-col gap-4">
                  {renderActionsList("high")}
                  {renderActionsList("low")}
                </div>

                <div className="flex justify-end mt-2">
                  <button 
                    onClick={handleSave}
                    className="w-full py-3 bg-[var(--accent3)] hover:bg-[var(--accent3-dark)] text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-[var(--accent3-transparent)]"
                  >
                    ثبت و ارسال
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
