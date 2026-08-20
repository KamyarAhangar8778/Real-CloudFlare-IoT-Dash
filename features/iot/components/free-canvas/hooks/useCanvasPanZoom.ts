import { useState, useCallback, useRef, useEffect } from "react";
import { CanvasTransform } from "../core/types";
import { DEFAULT_CANVAS_TRANSFORM, CANVAS_BOUNDS } from "../core/constants";
import { useCanvasZoomStore } from "../store/useCanvasZoomStore";

export type PanMode = "idle" | "right_drag" | "middle_drag" | "middle_locked";

/**
 * Smooth damped pan & zoom navigation hook.
 * Uses LERP (Linear Interpolation) with momentum damping for a soft, natural gliding feel.
 */
export function useCanvasPanZoom(initial: CanvasTransform = DEFAULT_CANVAS_TRANSFORM) {
  const [transform, setTransform] = useState<CanvasTransform>(initial);
  const [panMode, setPanMode] = useState<PanMode>("idle");
  const [middleLockOrigin, setMiddleLockOrigin] = useState<{ x: number; y: number } | null>(null);

  // Targets and physics state
  const targetRef = useRef<CanvasTransform>(initial);
  const currentRef = useRef<CanvasTransform>(initial);
  const startMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startTargetRef = useRef<CanvasTransform>(initial);
  const velocityRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const lastSampleRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const rafRef = useRef<number | null>(null);

  const panModeRef = useRef<PanMode>("idle");
  panModeRef.current = panMode;

  const syncScale = useCanvasZoomStore((s) => s.syncScale);
  const registerActions = useCanvasZoomStore((s) => s.registerActions);

  // Main animation loop that smoothly drives current towards target
  const startAnimationLoop = useCallback(() => {
    if (rafRef.current) return;

    const tick = () => {
      const target = targetRef.current;
      const current = currentRef.current;

      // When dragging has finished, apply subtle friction decay to residual velocity
      if (panModeRef.current === "idle") {
        if (Math.abs(velocityRef.current.vx) > 0.05 || Math.abs(velocityRef.current.vy) > 0.05) {
          target.x += velocityRef.current.vx;
          target.y += velocityRef.current.vy;
          velocityRef.current.vx *= 0.90; // Balanced friction: stops softly without excessive slippery feel
          velocityRef.current.vy *= 0.90;
        } else {
          velocityRef.current = { vx: 0, vy: 0 };
        }
      }

      // Smooth LERP (soft ease-in and soft ease-out)
      const lerp = 0.16;
      const dx = target.x - current.x;
      const dy = target.y - current.y;
      const dScale = target.scale - current.scale;

      const nextX = current.x + dx * lerp;
      const nextY = current.y + dy * lerp;
      const nextScale = current.scale + dScale * lerp;

      currentRef.current = { x: nextX, y: nextY, scale: nextScale };
      setTransform({ x: nextX, y: nextY, scale: nextScale });

      const isStillMoving =
        Math.abs(dx) > 0.1 ||
        Math.abs(dy) > 0.1 ||
        Math.abs(dScale) > 0.001 ||
        Math.abs(velocityRef.current.vx) > 0.05 ||
        Math.abs(velocityRef.current.vy) > 0.05 ||
        panModeRef.current !== "idle";

      if (isStillMoving) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Snap to exact target and sleep RAF loop
        currentRef.current = { ...target };
        setTransform({ ...target });
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (panModeRef.current === "middle_locked") {
      setPanMode("idle");
      setMiddleLockOrigin(null);
      return;
    }

    if (e.button === 2 || e.button === 1) {
      if (e.button === 1) e.preventDefault();
      const mode: PanMode = e.button === 2 ? "right_drag" : "middle_drag";
      setPanMode(mode);
      startMouseRef.current = { x: e.clientX, y: e.clientY };
      startTargetRef.current = { ...targetRef.current };
      lastSampleRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
      velocityRef.current = { vx: 0, vy: 0 };

      if (e.button === 1) {
        setMiddleLockOrigin({ x: e.clientX, y: e.clientY });
      }

      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      startAnimationLoop();
    }
  }, [startAnimationLoop]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (panModeRef.current === "idle") return;

    const now = performance.now();
    const dt = Math.max(now - lastSampleRef.current.time, 1);

    if (panModeRef.current === "right_drag" || panModeRef.current === "middle_drag") {
      const totalDx = e.clientX - startMouseRef.current.x;
      const totalDy = e.clientY - startMouseRef.current.y;

      targetRef.current.x = startTargetRef.current.x + totalDx;
      targetRef.current.y = startTargetRef.current.y + totalDy;

      // Track velocity for soft release glide
      const instVx = ((e.clientX - lastSampleRef.current.x) / dt) * 16.6;
      const instVy = ((e.clientY - lastSampleRef.current.y) / dt) * 16.6;
      velocityRef.current.vx = velocityRef.current.vx * 0.3 + instVx * 0.7;
      velocityRef.current.vy = velocityRef.current.vy * 0.3 + instVy * 0.7;

      lastSampleRef.current = { x: e.clientX, y: e.clientY, time: now };
      startAnimationLoop();
    } else if (panModeRef.current === "middle_locked" && middleLockOrigin) {
      // Soft continuous drift based on offset from origin
      const dx = (e.clientX - middleLockOrigin.x) * 0.035;
      const dy = (e.clientY - middleLockOrigin.y) * 0.035;
      targetRef.current.x -= dx;
      targetRef.current.y -= dy;
      startAnimationLoop();
    }
  }, [middleLockOrigin, startAnimationLoop]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (panModeRef.current === "right_drag") {
      setPanMode("idle");
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      // Clamp max release velocity to prevent harsh sliding
      const maxSpeed = 35;
      velocityRef.current.vx = Math.max(-maxSpeed, Math.min(maxSpeed, velocityRef.current.vx));
      velocityRef.current.vy = Math.max(-maxSpeed, Math.min(maxSpeed, velocityRef.current.vy));
      startAnimationLoop();
    } else if (panModeRef.current === "middle_drag") {
      const movedDistance = Math.hypot(
        e.clientX - startMouseRef.current.x,
        e.clientY - startMouseRef.current.y
      );

      if (movedDistance < 6) {
        setPanMode("middle_locked");
      } else {
        setPanMode("idle");
        setMiddleLockOrigin(null);
        try {
          (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        } catch {}
        startAnimationLoop();
      }
    }
  }, [startAnimationLoop]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => e.preventDefault(), []);

  const zoomIn = useCallback(() => {
    const nextScale = Math.min(CANVAS_BOUNDS.maxScale, +(targetRef.current.scale + CANVAS_BOUNDS.step).toFixed(2));
    targetRef.current.scale = nextScale;
    syncScale(nextScale);
    startAnimationLoop();
  }, [syncScale, startAnimationLoop]);

  const zoomOut = useCallback(() => {
    const nextScale = Math.max(CANVAS_BOUNDS.minScale, +(targetRef.current.scale - CANVAS_BOUNDS.step).toFixed(2));
    targetRef.current.scale = nextScale;
    syncScale(nextScale);
    startAnimationLoop();
  }, [syncScale, startAnimationLoop]);

  const resetTransform = useCallback(() => {
    targetRef.current = { ...DEFAULT_CANVAS_TRANSFORM };
    velocityRef.current = { vx: 0, vy: 0 };
    syncScale(1);
    startAnimationLoop();
  }, [syncScale, startAnimationLoop]);

  useEffect(() => {
    registerActions({ zoomIn, zoomOut, reset: resetTransform, scale: transform.scale });
  }, [registerActions, zoomIn, zoomOut, resetTransform, transform.scale]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return {
    transform,
    isPanning: panMode !== "idle",
    panMode,
    middleLockOrigin,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleContextMenu,
  };
}
