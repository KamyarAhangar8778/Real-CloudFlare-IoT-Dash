import { useState, useCallback, useRef } from "react";
import { CanvasTransform } from "../core/types";
import { DEFAULT_CANVAS_TRANSFORM, CANVAS_BOUNDS } from "../core/constants";

/**
 * Custom hook to manage pan, drag navigation, and zoom transformations for 2D Canvas.
 * Supports smooth pointer gesture handling, trackpad 2D panning, and bounded scaling.
 * 
 * @param initial - Optional initial transform coordinates.
 * @returns State and event handlers for canvas pan and zoom operations.
 */
export function useCanvasPanZoom(initial: CanvasTransform = DEFAULT_CANVAS_TRANSFORM) {
  const [transform, setTransform] = useState<CanvasTransform>(initial);
  const [isPanning, setIsPanning] = useState(false);
  const startPointRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startTransformRef = useRef<CanvasTransform>(initial);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Only initiate pan when clicking directly on canvas background or holding space/middle click
    const target = e.target as HTMLElement;
    const isInteractive = target.closest("button, input, select, textarea, [data-interactive='true']");
    if (isInteractive && e.button === 0) return;

    setIsPanning(true);
    startPointRef.current = { x: e.clientX, y: e.clientY };
    startTransformRef.current = transform;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [transform]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - startPointRef.current.x;
    const dy = e.clientY - startPointRef.current.y;

    setTransform({
      ...startTransformRef.current,
      x: startTransformRef.current.x + dx,
      y: startTransformRef.current.y + dy,
    });
  }, [isPanning]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (isPanning) {
      setIsPanning(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer capture release fails
      }
    }
  }, [isPanning]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      setTransform((prev) => {
        const nextScale = Math.min(
          CANVAS_BOUNDS.maxScale,
          Math.max(CANVAS_BOUNDS.minScale, +(prev.scale * zoomFactor).toFixed(2))
        );
        return { ...prev, scale: nextScale };
      });
    } else {
      setTransform((prev) => ({
        ...prev,
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  }, []);

  const zoomIn = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(CANVAS_BOUNDS.maxScale, +(prev.scale + CANVAS_BOUNDS.step).toFixed(2)),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(CANVAS_BOUNDS.minScale, +(prev.scale - CANVAS_BOUNDS.step).toFixed(2)),
    }));
  }, []);

  const resetTransform = useCallback(() => {
    setTransform(DEFAULT_CANVAS_TRANSFORM);
  }, []);

  return {
    transform,
    setTransform,
    isPanning,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
    zoomIn,
    zoomOut,
    resetTransform,
  };
}
