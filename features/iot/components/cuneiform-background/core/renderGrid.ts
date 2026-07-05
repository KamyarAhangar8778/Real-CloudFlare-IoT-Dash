interface RenderGridConfig {
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  width: number;
  height: number;
  time: number;
  pointer: { x: number; y: number };
  matrixDensity: number;
  matrixSize: number;
  matrixHoverSize: number;
  matrixOpacity: number;
  matrixColor: string;
  matrixMouseEffect: boolean;
  matrixTwinkleEffect: boolean;
  matrixTwinkleSpeed: number;
  isDark: boolean;
  animationsEnabled: boolean;
  isMobile: boolean;
}

const LUT_SIZE = 3600;
const SIN_LUT = new Float32Array(LUT_SIZE);
const COS_LUT = new Float32Array(LUT_SIZE);

for (let i = 0; i < LUT_SIZE; i++) {
  const rad = (i / LUT_SIZE) * Math.PI * 2;
  SIN_LUT[i] = Math.sin(rad);
  COS_LUT[i] = Math.cos(rad);
}

const FAST_RAD_CONVERSION = LUT_SIZE / (Math.PI * 2);

function fastSin(rad: number): number {
  let idx = (rad * FAST_RAD_CONVERSION) % LUT_SIZE;
  if (idx < 0) idx += LUT_SIZE;
  return SIN_LUT[idx | 0];
}

function fastCos(rad: number): number {
  let idx = (rad * FAST_RAD_CONVERSION) % LUT_SIZE;
  if (idx < 0) idx += LUT_SIZE;
  return COS_LUT[idx | 0];
}

export function renderGrid({
  ctx, width, height, time, pointer, matrixDensity, matrixSize, matrixHoverSize,
  matrixOpacity, matrixColor, matrixMouseEffect, matrixTwinkleEffect,
  matrixTwinkleSpeed, isDark, animationsEnabled, isMobile
}: RenderGridConfig) {
  const SPACING = matrixDensity;
  const CROSS_SIZE = matrixSize; 
  const GLOW_RADIUS = 300;

  const effectiveMouseEffect = matrixMouseEffect && !isMobile;

  const speedX = 0.3;
  const speedY = 0.3;
  
  const offsetX = (time * speedX) % SPACING;
  const offsetY = (time * speedY) % SPACING;

  ctx.clearRect(0, 0, width, height);

  const baseColor = isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.3)";

  if (effectiveMouseEffect && pointer.x > -500) {
    const gradient = ctx.createRadialGradient(
      pointer.x, pointer.y, 0, 
      pointer.x, pointer.y, GLOW_RADIUS
    );
    gradient.addColorStop(0, `${matrixColor}33`);
    gradient.addColorStop(1, "transparent");
    
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.lineWidth = 1.2;

  ctx.beginPath();
  const activePoints = [];

  for (let x = -SPACING; x < width + SPACING; x += SPACING) {
    for (let y = -SPACING; y < height + SPACING; y += SPACING) {
      const posX = x + offsetX;
      const posY = y + offsetY;

      const baseAlpha = matrixOpacity / 100;
      let currentAlpha = baseAlpha; 
      let currentSize = CROSS_SIZE;
      let color = baseColor;
      let isDefault = true;
      
      let twinkleFactor = 0;
      if (matrixTwinkleEffect && animationsEnabled) {
        const gridX = Math.round(x / SPACING);
        const gridY = Math.round(y / SPACING);
        const speed = matrixTwinkleSpeed * 0.0003;
        
        const wave1 = fastSin(gridX * 0.137 + gridY * 0.271 + time * speed);
        const wave2 = fastCos(gridX * 0.223 - gridY * 0.151 + time * speed * 1.3);
        const wave3 = fastSin(gridX * 0.359 + gridY * 0.093 - time * speed * 0.8);
        
        const combined = (wave1 + wave2 + wave3) / 3; 
        
        if (combined > 0.7) {
           twinkleFactor = (combined - 0.7) * 3.33; 
           twinkleFactor = Math.pow(twinkleFactor, 1.5); 
           isDefault = false;
        }
      }

      if (effectiveMouseEffect) {
        const dx = pointer.x - posX;
        const dy = pointer.y - posY;
        const distSq = dx * dx + dy * dy;

        if (distSq < GLOW_RADIUS * GLOW_RADIUS) {
          const distance = Math.sqrt(distSq);
          const intensity = 1 - Math.pow(distance / GLOW_RADIUS, 1.5); 
          currentAlpha = baseAlpha + intensity * (1 - baseAlpha);
          currentSize = CROSS_SIZE + intensity * matrixHoverSize;
          color = matrixColor;
          isDefault = false;
        }
      }
      
      if (twinkleFactor > 0) {
         currentAlpha = Math.max(currentAlpha, baseAlpha + twinkleFactor * (1 - baseAlpha));
         currentSize = Math.max(currentSize, CROSS_SIZE + twinkleFactor * matrixHoverSize);
         color = matrixColor;
      }

      if (isDefault) {
        ctx.moveTo(posX - currentSize, posY);
        ctx.lineTo(posX + currentSize, posY);
        ctx.moveTo(posX, posY - currentSize);
        ctx.lineTo(posX, posY + currentSize);
      } else {
        activePoints.push({ posX, posY, currentSize, currentAlpha, color });
      }
    }
  }

  ctx.globalAlpha = matrixOpacity / 100;
  ctx.strokeStyle = baseColor;
  ctx.stroke();

  for (let i = 0; i < activePoints.length; i++) {
    const p = activePoints[i];
    ctx.globalAlpha = p.currentAlpha;
    ctx.strokeStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(p.posX - p.currentSize, p.posY);
    ctx.lineTo(p.posX + p.currentSize, p.posY);
    ctx.moveTo(p.posX, p.posY - p.currentSize);
    ctx.lineTo(p.posX, p.posY + p.currentSize);
    ctx.stroke();
  }
}
