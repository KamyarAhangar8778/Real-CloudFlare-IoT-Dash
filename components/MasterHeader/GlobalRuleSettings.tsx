"use client";

import React, { useState } from "react";
import { Settings2, X } from "lucide-react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

import { validateEsp32Pin } from "@/features/iot/utils/pinValidation";

export default function GlobalRuleSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const segments = useIoTStore((state) => state.segments);
  const updateSegmentRule = useIoTStore((state) => state.updateSegmentRule);
  const showToast = useIoTStore((state) => state.showToast);

  // Local state for tracking edited rules
  const [localRules, setLocalRules] = useState<Record<string, { targetPin: string; triggerState: boolean; actionState: boolean }>>({});


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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-[var(--card-bg-solid)]">
              <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">مدیریت شرط‌ها (Rules)</h2>
              <button onClick={() => setIsOpen(false)} className="p-1.5 text-slate-500 hover:text-red-500 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 space-y-4" dir="rtl">
              {inputSegments.length === 0 ? (
                <p className="text-center text-slate-500 text-sm py-8">هیچ ورودی (سنسور/کلید) در داشبورد وجود ندارد.</p>
              ) : (
                inputSegments.map(segment => {
                  // Fallback to segment.rule, or default, but local overrides take precedence
                  const originalRule = segment.rule || { targetPin: "", triggerState: true, actionState: true };
                  const rule = localRules[segment.id] || originalRule;
                  
                  const handleLocalChange = (updates: Partial<typeof rule>) => {
                    setLocalRules(prev => ({
                      ...prev,
                      [segment.id]: { ...rule, ...updates }
                    }));
                  };

                  const handleSave = () => {
                    const validation = validateEsp32Pin(rule.targetPin, "output");
                    if (!validation.isValid) {
                      showToast(validation.message, "error");
                      return;
                    }
                    if (validation.isWarning) {
                      showToast(validation.message, "success");
                    }
                    
                    updateSegmentRule(segment.id, rule);
                    showToast("شرط با موفقیت ثبت و به دستگاه ارسال شد.", "success");
                  };

                  return (
                    <div key={segment.id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/50 hover:border-[var(--accent3)] transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                      <div className="flex-1 w-full">
                        <div className="font-bold text-sm mb-4 text-[var(--accent3)] flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[var(--accent3)] animate-pulse"></span>
                          {segment.title} (پایه: {segment.pin})
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                          <div>
                            <label className="block text-slate-500 mb-1.5">اگر وضعیت ورودی شد:</label>
                            <select
                              value={rule.triggerState ? "1" : "0"}
                              onChange={(e) => handleLocalChange({ triggerState: e.target.value === "1" })}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg focus:outline-none focus:border-[var(--accent3)]"
                            >
                              <option value="1">روشن (HIGH)</option>
                              <option value="0">خاموش (LOW)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-slate-500 mb-1.5">پایه هدف (GPIO):</label>
                            <input
                              type="text"
                              placeholder="مثلا 2 یا 4"
                              value={rule.targetPin}
                              onChange={(e) => handleLocalChange({ targetPin: e.target.value })}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg text-left focus:outline-none focus:border-[var(--accent3)]"
                              dir="ltr"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 mb-1.5">وضعیت پایه هدف بشود:</label>
                            <select
                              value={rule.actionState ? "1" : "0"}
                              onChange={(e) => handleLocalChange({ actionState: e.target.value === "1" })}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg focus:outline-none focus:border-[var(--accent3)]"
                            >
                              <option value="1">روشن (HIGH)</option>
                              <option value="0">خاموش (LOW)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={handleSave}
                        className="w-full sm:w-auto px-4 py-2.5 bg-[var(--accent3)] hover:bg-[var(--accent2)] text-white text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
                      >
                        ثبت و ارسال به دستگاه
                      </button>
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
