"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const toPersianDigits = (num: string | number) => {
    const id = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return num.toString().replace(/[0-9]/g, function(w) {
        return id[+w];
    });
};

const AnimatedDigit = ({ digit, isSecondary = false }: { digit: string, isSecondary?: boolean }) => {
    return (
        <div className={`relative w-4 h-6 overflow-hidden flex justify-center items-center ${isSecondary ? 'text-[var(--accent3-medium)]' : 'text-[var(--accent3)]'}`}>
            <AnimatePresence mode="popLayout">
                <motion.span
                    key={digit}
                    initial={{ y: "100%", opacity: 0, filter: "blur(2px)" }}
                    animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: "-100%", opacity: 0, filter: "blur(2px)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute font-mono text-base font-bold tracking-widest leading-none"
                >
                    {toPersianDigits(digit)}
                </motion.span>
            </AnimatePresence>
        </div>
    );
};

export default function ImperialClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTime(new Date()); 
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return <div className="w-32 h-10 opacity-0" />; // Placeholder
  }

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  const persianFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
     day: 'numeric',
     month: 'long',
  });
  
  const formatterParts = persianFormatter.formatToParts(time);
  const day = formatterParts.find(p => p.type === 'day')?.value || '';
  const month = formatterParts.find(p => p.type === 'month')?.value || '';
  
  const latinFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian-nu-latn', {
      year: 'numeric'
  });
  const latinYearStr = latinFormatter.format(time);
  const solarYear = parseInt(latinYearStr, 10);
  const shahanshahiYear = solarYear + 1180;

  const stringMonthsMap: Record<string, string> = {
    "فروردین": "فروردین (فروهر)",
    "اردیبهشت": "اردیبهشت (اشاوهیشت)",
    "خرداد": "خرداد (هورتات)",
    "تیر": "تیر (تشتر)",
    "مرداد": "امرداد (امرتات)",
    "شهریور": "شهریور (خشتره ویریه)",
    "مهر": "مهر (میترا)",
    "آبان": "آبان (آناهیتا)",
    "آذر": "آذر (آذرخش)",
    "دی": "دی (دادار)",
    "بهمن": "بهمن (وهومن)",
    "اسفند": "سپندارمد (اسفند)"
  };

  const dayLabel = day;
  const zoroastrianMonth = stringMonthsMap[month] || month;
  // Extract month and the Zoroastrian month from format like "خرداد (هورتات)"
  const cleanMonth = month;
  const zoroMatch = zoroastrianMonth.match(/\(([^)]+)\)/);
  const cleanZoro = zoroMatch ? zoroMatch[1] : "";

  return (
    <div className="flex flex-col items-center justify-center pointer-events-none select-none">
       <div className="flex items-center gap-[1px]" dir="ltr">
         <AnimatedDigit digit={hours[0]} />
         <AnimatedDigit digit={hours[1]} />
         <span className="text-[var(--accent3)] opacity-70 mb-0.5 animate-pulse font-mono mx-[1px]">:</span>
         <AnimatedDigit digit={minutes[0]} />
         <AnimatedDigit digit={minutes[1]} />
         <span className="text-[var(--accent3-medium)] opacity-50 mb-0.5 animate-pulse font-mono mx-[1px]">:</span>
         <AnimatedDigit digit={seconds[0]} isSecondary />
         <AnimatedDigit digit={seconds[1]} isSecondary />
       </div>
       <div className="flex items-center justify-center gap-1.5 text-[10px] theme-text-muted mt-0.5 tracking-wide font-sans" dir="rtl">
         <span>{toPersianDigits(dayLabel)}</span>
         <span className="theme-text-secondary font-bold">{cleanMonth}</span>
         <span>{toPersianDigits(solarYear)} خورشیدی</span>
       </div>
    </div>
  );
}
