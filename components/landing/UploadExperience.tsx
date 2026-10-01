"use client";

/* eslint-disable @next/next/no-img-element */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  type CSSProperties,
  type DragEvent,
  type KeyboardEvent,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { uploadMotion } from "@/lib/landing/motion-config";
import { uploadSamples, type UploadSample } from "@/lib/landing/upload-samples";

import styles from "./UploadExperience.module.css";

type SelectedImage =
  | null
  | Readonly<{
      source: "sample";
      sampleId: string;
      previewSrc: string;
      alt: string;
    }>
  | Readonly<{
      source: "upload";
      file: File;
      previewSrc: string;
      alt: string;
    }>;

type SampleStyle = CSSProperties & {
  "--sample-x": string;
  "--sample-y": string;
  "--sample-width": string;
  "--sample-parallax": string;
};

type RectSnapshot = Readonly<{
  left: number;
  top: number;
  width: number;
  height: number;
}>;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function easeInOut(value: number) {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
}

function mix(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function getSampleStyle(sample: UploadSample): SampleStyle {
  return {
    "--sample-x": `${sample.x}%`,
    "--sample-y": `${sample.y}%`,
    "--sample-width": `${sample.widthVw}vw`,
    "--sample-parallax": `${sample.parallaxY}px`,
  };
}

function isImageFile(file: File | undefined): file is File {
  return Boolean(file?.type.startsWith("image/"));
}

export function UploadExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadObjectUrlRef = useRef<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<SelectedImage>(null);
  const [dragActive, setDragActive] = useState(false);
  const [statusMessage, setStatusMessage] = useState("No image selected.");

  const releaseUploadUrl = () => {
    if (!uploadObjectUrlRef.current) return;
    URL.revokeObjectURL(uploadObjectUrlRef.current);
    uploadObjectUrlRef.current = null;
  };

  const selectSample = (sample: UploadSample) => {
    releaseUploadUrl();
    setSelectedImage({
      source: "sample",
      sampleId: sample.id,
      previewSrc: sample.src,
      alt: sample.alt,
    });
    setStatusMessage("Sample image selected. Ready to analyze.");
  };

  const selectFile = (file: File | undefined) => {
    if (!isImageFile(file)) {
      setStatusMessage("Choose an image file to continue.");
      return;
    }

    releaseUploadUrl();
    const previewSrc = URL.createObjectURL(file);
    uploadObjectUrlRef.current = previewSrc;
    setSelectedImage({
      source: "upload",
      file,
      previewSrc,
      alt: file.name || "Selected vehicle image",
    });
    setStatusMessage("Uploaded image selected. Ready to analyze.");
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    selectFile(event.dataTransfer.files[0]);
  };

  const handleApertureKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openFilePicker();
  };

  const handleAnalyze = () => {
    if (!selectedImage) return;

    window.dispatchEvent(
      new CustomEvent("vehiclevision:analyze-requested", {
        detail:
          selectedImage.source === "sample"
            ? { source: "sample", sampleId: selectedImage.sampleId }
            : { source: "upload", file: selectedImage.file },
      }),
    );
    setStatusMessage("Analysis requested.");
  };

  useLayoutEffect(() => {
    return () => releaseUploadUrl();
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const center = centerRef.current;
    if (!section || !center) return;

    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();

    const setupHandoff = (desktop: boolean) => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const source = Array.from(
        document.querySelectorAll<HTMLElement>("[data-section03-handoff-source]"),
      ).find((candidate) => {
        const bounds = candidate.getBoundingClientRect();
        return bounds.width > 0 && bounds.height > 0;
      });
      const retreatNodes = Array.from(
        document.querySelectorAll<HTMLElement>("[data-section03-retreat]"),
      );
      const sampleSlots = Array.from(
        section.querySelectorAll<HTMLElement>("[data-upload-sample]"),
      );
      const carriedTarget = section.querySelector<HTMLElement>(
        "[data-section04-carried-sample]",
      );
      const carriedMedia = section.querySelector<HTMLElement>(
        "[data-section04-carried-media]",
      );
      const sampleHint = section.querySelector<HTMLElement>(`.${styles.sampleHint}`);

      if (reducedMotion || !source || !carriedTarget || !carriedMedia) {
        gsap.set(sampleSlots, { autoAlpha: 1, y: 0 });
        gsap.set(center, { autoAlpha: 1, y: 0 });
        gsap.set(sampleHint, { autoAlpha: 1, y: 0 });
        gsap.set(carriedMedia, { autoAlpha: 1 });
        return;
      }

      let clone: HTMLElement | null = null;
      let sourceRect: RectSnapshot | null = null;
      let targetRect: RectSnapshot | null = null;

      const removeClone = () => {
        clone?.remove();
        clone = null;
      };

      const captureRects = () => {
        const scene = sceneRef.current;
        if (!scene) return;

        const sourceBounds = source.getBoundingClientRect();
        const targetBounds = carriedTarget.getBoundingClientRect();
        const sectionBounds = section.getBoundingClientRect();

        const carriedSlot = carriedTarget.closest<HTMLElement>("[data-upload-sample]");
        const slotY = carriedSlot ? Number(gsap.getProperty(carriedSlot, "y")) || 0 : 0;
        const slotX = carriedSlot ? Number(gsap.getProperty(carriedSlot, "x")) || 0 : 0;

        // Section 03'teki visualFrame, 100svh içinde tam dikey ortalanır.
        // Desktop dışındaki source, mobile sticky sahnesinin mevcut viewport konumunu korur.
        const restingSourceTop = desktop
          ? Math.round((window.innerHeight - sourceBounds.height) / 2)
          : sourceBounds.top;

        sourceRect = {
          left: sourceBounds.left,
          top: restingSourceTop,
          width: sourceBounds.width,
          height: sourceBounds.height,
        };
        targetRect = {
          left: targetBounds.left - slotX - sectionBounds.left,
          top: targetBounds.top - slotY - sectionBounds.top,
          width: targetBounds.width,
          height: targetBounds.height,
        };
      };

      const ensureClone = () => {
        if (clone) return clone;

        clone = source.cloneNode(true) as HTMLElement;
        clone.querySelectorAll("[data-analysis-overlay]").forEach((node) => node.remove());
        clone.removeAttribute("data-section03-handoff-source");
        clone.setAttribute("aria-hidden", "true");
        clone.style.position = "fixed";
        clone.style.zIndex = "20";
        clone.style.margin = "0";
        clone.style.maxWidth = "none";
        clone.style.pointerEvents = "none";
        clone.style.willChange = "left, top, width, height, border-radius, opacity";

        // Disable CSS transitions so GSAP has immediate 1:1 control with no lag
        clone.style.transition = "none";
        clone.querySelectorAll<HTMLElement>("*").forEach((node) => {
          node.style.transition = "none";
        });

        if (sourceRect) {
          clone.style.left = `${sourceRect.left}px`;
          clone.style.top = `${sourceRect.top}px`;
          clone.style.width = `${sourceRect.width}px`;
          clone.style.height = `${sourceRect.height}px`;
        }
        document.body.appendChild(clone);
        gsap.set(clone, { autoAlpha: 1 });
        return clone;
      };

      const resetBeforeHandoff = () => {
        removeClone();
        sourceRect = null;
        targetRect = null;
        gsap.set(source, { autoAlpha: 1 });
        gsap.set(retreatNodes, { clearProps: "opacity,visibility,transform" });
        gsap.set(sampleSlots, { autoAlpha: 0, y: 18 });
        gsap.set(center, { autoAlpha: 0, y: 24 });
        gsap.set(sampleHint, { autoAlpha: 0, y: 12 });
        gsap.set(carriedMedia, { autoAlpha: 0 });
      };

      const settleHandoff = () => {
        removeClone();
        gsap.set(source, { autoAlpha: 0 });
        gsap.set(retreatNodes, { autoAlpha: 0, y: -12 });
        gsap.set(sampleSlots, { autoAlpha: 1, y: 0 });
        gsap.set(center, { autoAlpha: 1, y: 0 });
        gsap.set(sampleHint, { autoAlpha: 1, y: 0 });
        gsap.set(carriedMedia, { autoAlpha: 1 });
      };

      const applyHandoffProgress = (progress: number) => {
        const p = clamp(progress);

        if (!sourceRect || !targetRect) captureRects();
        if (!sourceRect || !targetRect) return;

        const handoffClone = ensureClone();
        gsap.set(source, { autoAlpha: 0 });

        const retreatProgress = easeInOut(p / uploadMotion.handoff.uiRetreatEnd);
        gsap.set(retreatNodes, {
          autoAlpha: 1 - retreatProgress,
          y: -12 * retreatProgress,
        });

        const travelProgress = easeInOut(
          (p - uploadMotion.handoff.imageMoveStart) /
            (0.96 - uploadMotion.handoff.imageMoveStart),
        );

        // Smoothly zoom the internal source image from 1.04 down to 1.00 so it matches the resting slot
        const currentScale = mix(1.04, 1, travelProgress);
        const transformNode = handoffClone.querySelector<HTMLElement>(
          "[class*='analysisSourceTransform']",
        );
        if (transformNode) {
          transformNode.style.transform = `scale(${currentScale})`;
          transformNode.style.transformOrigin = "50% 50%";
        }

        const targetRadius =
          Number.parseFloat(getComputedStyle(carriedTarget).borderRadius) || 14;

        gsap.set(handoffClone, {
          left: mix(sourceRect.left, targetRect.left, travelProgress),
          top: mix(sourceRect.top, targetRect.top, travelProgress),
          width: mix(sourceRect.width, targetRect.width, travelProgress),
          height: mix(sourceRect.height, targetRect.height, travelProgress),
          borderRadius: mix(22, targetRadius, travelProgress),
        });

        // Avoid double-image ghosting: the clone stays 100% visible throughout flight until it settles into targetRect.
        // Once seated (p >= 0.98), swap cleanly: reveal the target image and hide the clone.
        const isSeated = p >= 0.98;
        gsap.set(carriedMedia, { autoAlpha: isSeated ? 1 : 0 });
        gsap.set(handoffClone, { autoAlpha: isSeated ? 0 : 1 });

        sampleSlots.forEach((slot, index) => {
          const isCarried = slot.hasAttribute("data-carried-slot");
          const revealStart = uploadMotion.samples.revealStart + index * 0.025;
          const reveal = isCarried
            ? clamp((p - 0.72) / 0.2)
            : easeInOut((p - revealStart) / uploadMotion.samples.revealDuration);
          gsap.set(slot, {
            autoAlpha: reveal,
            y: (1 - reveal) * uploadMotion.samples.revealOffsetPx,
          });
        });

        const centerReveal = easeInOut(
          (p - uploadMotion.center.revealStart) / uploadMotion.center.revealDuration,
        );
        gsap.set(center, {
          autoAlpha: centerReveal,
          y: (1 - centerReveal) * uploadMotion.center.revealOffsetPx,
        });
        gsap.set(sampleHint, {
          autoAlpha: centerReveal,
          y: (1 - centerReveal) * 12,
        });
      };

      const context = gsap.context(() => {
        resetBeforeHandoff();

        ScrollTrigger.create({
          trigger: section,
          start: uploadMotion.handoff.start,
          end: uploadMotion.handoff.end,
          scrub: uploadMotion.scrubSeconds,
          invalidateOnRefresh: true,
          onRefreshInit: () => {
            sourceRect = null;
            targetRect = null;
          },
          onRefresh: (self) => {
            if (self.isActive) applyHandoffProgress(self.progress);
          },
          onEnter: () => {
            captureRects();
            applyHandoffProgress(0);
          },
          onEnterBack: (self) => {
            applyHandoffProgress(self.progress);
          },
          onUpdate: (self) => applyHandoffProgress(self.progress),
          onLeave: settleHandoff,
          onLeaveBack: resetBeforeHandoff,
        });

        if (desktop) {
          ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: uploadMotion.scrubSeconds,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              sampleSlots.forEach((slot) => {
                const distance = Number.parseFloat(
                  getComputedStyle(slot).getPropertyValue("--sample-parallax"),
                );
                gsap.set(slot, { y: self.progress * -distance });
              });
              gsap.set(center, {
                y: self.progress * uploadMotion.center.parallaxY,
              });
            },
            onLeaveBack: () => {
              sampleSlots.forEach((slot) => {
                gsap.set(slot, { y: 0 });
              });
              gsap.set(center, { y: 0 });
            },
          });
        }
      }, section);

      return () => {
        removeClone();
        gsap.set(source, { clearProps: "opacity,visibility" });
        context.revert();
      };
    };

    media.add("(min-width: 768px)", () => setupHandoff(true));
    media.add("(max-width: 767.99px)", () => setupHandoff(false));
    ScrollTrigger.refresh();

    return () => {
      media.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section ref={sectionRef} id="upload" className={styles.section} aria-labelledby="upload-title">
      <div ref={sceneRef} className={styles.scene}>
        <p className={styles.sampleHint}>CHOOSE A SAMPLE</p>
        <div className={styles.sampleField} aria-label="Sample vehicle images">
          {uploadSamples.map((sample) => {
            const selected =
              selectedImage?.source === "sample" && selectedImage.sampleId === sample.id;

            return (
              <div
                key={sample.id}
                className={styles.sampleSlot}
                data-upload-sample
                data-section04-retreat=""
                data-side={sample.side}
                data-carried-slot={sample.isSection03Source ? "" : undefined}
                style={getSampleStyle(sample)}
              >
                <button
                  type="button"
                  className={styles.sampleButton}
                  aria-pressed={selected}
                  aria-label={`Use sample: ${sample.alt}`}
                  data-selected={selected ? "true" : "false"}
                  data-section04-carried-sample={sample.isSection03Source ? "" : undefined}
                  onClick={() => selectSample(sample)}
                >
                  <span
                    className={styles.sampleMedia}
                    data-section04-carried-media={sample.isSection03Source ? "" : undefined}
                  >
                    <img
                      src={sample.src}
                      alt=""
                      loading={sample.isSection03Source ? "eager" : "lazy"}
                      draggable={false}
                      style={{ objectPosition: sample.objectPosition }}
                    />
                  </span>
                  <span className={styles.selectedMark} aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>

        <div ref={centerRef} className={styles.center}>
          <div className={styles.copy} data-section04-retreat>
            <p className={styles.kicker}>YOUR TURN.</p>
            <h2 id="upload-title">
              Bring your own image,
              <br />
              or choose one around you.
            </h2>
          </div>

          <div
            className={styles.aperture}
            data-section04-retreat
            data-drag-active={dragActive ? "true" : "false"}
            data-selected={selectedImage ? "true" : "false"}
            role="button"
            tabIndex={0}
            aria-label={selectedImage ? "Change selected image" : "Choose an image to analyze"}
            onClick={openFilePicker}
            onKeyDown={handleApertureKeyDown}
            onDragEnter={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={(event) => {
              if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
              setDragActive(false);
            }}
            onDrop={handleDrop}
          >
            <span className={`${styles.corner} ${styles.cornerTopLeft}`} aria-hidden="true" />
            <span className={`${styles.corner} ${styles.cornerTopRight}`} aria-hidden="true" />
            <span className={`${styles.corner} ${styles.cornerBottomLeft}`} aria-hidden="true" />
            <span className={`${styles.corner} ${styles.cornerBottomRight}`} aria-hidden="true" />

            {selectedImage ? (
              <img
                className={styles.preview}
                src={selectedImage.previewSrc}
                alt={selectedImage.alt}
                data-section04-aperture-content
              />
            ) : dragActive ? (
              <span className={styles.dropLabel} data-section04-aperture-content>
                DROP IMAGE
              </span>
            ) : (
              <span className={styles.plus} aria-hidden="true" data-section04-aperture-content>
                +
              </span>
            )}
          </div>

          <input
            ref={fileInputRef}
            className={styles.fileInput}
            type="file"
            accept="image/*"
            onChange={(event) => {
              selectFile(event.currentTarget.files?.[0]);
              event.currentTarget.value = "";
            }}
          />

          <div className={styles.actions} data-section04-retreat>
            {selectedImage ? (
              <>
                <button type="button" className={styles.changeAction} onClick={openFilePicker}>
                  CHANGE IMAGE
                </button>
                <button type="button" className={styles.analyzeAction} onClick={handleAnalyze}>
                  <span>ANALYZE</span>
                  <span className={styles.actionDot} aria-hidden="true" />
                </button>
              </>
            ) : (
              <button type="button" className={styles.chooseAction} onClick={openFilePicker}>
                CHOOSE IMAGE
              </button>
            )}
          </div>

          <p className={styles.srOnly} aria-live="polite">
            {statusMessage}
          </p>
        </div>
      </div>
    </section>
  );
}
