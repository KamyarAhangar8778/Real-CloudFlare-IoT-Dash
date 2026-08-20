import type { SegmentData } from "../core/types";
import SegmentPattern from "./SegmentPattern";

interface CardFooterProps {
  segment: SegmentData;
  isPinOn: boolean;
}

export default function CardFooter({ segment, isPinOn }: CardFooterProps) {
  const activeLabel = isPinOn
    ? segment.on_label || segment.onLabel || "HIGH"
    : segment.off_label || segment.offLabel || "LOW";

  return (
    <div className="relative overflow-hidden px-3 py-1.5 border-t border-[var(--border-color)] bg-transparent min-h-[26px] rounded-b-2xl transition-colors">
      <SegmentPattern variant="footer" />
      <div className="relative z-10 flex justify-between items-center text-[9px] font-sans font-bold tracking-wide text-gray-500 dark:text-gray-400 transition-colors">
        <div className="flex items-center gap-1.5 truncate max-w-[80%]">
          <span className="text-gray-400 dark:text-gray-500 text-[9px] shrink-0">وضعیت:</span>
          <strong
            className={`font-sans font-extrabold text-[10px] truncate ${
              isPinOn ? "text-[var(--accent4)]" : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {activeLabel}
          </strong>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              isPinOn
                ? "bg-[var(--accent4)] shadow-[0_0_6px_var(--accent4)] animate-pulse"
                : "bg-gray-400/40"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
