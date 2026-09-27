"use client";

/* eslint-disable @next/next/no-img-element */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

import { humanControlCards, humanControlDemo } from "@/lib/landing/human-control-demo";
import styles from "./HumanControlScene.module.css";

export function HumanControlScene() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add({ desktop: "(min-width: 1024px)", mobile: "(max-width: 1023px)", reduce: "(prefers-reduced-motion: reduce)" }, (context) => {
      if (context.conditions?.reduce) return;
      const corridor = section.querySelector(`.${styles.testimonials}`);
      const slots = gsap.utils.toArray<HTMLElement>(`.${styles.cardSlot}`, section);
      const oldChar = section.querySelector(`.${styles.ocrSplitOld}`);
      const newChar = section.querySelector(`.${styles.ocrSplitNew}`);

      if (context.conditions?.desktop) {
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: corridor, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
        });
        // The reference's percentage travel is relative to each postcard's height.
        timeline.fromTo(slots, {
          yPercent: (_, el) => 100 * Number(el.dataset.factor),
          z: (_, el) => 100 * (Number(el.dataset.factor) - 1),
        }, {
          yPercent: (_, el) => -100 * Number(el.dataset.factor),
          duration: 100,
        }, 0);

        timeline.fromTo(oldChar, { yPercent: 0, opacity: 1, filter: "blur(0px)" }, { yPercent: -18, opacity: 0, filter: "blur(3px)", duration: 15 }, 35);
        timeline.fromTo(newChar, { yPercent: 18, opacity: 0, filter: "blur(3px)" }, { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 15 }, 35);

        for (const [className, direction] of [[styles.titleA, -1], [styles.titleB, 1]] as const) {
          const wing = section.querySelector(`.${className}`);
          const chars = wing?.querySelectorAll(`.${styles.char}`);
          if (!wing || !chars) continue;
          timeline.to(wing, { x: direction * 420, ease: "power2.in", duration: 28 }, 62);
          timeline.to(chars, {
            rotationY: direction * 90, z: -180, opacity: 0, filter: "blur(6px)",
            transformOrigin: direction < 0 ? "100% 50%" : "0% 50%",
            stagger: { each: 0.5, from: direction < 0 ? "start" : "end" },
            ease: "expo.in", duration: 10,
          }, 68);
        }
        return;
      }

      // On mobile the cards are in normal flow, so the correction uses its own interval.
      const correction = gsap.timeline({
        scrollTrigger: { trigger: slots[1], start: "top 65%", end: "top 30%", scrub: true, invalidateOnRefresh: true },
      });
      correction.fromTo(oldChar, { yPercent: 0, opacity: 1, filter: "blur(0px)" }, { yPercent: -18, opacity: 0, filter: "blur(3px)", ease: "none" }, 0);
      correction.fromTo(newChar, { yPercent: 18, opacity: 0, filter: "blur(3px)" }, { yPercent: 0, opacity: 1, filter: "blur(0px)", ease: "none" }, 0);
    }, section);

    return () => mm.revert();
  }, []);

  const { initialOCR, correctedOCR, incorrectCharacterIndex } = humanControlDemo;
  const prefix = initialOCR.slice(0, incorrectCharacterIndex);
  const suffix = initialOCR.slice(incorrectCharacterIndex + 1);

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Section 05: OCR Correction Demo">
      <div className={styles.container}>
        <h2 className={styles.testimonialsTitle} aria-label="You can fix that.">
          <span className={styles.titleA} aria-hidden="true">
            {Array.from("You can").map((char, i) => <span key={i} className={styles.char}>{char}</span>)}
          </span>
          <span className={styles.titleB} aria-hidden="true">
            {Array.from("fix that.").map((char, i) => <span key={i} className={styles.char}>{char}</span>)}
          </span>
        </h2>

        <div className={styles.testimonials}>
          {humanControlCards.map((card, index) => (
            <div key={card.id} data-factor={card.factor} className={styles.cardSlot}
              style={{ top: card.desktopTop, left: card.desktopLeft, zIndex: 10 + index * 10 }}>
              <article className={styles.card} data-state={card.stateType} aria-label={`${card.stepNumber}: ${card.badgeLabel}`}>
                <div className={styles.cardHeader}>
                  <h3>{card.badgeLabel}</h3>
                  <span className={styles.stepNumber}>{card.stepNumber}<span> / 03</span></span>
                </div>

                {card.stateType === "initial" ? (
                  <div className={styles.evidence}>
                    <div className={styles.evidenceSource}>
                      <img src={humanControlDemo.imageSrc} alt={humanControlDemo.imageAlt} loading="lazy" />
                      <span className={styles.evidenceBox} aria-hidden="true" style={{
                        left: `${humanControlDemo.plateBBox.x * 100}%`,
                        top: `${humanControlDemo.plateBBox.y * 100}%`,
                        width: `${humanControlDemo.plateBBox.width * 100}%`,
                        height: `${humanControlDemo.plateBBox.height * 100}%`,
                      }} />
                    </div>
                    <span className={styles.evidenceLabel}>PLATE DETECTED</span>
                  </div>
                ) : card.stateType === "transition" ? (
                  <div className={styles.correctionStage} aria-label="Correct the uncertain character B to 8">
                    <span className={styles.rejectedGlyph} aria-hidden="true">B</span>
                    <svg className={styles.correctionArrow} viewBox="0 0 64 32" fill="none" aria-hidden="true">
                      <path d="M1 16H60M46 2L60 16L46 30" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    <span className={styles.glyphFrame} aria-hidden="true">
                      <span className={styles.ocrSplitSlot}>
                        <span className={styles.ocrSplitOld}>{initialOCR[incorrectCharacterIndex]}</span>
                        <span className={styles.ocrSplitNew}>{correctedOCR[incorrectCharacterIndex]}</span>
                      </span>
                    </span>
                  </div>
                ) : (
                  <div className={styles.resolvedStage}>
                    <div className={styles.cardCrop}>
                      <img className={styles.cardCropImage} src={humanControlDemo.imageSrc}
                        alt="Original plate image used for comparison" loading="lazy" />
                    </div>
                    <svg className={styles.verifiedMark} viewBox="0 0 32 32" fill="none" aria-label="Correction complete" role="img">
                      <path d="M6 16L13 23L27 8" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>
                )}

                <div className={styles.readout}>
                  <div className={styles.readoutMain}>
                    <span className={styles.readoutLabel}>{card.stateType === "initial" ? "MACHINE READ" : card.stateType === "transition" ? "HUMAN REVIEW" : "CORRECTED READ"}</span>
                    {card.stateType === "transition" ? (
                      <p className={styles.reviewCaption}>One character.<br />Your call.</p>
                    ) : (
                      <div className={styles.cardOcr} aria-label={card.stateType === "initial" ? `Raw OCR: ${initialOCR}` : `Corrected OCR: ${correctedOCR}`}>
                        <span aria-hidden="true">{prefix}</span>
                        <span className={card.stateType === "initial" ? styles.ocrErrorChar : styles.ocrResolvedChar} aria-hidden="true">
                          {(card.stateType === "initial" ? initialOCR : correctedOCR)[incorrectCharacterIndex]}
                        </span>
                        <span aria-hidden="true">{suffix}</span>
                      </div>
                    )}
                  </div>
                  <p className={styles.cardNote}>{card.note}</p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
