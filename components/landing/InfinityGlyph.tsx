"use client";

import { useEffect, useId, useRef } from "react";

import styles from "./InfinityGlyph.module.css";

const TAU = Math.PI * 2;
const SAMPLES = 160;
const FRAME_MS = 1000 / 24;

function infinityPaths(time: number) {
  const outside: string[] = [];
  const inside: string[] = [];
  const center: string[] = [];

  for (let index = 0; index < SAMPLES; index++) {
    const angle = (index / SAMPLES) * TAU;
    const dx = 108 * Math.cos(angle);
    const dy = 108 * Math.cos(2 * angle);
    const length = Math.hypot(dx, dy);
    const nx = -dy / length;
    const ny = dx / length;
    // A smooth figure eight carries an irregular, slowly breathing corona edge.
    const ripple =
      1.8 * Math.sin(7 * angle - time * 0.8) +
      1.1 * Math.sin(11 * angle + time * 0.55);
    const x = 150 + 108 * Math.sin(angle) + nx * ripple;
    const y = 75 + 54 * Math.sin(2 * angle) + ny * ripple;
    const thickness =
      13 +
      2.6 * Math.sin(3 * angle + time * 0.7) +
      1.7 * Math.sin(9 * angle - time * 0.6);
    const point = (px: number, py: number) =>
      `${px.toFixed(2)},${py.toFixed(2)}`;

    center.push(point(x, y));
    outside.push(point(x + nx * thickness, y + ny * thickness));
    inside.push(point(x - nx * thickness, y - ny * thickness));
  }

  return {
    outline: `M${outside.join("L")}L${inside.reverse().join("L")}Z`,
    center: `M${center.join("L")}Z`,
  };
}

const INITIAL_PATHS = infinityPaths(0);

export function InfinityGlyph() {
  const id = useId().replace(/:/g, "");
  const gradientId = `infinity-color-${id}`;
  const lightId = `infinity-light-${id}`;
  const glyphRef = useRef<HTMLSpanElement>(null);
  const outlineRef = useRef<SVGPathElement>(null);
  const coreRef = useRef<SVGPathElement>(null);
  const lightRef = useRef<SVGPathElement>(null);
  const gradientRef = useRef<SVGLinearGradientElement>(null);

  useEffect(() => {
    const glyph = glyphRef.current;
    const outline = outlineRef.current;
    const core = coreRef.current;
    const light = lightRef.current;
    const gradient = gradientRef.current;
    if (!glyph || !outline || !core || !light || !gradient) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let rafId = 0;
    let previous = 0;
    let elapsed = 0;

    function draw(time: number) {
      const paths = infinityPaths(time);
      outline!.setAttribute("d", paths.outline);
      core!.setAttribute("d", paths.center);
      light!.setAttribute("d", paths.center);
      light!.setAttribute("stroke-dashoffset", String(-time * 38));
      gradient!.setAttribute(
        "gradientTransform",
        `rotate(${Math.sin(time * 0.3) * 24} 150 75)`,
      );
    }

    function frame(now: number) {
      if (!previous) previous = now;
      const delta = now - previous;
      if (delta >= FRAME_MS) {
        elapsed += Math.min(delta, 100) / 1000;
        previous = now;
        draw(elapsed);
      }
      rafId = requestAnimationFrame(frame);
    }

    function updatePlayback() {
      const playing = visible && !document.hidden && !motion.matches;
      if (playing && !rafId) {
        previous = 0;
        rafId = requestAnimationFrame(frame);
      } else if (!playing && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      if (motion.matches) draw(0);
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updatePlayback();
    });
    observer.observe(glyph);
    motion.addEventListener("change", updatePlayback);
    document.addEventListener("visibilitychange", updatePlayback);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      motion.removeEventListener("change", updatePlayback);
      document.removeEventListener("visibilitychange", updatePlayback);
    };
  }, []);

  return (
    <span ref={glyphRef} className={styles.glyph} aria-hidden="true">
      <svg
        className={styles.artwork}
        viewBox="0 0 300 150"
        fill="none"
        focusable="false"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            ref={gradientRef}
            id={gradientId}
            x1="32"
            y1="118"
            x2="268"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#6b1124" />
            <stop offset="0.125" stopColor="#8f132e" />
            <stop offset="0.25" stopColor="#b90f31" />
            <stop offset="0.375" stopColor="#e0264b" />
            <stop offset="0.5" stopColor="#ff3b5c" />
            <stop offset="0.625" stopColor="#ff637f" />
            <stop offset="0.75" stopColor="#ff94a8" />
            <stop offset="0.875" stopColor="#ff5978" />
            <stop offset="1" stopColor="#ff3b5c" />
          </linearGradient>
          <linearGradient id={lightId} x1="0" y1="1" x2="1" y2="0">
            <stop stopColor="#ff3b5c" stopOpacity="0" />
            <stop offset="0.5" stopColor="#ff94a8" />
            <stop offset="1" stopColor="#ff637f" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          ref={outlineRef}
          d={INITIAL_PATHS.outline}
          fill={`url(#${gradientId})`}
        />
        <path
          ref={coreRef}
          d={INITIAL_PATHS.center}
          stroke={`url(#${lightId})`}
          strokeWidth="13"
          strokeLinejoin="round"
          opacity="0.55"
        />
        <path
          ref={lightRef}
          d={INITIAL_PATHS.center}
          stroke={`url(#${lightId})`}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="64 210 22 190"
          opacity="0.8"
        />
      </svg>
    </span>
  );
}
