"use client";

import React, { useEffect, useRef } from "react";

interface CuneiformBackgroundProps {
  isDark: boolean;
  matrixDensity: number;
  matrixSize: number;
  matrixHoverSize: number;
  matrixOpacity: number;
  matrixColor: string;
  matrixMoving: boolean;
  matrixMouseEffect: boolean;
  matrixTwinkleEffect: boolean;
  matrixTwinkleSpeed: number;
  accent3: string;
  animationsEnabled?: boolean;
  animationsFps?: number;
}

import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

export default function CuneiformBackground({
  isDark,
  matrixDensity,
  matrixSize,
  matrixHoverSize,
  matrixOpacity,
  matrixColor,
  matrixMoving,
  matrixMouseEffect,
  matrixTwinkleEffect,
  matrixTwinkleSpeed,
  accent3,
  animationsEnabled = true,
  animationsFps = 60,
}: CuneiformBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

    // Handle High DPI Displays
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

    const isMobile = window.innerWidth <= 768 || window.matchMedia("(pointer: coarse)").matches || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    const effectiveMouseEffect = matrixMouseEffect && !isMobile;

    // Track pointer position
    let pointer = { x: -1000, y: -1000 };
    // Track target position for smooth interpolation
    let targetPointer = { x: -1000, y: -1000 };

    const handlePointerMove = (e: PointerEvent) => {
      targetPointer.x = e.clientX;
      targetPointer.y = e.clientY;
    };
    
    const handlePointerLeave = () => {
      targetPointer.x = -1000;
      targetPointer.y = -1000;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    // Grid configuration
    const SPACING = matrixDensity;
    const CROSS_SIZE = matrixSize; 
    const GLOW_RADIUS = 300;
    
    let time = 0;
    let lastDrawTime = 0;

    const render = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(render);
      
      if (lastDrawTime === 0) {
        lastDrawTime = currentTime;
      }

      if (!isPageVisibleRef.current) {
        return;
      }
      
      if (!animationsEnabled && time > 0) {
        // If animations disabled, don't redraw unless we just initialized
        // We allow the initial draw so the background isn't empty
        return;
      }

      const fpsInterval = 1000 / animationsFps;
      const elapsed = currentTime - lastDrawTime;

      if (elapsed < fpsInterval) {
        return;
      }

      lastDrawTime = currentTime - (elapsed % fpsInterval);

      if (animationsEnabled && matrixMoving) {
        // Increment time based on real elapsed time to keep animation speed constant regardless of FPS
        // Normalizing relative to 60fps (approx 16.66ms per frame)
        time += elapsed / (1000 / 60);
      }
      
      // Smoothly interpolate pointer for fluid effect
      pointer.x += (targetPointer.x - pointer.x) * 0.1;
      pointer.y += (targetPointer.y - pointer.y) * 0.1;

      // Moving sheet offset
      const speedX = 0.3;
      const speedY = 0.3;
      
      const offsetX = (time * speedX) % SPACING;
      const offsetY = (time * speedY) % SPACING;

      ctx.clearRect(0, 0, width, height);

      // Base matrix color depending on theme
      const baseColor = isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.3)";

      // Draw background pointer glow
      if (effectiveMouseEffect && pointer.x > -500) {
        const gradient = ctx.createRadialGradient(
          pointer.x, pointer.y, 0, 
          pointer.x, pointer.y, GLOW_RADIUS
        );
        gradient.addColorStop(0, `${matrixColor}33`); // ~20% opacity hex
        gradient.addColorStop(1, "transparent");
        
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.lineWidth = 1.2;

      // Draw Matrix of Crosses (+)
      for (let x = -SPACING; x < width + SPACING; x += SPACING) {
        for (let y = -SPACING; y < height + SPACING; y += SPACING) {
          const posX = x + offsetX;
          const posY = y + offsetY;

          const baseAlpha = matrixOpacity / 100;
          let currentAlpha = baseAlpha; 
          let currentSize = CROSS_SIZE;
          let color = baseColor;
          
          let twinkleFactor = 0;
          if (matrixTwinkleEffect && animationsEnabled) {
            // Use grid index rather than pixel coordinates for stable frequencies
            const gridX = Math.round(x / SPACING);
            const gridY = Math.round(y / SPACING);
            
            // Adjust speed (time increases by 1 per frame)
            const speed = matrixTwinkleSpeed * 0.0003;
            
            // 3-wave interference pattern for organic, non-repeating twinkle
            // By using irrational-like offsets, we avoid repeating grid patterns
            const wave1 = Math.sin(gridX * 0.137 + gridY * 0.271 + time * speed);
            const wave2 = Math.cos(gridX * 0.223 - gridY * 0.151 + time * speed * 1.3);
            const wave3 = Math.sin(gridX * 0.359 + gridY * 0.093 - time * speed * 0.8);
            
            const combined = (wave1 + wave2 + wave3) / 3; 
            
            // Map values > 0.7 to a sharp 0-1 spike
            // This means roughly ~5-10% of crosses are twinkling at any given moment, 
            // but the active ones are constantly shifting organically.
            if (combined > 0.7) {
               twinkleFactor = (combined - 0.7) * 3.33; // Remap to 0-1
               twinkleFactor = Math.pow(twinkleFactor, 1.5); // Sharpen the ease-in/out
            }
          }

          if (effectiveMouseEffect) {
            const dx = pointer.x - posX;
            const dy = pointer.y - posY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Interactive effect near pointer
            if (distance < GLOW_RADIUS) {
              const intensity = 1 - Math.pow(distance / GLOW_RADIUS, 1.5); // Ease out
              currentAlpha = baseAlpha + intensity * (1 - baseAlpha);
              currentSize = CROSS_SIZE + intensity * matrixHoverSize;
              color = matrixColor;
            }
          }
          
          if (twinkleFactor > 0) {
             currentAlpha = Math.max(currentAlpha, baseAlpha + twinkleFactor * (1 - baseAlpha));
             currentSize = Math.max(currentSize, CROSS_SIZE + twinkleFactor * matrixHoverSize);
             color = matrixColor;
          }

          ctx.globalAlpha = currentAlpha;
          ctx.strokeStyle = color;
          
          ctx.beginPath();
          // Horizontal line
          ctx.moveTo(posX - currentSize, posY);
          ctx.lineTo(posX + currentSize, posY);
          // Vertical line
          ctx.moveTo(posX, posY - currentSize);
          ctx.lineTo(posX, posY + currentSize);
          ctx.stroke();
        }
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    isDark, 
    accent3, 
    animationsEnabled, 
    matrixDensity, 
    matrixSize, 
    matrixHoverSize, 
    matrixOpacity,
    matrixColor, 
    matrixMoving, 
    matrixMouseEffect,
    matrixTwinkleEffect,
    matrixTwinkleSpeed,
    animationsFps
  ]);

  return (
    <>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--bg-gradient-from)] via-[var(--bg-gradient-via)] to-[var(--bg-gradient-to)] opacity-95 z-0 pointer-events-none transition-colors duration-500" />
      
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.8 }}
      />

      <div
        className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-accent3 to-transparent z-0 transition-colors duration-500"
        style={{ backgroundColor: accent3, opacity: 0.15 }}
      />
    </>
  );
}
