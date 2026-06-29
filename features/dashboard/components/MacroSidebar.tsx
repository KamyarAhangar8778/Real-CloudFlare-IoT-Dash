"use client";

import React from "react";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import { motion, AnimatePresence } from "motion/react";
import { Play } from "lucide-react";
import { ICON_MAP } from "@/features/iot/utils/icons";

export default function MacroSidebar() {
  const { macros, handleSetPinState, selectedGroupFilter, animationsEnabled, headerPosition } = useDashboard();

  // Only show if selectedGroupFilter is empty/null/all groups, and there are macros
  if (selectedGroupFilter || !macros || macros.length === 0) {
    return null;
  }

  const handleExecuteMacro = (macroId: string) => {
    const macro = macros.find((m) => m.id === macroId);
    if (!macro) return;
    
    macro.actions.forEach((action) => {
      handleSetPinState(action.targetPin, action.actionOn);
    });
  };

  const isHorizontal = headerPosition === "left";

  return (
    <div className={`${isHorizontal ? "flex flex-row w-full justify-center gap-3 pt-4 pb-2" : "hidden lg:flex flex-col gap-3 shrink-0 pt-4 sticky top-6 z-10 w-[72px]"}`}>
      <AnimatePresence>
        {macros.map((macro, index) => (
          <motion.button
            key={macro.id}
            initial={animationsEnabled ? { opacity: 0, [isHorizontal ? 'y' : 'x']: -20 } : undefined}
            animate={animationsEnabled ? { opacity: 1, [isHorizontal ? 'y' : 'x']: 0 } : undefined}
            exit={animationsEnabled ? { opacity: 0, scale: 0.8 } : undefined}
            transition={animationsEnabled ? { duration: 0.2, delay: index * 0.05 } : undefined}
            onClick={() => handleExecuteMacro(macro.id)}
            whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
            className={`flex items-center justify-center rounded-2xl bg-[var(--card-bg-solid)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent3)] hover:text-[var(--accent3)] hover:-translate-y-1.5 hover:shadow-[0_10px_20px_-5px_var(--accent3-transparent)] transition-all duration-300 shadow-sm relative group ${isHorizontal ? "flex-row gap-2 px-4 h-12" : "flex-col w-[72px] h-[72px]"}`}
            title={macro.title}
          >
            {macro.icon ? (
              <span className={`${isHorizontal ? "text-xl" : "text-2xl mb-1"} group-hover:scale-110 transition-transform`}>
                {ICON_MAP[macro.icon] ? React.createElement(ICON_MAP[macro.icon], { className: isHorizontal ? "w-5 h-5" : "w-6 h-6" }) : macro.icon}
              </span>
            ) : (
              <Play className={`${isHorizontal ? "w-5 h-5" : "w-6 h-6 mb-1"} opacity-70 group-hover:scale-110 transition-transform`} />
            )}
            <span className={`${isHorizontal ? "text-xs max-w-[120px]" : "text-[10px] w-full px-1"} font-bold truncate text-center opacity-80 group-hover:opacity-100 transition-opacity`}>
              {macro.title}
            </span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
