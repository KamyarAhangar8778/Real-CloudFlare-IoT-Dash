import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useVoiceCommand } from '@/features/iot/hooks/useVoiceCommand';
import { useDashboard } from '@/features/dashboard/context/DashboardContext';
import { motion } from 'motion/react';

interface VoiceCommandButtonProps {
  animationsEnabled?: boolean;
  variant: "vertical" | "horizontal";
  isSidebarCollapsed?: boolean;
}

export default function VoiceCommandButton({ animationsEnabled, variant, isSidebarCollapsed }: VoiceCommandButtonProps) {
  const { isListening, transcript, startListening, stopListening } = useVoiceCommand();
  const { showToast, segments, handleSetPinState } = useDashboard();

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    startListening((finalTranscript) => {
      const cleanTranscript = finalTranscript.trim().replace(/[.،!؟]+$/, '').trim();
      
      if (!cleanTranscript) return;

      let targetSegment = null;
      let targetState: boolean | null = null;
      let actionFound = false;
      let segmentName = "";

      if (cleanTranscript.endsWith(" روشن")) {
        targetState = true;
        actionFound = true;
        segmentName = cleanTranscript.slice(0, -" روشن".length).trim();
      } else if (cleanTranscript.endsWith(" خاموش")) {
        targetState = false;
        actionFound = true;
        segmentName = cleanTranscript.slice(0, -" خاموش".length).trim();
      }

      if (actionFound) {
        targetSegment = segments.find(s => s.title === segmentName);
        if (targetSegment && targetState !== null) {
          handleSetPinState(targetSegment.pin, targetState);
          showToast(`فرمان اجرا شد: ${cleanTranscript}`, "success");
        } else {
          showToast(`سگمنتی با نام «${segmentName}» یافت نشد.`, "error");
        }
      } else {
        showToast(`فرمان نامعتبر: ${cleanTranscript}`, "error");
      }
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    stopListening();
  };

  if (variant === "vertical" && !isSidebarCollapsed) {
    return (
      <button
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onContextMenu={(e) => e.preventDefault()}
        style={{ touchAction: 'none' }}
        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300 transform active:scale-[0.98] group select-none ${
          isListening 
            ? "bg-[var(--accent4-transparent)] border-[var(--accent4)] text-[var(--accent4)]" 
            : "border-[var(--border-color)] bg-[var(--card-bg-solid)] hover:bg-[var(--card-hover-bg)] hover:border-blue-500/50 text-[var(--text-secondary)] hover:text-blue-400"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg transition-all ${isListening ? "bg-[var(--accent4)] text-white" : "bg-blue-500/10 text-blue-500"}`}>
            <Mic className={`w-4 h-4 ${isListening && animationsEnabled ? "animate-pulse" : ""}`} />
          </div>
          <span className="text-xs font-semibold">{isListening ? "در حال شنیدن..." : "فرمان صوتی (نگه دارید)"}</span>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--border-color)] text-[var(--text-muted)] font-mono">
          Voice
        </span>
      </button>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onContextMenu={(e) => e.preventDefault()}
      style={{ touchAction: 'none' }}
      className={`p-2 md:p-2.5 transition-all border rounded-xl flex justify-center items-center group select-none ${
        isListening
          ? "bg-[var(--accent4-transparent)] border-[var(--accent4)] text-[var(--accent4)]"
          : "bg-[var(--card-bg-solid)] hover:bg-[var(--card-hover-bg)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-blue-400 hover:border-blue-500/50"
      }`}
      title="فرمان صوتی (نگه دارید)"
    >
      <Mic className={`w-4 h-4 transition-transform duration-300 ${isListening && animationsEnabled ? "animate-pulse scale-110" : animationsEnabled ? "group-hover:scale-110" : ""}`} />
    </motion.button>
  );
}
