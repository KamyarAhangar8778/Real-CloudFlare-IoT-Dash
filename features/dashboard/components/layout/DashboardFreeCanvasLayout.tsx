"use client";

import React from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardMain from "./DashboardMain";
import DashboardFooter from "./DashboardFooter";
import DashboardDrawers from "./DashboardDrawers";
import ToastNotification from "@/features/iot/components/notifications/ToastNotification";

/**
 * Fullscreen 2D Free-Canvas (N8N-style) Layout.
 * Renders the canvas edge-to-edge across the entire dashboard with floating right-docked Header and Footer overlays.
 */
export default function DashboardFreeCanvasLayout() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col justify-between select-none" dir="rtl">
      {/* Edge-to-Edge Fullscreen Canvas Plane */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
        <DashboardMain />
      </div>

      {/* Floating Right-Docked Header Overlay */}
      <aside className="fixed top-0 right-0 bottom-0 z-30 pointer-events-auto h-screen">
        <DashboardHeader />
      </aside>

      {/* Floating Footer Overlay */}
      <div className="fixed bottom-0 inset-x-0 z-20 pointer-events-none">
        <div className="pointer-events-auto">
          <DashboardFooter />
        </div>
      </div>

      {/* Global Modals, Drawers and Toasts */}
      <DashboardDrawers />
      <ToastNotification />
    </div>
  );
}
