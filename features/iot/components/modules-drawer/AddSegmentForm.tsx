import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { validateEsp32Pin } from "@/features/iot/utils/pinValidation";
import { Plus, Settings2, ChevronDown } from "lucide-react";
import { Segment } from "./types";
import ButtonModeSelector from "./ButtonModeSelector";
import PinSelector from "./PinSelector";
import FormDetailsInput from "./FormDetailsInput";

interface AddSegmentFormProps {
  onAddSegment: (type: string, pin: string, title?: string, group?: string, mode?: "switch" | "push", auto_off?: number, icon?: string, groupIcon?: string) => void;
  onClose: () => void;
  segments: Segment[];
  animationsEnabled: boolean;
}

export default function AddSegmentForm({
  onAddSegment,
  onClose,
  segments,
  animationsEnabled,
}: AddSegmentFormProps) {
  const { showToast, groupsOrder } = useIoTStore();
  const [selectedType, setSelectedType] = useState("gpio_toggle");
  const [targetPin, setTargetPin] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [groupName, setGroupName] = useState(groupsOrder.length > 0 ? groupsOrder[0] : "Test");
  const [segmentIcon, setSegmentIcon] = useState("");
  const [groupIcon, setGroupIcon] = useState("");
  const [errorText, setErrorText] = useState("");
  const [buttonMode, setButtonMode] = useState<"switch" | "push">("switch");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

    const finalPin = targetPin.trim();
    if (!finalPin) {
      setErrorText("لطفاً شماره پایه را مشخص کنید.");
      return;
    }

    const validation = validateEsp32Pin(finalPin, selectedType);
    if (!validation.isValid) {
      showToast(validation.message, "error");
      return;
    }

    if (validation.isWarning) {
      showToast(validation.message, "success");
    }

    if (segments.some((s) => s.type === selectedType && s.pin === finalPin)) {
      setErrorText(`ماژولی برای پایه GPIO ${finalPin} قبلاً اضافه شده است.`);
      return;
    }

    onAddSegment(selectedType, finalPin, customTitle.trim() || `کنترل پایه دیجیتال (GPIO ${finalPin})`, groupName.trim() || "Test", buttonMode, undefined, segmentIcon || undefined, groupIcon || undefined);
    setCustomTitle("");
    setGroupName(groupsOrder.length > 0 ? groupsOrder[0] : "Test");
    setTargetPin("");
    setSegmentIcon("");
    setGroupIcon("");
    setButtonMode("switch");
    setErrorText("");
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="border border-[var(--border-color)] bg-[var(--card-bg-solid)] p-4 space-y-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 text-[var(--accent3)] border-b border-[var(--border-color)] pb-3">
          <Plus className="w-5 h-5" />
          <span className="text-sm font-bold font-sans">افزودن سگمنت جدید</span>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] theme-text-tertiary font-bold block">نوع سگمنت مانیتورینگ:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full h-10 px-3 text-xs bg-[var(--bg-main)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent3)] outline-none transition-all cursor-pointer font-sans shadow-sm"
          >
            <option value="gpio_toggle" className="bg-[var(--card-bg-solid)]">خاموش و روشن کردن یک پایه (GPIO Control)</option>
            <option value="input" className="bg-[var(--card-bg-solid)]">ورودی دیجیتال 0 و 1 (Input Logic)</option>
          </select>
        </div>
        
        <PinSelector customPin={targetPin} setCustomPin={setTargetPin} />
        
        <FormDetailsInput 
          customTitle={customTitle} 
          setCustomTitle={setCustomTitle} 
          groupName={groupName} 
          setGroupName={setGroupName}
          segmentIcon={segmentIcon}
          setSegmentIcon={setSegmentIcon}
          groupIcon={groupIcon}
          setGroupIcon={setGroupIcon}
          existingGroups={groupsOrder}
        />

        <div className="pt-2 border-t border-[var(--border-color)]">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-2"
          >
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              <span className="text-xs font-bold">تنظیمات جانبی</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAdvanced ? "rotate-180" : ""}`} />
          </button>
          
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-3 pb-1 space-y-4">
                  {selectedType === "gpio_toggle" && (
                    <ButtonModeSelector buttonMode={buttonMode} setButtonMode={setButtonMode} animationsEnabled={animationsEnabled} />
                  )}
                  {selectedType !== "gpio_toggle" && (
                    <p className="text-[10px] text-[var(--text-muted)] text-center">تنظیمات جانبی برای این نوع سگمنت وجود ندارد.</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {errorText && <p className="text-[10px] text-red-500 font-sans mt-2">{errorText}</p>}
        <motion.button
          type="submit"
          whileHover={animationsEnabled ? { scale: 1.02 } : undefined}
          whileTap={animationsEnabled ? { scale: 0.98 } : undefined}
          className="w-full py-3 bg-[var(--accent3)] text-black font-sans font-black text-sm md:hover:bg-opacity-90 transition-all duration-300 cursor-pointer text-center rounded-xl shadow-md shadow-[var(--accent3-transparent)] mt-4"
        >
          ایجاد سگمنت
        </motion.button>
      </div>
    </form>
  );
}
