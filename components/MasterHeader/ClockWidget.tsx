import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const ZOROASTRIAN_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "امرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

function RealTimeClock({ time, className }: { time: Date | null; className?: string }) {
  if (!time) {
    return <Clock className={className} />;
  }

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourRotation = (hours % 12) * 30 + minutes * 0.5;
  const minuteRotation = minutes * 6 + seconds * 0.1;

  return (
    <svg
      xmlns="http://www.w3.org/00/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line
        x1="12"
        y1="12"
        x2="12"
        y2="7"
        style={{
          transform: `rotate(${hourRotation}deg)`,
          transformOrigin: "12px 12px",
          transition: "transform 0.2s linear",
        }}
      />
      <line
        x1="12"
        y1="12"
        x2="12"
        y2="4"
        style={{
          transform: `rotate(${minuteRotation}deg)`,
          transformOrigin: "12px 12px",
          transition: "transform 0.2s linear",
        }}
      />
    </svg>
  );
}

interface ClockWidgetProps {
  variant: "horizontal" | "vertical";
  isSidebarCollapsed?: boolean;
}

import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

export default function ClockWidget({ variant, isSidebarCollapsed }: ClockWidgetProps) {
  const [time, setTime] = useState<Date | null>(null);
  const isPageVisible = useIoTStore((state) => state.isPageVisible);

  useEffect(() => {
    setTime(new Date());
    
    if (!isPageVisible) return;
    
    const timer = setInterval(() => {
      setTime(prev => {
        const now = new Date();
        if (prev && prev.getSeconds() === now.getSeconds()) return prev;
        return now;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPageVisible]);

  if (!time) {
    return (
      <div className={`flex items-center justify-center p-2 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg-solid)] ${variant === "vertical" ? "w-full" : ""}`}>
         <Clock className="w-4 h-4 text-[var(--text-muted)] animate-pulse" />
      </div>
    );
  }

  // Get time string
  const timeString = time.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Get Persian calendar parts
  const formatter = new Intl.DateTimeFormat("en-US-u-ca-persian", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  
  const parts = formatter.formatToParts(time);
  let jYear = 1400;
  let jMonth = 1;
  let jDay = 1;

  parts.forEach((p) => {
    if (p.type === "year") jYear = parseInt(p.value, 10);
    if (p.type === "month") jMonth = parseInt(p.value, 10);
    if (p.type === "day") jDay = parseInt(p.value, 10);
  });

  const shahanshahiYear = jYear + 1180;
  const monthName = ZOROASTRIAN_MONTHS[jMonth - 1] || "نامشخص";
  
  // Format numbers to Persian digits
  const toPersianDigits = (num: number | string) => {
    const id = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num.toString().replace(/[0-9]/g, (w) => id[+w]);
  };

  const dateString = `${toPersianDigits(jDay)} ${monthName} ${toPersianDigits(shahanshahiYear)}`;

  if (variant === "vertical") {
    if (isSidebarCollapsed) {
      return (
        <div className="w-full flex justify-center items-center p-2.5 bg-[var(--card-bg-solid)] md:hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] md:hover:text-[var(--accent3)] transition-all duration-350 md:hover:-translate-y-1 md:hover:shadow-md md:hover:border-[var(--accent3)] group" title={dateString}>
          <RealTimeClock time={time} className="w-4 h-4 transition-transform duration-500 md:group-hover:rotate-90 shrink-0" />
        </div>
      );
    }
    
    return (
      <div className="w-full flex flex-col items-center justify-center p-3 gap-1 bg-[var(--card-bg-solid)] md:hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] rounded-xl transition-all duration-350 md:hover:-translate-y-1.5 md:hover:shadow-xl md:hover:border-[var(--accent3)] group">
        <div className="flex items-center gap-2 text-[var(--accent3)] mb-1">
          <RealTimeClock time={time} className="w-4 h-4 transition-transform duration-500 md:group-hover:rotate-180" />
          <span className="font-mono font-bold text-lg tracking-widest" dir="ltr">{timeString}</span>
        </div>
        <div className="text-[11px] font-bold text-[var(--text-secondary)] md:group-hover:text-[var(--text-primary)] transition-colors">
          {dateString}
        </div>
        <div className="text-[9px] text-[var(--text-muted)] md:group-hover:text-[var(--accent3)] transition-colors mt-0.5">
          تاریخ شاهنشاهی
        </div>
      </div>
    );
  }

  // Horizontal variant
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-[var(--card-bg-solid)] md:hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] rounded-xl transition-all duration-350 md:hover:-translate-y-1 md:hover:shadow-md md:hover:border-[var(--accent3)] group cursor-default">
      <RealTimeClock time={time} className="w-4 h-4 text-[var(--text-tertiary)] md:group-hover:text-[var(--accent3)] transition-all duration-500 md:group-hover:rotate-180 shrink-0" />
      <div className="flex flex-col items-start justify-center">
        <span className="font-mono font-bold text-sm text-[var(--text-primary)] md:group-hover:text-[var(--accent3)] transition-colors" dir="ltr">
          {timeString}
        </span>
        <span className="text-[9px] font-bold text-[var(--text-secondary)] md:group-hover:text-[var(--text-primary)] transition-colors">
          {dateString}
        </span>
      </div>
    </div>
  );
}
