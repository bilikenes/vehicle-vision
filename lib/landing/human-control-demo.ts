import type { NormalizedBBox } from "@/lib/landing/analysis-demo";

export type PixelRect = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

export type HumanControlDemo = Readonly<{
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  plateBBox: NormalizedBBox;
  platePixelRect: PixelRect;
  initialOCR: string;
  correctedOCR: string;
  incorrectCharacterIndex: number;
}>;

export type HumanControlCard = Readonly<{
  id: string;
  stepNumber: string;
  badgeLabel: string;
  stateType: "initial" | "transition" | "resolved";
  note: string;
  factor: number;
  desktopTop: string;
  desktopLeft: string;
}>;

export const humanControlDemo = {
  imageSrc: "/media/temporary/section03-sedan-source.png",
  imageAlt: "Black sedan used to demonstrate human OCR correction",
  imageWidth: 1086,
  imageHeight: 1448,
  platePixelRect: {
    x: 860,
    y: 757,
    width: 123,
    height: 40,
  },
  plateBBox: {
    x: 860 / 1086,
    y: 757 / 1448,
    width: 123 / 1086,
    height: 40 / 1448,
  },
  initialOCR: "34 MB 1881",
  correctedOCR: "34 M8 1881",
  incorrectCharacterIndex: 4,
} as const satisfies HumanControlDemo;

export const humanControlCards: readonly HumanControlCard[] = [
  {
    id: "card-initial",
    stepNumber: "01",
    badgeLabel: "The first read",
    stateType: "initial",
    note: "One uncertain character. A closer look.",
    factor: 1.12,
    desktopTop: "18%",
    desktopLeft: "36%",
  },
  {
    id: "card-transition",
    stepNumber: "02",
    badgeLabel: "Your correction",
    stateType: "transition",
    note: "A small correction. You make the call.",
    factor: 1,
    desktopTop: "50%",
    desktopLeft: "64%",
  },
  {
    id: "card-resolved",
    stepNumber: "03",
    badgeLabel: "The corrected result",
    stateType: "resolved",
    note: "The same image. A corrected reading.",
    factor: 0.9,
    desktopTop: "82%",
    desktopLeft: "36%",
  },
] as const;

