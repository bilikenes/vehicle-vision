"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import styles from "./OpeningScene.module.css";

const menuItems = [
  { label: "Home", href: "#opening" },
  { label: "Try it now", href: "#upload" },
  { label: "How it works" },
  { label: "Capabilities" },
  { label: "About" },
  { label: "Updates" },
] as const;

export function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const bar = progressBarRef.current;
    if (!bar) return;

    const applyProgress = (progress: number) => {
      bar.style.transform = `scaleX(${progress})`;
    };

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => applyProgress(self.progress),
      onRefresh: (self) => applyProgress(self.progress),
    });

    applyProgress(trigger.progress);

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <header
      className={styles.floatingNav}
      data-open={isOpen}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") setIsOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "touch") setIsOpen(false);
      }}
      onBlur={(event) => {
        if (
          !(event.relatedTarget instanceof Node) ||
          !event.currentTarget.contains(event.relatedTarget)
        ) {
          setIsOpen(false);
        }
      }}
    >
      <div className={styles.navBar}>
        <a
          className={styles.brandLink}
          href="#opening"
          aria-label="Vehicle Vision home"
          onClick={() => setIsOpen(false)}
        >
          Vehicle Vision
        </a>

        <a
          className={styles.homeLink}
          href="#opening"
          onClick={() => setIsOpen(false)}
        >
          Home
        </a>

        <button
          className={styles.menuTrigger}
          type="button"
          aria-expanded={isOpen}
          aria-controls="floating-navigation-menu"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className={styles.menuIcon} aria-hidden="true">
            <span />
            <span />
          </span>
        </button>

        <div
          ref={progressBarRef}
          className={styles.navProgressBar}
          aria-hidden="true"
        />
      </div>

      <nav
        id="floating-navigation-menu"
        className={styles.menuPanel}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
      >
        <span className={styles.menuLabel}>Menu</span>

        <div className={styles.menuList}>
          {menuItems.map((item, index) => {
            const content = (
              <>
                <span
                  className={styles.menuThumb}
                  data-thumb={index + 1}
                  aria-hidden="true"
                />
                <span className={styles.menuItemLabel}>{item.label}</span>
              </>
            );

            return "href" in item ? (
              <a
                className={styles.menuItem}
                href={item.href}
                tabIndex={isOpen ? 0 : -1}
                onClick={() => setIsOpen(false)}
                key={item.label}
              >
                {content}
              </a>
            ) : (
              <span
                className={styles.menuItem}
                aria-disabled="true"
                key={item.label}
              >
                {content}
              </span>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
