import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useVoiceCommand } from '@/features/iot/hooks/useVoiceCommand';
import { useDashboard } from '@/features/dashboard/context/DashboardContext';
import { motion } from 'motion/react';

function normalizePhonetics(text: string): string {
  if (!text) return "";
  return text
    .replace(/[غق]/g, 'ق')
    .replace(/[سصث]/g, 'س')
    .replace(/[زضظذ]/g, 'ز')
    .replace(/[هح]/g, 'ح')
    .replace(/[تط]/g, 'ت')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[\u200C\s]+/g, ' ') // یکپارچه‌سازی فاصله‌ها و نیم‌فاصله‌ها
    .trim();
}

function getSimilarity(a: string, b: string): number {
  if (a.length === 0 && b.length === 0) return 1;
  if (a.length === 0 || b.length === 0) return 0;
  
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  const dist = matrix[b.length][a.length];
  const maxLen = Math.max(a.length, b.length);
  return (maxLen - dist) / maxLen;
}

interface VoiceCommandButtonProps {
  animationsEnabled?: boolean;
  variant: "vertical" | "horizontal";
  isSidebarCollapsed?: boolean;
}

export default function VoiceCommandButton({ animationsEnabled, variant, isSidebarCollapsed }: VoiceCommandButtonProps) {
  const { isListening, transcript, startListening, stopListening } = useVoiceCommand();
  const { showToast, segments, macros, voiceCommands, handleSetPinState, handleBatchPinState, setIsMenuOpen, setActiveSettingsTab } = useDashboard();

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (e.currentTarget && e.currentTarget.setPointerCapture) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    setIsMenuOpen(true);
    setActiveSettingsTab("voice-commands");
    startListening();
  };

  const executeCommand = (finalTranscript: string) => {
    const cleanTranscript = finalTranscript.trim().replace(/[.،!؟]+$/, '').trim();
    const normalizedTranscript = normalizePhonetics(cleanTranscript);
    
    if (!cleanTranscript) return;

    // 1. Check Custom Voice Commands first (Fuzzy Matching > 80%)
    let bestMatchCmd = null;
    let highestSim = 0;
    
    for (const c of (voiceCommands || [])) {
      const sim = getSimilarity(normalizePhonetics(c.phrase), normalizedTranscript);
      if (sim > highestSim && sim >= 0.8) {
        highestSim = sim;
        bestMatchCmd = c;
      }
    }

    if (bestMatchCmd && bestMatchCmd.actions && bestMatchCmd.actions.length > 0) {
      const batchActions: Array<{ targetPin: string; actionOn: boolean }> = [];
      
      bestMatchCmd.actions.forEach((act) => {
        if (act.targetPin) {
          batchActions.push({ targetPin: act.targetPin, actionOn: act.actionOn ?? true });
        } else if (act.targetMacro) {
          const m = macros.find((m) => m.id === act.targetMacro);
          if (m) {
            batchActions.push(...m.actions);
          }
        }
      });

      if (batchActions.length > 0) {
        handleBatchPinState(batchActions);
        showToast(`فرمان صوتی اجرا شد: ${cleanTranscript}`, "success");
        return;
      }
    }

    // 2. Fallback to parsing "<Segment Name> روشن/خاموش"
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
      // Fuzzy match for segment name too
      const normalizedSegName = normalizePhonetics(segmentName);
      let bestSeg = null;
      let highestSegSim = 0;
      
      for (const s of segments) {
        const sim = getSimilarity(normalizePhonetics(s.title), normalizedSegName);
        if (sim > highestSegSim && sim >= 0.8) {
          highestSegSim = sim;
          bestSeg = s;
        }
      }

      if (bestSeg && targetState !== null) {
        handleSetPinState(bestSeg.pin, targetState);
        showToast(`فرمان صوتی اجرا شد: ${cleanTranscript}`, "success");
      } else {
        showToast(`سگمنتی با نام مشابه «${segmentName}» یافت نشد.`, "error");
      }
    } else {
      showToast(`فرمان نامعتبر: ${cleanTranscript}`, "error");
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    if (e.currentTarget && e.currentTarget.releasePointerCapture) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
    stopListening();
    // Execute immediately using the current transcript
    executeCommand(transcript);
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    e.preventDefault();
    if (e.currentTarget && e.currentTarget.releasePointerCapture) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
    stopListening();
  };

  if (variant === "vertical" && !isSidebarCollapsed) {
    return (
      <button
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
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
      onPointerCancel={handlePointerCancel}
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
