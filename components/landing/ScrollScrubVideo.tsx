"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, type CSSProperties } from "react";

import type { LandingMediaSource } from "@/lib/landing/media-config";
import {
  getHeroMediaEndScale,
  getHeroMediaScrollWindow,
  heroMotion,
} from "@/lib/landing/motion-config";

import { OpeningCopy } from "./OpeningCopy";
import { TryItNowLink } from "./TryItNowLink";
import styles from "./OpeningScene.module.css";

type ScrollScrubVideoProps = Readonly<{
  media: LandingMediaSource;
}>;

type ScrollTrackStyle = CSSProperties & {
  "--hero-scroll-distance": string;
  "--hero-scroll-cue-target": string;
};

export function ScrollScrubVideo({ media }: ScrollScrubVideoProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const frame = frameRef.current;
    const video = videoRef.current;
    const copy = copyRef.current;
    const cta = ctaRef.current;

    if (!track || !frame || !video || !copy || !cta) return;

    video.pause();
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    let cancelled = false;
    let context: gsap.Context | null = null;
    let seeking = false;
    let pendingTime: number | null = null;
    let primed = false;
    let metadataTimer = 0;
    let syncToScroll: (() => void) | null = null;

    const prime = () => {
      if (primed) return;
      primed = true;

      const playback = video.play();
      if (playback) {
        void playback.then(() => video.pause()).catch(() => undefined);
      }
    };

    const primeEvents = ["touchstart", "pointerdown", "click"] as const;
    primeEvents.forEach((eventName) => {
      document.addEventListener(eventName, prime, { once: true, passive: true });
    });

    const seekTo = (time: number) => {
      if (video.readyState < 2) return;

      if (seeking) {
        pendingTime = time;
        return;
      }

      if (Math.abs(video.currentTime - time) <= 0.016) return;

      seeking = true;
      try {
        video.currentTime = time;
      } catch {
        seeking = false;
      }
    };

    const handleSeeked = () => {
      seeking = false;

      if (pendingTime === null) return;

      const nextTime = pendingTime;
      pendingTime = null;
      seekTo(nextTime);
    };

    video.addEventListener("seeked", handleSeeked);

    const whenSeekable = () =>
      new Promise<void>((resolve) => {
        let settled = false;

        const finish = () => {
          if (settled) return;
          settled = true;
          window.clearTimeout(metadataTimer);
          video.removeEventListener("loadedmetadata", finish);
          resolve();
        };

        if (video.readyState >= 1 && Number.isFinite(video.duration) && video.duration > 0) {
          finish();
          return;
        }

        video.addEventListener("loadedmetadata", finish, { once: true });
        metadataTimer = window.setTimeout(finish, 8000);
      });

    const init = async () => {
      await whenSeekable();
      if (cancelled) return;

      const proxy = { progress: 0 };
      const uiClock = { progress: 0 };

      context = gsap.context(() => {
        gsap.to(proxy, {
          progress: 1,
          ease: "none",
          onUpdate: () => {
            const duration = video.duration;
            if (!Number.isFinite(duration) || duration <= 0) return;
            seekTo(proxy.progress * duration);
          },
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: heroMotion.scrubSeconds,
          },
        });

        gsap.to(frame, {
          scale: () => getHeroMediaEndScale(window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: track,
            start: () => {
              const { startOffsetPx } = getHeroMediaScrollWindow(
                window.innerWidth,
                window.innerHeight,
              );
              return `top -=${startOffsetPx}`;
            },
            end: () => {
              const { durationPx } = getHeroMediaScrollWindow(
                window.innerWidth,
                window.innerHeight,
              );
              return `+=${durationPx}`;
            },
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: heroMotion.scrubSeconds,
            invalidateOnRefresh: true,
          },
        });

        timeline.to(uiClock, { progress: 1, duration: 1 }, 0);

        timeline.to(
          copy,
          {
            autoAlpha: 0,
            duration: heroMotion.ui.copyFadeEnd - heroMotion.ui.copyFadeStart,
          },
          heroMotion.ui.copyFadeStart,
        );

        timeline.to(
          cta,
          {
            autoAlpha: 0,
            duration: heroMotion.ui.ctaFadeEnd - heroMotion.ui.ctaFadeStart,
          },
          heroMotion.ui.ctaFadeStart,
        );
      }, track);

      syncToScroll = () => {
        const duration = video.duration;
        if (video.readyState >= 2 && Number.isFinite(duration) && duration > 0) {
          seekTo(proxy.progress * duration);
        }
      };

      if (video.readyState >= 2) {
        syncToScroll();
      } else {
        video.addEventListener("canplay", syncToScroll, { once: true });
      }

      ScrollTrigger.refresh();
    };

    void init();

    return () => {
      cancelled = true;
      window.clearTimeout(metadataTimer);
      video.removeEventListener("seeked", handleSeeked);
      if (syncToScroll) video.removeEventListener("canplay", syncToScroll);
      primeEvents.forEach((eventName) => {
        document.removeEventListener(eventName, prime);
      });
      context?.revert();
    };
  }, [media.src]);

  const trackStyle: ScrollTrackStyle = {
    "--hero-scroll-distance": `${heroMotion.scrollDistanceVh}svh`,
    "--hero-scroll-cue-target": `${heroMotion.scrollCueTargetVh}svh`,
  };

  return (
    <div ref={trackRef} className={styles.scrollTrack} style={trackStyle}>
      <span
        id="opening-transition"
        className={styles.scrollAdvanceAnchor}
        aria-hidden="true"
      />

      <div className={styles.stickyStage}>
        <div ref={frameRef} className={styles.mediaFrame}>
          <video
            ref={videoRef}
            className={styles.heroVideo}
            src={media.src}
            muted
            playsInline
            poster={media.posterSrc}
            preload="auto"
            tabIndex={-1}
            aria-hidden="true"
          />

          <div className={styles.lowerRail}>
            <div ref={copyRef} className={styles.motionItem}>
              <OpeningCopy />
            </div>
            <div ref={ctaRef} className={styles.motionItem}>
              <TryItNowLink />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
