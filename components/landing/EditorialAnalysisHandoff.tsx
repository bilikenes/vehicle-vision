"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

import { editorialAnalysisHandoffMotion } from "@/lib/landing/motion-config";

import { AnalysisPipeline } from "./AnalysisPipeline";
import { EditorialStatement } from "./EditorialStatement";
import styles from "./EditorialAnalysisHandoff.module.css";

type HandoffGeometry = {
  lineHeight: number;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function phase(progress: number, start: number, end: number) {
  return clamp((progress - start) / (end - start));
}

export function EditorialAnalysisHandoff() {
  const sequenceRef = useRef<HTMLDivElement>(null);
  const bridgeRef = useRef<HTMLDivElement>(null);
  const bridgeLineRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const sequence = sequenceRef.current;
    const bridge = bridgeRef.current;
    const bridgeLine = bridgeLineRef.current;

    if (!sequence || !bridge || !bridgeLine) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const editorialTrack = sequence.querySelector<HTMLElement>(
      "[data-handoff-editorial-track]",
    );
    const editorialStage = sequence.querySelector<HTMLElement>(
      "[data-handoff-editorial-stage]",
    );
    const firstBlock = sequence.querySelector<HTMLElement>(
      "[data-handoff-first-block]",
    );
    const period = sequence.querySelector<HTMLElement>("[data-handoff-period]");
    const analysisSection = sequence.querySelector<HTMLElement>(
      "[data-handoff-analysis-section]",
    );
    const spineClip = sequence.querySelector<HTMLElement>("[data-handoff-spine-clip]");
    const spineMover = sequence.querySelector<HTMLElement>(
      "[data-handoff-spine-mover]",
    );
    const analysisContent = Array.from(
      sequence.querySelectorAll<HTMLElement>("[data-handoff-analysis-content]"),
    );
    const secondBlockCharacters = Array.from(
      sequence.querySelectorAll<HTMLElement>(
        '[data-line-index="2"], [data-line-index="3"]',
      ),
    ).filter((character) => character !== period);

    if (
      !editorialTrack ||
      !editorialStage ||
      !firstBlock ||
      !period ||
      !analysisSection ||
      !spineClip ||
      !spineMover ||
      analysisContent.length === 0 ||
      secondBlockCharacters.length === 0
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const geometry: HandoffGeometry = {
      lineHeight: 0,
      sourceX: 0,
      sourceY: 0,
      targetX: 0,
      targetY: 0,
    };
    const state = { progress: 0 };
    const phaseConfig = editorialAnalysisHandoffMotion.phases;

    const measure = () => {
      const periodRect = period.getBoundingClientRect();
      const stageRect = editorialStage.getBoundingClientRect();
      const spineRect = spineClip.getBoundingClientRect();
      const targetY =
        spineClip.offsetHeight * editorialAnalysisHandoffMotion.spineOwnershipProgress -
        editorialAnalysisHandoffMotion.spineDotOffsetPx;

      geometry.sourceX = periodRect.left + periodRect.width * 0.5;
      geometry.sourceY =
        periodRect.top - stageRect.top + periodRect.height * 0.86;
      geometry.targetX = spineRect.left + spineRect.width * 0.5;
      geometry.targetY = targetY;
      geometry.lineHeight = targetY;
    };

    const applyHandoff = (rawProgress: number) => {
      const progress = clamp(rawProgress);
      const firstExit = phase(progress, ...phaseConfig.firstTextExit);
      const secondExit = phase(progress, ...phaseConfig.secondTextExit);
      const periodAccent = phase(progress, ...phaseConfig.periodAccent);
      const periodTakeover = phase(progress, ...phaseConfig.periodTakeover);
      const periodTravel = phase(progress, ...phaseConfig.periodTravel);
      const contentIntro = phase(progress, ...phaseConfig.contentIntro);
      const spineGrowth = phase(progress, ...phaseConfig.spineGrowth);
      const ownershipTransfer = phase(progress, ...phaseConfig.ownershipTransfer);
      const contentOffset =
        (1 - contentIntro) * editorialAnalysisHandoffMotion.contentIntroOffsetPx;
      const bridgeX = gsap.utils.interpolate(
        geometry.sourceX,
        geometry.targetX,
        periodTravel,
      );
      const bridgeY = gsap.utils.interpolate(
        geometry.sourceY,
        geometry.targetY,
        periodTravel,
      );

      gsap.set(firstBlock, {
        autoAlpha: 1 - firstExit,
        y: -editorialAnalysisHandoffMotion.firstTextExitPx * firstExit,
      });
      gsap.set(secondBlockCharacters, {
        autoAlpha: 1 - secondExit,
        y: -editorialAnalysisHandoffMotion.secondTextExitPx * secondExit,
      });
      gsap.set(period, {
        autoAlpha: 1 - periodTakeover,
        color: gsap.utils.interpolate(
          editorialAnalysisHandoffMotion.periodInitialColor,
          editorialAnalysisHandoffMotion.periodAccentColor,
          periodAccent,
        ),
      });
      gsap.set(bridge, {
        autoAlpha: periodTakeover * (1 - ownershipTransfer),
        x: bridgeX,
        y: bridgeY,
      });
      gsap.set(bridgeLine, {
        height: geometry.lineHeight,
        scaleY: spineGrowth,
      });
      gsap.set(analysisContent, {
        autoAlpha: contentIntro,
        y: contentOffset,
      });
      gsap.set(spineMover, {
        autoAlpha: ownershipTransfer,
        y: -editorialAnalysisHandoffMotion.spineDotOffsetPx,
        yPercent:
          -100 + editorialAnalysisHandoffMotion.spineOwnershipProgress * 100,
      });
    };

    const context = gsap.context(() => {
      measure();
      applyHandoff(0);

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: analysisSection,
            start: editorialAnalysisHandoffMotion.desktop.start,
            end: editorialAnalysisHandoffMotion.desktop.end,
            scrub: editorialAnalysisHandoffMotion.scrubSeconds,
            invalidateOnRefresh: true,
            onRefreshInit: measure,
            onRefresh: () => applyHandoff(state.progress),
          },
        })
        .to(state, {
          progress: 1,
          duration: 1,
          onUpdate: () => applyHandoff(state.progress),
        });
    }, sequence);

    ScrollTrigger.refresh();

    return () => context.revert();
  }, []);

  return (
    <div ref={sequenceRef} className={styles.sequence}>
      <EditorialStatement />
      <AnalysisPipeline />

      <div
        ref={bridgeRef}
        className={styles.bridge}
        data-handoff-bridge
        aria-hidden="true"
      >
        <span ref={bridgeLineRef} className={styles.bridgeLine} data-handoff-bridge-line />
        <span className={styles.bridgeDot} />
      </div>
    </div>
  );
}
