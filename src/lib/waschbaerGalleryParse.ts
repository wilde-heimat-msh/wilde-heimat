import type { WaschbaerGalleryInput } from "@/types/waschbaer";

function toNumber(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function toBoolean(value: unknown): boolean {
  return value === true || value === "true" || value === 1 || value === "1";
}

export function parseWaschbaerGallery(photos: unknown): WaschbaerGalleryInput[] {
  if (!Array.isArray(photos)) return [];

  const parsed: WaschbaerGalleryInput[] = [];
  for (const [index, item] of photos.entries()) {
    if (!item || typeof item !== "object") continue;
    const photo = item as Record<string, unknown>;
    const src = typeof photo.src === "string" ? photo.src.trim() : "";
    if (!src) continue;

    parsed.push({
      src,
      alt: typeof photo.alt === "string" ? photo.alt.trim() : "",
      width: toNumber(photo.width, 768),
      height: toNumber(photo.height, 1024),
      caption: typeof photo.caption === "string" ? photo.caption.trim() : undefined,
      featured: toBoolean(photo.featured),
      objectPosition:
        typeof photo.objectPosition === "string" && photo.objectPosition.trim()
          ? photo.objectPosition.trim()
          : "center center",
      sortOrder: toNumber(photo.sortOrder, index),
    });
  }

  return parsed;
}
