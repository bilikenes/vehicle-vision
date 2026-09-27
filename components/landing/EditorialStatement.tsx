"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

import { editorialMotion } from "@/lib/landing/motion-config";

import styles from "./EditorialStatement.module.css";
import { CoronaGlyph } from "./CoronaGlyph";

type CharacterSequenceProps = Readonly<{
  lineIndex: number;
  offset?: number;
  register: (
    lineIndex: number,
    characterIndex: number,
    node: HTMLSpanElement | null,
  ) => void;
  value: string;
}>;

function CharacterSequence({
  lineIndex,
  offset = 0,
  register,
  value,
}: CharacterSequenceProps) {
  return (
    <>
      {Array.from(value).map((character, characterIndex) => {
        const index = offset + characterIndex;

        return (
          <span
            key={`${lineIndex}-${index}`}
            ref={(node) => register(lineIndex, index, node)}
            data-line-index={lineIndex}
            className={styles.revealChar}
            aria-hidden="true"
          >
            {character === " " ? "\u00a0" : character}
          </span>
        );
      })}
    </>
  );
}

const EDITORIAL_CORONA_GRADIENT = [
  ["#6b1124", 0.0],
  ["#8f132e", 0.125],
  ["#b90f31", 0.25],
  ["#e0264b", 0.375],
  ["#ff3b5c", 0.5],
  ["#ff637f", 0.625],
  ["#ff94a8", 0.75],
  ["#ff5978", 0.875],
  ["#ff3b5c", 1.0],
] as const;

export function EditorialStatement() {
  const statementRef = useRef<HTMLHeadingElement>(null);
  const characterRefs = useRef<Array<Array<HTMLSpanElement | null>>>([]);

  const registerCharacter = (
    lineIndex: number,
    characterIndex: number,
    node: HTMLSpanElement | null,
  ) => {
    const line = characterRefs.current[lineIndex] ?? [];
    line[characterIndex] = node;
    characterRefs.current[lineIndex] = line;
  };

  useLayoutEffect(() => {
    const statement = statementRef.current;
    const characters = characterRefs.current
      .flat()
      .filter((character): character is HTMLSpanElement => character !== null);

    if (!statement || characters.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(characters, { color: editorialMotion.characterReveal.finalColor });
      return;
    }

    const lineMasks = statement.querySelectorAll<HTMLElement>(
      `.${styles.lineMask}`,
    );

    gsap.registerPlugin(ScrollTrigger);

    const matchMedia = gsap.matchMedia();
    const context = gsap.context(() => {
      matchMedia.add(
        {
          desktop: "(min-width: 992px)",
          mobile: "(max-width: 991px)",
        },
        ({ conditions }) => {
          const isMobile = Boolean(conditions?.mobile);
          const entryDuration = editorialMotion.entry.duration;
          const staggerStep = isMobile
            ? editorialMotion.characterReveal.mobileStagger
            : editorialMotion.characterReveal.desktopStagger;

          // Set initial visual states for entry
          gsap.set(lineMasks, { y: editorialMotion.entry.offsetYPx });
          gsap.set(characters, { color: editorialMotion.entry.accentColor });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: statement,
              start: isMobile
                ? editorialMotion.characterReveal.start.mobile
                : editorialMotion.characterReveal.start.desktop,
              end: isMobile
                ? editorialMotion.characterReveal.end.mobile
                : editorialMotion.characterReveal.end.desktop,
              scrub: editorialMotion.characterReveal.scrubSeconds,
              invalidateOnRefresh: true,
            },
          });

          // Phase 1: Lines slide into position & color cools down from pink to faint gray
          tl.to(
            lineMasks,
            {
              y: 0,
              stagger: 0.025,
              ease: "power2.out",
              duration: entryDuration,
            },
            0,
          );

          tl.to(
            characters,
            {
              color: editorialMotion.characterReveal.initialColor,
              ease: "power1.out",
              duration: entryDuration,
            },
            0,
          );

          // Phase 2: Sequential character reveal from faint gray to solid black
          tl.to(
            characters,
            {
              color: editorialMotion.characterReveal.finalColor,
              stagger: staggerStep,
              ease: "steps(1)",
              duration: 0.01,
            },
            entryDuration,
          );
        },
      );
    }, statement);

    ScrollTrigger.refresh();

    return () => {
      matchMedia.revert();
      context.revert();
    };
  }, []);

  return (
    <section
      id="editorial-statement"
      className={styles.section}
      aria-labelledby="editorial-statement-title"
    >
      <div className={styles.container}>
        <h2
          ref={statementRef}
          id="editorial-statement-title"
          className={styles.statement}
          aria-label="One image. More than it shows. The system sees further."
        >
          <span className={`${styles.block} ${styles.firstBlock}`} aria-hidden="true">
            <span className={styles.lineMask}>
              <span className={`${styles.lineInk} ${styles.lineOne}`}>
                <CharacterSequence
                  lineIndex={0}
                  register={registerCharacter}
                  value="ONE IMAGE"
                />
              </span>
            </span>

            <span className={`${styles.lineMask} ${styles.lineTwoMask}`}>
              <span className={`${styles.lineInk} ${styles.lineTwo}`}>
                <CharacterSequence
                  lineIndex={1}
                  register={registerCharacter}
                  value="MORE THAN IT SH"
                />
                <span
                  ref={(node) => registerCharacter(1, 15, node)}
                  className={styles.revealChar}
                  aria-hidden="true"
                >
                  <CoronaGlyph gradient={EDITORIAL_CORONA_GRADIENT} scale={2}/>
                </span>
                <CharacterSequence
                  lineIndex={1}
                  offset={16}
                  register={registerCharacter}
                  value="WS."
                />
              </span>
            </span>
          </span>

          <span className={`${styles.block} ${styles.secondBlock}`} aria-hidden="true">
            <span className={`${styles.lineMask} ${styles.lineThreeMask}`}>
              <span className={`${styles.lineInk} ${styles.lineThree}`}>
                <CharacterSequence
                  lineIndex={2}
                  register={registerCharacter}
                  value="THE SYSTEM"
                />
              </span>
            </span>

            <span className={`${styles.lineMask} ${styles.lineFourMask}`}>
              <span className={`${styles.lineInk} ${styles.lineFour}`}>
                <CharacterSequence
                  lineIndex={3}
                  register={registerCharacter}
                  value="SEES FURTHER"
                />
                <span
                  ref={(node) => registerCharacter(3, 12, node)}
                  className={styles.revealChar}
                  aria-hidden="true"
                >
                  .
                </span>
              </span>
            </span>
          </span>
        </h2>
      </div>
    </section>
  );
}
