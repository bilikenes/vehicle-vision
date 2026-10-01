"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  type CSSProperties,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import {
  analysisDemo,
  analysisStages,
  type AnalysisStageId,
  type NormalizedBBox,
} from "@/lib/landing/analysis-demo";
import { analysisMotion } from "@/lib/landing/motion-config";

import styles from "./AnalysisPipeline.module.css";

type CounterState = Readonly<{
  current: number;
  previous: number | null;
  direction: 1 | -1;
}>;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function stageFromProgress(
  progress: number,
  thresholds: readonly [number, number, number] = analysisMotion.stageThresholds,
) {
  const [t1, t2, t3] = thresholds;
  if (progress < t1) return 1;
  if (progress < t2) return 2;
  if (progress < t3) return 3;
  return 4;
}

function bboxStyle(bbox: NormalizedBBox): CSSProperties {
  return {
    left: `${bbox.x * 100}%`,
    top: `${bbox.y * 100}%`,
    width: `${bbox.width * 100}%`,
    height: `${bbox.height * 100}%`,
  };
}

function visualStyle(stageId: AnalysisStageId): CSSProperties {
  const frame = analysisDemo.visualFrames[stageId];

  return {
    "--analysis-scale": frame.scale,
    "--analysis-origin-x": `${frame.originX}%`,
    "--analysis-origin-y": `${frame.originY}%`,
  } as CSSProperties;
}

type AnalysisVisualProps = Readonly<{
  stageId: AnalysisStageId;
  className?: string;
  handoffSource?: boolean;
}>;

function AnalysisVisual({
  stageId,
  className,
  handoffSource = false,
}: AnalysisVisualProps) {
  return (
    <div
      className={`${styles.visualFrame}${className ? ` ${className}` : ""}`}
      data-stage={stageId}
      {...(handoffSource
        ? {
            "data-handoff-analysis-content": true,
            "data-section03-handoff-source": true,
          }
        : {})}
    >
      <div className={styles.analysisPlane}>
        <div
          className={styles.analysisSource}
          style={{
            aspectRatio: `${analysisDemo.imageWidth} / ${analysisDemo.imageHeight}`,
          }}
        >
          <div className={styles.analysisSourceTransform} style={visualStyle(stageId)}>
            <img src={analysisDemo.imageSrc} alt={analysisDemo.imageAlt} />

            <span
              className={`${styles.bbox} ${styles.vehicleBox}`}
              style={bboxStyle(analysisDemo.vehicleBBox)}
              data-analysis-overlay
              aria-hidden="true"
            />
            <span
              className={`${styles.bbox} ${styles.plateBox}`}
              style={bboxStyle(analysisDemo.plateBBox)}
              data-analysis-overlay
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <div
        className={`${styles.resultReadout} ${styles.ocrReadout}`}
        data-section03-retreat={handoffSource ? true : undefined}
        data-analysis-overlay
      >
        <span className={styles.resultLabel}>PLATE</span>
        <strong>{analysisDemo.plateText}</strong>
      </div>

      <div
        className={`${styles.resultReadout} ${styles.bodyReadout}`}
        data-section03-retreat={handoffSource ? true : undefined}
        data-analysis-overlay
      >
        <span className={styles.resultLabel}>BODY</span>
        <strong>{analysisDemo.bodyType}</strong>
      </div>
    </div>
  );
}

export function AnalysisPipeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const spineTrackRef = useRef<HTMLDivElement>(null);
  const spineLineRef = useRef<HTMLSpanElement>(null);
  const spineDotRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const counterCurrentRef = useRef<HTMLSpanElement>(null);
  const counterPreviousRef = useRef<HTMLSpanElement>(null);
  const textRailRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const visualStickyRef = useRef<HTMLDivElement>(null);
  const mobileSequenceRef = useRef<HTMLDivElement>(null);
  const mobileProgressFillRef = useRef<HTMLSpanElement>(null);
  const activeStageRef = useRef(1);
  const previousProgressRef = useRef(0);

  const [activeStage, setActiveStage] = useState(1);
  const [counterState, setCounterState] = useState<CounterState>({
    current: 1,
    previous: null,
    direction: 1,
  });

  const activeStageData = analysisStages[activeStage - 1];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const spineTrack = spineTrackRef.current;
    const spineLine = spineLineRef.current;
    const spineDot = spineDotRef.current;
    const counter = counterRef.current;
    const textRail = textRailRef.current;
    const visual = visualRef.current;
    const visualSticky = visualStickyRef.current;
    const mobileSequence = mobileSequenceRef.current;

    if (
      !section ||
      !spineTrack ||
      !spineLine ||
      !spineDot ||
      !counter ||
      !textRail ||
      !visual ||
      !visualSticky ||
      !mobileSequence
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const updateStage = (
      progress: number,
      thresholds: readonly [number, number, number] = analysisMotion.stageThresholds,
    ) => {
      const direction: 1 | -1 = progress >= previousProgressRef.current ? 1 : -1;
      const nextStage = stageFromProgress(progress, thresholds);

      previousProgressRef.current = progress;

      if (nextStage !== activeStageRef.current) {
        const previousStage = activeStageRef.current;
        activeStageRef.current = nextStage;
        setActiveStage(nextStage);
        setCounterState({
          current: nextStage,
          previous: previousStage,
          direction,
        });
      }
    };

    const applyDesktopProgress = (progress: number) => {
      const normalized = clamp(progress, 0, 1);
      const line = spineLineRef.current;

      if (line) {
        const lineGrowth = clamp(normalized / 0.25, 0, 1);
        gsap.set(line, { scaleY: lineGrowth });
      }

      updateStage(normalized);
    };

    const media = gsap.matchMedia();

    media.add("(max-width: 767px)", () => {
      const applyMobileProgress = (progress: number) => {
        const normalized = clamp(progress, 0, 1);
        const fill = mobileProgressFillRef.current;

        if (fill) {
          fill.style.transform = `scaleX(${normalized})`;
        }

        updateStage(normalized, analysisMotion.mobile.stageThresholds);
      };

      const trigger = ScrollTrigger.create({
        trigger: mobileSequence,
        start: "top top",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onUpdate: (self) => applyMobileProgress(self.progress),
        onRefresh: (self) => applyMobileProgress(self.progress),
      });

      applyMobileProgress(trigger.progress);

      return () => trigger.kill();
    });

    media.add("(min-width: 768px)", () => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        gsap.set(spineLine, { scaleY: 1 });
        gsap.set([counter, textRail, visualSticky], { autoAlpha: 1, y: 0 });
        return;
      }

      const context = gsap.context(() => {
        applyDesktopProgress(0);

        const entranceTargets = [visualSticky, textRail, counter];

        gsap.fromTo(
          entranceTargets,
          {
            autoAlpha: analysisMotion.entrance.initialOpacity,
            y: analysisMotion.entrance.offsetYPx,
          },
          {
            autoAlpha: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: analysisMotion.entrance.start,
              end: analysisMotion.entrance.end,
              scrub: analysisMotion.entrance.scrubSeconds,
              invalidateOnRefresh: true,
            },
          },
        );

        ScrollTrigger.create({
          trigger: section,
          start: analysisMotion.desktop.start,
          end: analysisMotion.desktop.end,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => applyDesktopProgress(self.progress),
          onRefresh: (self) => applyDesktopProgress(self.progress),
        });
      }, section);

      return () => context.revert();
    });

    ScrollTrigger.refresh();

    return () => media.revert();
  }, []);

  useLayoutEffect(() => {
    const current = counterCurrentRef.current;
    const previous = counterPreviousRef.current;

    if (!current || counterState.previous === null) return;

    const travel = analysisMotion.counterTravelPercent * counterState.direction;
    const timeline = gsap.timeline();

    if (previous) {
      timeline.fromTo(
        previous,
        { yPercent: 0 },
        {
          yPercent: -travel,
          duration: 0.42,
          ease: "power3.out",
        },
        0,
      );
    }

    timeline.fromTo(
      current,
      { yPercent: travel },
      {
        yPercent: 0,
        duration: 0.48,
        ease: "power3.out",
      },
      0,
    );

    return () => {
      timeline.kill();
    };
  }, [counterState]);

  return (
    <section
      ref={sectionRef}
      id="analysis-pipeline"
      className={styles.section}
      data-active-stage={activeStage}
      data-handoff-analysis-section
      aria-label="Vehicle analysis pipeline"
    >
      <div
        ref={spineTrackRef}
        className={styles.spineTrack}
        data-section03-retreat
        aria-hidden="true"
      >
        <div className={styles.spineSticky}>
          <span ref={spineLineRef} className={styles.spineLine} />
          <span ref={spineDotRef} className={styles.spineDot} />
        </div>
      </div>

      <div className={styles.columns}>
        <div className={styles.leftPane}>
          <div
            ref={counterRef}
            className={styles.counterSticky}
            data-handoff-analysis-content
            data-section03-retreat
            aria-live="polite"
          >
            <div className={styles.counterDigits} aria-hidden="true">
              {counterState.previous !== null ? (
                <span ref={counterPreviousRef} className={styles.counterNumber}>
                  {String(counterState.previous).padStart(2, "0")}
                </span>
              ) : null}
              <span ref={counterCurrentRef} className={styles.counterNumber}>
                {String(counterState.current).padStart(2, "0")}
              </span>
            </div>
            <span className={styles.counterTotal}>/04</span>
            <span className={styles.srOnly}>
              Step {activeStage} of {analysisStages.length}
            </span>
          </div>

          <div
            ref={textRailRef}
            className={styles.textRail}
            data-handoff-analysis-content
            data-section03-retreat
          >
            {analysisStages.map((stage, index) => (
              <article
                key={stage.id}
                className={`${styles.textStage} ${index === 0 ? "" : styles.overlapStage}`}
                data-active={activeStage === stage.index}
              >
                <div className={styles.textContent}>
                  <h2>{stage.label}</h2>
                  <p>{stage.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.visualPane}>
          <div ref={visualStickyRef} className={styles.visualSticky}>
            <div ref={visualRef} className={styles.desktopVisualHost}>
              <AnalysisVisual stageId={activeStageData.id} handoffSource />
            </div>
          </div>
        </div>
      </div>

      <div ref={mobileSequenceRef} className={styles.mobileSequence}>
        <div className={styles.mobileSticky} aria-live="polite">
          <div className={styles.mobileProgress} data-section03-retreat aria-hidden="true">
            <span ref={mobileProgressFillRef} className={styles.mobileProgressFill} />
          </div>

          <div className={styles.mobileStageHeader} data-section03-retreat>
            <div className={styles.mobileCounter}>
              <span key={activeStage} className={styles.mobileCounterCurrent}>
                {String(activeStage).padStart(2, "0")}
              </span>
              <span className={styles.mobileCounterTotal}>/04</span>
            </div>

            <div className={styles.mobileCopyStack}>
              {analysisStages.map((stage) => (
                <div
                  key={stage.id}
                  className={styles.mobileStageCopy}
                  data-active={activeStage === stage.index}
                  aria-hidden={activeStage !== stage.index}
                >
                  <h2>{stage.label}</h2>
                  <p>{stage.description}</p>
                </div>
              ))}
            </div>
          </div>

          <AnalysisVisual
            stageId={activeStageData.id}
            className={styles.mobileVisual}
            handoffSource
          />

          <span className={styles.srOnly}>
            Step {activeStage} of {analysisStages.length}: {activeStageData.label}.{" "}
            {activeStageData.description}
          </span>
        </div>
      </div>
    </section>
  );
}
