export const heroMotion = {
  scrollDistanceVh: 100,
  scrollCueTargetVh: 42,
  scrubSeconds: 0.4,
  media: {
    scroll: {
      startOffsetPx: {
        mobile: 300,
        tablet: 100,
        desktop: 50,
      },
      durationVh: {
        mobile: 50,
        tablet: 90,
        desktop: 90,
      },
    },
    endScale: {
      mobile: 0.82,
      tablet: 0.72,
      desktop: 0.66,
    },
  },
  ui: {
    cueFadeStart: 0.18,
    cueFadeEnd: 0.36,
    copyFadeStart: 0.2,
    copyFadeEnd: 0.5,
    ctaFadeStart: 0.22,
    ctaFadeEnd: 0.62,
  },
} as const;

export const editorialMotion = {
  entry: {
    accentColor: "#ffdde3",
    settledColor: "#eaeaea",
    offsetYPx: -300,
    duration: 2.00,
  },
  characterReveal: {
    initialColor: "#eaeaea",
    finalColor: "#000000",
    desktopStagger: 0.03,
    mobileStagger: 0.015,
    scrubSeconds: 0.1,
    start: {
      desktop: "top bottom",
      mobile: "top bottom",
    },
    end: {
      desktop: "center 40%",
      mobile: "bottom 70%",
    },
  },
  transition: {
    scrubSeconds: 0.12,
    hold: 0.48,
    firstBlockStart: 0.48,
    firstBlockRetreat: 0.24,
    firstBlockRestOpacity: 0,
    secondBlockStart: 0.68,
    secondBlockRetreat: 0.32,
    secondBlockRestOpacity: 0,
    periodStart: 0.72,
    periodResolve: 0.08,
    periodGlyphFade: 0.06,
    periodProxyExitStart: 0.8,
  },
} as const;

const ANALYSIS_SPINE_DOT_OFFSET_PX = 6;
const ANALYSIS_SPINE_OWNERSHIP_PROGRESS = 0.39;

export const editorialAnalysisHandoffMotion = {
  scrubSeconds: 0.12,
  periodInitialColor: "#000000",
  periodAccentColor: "#ff3b5c",
  firstTextExitPx: 10,
  secondTextExitPx: 8,
  contentIntroOffsetPx: -80,
  spineDotOffsetPx: ANALYSIS_SPINE_DOT_OFFSET_PX,
  spineOwnershipProgress: ANALYSIS_SPINE_OWNERSHIP_PROGRESS,
  phases: {
    firstTextExit: [0, 0.32],
    secondTextExit: [0.08, 0.38],
    periodAccent: [0.1, 0.18],
    periodTakeover: [0.14, 0.2],
    periodTravel: [0.18, 0.48],
    contentIntro: [0.28, 0.7],
    spineGrowth: [0.38, 0.82],
    ownershipTransfer: [0.99, 1],
  },
  desktop: {
    start: "top 87%",
    end: "top top",
  },
} as const;

export const analysisMotion = {
  inactiveOpacity: 0.15,
  scrubSeconds: 0.08,
  spineDotOffsetPx: ANALYSIS_SPINE_DOT_OFFSET_PX,
  counterTravelPercent: 120,
  entrance: {
    initialOpacity: 0.50,
    offsetYPx: 40,
    start: "top 70%",
    end: "top 5%",
    scrubSeconds: 1.8,
  },
  stageThresholds: [0.37, 0.62, 0.86],
  mobile: {
    spineIntroProgress: 0.012,
  },
  desktop: {
    start: "top center",
    end: "bottom bottom",
    spineOwnershipProgress: 0,
  },
} as const;

export const uploadMotion = {
  scrubSeconds: 0.12,
  handoff: {
    start: "top bottom",
    end: "top top",
    uiRetreatEnd: 0.34,
    imageMoveStart: 0.08,
  },
  samples: {
    revealStart: 0.3,
    revealDuration: 0.34,
    revealOffsetPx: 18,
  },
  center: {
    revealStart: 0.4,
    revealDuration: 0.34,
    revealOffsetPx: 24,
    parallaxY: 38,
  },
} as const;

export const humanControlMotion = {
  scrubSeconds: 0.8,
  scrollDistanceVh: 240,
  factors: {
    card1: 1.35,
    card2: 1.15,
    card3: 0.95,
  },
  textFadeIn: {
    duration: 0.5,
    stagger: 0.035,
    y: -12,
    z: 25,
    rotationX: 12,
    ease: "power3.out",
  },
  textFadeOut: {
    duration: 0.4,
    stagger: 0.02,
    y: -24,
    z: 15,
    rotationX: -10,
    ease: "power3.in",
  },
} as const;

export function getHeroMediaEndScale(viewportWidth: number) {
  if (viewportWidth < 768) return heroMotion.media.endScale.mobile;
  if (viewportWidth < 1440) return heroMotion.media.endScale.tablet;
  return heroMotion.media.endScale.desktop;
}

export function getHeroMediaScrollWindow(viewportWidth: number, viewportHeight: number) {
  if (viewportWidth < 991) {
    return {
      startOffsetPx: heroMotion.media.scroll.startOffsetPx.mobile,
      durationPx: viewportHeight * (heroMotion.media.scroll.durationVh.mobile / 100),
    };
  }

  if (viewportWidth < 1440) {
    return {
      startOffsetPx: heroMotion.media.scroll.startOffsetPx.tablet,
      durationPx: viewportHeight * (heroMotion.media.scroll.durationVh.tablet / 100),
    };
  }

  return {
    startOffsetPx: heroMotion.media.scroll.startOffsetPx.desktop,
    durationPx: viewportHeight * (heroMotion.media.scroll.durationVh.desktop / 100),
  };
}
