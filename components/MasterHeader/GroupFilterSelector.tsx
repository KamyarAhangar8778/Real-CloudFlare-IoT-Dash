import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";

interface GroupFilterSelectorProps {
  groupsOrder: string[];
  selectedGroupFilter: string | null;
  setSelectedGroupFilter: (group: string | null) => void;
  animationsEnabled?: boolean;
  isCompact?: boolean;
}

export default function GroupFilterSelector({
  groupsOrder,
  selectedGroupFilter,
  setSelectedGroupFilter,
  animationsEnabled = true,
  isCompact = false,
}: GroupFilterSelectorProps) {
  const [direction, setDirection] = useState(1);
  const [offset, setOffset] = useState(0);
  const { headerPosition, isFullyReady } = useDashboard();
  
  if (!isFullyReady) {
    return (
      <div className={`flex items-center justify-center pointer-events-auto max-w-full overflow-hidden ${!isCompact ? 'mb-2' : ''}`} dir="rtl">
        <div className={`flex flex-row items-center justify-center ${isCompact ? 'gap-1' : 'gap-2'} max-w-full`}>
          <div className={`${isCompact ? 'w-4 h-4' : 'w-6 h-6'} rounded-full bg-[var(--text-muted)] opacity-20 animate-pulse`} />
          <div className={`flex flex-row items-center justify-center ${isCompact ? 'gap-1 p-1 max-w-[300px]' : 'gap-2 p-1 max-w-[460px]'} relative`}>
            <div className={`${isCompact ? 'w-[80px] h-5 rounded-md' : 'w-[140px] h-12 rounded-2xl'} bg-[var(--card-bg-solid)] border border-[var(--border-color)] opacity-40 animate-pulse`} />
            <div className={`${isCompact ? 'w-[80px] h-5 rounded-md' : 'w-[140px] h-12 rounded-2xl'} bg-[var(--card-bg-solid)] border border-[var(--accent3)] opacity-80 animate-pulse`} />
            <div className={`${isCompact ? 'w-[80px] h-5 rounded-md' : 'w-[140px] h-12 rounded-2xl'} bg-[var(--card-bg-solid)] border border-[var(--border-color)] opacity-40 animate-pulse`} />
          </div>
          <div className={`${isCompact ? 'w-4 h-4' : 'w-6 h-6'} rounded-full bg-[var(--text-muted)] opacity-20 animate-pulse`} />
        </div>
      </div>
    );
  }

  if (groupsOrder.length === 0) return null;

  const allGroups = [null, ...groupsOrder];
  
  const currIndex = allGroups.findIndex((g) => g === selectedGroupFilter);
  const safeCurrIndex = currIndex === -1 ? 0 : currIndex;
  
  const goNext = () => {
    setDirection(-1);
    setOffset(prev => prev + 1);
    const nextIndex = (safeCurrIndex + 1) % allGroups.length;
    setSelectedGroupFilter(allGroups[nextIndex]);
  };

  const goPrev = () => {
    setDirection(1);
    setOffset(prev => prev - 1);
    const prevIndex = (safeCurrIndex - 1 + allGroups.length) % allGroups.length;
    setSelectedGroupFilter(allGroups[prevIndex]);
  };

  const getLabel = (item: string | null) => item === null ? "همه گروه‌ها" : (item || "گروه بدون نام");

  const renderFilterButton = (group: string | null, isCenter: boolean, onClick: () => void, uniqueKey: string) => {
    return (
      <motion.button
        layout
        key={uniqueKey}
        initial={animationsEnabled ? { 
          opacity: 0, 
          scale: 0.8,
          x: direction * 40
        } : undefined}
        animate={animationsEnabled ? { 
          opacity: isCenter ? 1 : 0.4, 
          scale: isCenter ? 1 : 0.85,
          x: 0, y: 0
        } : undefined}
        exit={animationsEnabled ? { 
          opacity: 0, 
          scale: 0.8,
          x: -direction * 40
        } : undefined}
        transition={animationsEnabled ? { duration: 0.3 } : undefined}
        onClick={onClick}
        className={`flex items-center justify-center bg-[var(--card-bg-solid)] border ${isCompact ? 'rounded-md h-5 min-w-[70px] max-w-[120px] gap-1 px-2' : 'rounded-2xl h-12 w-[140px] gap-2 px-4'} ${isCenter ? (isCompact ? 'border-[var(--accent3)] shadow-[0_2px_8px_-3px_var(--accent3-transparent)] z-10' : 'border-[var(--accent3)] shadow-[0_4px_15px_-5px_var(--accent3-transparent)] z-10') : 'hidden md:flex border-[var(--border-color)] md:hover:border-[var(--accent3)]'} text-[var(--text-primary)] ${isCenter ? 'text-[var(--accent3)]' : 'text-[var(--text-muted)]'} transition-all duration-300 relative group flex-row whitespace-nowrap overflow-hidden shrink-0`}
        title={getLabel(group)}
      >
        <span className={`${isCompact ? 'font-mono text-[9px] leading-none' : 'font-bold text-sm'} truncate max-w-full`}>
          {getLabel(group)}
        </span>
      </motion.button>
    );
  };

  return (
    <div className={`flex items-center justify-center pointer-events-auto max-w-full overflow-hidden ${!isCompact ? 'mb-2' : ''}`} dir="rtl">
      <div className={`flex flex-row items-center justify-center ${isCompact ? 'gap-1' : 'gap-2'} max-w-full`}>
        
        <button onClick={goPrev} className={`hidden md:block rounded-full text-[var(--text-secondary)] md:hover:bg-[var(--accent3)] md:hover:text-white transition-colors shrink-0 ${isCompact ? 'p-0.5' : 'p-1'}`} title="قبلی">
          <ChevronRight className={isCompact ? "w-3.5 h-3.5" : "w-5 h-5"} />
        </button>
        
        <div className={`flex flex-row items-center justify-center relative overflow-hidden ${isCompact ? 'gap-1 p-0.5 max-w-[300px]' : 'gap-2 p-1 max-w-[460px]'}`}>
          <AnimatePresence mode="popLayout" custom={direction}>
            {[
              { group: allGroups[(safeCurrIndex - 1 + allGroups.length) % allGroups.length], key: offset - 1 },
              { group: allGroups[safeCurrIndex], key: offset },
              { group: allGroups[(safeCurrIndex + 1) % allGroups.length], key: offset + 1 }
            ].map(({ group, key }, index) => {
              const isCenter = index === 1;
              const onClick = index === 0 ? goPrev : index === 2 ? goNext : () => setSelectedGroupFilter(group);
              return renderFilterButton(group, isCenter, onClick, String(key));
            })}
          </AnimatePresence>
        </div>

        <button onClick={goNext} className={`hidden md:block rounded-full text-[var(--text-secondary)] md:hover:bg-[var(--accent3)] md:hover:text-white transition-colors shrink-0 ${isCompact ? 'p-0.5' : 'p-1'}`} title="بعدی">
          <ChevronLeft className={isCompact ? "w-3.5 h-3.5" : "w-5 h-5"} />
        </button>
      </div>
    </div>
  );
}
