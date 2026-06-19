"use client";

import React from "react";
import { useAchaemenidState } from "@/features/iot/hooks/useAchaemenidState";
import { DashboardContext } from "@/features/dashboard/context/DashboardContext";
import dynamic from "next/dynamic";

// Dynamically import DashboardContainer to reduce initial bundle size and speed up initial render.
const DashboardContainer = dynamic(
  () => import("@/features/dashboard/components/DashboardContainer"),
  { ssr: false },
);

export default function Home() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#0b0c10]" />}>
      <AchaemenidDashboard />
    </React.Suspense>
  );
}

function AchaemenidDashboard() {
  const state = useAchaemenidState();

  if (!state.mounted) {
    return (
      <div 
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden"
        style={{
          background: "radial-gradient(ellipse_at_center, #0c0f1d 0%, #030408 100%)",
        }}
      >
        <div className="relative w-24 h-24 mb-6 shrink-0 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/40 animate-[spin_10s_linear_infinite]" />
          <div className="w-8 h-8 text-cyan-400 animate-pulse bg-cyan-400/20 rounded-full" />
        </div>
        <h3 className="text-xl font-bold text-white tracking-wide font-sans">
          سامانه یکپارچه مانیتورینگ اینترنت اشیا
        </h3>
        <p className="text-xs text-slate-400 mt-3">در حال بارگذاری بسترهای اتصال...</p>
      </div>
    );
  }

  return (
    <DashboardContext.Provider value={state}>
      <DashboardContainer />
    </DashboardContext.Provider>
  );
}
