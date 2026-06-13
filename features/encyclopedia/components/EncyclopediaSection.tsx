"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { CLIP_PEDESTAL } from "@/lib/presets";
import { PersianSymbol } from "@/features/encyclopedia/data/symbols";
import { EncyclopediaHeader } from "./EncyclopediaHeader";
import { SymbolDetailsPanel } from "./SymbolDetailsPanel";
import { SymbolImageFrame } from "./SymbolImageFrame";

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
  return (
    <section 
      className="theme-card-bg backdrop-blur-md border border-accent3-medium flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.65)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.75)] hover:-translate-y-[1px] relative overflow-hidden transition-all duration-500"
      style={{ clipPath: CLIP_PEDESTAL }}
    >
      <EncyclopediaHeader
        isSymbolsSectionExpanded={isSymbolsSectionExpanded}
        setIsSymbolsSectionExpanded={setIsSymbolsSectionExpanded}
      />

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
              <SymbolDetailsPanel
                selectedSymbol={selectedSymbol}
                setSelectedSymbol={setSelectedSymbol}
              />
              <SymbolImageFrame
                selectedSymbol={selectedSymbol}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
