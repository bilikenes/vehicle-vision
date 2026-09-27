"use client";

import { useEffect, useRef } from "react";

import styles from "./EditorialStatement.module.css";

export function WheelGlyph() {
  const glyphRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const glyph = glyphRef.current;
    if (!glyph) return;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let isVisible = false;

    const syncMotion = () => {
      glyph.dataset.spinning = String(
        isVisible && !motionPreference.matches && !document.hidden,
      );
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        syncMotion();
      },
      { threshold: 0.3 },
    );

    observer.observe(glyph);
    motionPreference.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncMotion);

    return () => {
      observer.disconnect();
      motionPreference.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncMotion);
    };
  }, []);

  return (
    <span
      ref={glyphRef}
      className={styles.wheelGlyph}
      data-spinning="false"
      aria-hidden="true"
    >
      <span className={styles.wheelRotor}>
        <span className={styles.wheelHub} />
        <span className={`${styles.wheelSpoke} ${styles.spokeZero}`} />
        <span className={`${styles.wheelSpoke} ${styles.spokeFortyFive}`} />
        <span className={`${styles.wheelSpoke} ${styles.spokeNinety}`} />
        <span className={`${styles.wheelSpoke} ${styles.spokeOneThirtyFive}`} />
      </span>
    </span>
  );
}
