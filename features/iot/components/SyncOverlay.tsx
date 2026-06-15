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
  workerUrl: string;
  setWorkerUrl: (url: string) => void;
  onRetry: () => void;
}

export default function SyncOverlay({
  isFullyReady,
  syncMessage,
  syncProgress,
  onBypass,
  workerUrl,
  setWorkerUrl,
  onRetry,
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
            fontFamily: "var(--font-vazir)",
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
            <p className="text-xs text-slate-400">{syncMessage}</p>

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

            {/* Input field for Cloudflare Worker URL during stage 1 initialization */}
            <div className="w-80 mt-6 p-4 rounded-2xl border border-slate-800/80 bg-black/45 backdrop-blur-md space-y-3">
              <div className="text-right text-[10px] font-bold text-cyan-400">
                پیکربندی ورکر کلودفلر (مرحله اول)
              </div>
              <input
                type="text"
                dir="ltr"
                value={workerUrl}
                onChange={(e) => setWorkerUrl(e.target.value)}
                placeholder="https://my-iot-worker.subdomain.workers.dev"
                className="block w-full py-2 px-3 border border-slate-850 focus:border-cyan-500 rounded-xl bg-slate-950/80 text-[10px] text-white placeholder-slate-600 focus:outline-none font-mono transition-all text-center"
              />
              <div className="flex gap-2 justify-stretch">
                <button
                  onClick={onRetry}
                  className="flex-1 py-1.5 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/60 hover:border-cyan-500/80 text-cyan-300 hover:text-cyan-100 rounded-lg text-[9px] font-bold transition-all cursor-pointer"
                >
                  تلاش مجدد همگام‌سازی
                </button>
                <button
                  onClick={onBypass}
                  className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-lg text-[9px] font-bold transition-all cursor-pointer"
                >
                  ورود آفلاین
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
