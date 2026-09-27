import styles from "./OpeningScene.module.css";

export function TryItNowLink() {
  return (
    <a className={styles.tryItNow} href="#upload">
      <span>Try it now</span>
      <span className={styles.ctaArrow} aria-hidden="true">
        ↗
      </span>
    </a>
  );
}
