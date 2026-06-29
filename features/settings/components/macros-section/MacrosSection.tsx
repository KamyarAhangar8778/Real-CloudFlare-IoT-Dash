import React, { useState } from "react";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import { Plus, Trash2, Edit2, Check, X, Command, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ICON_MAP, AVAILABLE_ICONS } from "@/features/iot/utils/icons";

const SUGGESTED_ICONS = ["⚡", "🚀", "💡", "🌙", "☀️", "🔒", "🔓", "🎵", "🎬", "🚪", "🚿", "☕", "❄️", "🔥", "💨", "🌿", "🔔", "💤", "🎉", "🎥"];

export default function MacrosSection() {
  const { macros, setMacros, segments } = useDashboard();
  const [editingMacroId, setEditingMacroId] = useState<string | null>(null);
  const [newMacroTitle, setNewMacroTitle] = useState("");
  const [newMacroIcon, setNewMacroIcon] = useState("");
  const [tempActions, setTempActions] = useState<Array<{targetPin: string, actionOn: boolean}>>([]);
  const [iconMode, setIconMode] = useState<"emoji" | "lucide">("emoji");
  const [showLucideIcons, setShowLucideIcons] = useState(false);

  const handleAddMacro = () => {
    const newMacro = {
      id: `macro_${Date.now()}`,
      title: "ماکروی جدید",
      icon: "⚡",
      actions: [],
    };
    setMacros([...macros, newMacro]);
    setEditingMacroId(newMacro.id);
    setNewMacroTitle(newMacro.title);
    setNewMacroIcon(newMacro.icon);
    setIconMode("emoji");
    setTempActions([]);
  };

  const handleDeleteMacro = (id: string) => {
    setMacros(macros.filter((m) => m.id !== id));
    if (editingMacroId === id) setEditingMacroId(null);
  };

  const handleSaveMacro = (id: string) => {
    setMacros(macros.map(m => m.id === id ? { ...m, title: newMacroTitle, icon: newMacroIcon, actions: tempActions } : m));
    setEditingMacroId(null);
  };

  const handleCancelEdit = () => {
    setEditingMacroId(null);
  };

  const handleAddAction = () => {
    if (segments.length === 0) return;
    setTempActions([...tempActions, { targetPin: segments[0].pin, actionOn: true }]);
  };

  const handleRemoveAction = (index: number) => {
    const newActions = [...tempActions];
    newActions.splice(index, 1);
    setTempActions(newActions);
  };

  const handleUpdateAction = (index: number, updates: Partial<{targetPin: string, actionOn: boolean}>) => {
    const newActions = [...tempActions];
    newActions[index] = { ...newActions[index], ...updates };
    setTempActions(newActions);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 text-right">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--text-primary)]">
          <Command className="w-5 h-5 text-[var(--accent3)]" />
          مدیریت ماکروها
        </h3>
        <button
          onClick={handleAddMacro}
          className="bg-[var(--accent3)] text-white p-2 rounded-xl hover:bg-[var(--accent3-dark)] transition-colors shadow-md"
          title="افزودن ماکرو جدید"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <p className="text-sm text-[var(--text-secondary)] opacity-80 leading-relaxed">
        با استفاده از ماکروها می‌توانید چندین دستور (روشن/خاموش کردن پایه‌ها) را به صورت همزمان با یک کلیک اجرا کنید. این دکمه‌ها در هدر داشبورد نمایش داده می‌شوند.
      </p>

      <div className="space-y-3 mt-4">
        <AnimatePresence>
          {macros.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6 bg-black/5 dark:bg-white/5 border border-dashed border-[var(--border-color)] rounded-2xl text-[var(--text-tertiary)] text-sm"
            >
              هنوز ماکرویی تعریف نشده است.
            </motion.div>
          )}

          {macros.map((macro) => (
            <motion.div
              key={macro.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--card-bg-solid)] border border-[var(--border-color)] p-4 rounded-2xl shadow-sm flex flex-col gap-3"
            >
              {editingMacroId === macro.id ? (
                // Edit Mode
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    {iconMode === "emoji" || !ICON_MAP[newMacroIcon] ? (
                      <input
                        type="text"
                        value={newMacroIcon}
                        onChange={(e) => setNewMacroIcon(e.target.value)}
                        placeholder="نماد (مثلا 🚀)"
                        maxLength={2}
                        className="w-16 bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-xl px-2 py-2 text-sm text-center outline-none focus:border-[var(--accent3)] transition-colors"
                      />
                    ) : (
                      <div className="w-16 h-[38px] flex items-center justify-center bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-xl text-sm">
                        {React.createElement(ICON_MAP[newMacroIcon], { className: "w-5 h-5" })}
                      </div>
                    )}
                    <input
                      type="text"
                      value={newMacroTitle}
                      onChange={(e) => setNewMacroTitle(e.target.value)}
                      placeholder="نام ماکرو..."
                      className="flex-1 bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent3)] transition-colors"
                    />
                    <button
                      onClick={() => handleSaveMacro(macro.id)}
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

                  <div className="flex flex-col gap-2 bg-black/5 dark:bg-white/5 p-2 rounded-xl border border-[var(--border-color)]">
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <button 
                        onClick={() => setIconMode("emoji")} 
                        className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg transition-colors ${iconMode === "emoji" ? "bg-[var(--accent3)] text-white shadow-sm" : "bg-black/5 dark:bg-white/5 hover:bg-[var(--card-bg-solid)] text-[var(--text-secondary)]"}`}
                      >
                        ایموجی
                      </button>
                      <button 
                        onClick={() => setIconMode("lucide")} 
                        className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg transition-colors ${iconMode === "lucide" ? "bg-[var(--accent3)] text-white shadow-sm" : "bg-black/5 dark:bg-white/5 hover:bg-[var(--card-bg-solid)] text-[var(--text-secondary)]"}`}
                      >
                        آیکون بی‌رنگ
                      </button>
                    </div>

                    {iconMode === "emoji" ? (
                      <div className="flex flex-wrap gap-1.5 justify-center max-h-[140px] overflow-y-auto p-1 custom-scrollbar">
                        {SUGGESTED_ICONS.map((icon) => (
                          <button
                            key={icon}
                            onClick={() => setNewMacroIcon(icon)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-lg transition-colors ${
                              newMacroIcon === icon 
                                ? "bg-[var(--accent3)] text-white shadow-sm" 
                                : "hover:bg-[var(--card-bg-solid)] text-[var(--text-secondary)]"
                            }`}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 justify-center max-h-[140px] overflow-y-auto p-1 custom-scrollbar">
                        {AVAILABLE_ICONS.map((iconName) => (
                          <button
                            key={iconName}
                            onClick={() => setNewMacroIcon(iconName)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                              newMacroIcon === iconName 
                                ? "bg-[var(--accent3)] text-white shadow-sm" 
                                : "hover:bg-[var(--card-bg-solid)] text-[var(--text-secondary)]"
                            }`}
                            title={iconName}
                          >
                            {React.createElement(ICON_MAP[iconName], { className: "w-4 h-4" })}
                          </button>
                        ))}
                      </div>
                    )}
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

                    {tempActions.map((action, index) => (
                      <div key={index} className="flex items-center gap-2 bg-black/5 dark:bg-white/5 p-2 rounded-xl">
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
                        <button
                          onClick={() => handleRemoveAction(index)}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {macro.icon && (
                      <div className="w-10 h-10 flex items-center justify-center bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-xl text-xl">
                        {ICON_MAP[macro.icon] ? React.createElement(ICON_MAP[macro.icon], { className: "w-5 h-5" }) : macro.icon}
                      </div>
                    )}
                    <div className="flex flex-col gap-1.5">
                      <span className="font-bold text-[var(--text-primary)]">{macro.title}</span>
                      <span className="text-xs text-[var(--text-secondary)] opacity-80">
                        {macro.actions.length} عملیات
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        setEditingMacroId(macro.id);
                        setNewMacroTitle(macro.title);
                        setNewMacroIcon(macro.icon || "");
                        setIconMode(ICON_MAP[macro.icon || ""] ? "lucide" : "emoji");
                        setTempActions(macro.actions);
                      }}
                      className="p-2 bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--accent3)] rounded-xl transition-colors"
                      title="ویرایش"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMacro(macro.id)}
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
