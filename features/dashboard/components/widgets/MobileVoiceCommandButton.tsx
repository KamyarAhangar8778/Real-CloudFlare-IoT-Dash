import React from 'react';
import { Mic } from 'lucide-react';
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
    .replace(/[\u200C\s]+/g, ' ')
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

export default function MobileVoiceCommandButton() {
  const { isListening, transcript, startListening, stopListening } = useVoiceCommand();
  const { showToast, segments, macros, voiceCommands, handleSetPinState, handleBatchPinState, animationsEnabled, activeGroupId, activeSegmentId } = useDashboard();

  const isDragging = !!activeGroupId || !!activeSegmentId;

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (e.currentTarget && e.currentTarget.setPointerCapture) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    // We don't open the settings menu here for the mobile floating button
    startListening((finalTranscript) => {
      executeCommand(finalTranscript);
    });
  };

  const executeCommand = (finalTranscript: string) => {
    const cleanTranscript = finalTranscript.trim().replace(/[.،!؟]+$/, '').trim();
    const normalizedTranscript = normalizePhonetics(cleanTranscript);
    
    if (!cleanTranscript) return;

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

  if (isDragging) return null;

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onContextMenu={(e) => e.preventDefault()}
      style={{ touchAction: 'none' }}
      className={`sm:hidden fixed bottom-6 left-6 z-50 p-4 rounded-full shadow-lg flex justify-center items-center select-none transition-all duration-300 ${
        isListening
          ? "bg-[var(--accent4)] shadow-[0_0_20px_var(--accent4-transparent)] text-white"
          : "bg-[var(--card-bg-solid)] border border-[var(--border-color)] text-[var(--text-secondary)] shadow-[0_4px_15px_-5px_var(--border-color)]"
      }`}
      title="فرمان صوتی (نگه دارید)"
    >
      <Mic className={`w-6 h-6 ${isListening && animationsEnabled ? "animate-pulse" : ""}`} />
    </motion.button>
  );
}
