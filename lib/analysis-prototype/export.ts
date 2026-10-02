import { strToU8, zipSync } from "fflate";
import type { VehicleResult, BoundingBox } from "./model";

export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = () => reject(new Error("Görsel yüklenemedi.")); image.src = src; });
}
export async function createDemoSource(): Promise<string> {
  const image = await loadImage("/media/samples/sample-sedan.png");
  const canvas = document.createElement("canvas"); canvas.width = image.naturalWidth * 2; canvas.height = image.naturalHeight;
  const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("Görsel alanı oluşturulamadı.");
  ctx.drawImage(image, 0, 0); ctx.drawImage(image, image.naturalWidth, 0);
  return canvas.toDataURL("image/png");
}
async function png(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("PNG oluşturulamadı.")), "image/png"));
  return new Uint8Array(await blob.arrayBuffer());
}
export async function buildArchive(source: string, vehicles: VehicleResult[]): Promise<Uint8Array> {
  const image = await loadImage(source);
  const canvas = document.createElement("canvas"); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
  const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("İndirme görseli oluşturulamadı.");
  ctx.drawImage(image, 0, 0);
  const files: Record<string, Uint8Array> = { "results.json": strToU8(JSON.stringify({ prototype: true, coordinateSystem: "normalized-0-1", image: { width: canvas.width, height: canvas.height }, vehicles }, null, 2)) };
  const crop = async (box: BoundingBox) => {
    const cropped = document.createElement("canvas"); cropped.width = Math.max(1, Math.round(box.width * canvas.width)); cropped.height = Math.max(1, Math.round(box.height * canvas.height));
    const context = cropped.getContext("2d"); if (!context) throw new Error("Kırpım oluşturulamadı.");
    context.drawImage(image, box.x * canvas.width, box.y * canvas.height, box.width * canvas.width, box.height * canvas.height, 0, 0, cropped.width, cropped.height);
    return png(cropped);
  };
  for (const vehicle of vehicles) {
    for (const [kind, box] of [["vehicle", vehicle.vehicleBox], ["plate", vehicle.plateBox]] as const) {
      if (!box || !vehicle.vehicleBox) continue;
      files[`${vehicle.id}/${kind}.png`] = await crop(box);
      const x = box.x * canvas.width, y = box.y * canvas.height;
      ctx.strokeStyle = "#ff3b5c"; ctx.lineWidth = 4; ctx.strokeRect(x, y, box.width * canvas.width, box.height * canvas.height);
      ctx.font = "24px sans-serif"; const label = kind === "plate" ? vehicle.plateText : `${vehicle.id}: ${vehicle.bodyType}`;
      const width = ctx.measureText(label).width + 16; ctx.fillStyle = "#0b0b0b"; ctx.fillRect(x, Math.max(0, y - 32), width, 32); ctx.fillStyle = "#faf8f4"; ctx.fillText(label, x + 8, Math.max(24, y - 8));
    }
  }
  files["annotated.png"] = await png(canvas);
  return zipSync(files, { level: 0 });
}
export function downloadBytes(bytes: Uint8Array, name: string) {
  const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: "application/zip" }));
  const link = document.createElement("a"); link.href = url; link.download = name; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 10000);
}
