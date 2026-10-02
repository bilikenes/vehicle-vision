export type BoundingBox = { x: number; y: number; width: number; height: number };
export type Finding = "vehicle" | "plate";
export type VehicleResult = {
  id: string; bodyType: string; plateText: string;
  vehicleBox: BoundingBox | null; plateBox: BoundingBox | null;
  edited: { vehicle: boolean; plate: boolean };
};
export const bodyTypes = ["Sedan", "SUV", "Hatchback", "Pickup", "Minivan", "Van", "Otobüs", "Kamyon", "Motosiklet", "Bilinmiyor"];
export const storageKey = "vehiclevision:analysis-prototype:v1";
export const originals: VehicleResult[] = [0, 1].map((index) => ({
  id: `vehicle-${index + 1}`, bodyType: "Sedan", plateText: "06 DCC 821",
  vehicleBox: { x: index * .5 + .02, y: .37, width: .46, height: .37 },
  plateBox: { x: index * .5 + .336, y: .605, width: .083, height: .036 },
  edited: { vehicle: false, plate: false },
}));
export function normalizePlate(text: string) { return text.trim().replace(/\s+/g, " ").toUpperCase(); }
export function clampBox(box: BoundingBox): BoundingBox {
  const width = Math.max(.008, Math.min(1, box.width));
  const height = Math.max(.008, Math.min(1, box.height));
  return { width, height, x: Math.max(0, Math.min(1 - width, box.x)), y: Math.max(0, Math.min(1 - height, box.y)) };
}
export function commitFinding(saved: VehicleResult, draft: VehicleResult, finding: Finding): VehicleResult {
  if (finding === "plate") return { ...saved, plateBox: draft.plateBox, plateText: normalizePlate(draft.plateText), edited: { ...saved.edited, plate: true } };
  return { ...saved, vehicleBox: draft.vehicleBox, bodyType: draft.bodyType, ...(draft.vehicleBox ? {} : { plateBox: null, plateText: "" }), edited: { ...saved.edited, vehicle: true } };
}
export function parseSaved(raw: string): VehicleResult[] {
  const value: unknown = JSON.parse(raw);
  const validBox = (box: unknown) => box === null || (typeof box === "object" && box !== null && ["x", "y", "width", "height"].every((key) => typeof (box as Record<string, unknown>)[key] === "number" && Number.isFinite((box as Record<string, number>)[key])) && (box as BoundingBox).x >= 0 && (box as BoundingBox).y >= 0 && (box as BoundingBox).width > 0 && (box as BoundingBox).height > 0 && (box as BoundingBox).x + (box as BoundingBox).width <= 1.000001 && (box as BoundingBox).y + (box as BoundingBox).height <= 1.000001);
  if (!Array.isArray(value) || value.length > 100 || !value.every((item) => item && typeof item.id === "string" && typeof item.bodyType === "string" && bodyTypes.includes(item.bodyType) && typeof item.plateText === "string" && validBox(item.vehicleBox) && validBox(item.plateBox) && item.edited && typeof item.edited.vehicle === "boolean" && typeof item.edited.plate === "boolean") || new Set(value.map((item) => item.id)).size !== value.length) throw new Error("Geçersiz kayıt");
  return value as VehicleResult[];
}
