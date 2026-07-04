import { useEffect, useRef } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { renderGrid } from "../core/renderGrid";
import { CuneiformBackgroundProps } from "../core/types";

interface UseCanvasRenderParams extends Omit<CuneiformBackgroundProps, "accent3"> {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  targetPointerRef: React.MutableRefObject<{ x: number; y: number }>;
}

export function useCanvasRender({
  canvasRef, pointerRef, targetPointerRef, isDark, matrixDensity, matrixSize, 
  matrixHoverSize, matrixOpacity, matrixColor, matrixMoving, matrixMouseEffect,
  matrixTwinkleEffect, matrixTwinkleSpeed, animationsEnabled = true, animationsFps = 60
}: UseCanvasRenderParams) {
  const isPageVisible = useIoTStore((state) => state.isPageVisible);
  const isPageVisibleRef = useRef(isPageVisible);
  
  useEffect(() => {
    isPageVisibleRef.current = isPageVisible;
  }, [isPageVisible]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const dpr = window.devicePixelRatio || 1;
    
    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    let time = 0;
    let lastDrawTime = 0;

    const render = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(render);
      
      if (lastDrawTime === 0) lastDrawTime = currentTime;

      if (!isPageVisibleRef.current) return;
      
      if (!animationsEnabled && time > 0) return;

      const fpsInterval = 1000 / animationsFps;
      const elapsed = currentTime - lastDrawTime;

      if (elapsed < fpsInterval) return;

      lastDrawTime = currentTime - (elapsed % fpsInterval);

      if (animationsEnabled && matrixMoving) {
        time += elapsed / (1000 / 60);
      }
      
      pointerRef.current.x += (targetPointerRef.current.x - pointerRef.current.x) * 0.1;
      pointerRef.current.y += (targetPointerRef.current.y - pointerRef.current.y) * 0.1;

      renderGrid({
        ctx, width, height, time, pointer: pointerRef.current,
        matrixDensity, matrixSize, matrixHoverSize, matrixOpacity, matrixColor,
        matrixMouseEffect, matrixTwinkleEffect, matrixTwinkleSpeed, isDark, animationsEnabled
      });
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    canvasRef, pointerRef, targetPointerRef, isDark, matrixDensity, matrixSize, 
    matrixHoverSize, matrixOpacity, matrixColor, matrixMoving, matrixMouseEffect,
    matrixTwinkleEffect, matrixTwinkleSpeed, animationsEnabled, animationsFps
  ]);
}
