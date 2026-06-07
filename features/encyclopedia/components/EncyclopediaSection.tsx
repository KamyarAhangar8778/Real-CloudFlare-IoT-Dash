"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronDown, 
  BookOpen, 
  Layers 
} from "lucide-react";
import { 
  BUTTON_CLIP, 
  CLIP_PEDESTAL, 
  CLIP_DIAGONAL_TL_BR 
} from "@/lib/presets";
import { persianSymbols, PersianSymbol } from "@/features/encyclopedia/data/symbols";

interface EncyclopediaSectionProps {
  selectedSymbol: PersianSymbol;
  setSelectedSymbol: (sym: PersianSymbol) => void;
  isSymbolsSectionExpanded: boolean;
  setIsSymbolsSectionExpanded: (val: boolean) => void;
}

export default function EncyclopediaSection({
  selectedSymbol,
  setSelectedSymbol,
  isSymbolsSectionExpanded,
  setIsSymbolsSectionExpanded
}: EncyclopediaSectionProps) {
  const [prevSymbolId, setPrevSymbolId] = React.useState(selectedSymbol.id);
  const [imgError, setImgError] = React.useState(false);

  if (selectedSymbol.id !== prevSymbolId) {
    setPrevSymbolId(selectedSymbol.id);
    setImgError(false);
  }

  return (
    <section 
      className="theme-card-bg backdrop-blur-md border border-accent3-medium flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.65)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.75)] hover:-translate-y-[1px] relative overflow-hidden transition-all duration-500"
      style={{ clipPath: CLIP_PEDESTAL }}
    >
      {/* Header Row Trigger */}
      <button
        onClick={() => setIsSymbolsSectionExpanded(!isSymbolsSectionExpanded)}
        className="w-full py-4 px-6 flex items-center justify-between text-right hover:bg-[var(--accent3-transparent)] transition-all duration-300 cursor-pointer focus:outline-none"
      >
        <div className="flex items-center gap-2.5">
          <span className={`text-[10px] font-sans px-2.5 py-0.5 border ${isSymbolsSectionExpanded ? 'border-accent3 text-accent3' : 'border-accent3-medium theme-text-muted'} transition-all`} style={{ clipPath: BUTTON_CLIP }}>
            {isSymbolsSectionExpanded ? "فعال" : "بسته"}
          </span>
          <motion.div
            animate={{ rotate: isSymbolsSectionExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-accent3" style={{ color: "var(--accent3)" }} />
          </motion.div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold theme-text-primary hidden sm:inline md:block">
            {isSymbolsSectionExpanded ? "برای بستن بخش راهنمای نمادها کلیک کنید" : "برای گشایش دانشنامه هویت و نگاره‌های شاهنشاهی هخامنشی کلیک کنید"}
          </span>
          <span className="text-xs font-bold theme-text-primary sm:hidden">
            کمتر / بیشتر
          </span>
          <div className="p-1.5 theme-card-bg-solid border border-accent3-medium text-accent3">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>
      </button>

      {/* Expandable Inner Content Panels */}
      <AnimatePresence initial={false}>
        {isSymbolsSectionExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden border-t border-accent3-medium/30"
          >
            <div className="p-6 flex flex-col md:flex-row gap-8 items-stretch justify-between">
              
              <div className="flex-1 space-y-4 text-right">
                <div className="flex items-center gap-2 border-b border-accent3-medium pb-2">
                  <Layers className="w-4 h-4 text-accent3" style={{ color: "var(--accent3)" }} />
                  <h4 className="font-sans font-bold text-accent3 text-sm">راهنمای هویت و نگاره‌های کهن پیش‌نمایش</h4>
                </div>

                {/* Micro Slider Selector of Symbols */}
                <div className="flex flex-wrap gap-2 justify-start max-h-[140px] overflow-y-auto pr-1">
                  {persianSymbols.map((sym) => (
                    <button
                      key={sym.id}
                      onClick={() => setSelectedSymbol(sym)}
                      className="px-3 py-1.5 text-xs font-sans transition-all duration-300 border focus:outline-none cursor-pointer"
                      style={{ 
                        clipPath: BUTTON_CLIP,
                        borderColor: selectedSymbol.id === sym.id ? "var(--accent3)" : "var(--border-color)",
                        backgroundColor: selectedSymbol.id === sym.id ? "var(--accent3-transparent)" : "var(--card-hover-bg)",
                        color: selectedSymbol.id === sym.id ? "var(--accent3)" : "var(--text-tertiary)"
                      }}
                    >
                      {sym.title}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5 py-2">
                  <span className="block text-[10px] text-accent3 font-mono tracking-wider" dir="ltr">Symbol Integrity: {selectedSymbol.id.toUpperCase()}</span>
                  <h5 className="text-sm font-bold theme-text-secondary">{selectedSymbol.title} — <span className="font-bold text-accent4 text-xs">{selectedSymbol.concept}</span></h5>
                  <p className="text-xs theme-text-tertiary leading-relaxed font-sans">{selectedSymbol.meaning}</p>
                </div>

                <p className="text-[10px] theme-text-muted font-sans italic pt-2 border-t border-accent3-medium">
                  💡 {selectedSymbol.historicalRef}
                </p>
              </div>

              {/* Real Premium Photographic Representation Frame */}
              <div 
                className="w-full md:w-[280px] shrink-0 h-[180px] md:h-200 border border-accent3-medium bg-gradient-to-tr from-[var(--card-bg-solid)] to-[var(--bg-main)] overflow-hidden relative group"
                style={{ clipPath: CLIP_DIAGONAL_TL_BR }}
              >
                {imgError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-[#07090e] transition-all duration-500">
                    <div className="w-10 h-10 rounded-full border border-accent4-medium flex items-center justify-center mb-2 bg-[var(--accent4-transparent)] animate-pulse">
                      <span className="text-accent4 font-mono text-[9px] font-bold">ARC</span>
                    </div>
                    <span className="text-[9px] text-accent3 font-bold uppercase tracking-widest block">Achaemenid Museum</span>
                    <span className="text-[11px] text-slate-300 font-bold block mt-1">{selectedSymbol.title}</span>
                    <span className="text-[8px] theme-text-muted mt-2 text-center max-w-[200px]" dir="rtl">
                      لوح زرین شاهنشاهی و نگاره‌ی تمدنی
                    </span>
                  </div>
                ) : (
                  <>
                    <Image 
                      src={selectedSymbol.imageUrl}
                      alt={selectedSymbol.title}
                      fill
                      sizes="(max-w-710px) 100vw, 280px"
                      className="object-cover opacity-65 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700"
                      referrerPolicy="no-referrer"
                      onError={() => setImgError(true)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  </>
                )}
                
                <div className="absolute bottom-3 right-5 text-right">
                  <span className="text-[9px] text-accent3 font-bold uppercase tracking-widest block" style={{ color: "var(--accent3)" }}>Achaemenid Relic</span>
                  <span className="text-xs font-sans text-white font-black block mt-0.5">{selectedSymbol.title}</span>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
