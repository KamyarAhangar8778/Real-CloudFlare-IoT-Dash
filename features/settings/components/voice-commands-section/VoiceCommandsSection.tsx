import React, { useState } from "react";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import { Plus, Trash2, Edit2, Check, X, Mic } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function VoiceCommandsSection() {
  const { voiceCommands, setVoiceCommands, segments, macros, isListening, voiceTranscript } = useDashboard();
  const [editingCommandId, setEditingCommandId] = useState<string | null>(null);
  const [newCommandPhrase, setNewCommandPhrase] = useState("");
  const [tempActions, setTempActions] = useState<Array<{targetPin?: string, targetMacro?: string, actionOn?: boolean}>>([]);

  const handleAddCommand = () => {
    const newCommand = {
      id: `voice_${Date.now()}`,
      phrase: "دستور جدید",
      actions: [],
    };
    setVoiceCommands([...(voiceCommands || []), newCommand]);
    setEditingCommandId(newCommand.id);
    setNewCommandPhrase(newCommand.phrase);
    setTempActions([]);
  };

  const handleDeleteCommand = (id: string) => {
    setVoiceCommands((voiceCommands || []).filter((m) => m.id !== id));
    if (editingCommandId === id) setEditingCommandId(null);
  };

  const handleSaveCommand = (id: string) => {
    setVoiceCommands((voiceCommands || []).map(m => m.id === id ? { ...m, phrase: newCommandPhrase, actions: tempActions } : m));
    setEditingCommandId(null);
  };

  const handleCancelEdit = () => {
    setEditingCommandId(null);
  };

  const handleAddAction = () => {
    if (segments.length === 0 && macros.length === 0) return;
    if (segments.length > 0) {
      setTempActions([...tempActions, { targetPin: segments[0].pin, actionOn: true }]);
    } else {
      setTempActions([...tempActions, { targetMacro: macros[0].id }]);
    }
  };

  const handleRemoveAction = (index: number) => {
    const newActions = [...tempActions];
    newActions.splice(index, 1);
    setTempActions(newActions);
  };

  const handleUpdateAction = (index: number, updates: Partial<{targetPin?: string, targetMacro?: string, actionOn?: boolean}>) => {
    const newActions = [...tempActions];
    
    // If switching type (pin to macro or macro to pin), clean up the other property
    if (updates.targetPin !== undefined) {
      newActions[index] = { targetPin: updates.targetPin, actionOn: newActions[index].actionOn ?? true };
    } else if (updates.targetMacro !== undefined) {
      newActions[index] = { targetMacro: updates.targetMacro };
    } else {
      newActions[index] = { ...newActions[index], ...updates };
    }
    
    setTempActions(newActions);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 text-right">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--text-primary)]">
          <Mic className="w-5 h-5 text-[var(--accent3)]" />
          مدیریت دستورات صوتی
        </h3>
        <button
          onClick={handleAddCommand}
          className="bg-[var(--accent3)] text-white p-2 rounded-xl hover:bg-[var(--accent3-dark)] transition-colors shadow-md"
          title="افزودن دستور صوتی جدید"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <p className="text-sm text-[var(--text-secondary)] opacity-80 leading-relaxed">
        با تعریف دستورات صوتی، می‌توانید با گفتن یک عبارت خاص به دستیار صوتی، چندین دستور (مانند روشن/خاموش کردن پایه‌ها یا اجرای ماکروها) را اجرا کنید.
      </p>

      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            className="overflow-hidden mt-4"
          >
            <div className="bg-[var(--accent4-transparent)] border border-[var(--accent4)] rounded-2xl p-4 flex flex-col items-center justify-center gap-3 relative shadow-lg shadow-[var(--accent4)]/10">
              <div className="absolute inset-0 bg-[var(--accent4)] opacity-10 animate-pulse rounded-2xl" />
              <div className="flex items-center gap-3 z-10">
                <div className="w-2 h-2 rounded-full bg-[var(--accent4)] animate-ping" />
                <span className="text-[var(--accent4)] font-semibold text-sm">در حال شنیدن...</span>
                <div className="w-2 h-2 rounded-full bg-[var(--accent4)] animate-ping" />
              </div>
              <div className="z-10 min-h-[2.5rem] flex items-center justify-center">
                <p className="text-2xl font-bold text-center text-[var(--text-primary)]">
                  {voiceTranscript ? `« ${voiceTranscript} »` : "..."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3 mt-4">
        <AnimatePresence>
          {(!voiceCommands || voiceCommands.length === 0) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6 bg-black/5 dark:bg-white/5 border border-dashed border-[var(--border-color)] rounded-2xl text-[var(--text-tertiary)] text-sm"
            >
              هنوز دستور صوتی تعریف نشده است.
            </motion.div>
          )}

          {(voiceCommands || []).map((cmd) => (
            <motion.div
              key={cmd.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--card-bg-solid)] border border-[var(--border-color)] p-4 rounded-2xl shadow-sm flex flex-col gap-3"
            >
              {editingCommandId === cmd.id ? (
                // Edit Mode
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newCommandPhrase}
                      onChange={(e) => setNewCommandPhrase(e.target.value)}
                      placeholder="عبارت صوتی (مثلاً: رقص نور)..."
                      className="flex-1 bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent3)] transition-colors"
                    />
                    <button
                      onClick={() => handleSaveCommand(cmd.id)}
                      className="p-2 bg-[var(--accent3)] text-white rounded-xl hover:bg-[var(--accent3-dark)] transition-colors shadow-sm"
                      title="ذخیره"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-2 bg-black/10 dark:bg-white/10 text-[var(--text-secondary)] rounded-xl hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
                      title="انصراف"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 border-t border-[var(--border-color)] pt-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-[var(--text-secondary)]">عملیات‌ها</h4>
                      <button
                        onClick={handleAddAction}
                        className="text-[var(--accent3)] text-xs font-bold px-2 py-1 bg-[var(--accent3-transparent)] rounded-lg hover:bg-[var(--accent3)] hover:text-white transition-colors"
                      >
                        + افزودن
                      </button>
                    </div>

                    {tempActions.length === 0 && (
                      <p className="text-xs text-[var(--text-tertiary)] opacity-80 text-center py-2">
                        عملیاتی اضافه نشده است
                      </p>
                    )}

                    {tempActions.map((action, index) => {
                      const isMacroAction = action.targetMacro !== undefined;
                      return (
                        <div key={index} className="flex flex-wrap items-center gap-2 bg-black/5 dark:bg-white/5 p-2 rounded-xl">
                          <select
                            value={isMacroAction ? "macro" : "pin"}
                            onChange={(e) => {
                              if (e.target.value === "macro" && macros.length > 0) {
                                handleUpdateAction(index, { targetMacro: macros[0].id });
                              } else if (e.target.value === "pin" && segments.length > 0) {
                                handleUpdateAction(index, { targetPin: segments[0].pin });
                              }
                            }}
                            className="bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-lg px-2 py-1.5 text-xs text-[var(--text-primary)] outline-none"
                          >
                            <option value="pin">ماژول/سگمنت</option>
                            <option value="macro" disabled={macros.length === 0}>دکمه سفارشی (ماکرو)</option>
                          </select>

                          {isMacroAction ? (
                            <select
                              value={action.targetMacro}
                              onChange={(e) => handleUpdateAction(index, { targetMacro: e.target.value })}
                              className="flex-1 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-lg px-2 py-1.5 text-xs text-[var(--text-primary)] outline-none"
                            >
                              {macros.map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.title}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <>
                              <select
                                value={action.targetPin}
                                onChange={(e) => handleUpdateAction(index, { targetPin: e.target.value })}
                                className="flex-1 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-lg px-2 py-1.5 text-xs text-[var(--text-primary)] outline-none"
                              >
                                {segments.map((seg) => (
                                  <option key={seg.id} value={seg.pin}>
                                    {seg.title} ({seg.pin})
                                  </option>
                                ))}
                              </select>
                              <select
                                value={action.actionOn ? "on" : "off"}
                                onChange={(e) => handleUpdateAction(index, { actionOn: e.target.value === "on" })}
                                className="bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-lg px-2 py-1.5 text-xs text-[var(--text-primary)] outline-none"
                              >
                                <option value="on">روشن شود</option>
                                <option value="off">خاموش شود</option>
                              </select>
                            </>
                          )}

                          <button
                            onClick={() => handleRemoveAction(index)}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-[var(--accent3-transparent)] border border-[var(--accent3)] rounded-xl text-xl text-[var(--accent3)]">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="font-bold text-[var(--text-primary)]">"{cmd.phrase}"</span>
                      <span className="text-xs text-[var(--text-secondary)] opacity-80">
                        {cmd.actions.length} عملیات
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        setEditingCommandId(cmd.id);
                        setNewCommandPhrase(cmd.phrase);
                        setTempActions(cmd.actions);
                      }}
                      className="p-2 bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--accent3)] rounded-xl transition-colors"
                      title="ویرایش"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCommand(cmd.id)}
                      className="p-2 bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] hover:text-red-500 rounded-xl transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
