import styles from "./OpeningScene.module.css";

export function ScrollCue() {
  return (
    <a
      className={styles.scrollCue}
      href="#opening-transition"
      aria-label="Scroll to explore"
    >
      <svg aria-hidden="true" viewBox="0 0 12 12" focusable="false">
        <path d="M6 2v7M3.5 6.75 6 9.25l2.5-2.5" />
      </svg>
    </a>
  );
}
