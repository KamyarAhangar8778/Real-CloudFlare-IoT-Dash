import React from "react";
import { CanvasGridBackgroundProps } from "../core/types";
import { CANVAS_GRID_CONFIG } from "../core/constants";

/**
 * Renders an optimized SVG dot matrix grid background aligned with the canvas transform.
 * Adjusts dynamically during panning and zooming.
 */
export const CanvasGridBackground: React.FC<CanvasGridBackgroundProps> = ({
  transform,
  dotSize = CANVAS_GRID_CONFIG.dotRadius,
  gridSpacing = CANVAS_GRID_CONFIG.spacing,
  className = "",
}) => {
  const patternSize = gridSpacing * transform.scale;
  const offsetX = (transform.x % patternSize + patternSize) % patternSize;
  const offsetY = (transform.y % patternSize + patternSize) % patternSize;

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="free-canvas-dots"
          width={patternSize}
          height={patternSize}
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <circle
            cx={patternSize / 2}
            cy={patternSize / 2}
            r={dotSize}
            className="fill-[var(--border-color)] opacity-60"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#free-canvas-dots)" />
    </svg>
  );
};
