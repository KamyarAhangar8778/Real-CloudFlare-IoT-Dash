import React from "react";
import { CanvasGridBackground } from "./CanvasGridBackground";
import { CanvasControls } from "./CanvasControls";
import { useCanvasPanZoom } from "../hooks/useCanvasPanZoom";
import { CanvasViewportProps } from "../core/types";

/**
 * Main viewport container that orchestrates pan/zoom transformations,
 * renders background dot grid, and encapsulates the free-canvas workspace.
 */
export const CanvasViewport: React.FC<CanvasViewportProps> = ({
  children,
  className = "",
}) => {
  const {
    transform,
    isPanning,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
    zoomIn,
    zoomOut,
    resetTransform,
  } = useCanvasPanZoom();

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none touch-none ${
        isPanning ? "cursor-grabbing" : "cursor-grab"
      } ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
    >
      {/* Dynamic Grid Background */}
      <CanvasGridBackground transform={transform} />

      {/* Infinite Canvas Interactive Plane */}
      <div
        className="absolute inset-0 origin-top-left transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0px) scale(${transform.scale})`,
        }}
      >
        <div className="pt-28 pb-20 px-10 w-max h-max pointer-events-auto">
          {children}
        </div>
      </div>

      {/* Floating Canvas Controls */}
      <CanvasControls
        scale={transform.scale}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={resetTransform}
      />
    </div>
  );
};
