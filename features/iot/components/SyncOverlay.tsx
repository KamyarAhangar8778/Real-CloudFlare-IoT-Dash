"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cpu } from "lucide-react";
import { BUTTON_CLIP } from "@/lib/presets";

interface SyncOverlayProps {
  isFullyReady: boolean;
  syncMessage: string;
  syncProgress: number;
  onBypass: () => void;
}

export default function SyncOverlay({
  isFullyReady,
  syncMessage,
  syncProgress,
  onBypass,
}: SyncOverlayProps) {
  return (
    <AnimatePresence>
      {!isFullyReady && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden"
          style={{
            background: "radial-gradient(ellipse_at_center, #0c0f1d 0%, #030408 100%)",
            fontFamily: "var(--font-vazir)"
          }}
        >
          {/* Modern rotating loading ring */}
          <div className="relative w-24 h-24 mb-6 shrink-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-dashed border-cyan-500/40"
            />
            <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>

          {/* Loader description & Persian Title */}
          <div className="space-y-3 max-w-lg flex flex-col justify-center items-center">
            <h3 className="text-xl font-bold text-white tracking-wide font-sans">
              سامانه یکپارچه مانیتورینگ اینترنت اشیا
            </h3>
            <p className="text-xs text-slate-400">
              {syncMessage}
            </p>

            {/* Progress bar container */}
            <div className="w-64 h-1 bg-black/50 border border-gray-800/60 rounded-full overflow-hidden mx-auto relative mt-2">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${syncProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            
            <div className="text-[10px] text-zinc-500 font-mono mt-1">
              {syncProgress}% • CONNECTED ON STANDALONE_PORT
            </div>

            <div className="pt-6">
              <button
                onClick={onBypass}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all text-[10px] font-bold cursor-pointer"
                style={{ clipPath: BUTTON_CLIP }}
              >
                دور زدن و ورود آفلاین (Standalone)
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
