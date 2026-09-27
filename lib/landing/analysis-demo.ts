export type AnalysisStageId = "vehicle" | "plate" | "ocr" | "body";

export type NormalizedBBox = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

export type AnalysisStage = Readonly<{
  index: 1 | 2 | 3 | 4;
  id: AnalysisStageId;
  label: string;
  description: string;
}>;

export type AnalysisVisualFrame = Readonly<{
  scale: number;
  originX: number;
  originY: number;
}>;

export const analysisStages: readonly AnalysisStage[] = [
  {
    index: 1,
    id: "vehicle",
    label: "VEHICLE",
    description: "The vehicle is isolated from the scene.",
  },
  {
    index: 2,
    id: "plate",
    label: "PLATE",
    description: "The license plate region is located within the vehicle.",
  },
  {
    index: 3,
    id: "ocr",
    label: "OCR",
    description: "The plate is read and resolved into text.",
  },
  {
    index: 4,
    id: "body",
    label: "BODY",
    description: "The vehicle body type is classified from the same image.",
  },
] as const;

export const analysisDemo = {
  imageSrc: "/media/temporary/section03-sedan-source.png",
  imageAlt: "Black sedan shown in a studio scene",
  imageWidth: 1086,
  imageHeight: 1448,
  vehicleBBox: {
    x: 29 / 1086,
    y: 455 / 1448,
    width: 988 / 1052,
    height: 405 / 1370,
  } satisfies NormalizedBBox,
  plateBBox: {
    x: 860 / 1086,
    y: 757 / 1448,
    width: 123 / 1132,
    height: 40 / 1448,
  } satisfies NormalizedBBox,
  plateText: "34 MB 1881",
  bodyType: "SEDAN",
  visualFrames: {
    vehicle: { scale: 1, originX: 50, originY: 50 },
    plate: { scale: 2.45, originX: 100.0902, originY: 53.5221 },
    ocr: { scale: 2.7, originX: 100.0902, originY: 53.5221 },
    body: { scale: 1.04, originX: 50, originY: 50 },
  } satisfies Record<AnalysisStageId, AnalysisVisualFrame>,
} as const;
