export type TikTokContentType = "photo" | "video";

export type TikTokItem = {
  id: string;
  type: TikTokContentType;
  url: string;
  views?: number;
  pinned?: boolean;
  /** Lokales Vorschaubild in /public/tiktok/ */
  thumbnail?: string;
};

export const tiktokProfile = {
  handle: "@juja030691",
  url: "https://www.tiktok.com/@juja030691",
};

/** 3er-Vorschau in der Social-Karte – feste Links von @juja030691 */
export const tiktokPreviewItems: TikTokItem[] = [
  {
    id: "7622995949454888225",
    type: "photo",
    url: "https://www.tiktok.com/@juja030691/photo/7622995949454888225",
    pinned: true,
    thumbnail: "/tiktok/preview-1.jpg",
  },
  {
    id: "7517559883785391382",
    type: "video",
    url: "https://www.tiktok.com/@juja030691/video/7517559883785391382",
    views: 5079,
    pinned: true,
    thumbnail: "/tiktok/preview-2.jpg",
  },
  {
    id: "7625685354963586337",
    type: "video",
    url: "https://www.tiktok.com/@juja030691/video/7625685354963586337",
    views: 1054,
    pinned: true,
    thumbnail: "/tiktok/preview-3.jpg",
  },
];

export function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 10_000) return `${Math.round(views / 1000)}K`;
  return views.toLocaleString("de-DE");
}
