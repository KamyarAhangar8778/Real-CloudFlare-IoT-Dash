import React from "react";
import { Radio } from "lucide-react";
import { BUTTON_CLIP } from "@/lib/presets";

interface ConnectionStatusProps {
  lastSeen: string | null;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ lastSeen }) => {
  // Convert ISO string to beautiful Persian date or standard readable format
  const formatLastSeen = (isoStr: string | null) => {
    if (!isoStr) return "هنوز به برد متصل نشده- در انتظار فرکانس";
    const date = new Date(isoStr);
    return date.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-sans">
      <div className="flex items-center gap-2">
        <Radio className="w-4 h-4 text-emerald-500 animate-ping" />
        <span className="theme-text-muted">آخرین پینگ فعال:</span>
      </div>
      <span 
        className="font-mono text-[11px] bg-[var(--card-bg-solid)] px-2 py-1 border border-[var(--border-color)]"
        style={{ color: "var(--accent3)", clipPath: BUTTON_CLIP }}
      >
        {formatLastSeen(lastSeen)}
      </span>
    </div>
  );
};
