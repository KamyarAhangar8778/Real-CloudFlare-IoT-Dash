"use client";

import React, { useState } from "react";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import { motion, AnimatePresence } from "motion/react";
import { Play, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { ICON_MAP } from "@/features/iot/utils/icons";

export default function MacroSidebar({ forceHorizontal = false, className = "" }: { forceHorizontal?: boolean, className?: string }) {
  const { macros, handleBatchPinState, selectedGroupFilter, animationsEnabled, headerPosition } = useDashboard();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [offset, setOffset] = useState(0);

  React.useEffect(() => {
    if (macros && activeIndex >= macros.length) {
      setActiveIndex(Math.max(0, macros.length - 1));
    }
  }, [macros, activeIndex]);

  // Only show if selectedGroupFilter is empty/null/all groups, and there are macros
  if (selectedGroupFilter || !macros || macros.length === 0) {
    return null;
  }

  const handleExecuteMacro = (macroId: string) => {
    const macro = macros.find((m) => m.id === macroId);
    if (!macro) return;
    
    handleBatchPinState(macro.actions);
  };

  const isHorizontal = forceHorizontal || headerPosition === "left";

  const goNext = () => {
    setDirection(-1);
    setOffset(prev => prev + 1);
    setActiveIndex((prev) => (prev + 1) % macros.length);
  };
  const goPrev = () => {
    setDirection(1);
    setOffset(prev => prev - 1);
    setActiveIndex((prev) => (prev - 1 + macros.length) % macros.length);
  };

  const renderMacroButton = (macro: any, isCenter: boolean, onClick: () => void, uniqueKey: string) => {
    return (
      <motion.button
        layout
        key={uniqueKey}
        initial={animationsEnabled ? { 
          opacity: 0, 
          scale: 0.8,
          [isHorizontal ? "x" : "y"]: direction * 40
        } : undefined}
        animate={animationsEnabled ? { 
          opacity: isCenter ? 1 : 0.4, 
          scale: isCenter ? 1 : 0.85,
          x: 0, y: 0
        } : undefined}
        exit={animationsEnabled ? { 
          opacity: 0, 
          scale: 0.8,
          [isHorizontal ? "x" : "y"]: -direction * 40
        } : undefined}
        transition={animationsEnabled ? { duration: 0.3 } : undefined}
        onClick={onClick}
        className={`flex items-center justify-center rounded-2xl bg-[var(--card-bg-solid)] border ${isCenter ? 'border-[var(--accent3)] shadow-[0_4px_15px_-5px_var(--accent3-transparent)] z-10' : 'border-[var(--border-color)] md:hover:border-[var(--accent3)]'} text-[var(--text-primary)] ${isCenter ? 'text-[var(--accent3)]' : ''} transition-all duration-300 relative group shrink-0 ${isHorizontal ? "flex-row gap-1 px-2 w-[100px] min-w-[90px] min-h-[44px] h-fit py-2" : "flex-col w-[72px] min-w-min px-2 min-h-[72px] h-fit py-2"}`}
        title={macro.title}
      >
        {macro.icon ? (
          <span className={`${isHorizontal ? "text-xl" : "text-2xl mb-1"} ${isCenter ? 'scale-110' : 'md:group-hover:scale-110'} transition-transform`}>
            {ICON_MAP[macro.icon] ? React.createElement(ICON_MAP[macro.icon], { className: isHorizontal ? "w-5 h-5" : "w-6 h-6" }) : macro.icon}
          </span>
        ) : (
          <Play className={`${isHorizontal ? "w-5 h-5" : "w-6 h-6 mb-1"} ${isCenter ? 'opacity-100 scale-110' : 'opacity-70 md:group-hover:scale-110'} transition-all`} />
        )}
        <span className={`${isHorizontal ? "text-[10px]" : "text-[10px] px-1"} leading-tight font-bold text-center transition-opacity ${isCenter ? 'opacity-100' : 'opacity-60 md:group-hover:opacity-100'}`}>
          {macro.title}
        </span>
      </motion.button>
    );
  };

  return (
    <div className={`${className} w-full max-w-full ${isHorizontal ? "flex flex-row justify-center items-center gap-2 pt-4 pb-2" : "hidden lg:flex flex-col gap-3 shrink-0 pt-4 sticky top-6 z-10 w-[72px] items-center"}`} dir={isHorizontal ? "rtl" : undefined}>
      {macros.length >= 3 ? (
        <>
          <button onClick={goPrev} className="p-1 rounded-full text-[var(--text-secondary)] md:hover:bg-[var(--accent3)] md:hover:text-white transition-colors shrink-0" title="قبلی">
            {isHorizontal ? <ChevronRight className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
          
          <div 
            className={`flex ${isHorizontal ? "flex-row items-center gap-1 max-w-[320px]" : "flex-col items-center gap-2"} relative overflow-hidden p-1`}
            style={isHorizontal ? { WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)", maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" } : undefined}
          >
            <AnimatePresence mode="popLayout" custom={direction}>
              {[
                { macro: macros[(activeIndex - 1 + macros.length) % macros.length], key: offset - 1 },
                { macro: macros[activeIndex], key: offset },
                { macro: macros[(activeIndex + 1) % macros.length], key: offset + 1 }
              ].map(({ macro, key }, index) => {
                const isCenter = index === 1;
                const onClick = index === 0 ? goPrev : index === 2 ? goNext : () => handleExecuteMacro(macro.id);
                return renderMacroButton(macro, isCenter, onClick, String(key));
              })}
            </AnimatePresence>
          </div>

          <button onClick={goNext} className="p-1 rounded-full text-[var(--text-secondary)] md:hover:bg-[var(--accent3)] md:hover:text-white transition-colors shrink-0" title="بعدی">
            {isHorizontal ? <ChevronLeft className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </>
      ) : (
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
              className={`flex items-center justify-center rounded-2xl bg-[var(--card-bg-solid)] border border-[var(--border-color)] text-[var(--text-primary)] md:hover:border-[var(--accent3)] md:hover:text-[var(--accent3)] md:hover:-translate-y-1.5 md:hover:shadow-[0_10px_20px_-5px_var(--accent3-transparent)] transition-all duration-300 shadow-sm relative group ${isHorizontal ? "flex-row gap-2 px-4 w-[120px] min-w-min min-h-[48px] h-fit py-2" : "flex-col w-[72px] min-w-min px-2 min-h-[72px] h-fit py-2"}`}
              title={macro.title}
            >
              {macro.icon ? (
                <span className={`${isHorizontal ? "text-xl" : "text-2xl mb-1"} md:group-hover:scale-110 transition-transform`}>
                  {ICON_MAP[macro.icon] ? React.createElement(ICON_MAP[macro.icon], { className: isHorizontal ? "w-5 h-5" : "w-6 h-6" }) : macro.icon}
                </span>
              ) : (
                <Play className={`${isHorizontal ? "w-5 h-5" : "w-6 h-6 mb-1"} opacity-70 md:group-hover:scale-110 transition-transform`} />
              )}
              <span className={`${isHorizontal ? "text-xs" : "text-[10px] px-1 leading-tight"} font-bold text-center opacity-80 md:group-hover:opacity-100 transition-opacity`}>
                {macro.title}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}
