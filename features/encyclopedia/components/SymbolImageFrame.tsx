"use client";

import React from "react";
import Image from "next/image";
import { CLIP_DIAGONAL_TL_BR } from "@/lib/presets";
import { PersianSymbol } from "@/features/encyclopedia/data/symbols";

interface SymbolImageFrameProps {
  selectedSymbol: PersianSymbol;
}

export function SymbolImageFrame({ selectedSymbol }: SymbolImageFrameProps) {
  const [prevSymbolId, setPrevSymbolId] = React.useState(selectedSymbol.id);
  const [imgError, setImgError] = React.useState(false);

  if (selectedSymbol.id !== prevSymbolId) {
    setPrevSymbolId(selectedSymbol.id);
    setImgError(false);
  }

  return (
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
        <span className="text-[9px] text-accent3 font-bold uppercase tracking-widest block" style={{ color: "var(--accent3)" }}>
          Achaemenid Relic
        </span>
        <span className="text-xs font-sans text-white font-black block mt-0.5">
          {selectedSymbol.title}
        </span>
      </div>
    </div>
  );
}
