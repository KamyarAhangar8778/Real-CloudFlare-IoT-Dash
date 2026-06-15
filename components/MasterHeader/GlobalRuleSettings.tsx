"use client";

import React, { useState } from "react";
import { Settings2, X } from "lucide-react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

export default function GlobalRuleSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const segments = useIoTStore((state) => state.segments);
  const updateSegmentRule = useIoTStore((state) => state.updateSegmentRule);

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
                  const rule = segment.rule || { targetPin: "", triggerState: true, actionState: true };
                  return (
                    <div key={segment.id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/50 hover:border-[var(--accent3)] transition-colors">
                      <div className="font-bold text-sm mb-4 text-[var(--accent3)] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent3)] animate-pulse"></span>
                        {segment.title} (پایه: {segment.pin})
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <label className="block text-slate-500 mb-1.5">اگر وضعیت ورودی شد:</label>
                          <select
                            value={rule.triggerState ? "1" : "0"}
                            onChange={(e) => updateSegmentRule(segment.id, { ...rule, triggerState: e.target.value === "1" })}
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
                            onChange={(e) => updateSegmentRule(segment.id, { ...rule, targetPin: e.target.value })}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg text-left focus:outline-none focus:border-[var(--accent3)]"
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 mb-1.5">وضعیت پایه هدف بشود:</label>
                          <select
                            value={rule.actionState ? "1" : "0"}
                            onChange={(e) => updateSegmentRule(segment.id, { ...rule, actionState: e.target.value === "1" })}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg focus:outline-none focus:border-[var(--accent3)]"
                          >
                            <option value="1">روشن (HIGH)</option>
                            <option value="0">خاموش (LOW)</option>
                          </select>
                        </div>
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
