import type { LandingMediaSource } from "@/lib/landing/media-config";

import { ScrollScrubVideo } from "./ScrollScrubVideo";
import styles from "./OpeningScene.module.css";

type OpeningSceneProps = Readonly<{
  media: LandingMediaSource;
}>;

export function OpeningScene({ media }: OpeningSceneProps) {
  return (
    <section id="opening" className={styles.scene} aria-labelledby="opening-title">
      <h1 id="opening-title" className={styles.visuallyHidden}>
        Vehicle Vision
      </h1>

      <ScrollScrubVideo media={media} />
    </section>
  );
}
