"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useEffect, useRef, useState } from "react";
import { footerMotion } from "@/lib/landing/motion-config";
import styles from "./Footer.module.css";
import { LightTunnelCanvas } from "./footer/LightTunnelCanvas";

const platformLinks = [
  { label: "Overview", href: "#" },
  { label: "Analysis Pipeline", href: "#pipeline" },
  { label: "Try Machine Vision", href: "#upload" },
  { label: "System Architecture", href: "#" },
  { label: "Security & Validation", href: "#" },
] as const;

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    const desktopQuery = window.matchMedia(
      `(min-width: ${footerMotion.canvas.minWidthPx}px)`,
    );
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const syncCanvas = () => {
      setShowCanvas(desktopQuery.matches && !reducedMotionQuery.matches);
    };

    syncCanvas();
    desktopQuery.addEventListener("change", syncCanvas);
    reducedMotionQuery.addEventListener("change", syncCanvas);

    return () => {
      desktopQuery.removeEventListener("change", syncCanvas);
      reducedMotionQuery.removeEventListener("change", syncCanvas);
    };
  }, []);

  useEffect(() => {
    const footer = footerRef.current;
    const surface = surfaceRef.current;
    const content = contentRef.current;
    if (!footer || !surface || !content) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        gsap.set(surface, { y: 0 });
        gsap.set(content, { opacity: 1 });
        return;
      }

      const updateFromProgress = (progress: number) => {
        const y = gsap.utils.interpolate(
          footerMotion.entry.offsetYPx,
          0,
          progress,
        );
        const opacity = gsap.utils.clamp(
          0,
          1,
          (progress - footerMotion.entry.contentRevealStart) /
            (1 - footerMotion.entry.contentRevealStart),
        );

        gsap.set(surface, { y });
        gsap.set(content, { opacity });
      };

      updateFromProgress(0);
      ScrollTrigger.create({
        trigger: footer,
        start: footerMotion.entry.start,
        end: footerMotion.entry.end,
        onUpdate: (self) => updateFromProgress(self.progress),
      });
    }, footer);

    ScrollTrigger.refresh();
    return () => context.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      id="site-footer"
      className={styles.footer}
      role="contentinfo"
      aria-label="Site footer"
    >
      <div ref={surfaceRef} className={styles.surface}>
        <div className={styles.backgroundLayer}>
          <video
            src="/videos/light-tunnel.mp4"
            autoPlay
            playsInline
            loop
            muted
            className={styles.videoFallback}
            aria-hidden="true"
          />
          {showCanvas && <LightTunnelCanvas targetRef={footerRef} />}
        </div>

        <div ref={contentRef} className={styles.content}>
        {/* Top Row: Headline + Nav + Socials */}
        <div className={`${styles.container} ${styles.topRow}`}>
          {/* Left Column: Headline, Copy & Mail Links */}
          <div className={styles.leftColumn}>
            <h2 className={styles.headline}>
              Next-generation
              <br />
              automotive intelligence.
            </h2>
            <div className={styles.paragraph}>
              Follow along or reach out directly at
              <div className={styles.emailLinks}>
                <a
                  href="mailto:contact@vehiclevision.ai"
                  className={styles.mailLink}
                >
                  contact@vehiclevision.ai
                </a>
                <span className={styles.divider} aria-hidden="true">
                  |
                </span>
                <a
                  href="mailto:enterprise@vehiclevision.ai"
                  className={styles.mailLink}
                >
                  enterprise@vehiclevision.ai
                </a>
              </div>
            </div>
          </div>

          {/* Middle Column: Platform Links */}
          <div className={styles.navColumn}>
            <div className={styles.navTitle}>Platform</div>
            <nav aria-label="Footer navigation">
              <ul className={styles.navList}>
                {platformLinks.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className={styles.navLink}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right Column: Circular Social Buttons */}
          <div className={styles.socialColumn}>
            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Vehicle Vision on LinkedIn"
              className={styles.socialBtn}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 12 12"
                fill="currentColor"
              >
                <path d="M9.26338 0H2.73662C2.01082 0 1.31475 0.288321 0.801536 0.801536C0.288321 1.31475 0 2.01082 0 2.73662V9.26338C0 9.98918 0.288321 10.6852 0.801536 11.1985C1.31475 11.7117 2.01082 12 2.73662 12H9.26338C9.98918 12 10.6852 11.7117 11.1985 11.1985C11.7117 10.6852 12 9.98918 12 9.26338V2.73662C12 2.01082 11.7117 1.31475 11.1985 0.801536C10.6852 0.288321 9.98918 0 9.26338 0ZM4.05723 9.68739C4.05916 9.72088 4.05422 9.75442 4.04272 9.78594C4.03121 9.81745 4.01339 9.84629 3.99034 9.87067C3.96728 9.89504 3.93949 9.91445 3.90866 9.9277C3.87784 9.94094 3.84463 9.94775 3.81108 9.94769H2.71569C2.64964 9.94608 2.58685 9.91862 2.54082 9.87121C2.49479 9.8238 2.4692 9.76023 2.46954 9.69415V5.13846C2.46863 5.10557 2.47433 5.07283 2.4863 5.04218C2.49826 5.01153 2.51625 4.98359 2.5392 4.96001C2.56215 4.93643 2.58959 4.91769 2.6199 4.9049C2.65022 4.89211 2.68279 4.88553 2.71569 4.88554H3.81108C3.84398 4.88553 3.87655 4.89211 3.90687 4.9049C3.93718 4.91769 3.96462 4.93643 3.98757 4.96001C4.01052 4.98359 4.02851 5.01153 4.04047 5.04218C4.05244 5.07283 4.05814 5.10557 4.05723 5.13846V9.68739ZM3.24308 3.92738C3.12448 3.9265 3.00723 3.90226 2.898 3.85605C2.78877 3.80985 2.68972 3.74258 2.60649 3.65809C2.52326 3.57361 2.45748 3.47355 2.41292 3.36365C2.36836 3.25374 2.34588 3.13613 2.34677 3.01754C2.34766 2.89894 2.3719 2.78169 2.4181 2.67246C2.46431 2.56324 2.53157 2.46418 2.61606 2.38095C2.70055 2.29772 2.8006 2.23195 2.91051 2.18738C3.02041 2.14282 3.13802 2.12034 3.25662 2.12123C3.49201 2.12889 3.71509 2.22823 3.87827 2.39807C4.04144 2.5679 4.13178 2.79478 4.13002 3.03029C4.12825 3.26581 4.03451 3.49131 3.86881 3.65868C3.70311 3.82604 3.47856 3.92203 3.24308 3.92615M9.89969 9.68C9.8994 9.74218 9.87499 9.80182 9.8316 9.84636C9.78821 9.8909 9.72923 9.91686 9.66708 9.91877H8.51077C8.44851 9.91685 8.38944 9.89081 8.34603 9.84614C8.30262 9.80147 8.27828 9.74167 8.27815 9.67939V7.57231C8.27815 7.25785 8.37415 6.20431 7.44369 6.20431C6.71815 6.20431 6.57477 6.94277 6.54708 7.27138V9.72738C6.54711 9.78978 6.52284 9.84973 6.47941 9.89453C6.43599 9.93933 6.37682 9.96547 6.31446 9.96739H5.19262C5.12907 9.96722 5.06818 9.94186 5.02331 9.89687C4.97843 9.85188 4.95323 9.79093 4.95323 9.72738V5.11631C4.95515 5.05394 4.98128 4.99478 5.02608 4.95136C5.07089 4.90793 5.13084 4.88366 5.19323 4.88369H6.31446C6.37685 4.88366 6.43681 4.90793 6.48161 4.95136C6.52641 4.99478 6.55254 5.05394 6.55446 5.11631V5.51323C6.71817 5.27361 6.9442 5.08324 7.20816 4.96265C7.47212 4.84205 7.764 4.79582 8.05231 4.82892C9.92 4.82892 9.91323 6.57354 9.91323 7.56554L9.89969 9.68Z" />
              </svg>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Vehicle Vision on GitHub"
              className={styles.socialBtn}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>

            {/* X / Twitter */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Vehicle Vision on X"
              className={styles.socialBtn}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M12.6 1h2.454l-5.36 6.126L16 15h-4.937l-3.867-5.056L2.771 15H.314l5.733-6.553L0 1h5.063l3.495 4.62L12.6 1zm-.86 12.54h1.36L4.323 2.38H2.865l8.875 11.16z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Row: Legal + Massive Brand Wordmark */}
        <div className={`${styles.container} ${styles.bottomRow}`}>
          {/* Left: Copyright and Legal */}
          <div className={styles.legalColumn}>
            <div className={styles.copyright}>
              © {new Date().getFullYear()} Vehicle Vision. All Rights Reserved.
            </div>
            <div className={styles.legalLinks}>
              <a href="#privacy" className={styles.legalLink}>
                Privacy Policy
              </a>
              <a href="#terms" className={styles.legalLink}>
                Terms of Service
              </a>
              <a href="#security" className={styles.legalLink}>
                Security Architecture
              </a>
            </div>
          </div>

          {/* Right: Massive Brand Wordmark */}
          <div className={styles.wordmarkColumn}>
            <div className={styles.wordmark} aria-label="Vehicle Vision">
              VEHICLE VISION
            </div>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}
