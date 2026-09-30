"use client";

import { type RefObject, useEffect, useRef } from "react";

interface RGBColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

const WAABI_PALETTE: RGBColor[] = [
  { r: 252, g: 179, b: 247, a: 255 },
  { r: 255, g: 44, b: 107, a: 255 },
  { r: 128, g: 3, b: 28, a: 255 },
  { r: 151, g: 126, b: 117, a: 255 },
];

const TUNNEL_CONFIG = {
  NUM_LAYERS: 250,
  SCALE_FACTOR: 0.99,
  MAX_WIDTH_MULTIPLIER: 4.5,
  MAX_HEIGHT_MULTIPLIER: 4.2,
  TIME_SCALE: 0.007,
  FLOW_MULTIPLIER: 5.5,
  EXAGGERATION: 1,
  MOUSE_SMOOTHING: 0.15,
} as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function lerp(a: number, b: number, t: number) {
  return (1 - t) * a + t * b;
}

function lerpColor(c1: RGBColor, c2: RGBColor, t: number): RGBColor {
  return {
    r: Math.round(c1.r + (c2.r - c1.r) * t),
    g: Math.round(c1.g + (c2.g - c1.g) * t),
    b: Math.round(c1.b + (c2.b - c1.b) * t),
    a: 255,
  };
}

interface LightTunnelCanvasProps {
  className?: string;
  palette?: RGBColor[];
  targetRef?: RefObject<HTMLElement | null>;
}

export function LightTunnelCanvas({
  className = "",
  palette = WAABI_PALETTE,
  targetRef,
}: LightTunnelCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = container.clientWidth;
    let height = container.clientHeight;
    let frame = 0;
    let animationId: number | null = null;
    let hasStarted = false;
    let isVisible = false;

    const rawMouse = { x: width / 2, y: height / 2 };
    const smoothMouse = { x: width / 2, y: height / 2 };

    const render = () => {
      if (!isVisible || !hasStarted || width <= 0 || height <= 0) {
        animationId = null;
        return;
      }

      smoothMouse.x = lerp(
        smoothMouse.x,
        rawMouse.x,
        TUNNEL_CONFIG.MOUSE_SMOOTHING,
      );
      smoothMouse.y = lerp(
        smoothMouse.y,
        rawMouse.y,
        TUNNEL_CONFIG.MOUSE_SMOOTHING,
      );

      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const maxWidth = width * TUNNEL_CONFIG.MAX_WIDTH_MULTIPLIER;
      const maxHeight = height * TUNNEL_CONFIG.MAX_HEIGHT_MULTIPLIER;
      const colorOffset = frame * TUNNEL_CONFIG.TIME_SCALE;
      const centerX = width / 2;
      const centerY = height / 2;
      const targetX =
        centerX + (smoothMouse.x - centerX) * TUNNEL_CONFIG.EXAGGERATION;
      const targetY =
        centerY + (smoothMouse.y - centerY) * TUNNEL_CONFIG.EXAGGERATION;

      ctx.clearRect(0, 0, width, height);

      const colors: RGBColor[] = [];
      for (let i = 0; i < TUNNEL_CONFIG.NUM_LAYERS; i++) {
        const step =
          (i / (TUNNEL_CONFIG.NUM_LAYERS - 1)) *
            TUNNEL_CONFIG.FLOW_MULTIPLIER +
          colorOffset;
        const currentColorIndex = Math.floor(step) % palette.length;
        const nextColorIndex = (currentColorIndex + 1) % palette.length;
        colors.push(
          lerpColor(
            palette[currentColorIndex],
            palette[nextColorIndex],
            step % 1,
          ),
        );
      }

      for (let i = 0; i < TUNNEL_CONFIG.NUM_LAYERS; i++) {
        const progress = i / (TUNNEL_CONFIG.NUM_LAYERS - 1);
        const layerCenterX = lerp(targetX, centerX, progress);
        const layerCenterY = lerp(targetY, centerY, progress);
        const layerWidth =
          maxWidth * Math.pow(TUNNEL_CONFIG.SCALE_FACTOR, i);
        const layerHeight =
          maxHeight * Math.pow(TUNNEL_CONFIG.SCALE_FACTOR, i);
        const color = colors[i];

        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a / 255})`;
        ctx.fillRect(
          layerCenterX - layerWidth / 2,
          layerCenterY - layerHeight / 2,
          layerWidth,
          layerHeight,
        );
      }

      frame += 1;
      animationId = requestAnimationFrame(render);
    };

    const ensureAnimation = () => {
      if (isVisible && hasStarted && animationId === null) {
        animationId = requestAnimationFrame(render);
      }
    };

    const updateSize = () => {
      width = container.clientWidth;
      height = container.clientHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      rawMouse.x = width / 2;
      rawMouse.y = height / 2;
      smoothMouse.x = width / 2;
      smoothMouse.y = height / 2;
    };

    const handleMouseMove = (event: MouseEvent) => {
      const normalizedX = clamp(event.clientX / window.innerWidth, 0, 1);
      const normalizedY = clamp(event.clientY / window.innerHeight, 0, 1);

      rawMouse.x = width * normalizedX;
      rawMouse.y = height * normalizedY;

      if (!hasStarted) {
        hasStarted = true;
        container.style.visibility = "visible";
      }

      ensureAnimation();
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (!isVisible && animationId !== null) {
          cancelAnimationFrame(animationId);
          animationId = null;
        } else {
          ensureAnimation();
        }
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(targetRef?.current ?? container);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      if (animationId !== null) cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [palette, targetRef]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        visibility: "hidden",
        pointerEvents: "auto",
        zIndex: 1,
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
