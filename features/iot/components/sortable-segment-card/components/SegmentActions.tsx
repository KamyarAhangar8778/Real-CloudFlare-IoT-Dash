import React from "react";
import { SegmentData } from "../core/types";
import SegmentControls from "./SegmentControls";
import { SegmentDeleteIcon, SegmentGripIcon } from "@/components/icons";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

interface SegmentActionsProps {
  segment: SegmentData;
  onRemove: (id: string) => void;
  attributes: any;
  listeners: any;
  onUpdateSegmentMode?: (id: string, mode: "switch" | "push") => void;
  onUpdateSegmentAutoOff?: (id: string, autoOff: number) => void;
  mode: "switch" | "push";
  countdown?: number | null;
  autoOffMenuProps: {
    showAutoOffMenu: boolean;
    setShowAutoOffMenu: (val: boolean) => void;
    autoOffButtonRef: React.RefObject<HTMLButtonElement | null>;
    autoOffMenuRef: React.RefObject<HTMLDivElement | null>;
  };
}

export default function SegmentActions({
  segment,
  onRemove,
  attributes,
  listeners,
  onUpdateSegmentMode,
  onUpdateSegmentAutoOff,
  mode,
  countdown,
  autoOffMenuProps,
}: SegmentActionsProps) {
  const animationsEnabled = useIoTStore((s) => s.animationsEnabled);

  return (
    <>
      <button
        onClick={() => onRemove(segment.id)}
        className="group/del p-1.5 bg-slate-200/90 dark:bg-slate-950 border border-slate-300/85 dark:border-slate-800 text-slate-600 dark:text-gray-400 md:hover:border-rose-500/60 md:hover:bg-rose-500/10 md:hover:text-rose-400 transition-all duration-200 cursor-pointer rounded-lg shadow-xs active:scale-95 flex items-center justify-center"
        title="حذف این سگمنت"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <SegmentDeleteIcon
          size={14}
          animationsEnabled={animationsEnabled}
        />
      </button>
      <div
        {...attributes}
        {...listeners}
        className="group/grip p-1.5 bg-slate-200/90 dark:bg-slate-950 border border-slate-300/85 dark:border-slate-800 text-slate-600 dark:text-gray-400 md:hover:border-[var(--accent4)] md:hover:bg-[var(--accent4-transparent)] md:hover:text-[var(--accent4)] cursor-grab active:cursor-grabbing transition-all duration-200 rounded-lg shadow-xs active:scale-95 flex items-center justify-center"
        title="کشیدن برای جابه‌جایی"
      >
        <SegmentGripIcon
          size={14}
          animationsEnabled={animationsEnabled}
        />
      </div>
      {onUpdateSegmentMode && segment.type !== "input" && (
        <div className="mr-1.5">
          <SegmentControls
            segment={segment}
            mode={mode}
            onUpdateSegmentMode={onUpdateSegmentMode}
            onUpdateSegmentAutoOff={onUpdateSegmentAutoOff}
            countdown={countdown}
            {...autoOffMenuProps}
          />
        </div>
      )}
    </>
  );
}

