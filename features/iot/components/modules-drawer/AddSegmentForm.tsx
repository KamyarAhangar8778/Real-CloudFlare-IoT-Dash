import React, { useState } from "react";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { Segment } from "./types";
import ButtonModeSelector from "./ButtonModeSelector";
import PinSelector from "./PinSelector";
import FormDetailsInput from "./FormDetailsInput";

interface AddSegmentFormProps {
  onAddSegment: (type: string, pin: string, title?: string, group?: string, mode?: "switch" | "push") => void;
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
  const [selectedType, setSelectedType] = useState("gpio_toggle");
  const [selectedPin, setSelectedPin] = useState("2");
  const [customPin, setCustomPin] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [groupName, setGroupName] = useState("Test");
  const [useCustomPinInput, setUseCustomPinInput] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [buttonMode, setButtonMode] = useState<"switch" | "push">("switch");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

    const targetPin = useCustomPinInput ? customPin.trim() : selectedPin;
    if (!targetPin) {
      setErrorText("لطفاً شماره پایه را مشخص کنید.");
      return;
    }

    if (segments.some((s) => s.type === selectedType && s.pin === targetPin)) {
      setErrorText(`ماژولی برای پایه GPIO ${targetPin} قبلاً اضافه شده است.`);
      return;
    }

    onAddSegment(selectedType, targetPin, customTitle.trim() || `کنترل پایه دیجیتال (GPIO ${targetPin})`, groupName.trim() || "Test", buttonMode);
    setCustomTitle("");
    setGroupName("Test");
    setCustomPin("");
    setButtonMode("switch");
    setErrorText("");
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="border border-[var(--border-color)] bg-[var(--card-bg-solid)] p-4 space-y-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 text-accent3 border-b border-accent3-medium/30 pb-2">
          <Plus className="w-4 h-4" />
          <span className="text-xs font-bold font-sans">افزودن سگمنت جدید</span>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] theme-text-tertiary font-bold block">نوع سگمنت مانیتورینگ:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full h-10 px-3 text-xs bg-black/20 text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent3)] outline-none transition-all cursor-pointer font-sans"
          >
            <option value="gpio_toggle" className="bg-slate-900">خاموش و روشن کردن یک پایه (GPIO Control)</option>
          </select>
        </div>
        <ButtonModeSelector buttonMode={buttonMode} setButtonMode={setButtonMode} animationsEnabled={animationsEnabled} />
        <PinSelector useCustomPinInput={useCustomPinInput} setUseCustomPinInput={setUseCustomPinInput} customPin={customPin} setCustomPin={setCustomPin} selectedPin={selectedPin} setSelectedPin={setSelectedPin} />
        <FormDetailsInput customTitle={customTitle} setCustomTitle={setCustomTitle} groupName={groupName} setGroupName={setGroupName} />
        {errorText && <p className="text-[10px] text-red-500 font-sans mt-2">{errorText}</p>}
        <motion.button
          type="submit"
          whileHover={animationsEnabled ? { scale: 1.02 } : undefined}
          whileTap={animationsEnabled ? { scale: 0.98 } : undefined}
          className="w-full py-2.5 bg-[var(--accent3)] text-black font-sans font-black text-xs hover:bg-opacity-90 transition-all duration-300 cursor-pointer text-center rounded-xl shadow-md shadow-[var(--accent3-transparent)] mt-2"
        >
          + تأیید و ایجاد سگمنت جدید
        </motion.button>
      </div>
    </form>
  );
}
