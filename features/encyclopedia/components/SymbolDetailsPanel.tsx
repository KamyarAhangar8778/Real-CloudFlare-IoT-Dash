"use client";

import React from "react";
import { Layers } from "lucide-react";
import { BUTTON_CLIP } from "@/lib/presets";
import { persianSymbols, PersianSymbol } from "@/features/encyclopedia/data/symbols";

interface SymbolDetailsPanelProps {
  selectedSymbol: PersianSymbol;
  setSelectedSymbol: (sym: PersianSymbol) => void;
}

export function SymbolDetailsPanel({
  selectedSymbol,
  setSelectedSymbol
}: SymbolDetailsPanelProps) {
  return (
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
        <span className="block text-[10px] text-accent3 font-mono tracking-wider" dir="ltr">
          Symbol Integrity: {selectedSymbol.id.toUpperCase()}
        </span>
        <h5 className="text-sm font-bold theme-text-secondary">
          {selectedSymbol.title} — <span className="font-bold text-accent4 text-xs">{selectedSymbol.concept}</span>
        </h5>
        <p className="text-xs theme-text-tertiary leading-relaxed font-sans">{selectedSymbol.meaning}</p>
      </div>

      <p className="text-[10px] theme-text-muted font-sans italic pt-2 border-t border-accent3-medium">
        💡 {selectedSymbol.historicalRef}
      </p>
    </div>
  );
}
