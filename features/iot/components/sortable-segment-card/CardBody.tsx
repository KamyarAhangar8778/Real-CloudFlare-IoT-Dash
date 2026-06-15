import React from "react";
import { SegmentData } from "./types";
import PinToggle from "./PinToggle";

interface CardBodyProps {
  segment: SegmentData;
  isPinOn: boolean;
  isCompact: boolean;
  isUltraCompact: boolean;
  mode: "switch" | "push";
  buttonProps: any;
  animationsEnabled?: boolean;
}

export default function CardBody({
  segment,
  isPinOn,
  isCompact,
  isUltraCompact,
  mode,
  buttonProps,
  animationsEnabled = true,
}: CardBodyProps) {
  return (
    <div className={`${isUltraCompact ? "p-2 flex-grow flex items-center justify-center" : isCompact ? "p-3 flex-1 flex items-center" : "p-4 flex-1"}`}>
      {segment.type === "input" ? (
        <div className="flex items-center justify-between bg-[var(--card-bg-solid)] p-4 border border-[var(--border-color)] rounded-xl w-full">
          <span className={`text-[10px] font-sans font-bold px-2.5 py-0.5 border rounded-lg ${
            isPinOn ? "border-green-500 text-green-500 bg-green-500/10" : "border-gray-500 text-gray-400"
          }`}>
            {isPinOn ? "ورودی HIGH (1)" : "ورودی LOW (0)"}
          </span>
          <div className="flex items-center gap-3 text-right">
            <div>
              <span className="block text-xs font-sans font-bold theme-text-primary">
                وضیعت پایه {segment.pin}
              </span>
              <span className="block text-[9px] theme-text-muted mt-0.5">
                Digital Input Status
              </span>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-inner ${isPinOn ? "bg-green-500/20 shadow-green-500/50" : "bg-gray-800"}`}>
              <div className={`w-4 h-4 rounded-full ${isPinOn ? "bg-green-400 animate-pulse shadow-[0_0_15px_rgba(74,222,128,0.8)]" : "bg-gray-600"}`} />
            </div>
          </div>
        </div>
      ) : isUltraCompact ? (
        <div className="flex items-center justify-center w-full">
          <PinToggle
            isPinOn={isPinOn}
            buttonProps={buttonProps}
            animationsEnabled={animationsEnabled}
            isUltraCompact={true}
          />
        </div>
      ) : isCompact ? (
        <div className="flex items-center justify-between w-full bg-[var(--card-bg-solid)] p-2 border border-[var(--border-color)] rounded-xl">
          <span className="text-[10px] font-sans font-bold theme-text-secondary">
            {mode === "push" ? `پالس ${segment.pin}` : `پایه ${segment.pin}`}
          </span>
          <PinToggle
            isPinOn={isPinOn}
            buttonProps={buttonProps}
            animationsEnabled={animationsEnabled}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between bg-[var(--card-bg-solid)] p-4 border border-[var(--border-color)] rounded-xl">
          <span className={`text-[10px] font-sans font-bold px-2.5 py-0.5 border rounded-lg ${
            isPinOn ? "border-[var(--accent4)] text-[var(--accent4)] bg-[var(--accent4-transparent)]" : "border-gray-500 text-gray-400"
          }`}>
            {mode === "push" 
              ? (isPinOn ? "پالس فعال HIGH" : "آماده تحریک LOW") 
              : (isPinOn ? "روشن / فعال" : "خاموش / غیرفعال")}
          </span>

          <div className="flex items-center gap-3 text-right">
            <div>
              <span className="block text-xs font-sans font-bold theme-text-primary">
                {mode === "push" ? `شستی پایه ${segment.pin}` : `سوئیچ پایه ${segment.pin}`}
              </span>
              <span className="block text-[9px] theme-text-muted mt-0.5">
                {mode === "push" ? "GPIO Pin Pulse" : "GPIO Pin Trigger"}
              </span>
            </div>
            <PinToggle
              isPinOn={isPinOn}
              buttonProps={buttonProps}
              animationsEnabled={animationsEnabled}
            />
          </div>
        </div>
      )}
    </div>
  );
}
