"use client";

import React from "react";
import { useAchaemenidState } from "@/features/iot/hooks/useAchaemenidState";
import { DashboardContext } from "@/features/dashboard/context/DashboardContext";
import DashboardContainer from "@/features/dashboard/components/DashboardContainer";

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
    return <div className="min-h-screen bg-[#0b0c10]" />;
  }

  return (
    <DashboardContext.Provider value={state}>
      <DashboardContainer />
    </DashboardContext.Provider>
  );
}
