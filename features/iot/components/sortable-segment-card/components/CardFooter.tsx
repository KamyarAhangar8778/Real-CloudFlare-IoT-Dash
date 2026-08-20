import React from "react";
import { SegmentData } from "../core/types";
import SegmentPattern from "./SegmentPattern";

interface CardFooterProps {
  segment: SegmentData;
  isPinOn: boolean;
}

export default function CardFooter({ segment, isPinOn }: CardFooterProps) {
  return (
    <div className="relative overflow-hidden p-2 border-t border-[var(--border-color)] bg-transparent min-h-[24px] rounded-b-2xl transition-colors">
      <SegmentPattern variant="footer" />
      <div className="relative z-10 flex justify-between items-center text-[8px] font-mono tracking-wider text-gray-500 dark:text-gray-400 md:hover:text-[var(--accent3)] transition-colors">
        <span>SW STATE: <strong className={isPinOn ? "text-[var(--accent4)]" : "text-gray-400 dark:text-gray-500"}>{isPinOn ? "HIGH" : "LOW"}</strong></span>
        <span>ADDR: PIN_{segment.pin}</span>
      </div>
    </div>
  );
}
