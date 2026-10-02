"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

import styles from "./ClosingStatement.module.css";
import { InfinityGlyph } from "./InfinityGlyph";

export function ClosingStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const text = textRef.current;
    if (!section || !container || !text) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const travel = () => Math.max(0, text.scrollWidth - container.offsetWidth);

        const tween = gsap.to(text, {
          x: () => -travel(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "bottom bottom",
            end: "top 30%",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        return () => tween.kill();
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="closing-statement"
      className={styles.section}
      aria-label="Closing statement"
    >
      <div className={styles.paddingGlobal}>
        <div ref={containerRef} className={styles.containerLarge}>
          <div className={styles.textWrapper}>
            <h2
              ref={textRef}
              className={styles.text}
              aria-label="Seen by the system. understood by you."
            >
              <span aria-hidden="true">Seen by the system. </span>
              <span className={styles.word} aria-hidden="true">
                underst<InfinityGlyph />d
              </span>
              <span aria-hidden="true"> by you.</span>
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
