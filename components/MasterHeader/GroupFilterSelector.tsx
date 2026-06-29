import React from "react";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

interface GroupFilterSelectorProps {
  groupsOrder: string[];
  selectedGroupFilter: string | null;
  setSelectedGroupFilter: (group: string | null) => void;
  variant: "vertical" | "horizontal";
  animationsEnabled?: boolean;
}

export default function GroupFilterSelector({
  groupsOrder,
  selectedGroupFilter,
  setSelectedGroupFilter,
  variant,
  animationsEnabled = true,
}: GroupFilterSelectorProps) {
  if (groupsOrder.length === 0) return null;

  // Add "all" option to the list for easier navigation
  const allGroups = [null, ...groupsOrder];
  
  const currIndex = allGroups.findIndex((g) => g === selectedGroupFilter);
  // Ensure we don't get -1 somehow
  const safeCurrIndex = currIndex === -1 ? 0 : currIndex;
  
  const prevIndex = (safeCurrIndex - 1 + allGroups.length) % allGroups.length;
  const nextIndex = (safeCurrIndex + 1) % allGroups.length;

  const handleNext = () => {
    setSelectedGroupFilter(allGroups[nextIndex]);
  };

  const handlePrev = () => {
    setSelectedGroupFilter(allGroups[prevIndex]);
  };

  const getLabel = (item: string | null) => item === null ? "همه گروه ها" : (item || "گروه بدون نام");

  if (variant === "vertical") {
    // For vertical variant, keep it somewhat similar or adapt to horizontal slider if it fits.
    // The previous implementation was a simple list of buttons for vertical as well. 
    // We can use a simpler version or just the slider.
    // I'll keep the slider for both for consistency, just with slightly different width.
  }

  return (
    <div className={`flex items-center justify-between gap-1 p-1.5 border border-[var(--border-color)] bg-[var(--card-bg-solid)] rounded-2xl shadow-inner ${variant === "vertical" ? "w-full mb-2" : "min-w-[280px] w-[300px]"}`}>
      <motion.button
        onClick={handlePrev}
        whileHover={animationsEnabled ? { scale: 1.12, rotate: 3 } : undefined}
        whileTap={animationsEnabled ? { scale: 0.9 } : undefined}
        className="p-1.5 rounded-xl border border-[var(--border-color)] bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--accent3)] hover:border-[var(--accent3)] transition-all duration-300 cursor-pointer shrink-0"
        title="گروه قبلی"
      >
        <ChevronRight className="w-4 h-4" />
      </motion.button>

      <div className="flex-1 flex flex-col items-center justify-center text-center overflow-hidden px-1">
        <div className="text-[10px] text-[var(--text-tertiary)] truncate w-full flex justify-between px-2 opacity-60">
           <span className="truncate max-w-[40%] text-right">{getLabel(allGroups[prevIndex])}</span>
           <span className="truncate max-w-[40%] text-left">{getLabel(allGroups[nextIndex])}</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-0.5">
          {selectedGroupFilter === null && <Filter className="w-3.5 h-3.5 text-[var(--accent3)]" />}
          <span className="text-xs font-bold text-[var(--text-primary)] truncate max-w-[120px]">
            {getLabel(selectedGroupFilter)}
          </span>
        </div>
      </div>

      <motion.button
        onClick={handleNext}
        whileHover={animationsEnabled ? { scale: 1.12, rotate: -3 } : undefined}
        whileTap={animationsEnabled ? { scale: 0.9 } : undefined}
        className="p-1.5 rounded-xl border border-[var(--border-color)] bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--accent3)] hover:border-[var(--accent3)] transition-all duration-300 cursor-pointer shrink-0"
        title="گروه بعدی"
      >
        <ChevronLeft className="w-4 h-4" />
      </motion.button>
    </div>
  );
}
