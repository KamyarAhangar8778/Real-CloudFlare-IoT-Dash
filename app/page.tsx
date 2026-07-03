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

  return (
    <DashboardContext.Provider value={state}>
      <DashboardContainer />
    </DashboardContext.Provider>
  );
}
