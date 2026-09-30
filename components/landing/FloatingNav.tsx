"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import styles from "./OpeningScene.module.css";

const menuItems = [
  { label: "Home", href: "#opening" },
  { label: "Our vision", href: "#editorial-statement" },
  { label: "Analysis pipeline", href: "#analysis-pipeline" },
  { label: "Try it now", href: "#upload" },
  { label: "Contact", href: "#site-footer" },
] as const;

export function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<(typeof menuItems)[number]["href"]>(
    "#opening",
  );
  const progressBarRef = useRef<HTMLDivElement>(null);

  const activeItem =
    menuItems.find((item) => item.href === activeHref) ?? menuItems[0];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const bar = progressBarRef.current;
    if (!bar) return;

    const applyProgress = (progress: number) => {
      bar.style.transform = `scaleX(${progress})`;
    };

    const updateActiveSection = () => {
      const probeY = window.innerHeight * 0.42;
      let nextHref: (typeof menuItems)[number]["href"] = menuItems[0].href;

      for (const item of menuItems) {
        const section = document.querySelector<HTMLElement>(item.href);
        if (!section) continue;

        if (section.getBoundingClientRect().top <= probeY) {
          nextHref = item.href;
        }
      }

      setActiveHref((current) => (current === nextHref ? current : nextHref));
    };

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => applyProgress(self.progress),
      onRefresh: (self) => {
        applyProgress(self.progress);
        updateActiveSection();
      },
    });

    applyProgress(trigger.progress);
    updateActiveSection();
    const initialSyncFrame = window.requestAnimationFrame(updateActiveSection);
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("pageshow", updateActiveSection);

    return () => {
      trigger.kill();
      window.cancelAnimationFrame(initialSyncFrame);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("pageshow", updateActiveSection);
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
          href={activeItem.href}
          onClick={() => setIsOpen(false)}
        >
          {activeItem.label}
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
          {menuItems.map((item, index) => (
            <a
              className={styles.menuItem}
              href={item.href}
              data-active={item.href === activeHref ? "true" : "false"}
              aria-current={item.href === activeHref ? "location" : undefined}
              tabIndex={isOpen ? 0 : -1}
              onClick={() => {
                setActiveHref(item.href);
                setIsOpen(false);
              }}
              key={item.label}
            >
              <span
                className={styles.menuThumb}
                data-thumb={index + 1}
                aria-hidden="true"
              />
              <span className={styles.menuItemLabel}>{item.label}</span>
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
