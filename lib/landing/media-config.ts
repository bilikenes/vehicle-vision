export type LandingMediaSource = Readonly<{
  src: string;
  posterSrc: string;
  kind: "temporary" | "final";
  mimeType: "video/mp4";
}>;

export type LandingMediaConfig = Readonly<{
  heroVideo: LandingMediaSource;
}>;

export const landingMedia = {
  heroVideo: {
    src: "/media/hero/hero-video-scrub-3s.mp4",
    posterSrc: "/media/hero/hero-video-poster.jpg",
    kind: "final",
    mimeType: "video/mp4",
  },
} as const satisfies LandingMediaConfig;
