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
  imageSrc: "/media/samples/sample-sedan.png",
  imageAlt: "Dark gray sedan shown in a pink-lit studio",
  imageWidth: 1122,
  imageHeight: 1402,
  vehicleBBox: {
    x: 46 / 1122,
    y: 520 / 1402,
    width: 1033 / 1122,
    height: 513 / 1402,
  } satisfies NormalizedBBox,
  plateBBox: {
    x: 759 / 1122,
    y: 851 / 1402,
    width: 177 / 1122,
    height: 47 / 1402,
  } satisfies NormalizedBBox,
  plateText: "06 DCC 821",
  bodyType: "SEDAN",
  visualFrames: {
    vehicle: { scale: 1, originX: 50, originY: 50 },
    plate: { scale: 2.45, originX: 84.6, originY: 68.3 },
    ocr: { scale: 2.7, originX: 86.2, originY: 69.9 },
    body: { scale: 1.04, originX: 50, originY: 50 },
  } satisfies Record<AnalysisStageId, AnalysisVisualFrame>,
} as const;
