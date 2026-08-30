import React from 'react';
import { VoiceAssistantIcon } from '@/components/icons';
import { VoiceCommandButtonProps } from './types';

interface VerticalVoiceButtonProps extends VoiceCommandButtonProps {
  isListening: boolean;
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerUp: (e: React.PointerEvent) => void;
  handlePointerCancel: (e: React.PointerEvent) => void;
}

export default function VerticalVoiceButton({ 
  animationsEnabled = false, 
  isListening, 
  handlePointerDown, 
  handlePointerUp, 
  handlePointerCancel,
  isSidebarCollapsed,
}: VerticalVoiceButtonProps) {
  if (isSidebarCollapsed) {
    return (
      <button
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onContextMenu={(e) => e.preventDefault()}
        style={{ touchAction: 'none' }}
        className={`w-10 h-10 p-2 rounded-xl border transition-all cursor-pointer flex justify-center items-center shadow-xs active:scale-95 select-none ${
          isListening 
            ? "bg-[var(--accent4-transparent)] border-[var(--accent4)] text-[var(--accent4)] shadow-[0_0_14px_var(--accent4-transparent)] animate-pulse" 
            : "bg-[var(--card-bg)] md:hover:bg-[var(--card-hover-bg)] border-[var(--border-color)] text-[var(--text-secondary)] md:hover:border-[var(--accent4)]/60 md:hover:text-[var(--accent4)]"
        }`}
        title={isListening ? "در حال شنیدن..." : "فرمان صوتی (نگه دارید)"}
      >
        <VoiceAssistantIcon
          size={18}
          animationsEnabled={animationsEnabled}
          isListening={isListening}
        />
      </button>
    );
  }

  return (
    <button
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onContextMenu={(e) => e.preventDefault()}
      style={{ touchAction: 'none' }}
      className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all duration-200 transform active:scale-[0.98] group select-none cursor-pointer shadow-xs ${
        isListening 
          ? "bg-[var(--accent4-transparent)] border-[var(--accent4)] text-[var(--accent4)] shadow-[0_0_16px_var(--accent4-transparent)] font-semibold" 
          : "border-[var(--border-color)] bg-[var(--card-bg)] md:hover:bg-[var(--card-hover-bg)] md:hover:border-[var(--accent4)]/40 text-[var(--text-secondary)] md:hover:text-[var(--text-primary)]"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${isListening ? "bg-[var(--accent4)] text-white shadow-xs" : "bg-[var(--accent4-transparent)] text-[var(--accent4)]"}`}>
          <VoiceAssistantIcon
            size={16}
            animationsEnabled={animationsEnabled}
            isListening={isListening}
          />
        </div>
        <span className="text-xs font-semibold">{isListening ? "در حال شنیدن..." : "فرمان صوتی (نگه دارید)"}</span>
      </div>
      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--border-color)]/60 text-[var(--text-muted)] font-mono">
        Voice
      </span>
    </button>
  );
}
