import React from "react";
import RealTimeClock from "./RealTimeClock";

interface VerticalClockProps {
  time: Date;
  timeString: string;
  dateString: string;
  isSidebarCollapsed?: boolean;
}

export default function VerticalClock({ time, timeString, dateString, isSidebarCollapsed }: VerticalClockProps) {
  if (isSidebarCollapsed) {
    return (
      <div className="w-full flex justify-center items-center p-2.5 bg-[var(--card-bg)] md:hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] md:hover:text-[var(--accent3)] transition-all duration-200 md:hover:shadow-[0_0_12px_var(--accent3-transparent)] md:hover:border-[var(--accent3)]/50 group cursor-default" title={dateString}>
        <RealTimeClock time={time} className="w-4 h-4 transition-transform duration-500 md:group-hover:rotate-90 shrink-0" />
      </div>
    );
  }
  
  return (
    <div className="w-full flex flex-col items-center justify-center p-2.5 gap-0.5 bg-[var(--card-bg)] md:hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] rounded-xl transition-all duration-200 md:hover:shadow-[0_4px_16px_var(--accent3-transparent)] md:hover:border-[var(--accent3)]/50 group cursor-default">
      <div className="flex items-center gap-1.5 text-[var(--accent3)] mb-0.5">
        <RealTimeClock time={time} className="w-3.5 h-3.5 transition-transform duration-500 md:group-hover:rotate-180" />
        <span className="font-mono font-bold text-base tracking-widest" dir="ltr">{timeString}</span>
      </div>
      <div className="text-[10.5px] font-medium text-[var(--text-secondary)] md:group-hover:text-[var(--text-primary)] transition-colors">
        {dateString}
      </div>
      <div className="text-[8.5px] font-medium text-[var(--text-muted)] md:group-hover:text-[var(--accent3)] transition-colors">
        تقویم شاهنشاهی
      </div>
    </div>
  );
}
