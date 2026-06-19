"use client";

import React, { useState } from "react";
import { Settings2, X, Info } from "lucide-react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { publishUpdateRuleCommand } from "@/features/iot/services/mqttService";

import { validateEsp32Pin } from "@/features/iot/utils/pinValidation";

export default function GlobalRuleSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const segments = useIoTStore((state) => state.segments);
  const updateSegmentRule = useIoTStore((state) => state.updateSegmentRule);
  const showToast = useIoTStore((state) => state.showToast);

  // Local state for tracking edited rules
  const [localRules, setLocalRules] = useState<Record<string, { targetPinHigh: string; actionOnHigh: boolean; targetPinLow: string; actionOnLow: boolean }>>({});


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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-[var(--card-bg-solid)]">
              <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">مدیریت شرط‌ها (Rules)</h2>
              <button onClick={() => setIsOpen(false)} className="p-1.5 text-slate-500 hover:text-red-500 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 space-y-6" dir="rtl">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 p-3 rounded-lg text-xs flex gap-2 items-start">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  در این بخش می‌توانید مشخص کنید زمانی که یک سنسور یا کلیدِ ورودی <strong>روشن (HIGH)</strong> می‌شود چه اتفاقی بیفتد، و زمانی که <strong>خاموش (LOW)</strong> می‌شود چه اتفاقی بیفتد. در صورت خالی گذاشتن شماره پایه (GPIO)، برای آن حالت هیچ کاری انجام نمی‌شود.
                </p>
              </div>

              {inputSegments.length === 0 ? (
                <p className="text-center text-slate-500 text-sm py-8">هیچ ورودی (سنسور/کلید) در داشبورد وجود ندارد.</p>
              ) : (
                inputSegments.map(segment => {
                  const originalRule = segment.rule || { targetPinHigh: "", actionOnHigh: true, targetPinLow: "", actionOnLow: false };
                  const rule = localRules[segment.id] || originalRule;
                  
                  const handleLocalChange = (updates: Partial<typeof rule>) => {
                    setLocalRules(prev => ({
                      ...prev,
                      [segment.id]: { ...rule, ...updates }
                    }));
                  };

                  const handleSave = () => {
                    if (rule.targetPinHigh) {
                      const valHigh = validateEsp32Pin(rule.targetPinHigh, "output");
                      if (!valHigh.isValid) {
                        showToast(`خطا در پایه HIGH: ${valHigh.message}`, "error");
                        return;
                      }
                      if (valHigh.isWarning) showToast(valHigh.message, "success");
                    }
                    if (rule.targetPinLow) {
                      const valLow = validateEsp32Pin(rule.targetPinLow, "output");
                      if (!valLow.isValid) {
                        showToast(`خطا در پایه LOW: ${valLow.message}`, "error");
                        return;
                      }
                      if (valLow.isWarning) showToast(valLow.message, "success");
                    }
                    
                    updateSegmentRule(segment.id, rule);
                    publishUpdateRuleCommand(segment.id, rule.targetPinHigh, rule.actionOnHigh, rule.targetPinLow, rule.actionOnLow);
                    showToast("شرط‌ها با موفقیت ثبت و به دستگاه ارسال شدند.", "success");
                  };

                  return (
                    <div key={segment.id} className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/50 hover:border-[var(--accent3)] transition-colors flex flex-col gap-5">
                      <div className="font-bold text-sm text-[var(--accent3)] flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent3)] animate-pulse"></span>
                        {segment.title} (ورودی پایه: {segment.pin})
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* HIGH Trigger Section */}
                        <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-xl">
                          <h4 className="text-emerald-600 dark:text-emerald-400 font-medium text-xs mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            هنگام فعال شدن (HIGH)
                          </h4>
                          <div className="space-y-3 text-xs">
                            <div>
                              <label className="block text-slate-500 mb-1.5">پایه هدف (GPIO):</label>
                              <input
                                type="text"
                                placeholder="خالی = بدون عملیات"
                                value={rule.targetPinHigh}
                                onChange={(e) => handleLocalChange({ targetPinHigh: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-2 rounded-lg text-left focus:outline-none focus:border-emerald-500"
                                dir="ltr"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-500 mb-1.5">وضعیت پایه هدف بشود:</label>
                              <select
                                value={rule.actionOnHigh ? "1" : "0"}
                                onChange={(e) => handleLocalChange({ actionOnHigh: e.target.value === "1" })}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-2 rounded-lg focus:outline-none focus:border-emerald-500"
                              >
                                <option value="1">روشن (HIGH)</option>
                                <option value="0">خاموش (LOW)</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* LOW Trigger Section */}
                        <div className="bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/30 p-4 rounded-xl">
                          <h4 className="text-rose-600 dark:text-rose-400 font-medium text-xs mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            هنگام غیرفعال شدن (LOW)
                          </h4>
                          <div className="space-y-3 text-xs">
                            <div>
                              <label className="block text-slate-500 mb-1.5">پایه هدف (GPIO):</label>
                              <input
                                type="text"
                                placeholder="خالی = بدون عملیات"
                                value={rule.targetPinLow}
                                onChange={(e) => handleLocalChange({ targetPinLow: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-2 rounded-lg text-left focus:outline-none focus:border-rose-500"
                                dir="ltr"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-500 mb-1.5">وضعیت پایه هدف بشود:</label>
                              <select
                                value={rule.actionOnLow ? "1" : "0"}
                                onChange={(e) => handleLocalChange({ actionOnLow: e.target.value === "1" })}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-2 rounded-lg focus:outline-none focus:border-rose-500"
                              >
                                <option value="1">روشن (HIGH)</option>
                                <option value="0">خاموش (LOW)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end mt-2">
                        <button 
                          onClick={handleSave}
                          className="px-6 py-2.5 bg-[var(--accent3)] hover:bg-[var(--accent2)] text-white text-sm font-medium rounded-lg transition-colors"
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
