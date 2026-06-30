import Image from "next/image";
import {
  formatViews,
  tiktokPreviewItems,
  tiktokProfile,
  type TikTokItem,
} from "@/data/tiktok";
import { getDesignWaschbaerBild } from "@/data/photos";

function PlayIcon() {
  return (
    <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M8 5.14v14.72a1 1 0 0 0 1.5.86l11.04-7.36a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14z" />
    </svg>
  );
}

function CarouselIcon() {
  return (
    <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M4 6h16v12H4V6zm2 2v8h12V8H6zm2 2h3v4H8v-4zm5 0h3v4h-3v-4z" />
    </svg>
  );
}

function PreviewTile({ item, index }: { item: TikTokItem; index: number }) {
  const imageSrc = item.thumbnail ?? getDesignWaschbaerBild(index);

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative aspect-[9/16] overflow-hidden rounded-lg bg-neutral-800 group block"
      aria-label={
        item.type === "photo"
          ? "TikTok-Bilderreihe öffnen"
          : "TikTok-Video öffnen"
      }
    >
      <Image
        src={imageSrc}
        alt=""
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="120px"
      />
      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
      {item.pinned && (
        <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold bg-red-600 text-white rounded">
          Fixiert
        </span>
      )}
      <div className="absolute bottom-1 left-1 flex items-center gap-0.5 text-white text-[10px] sm:text-xs font-medium drop-shadow">
        {item.type === "photo" ? (
          <>
            <CarouselIcon />
            <span>Bilder</span>
          </>
        ) : (
          <>
            <PlayIcon />
            {item.views != null && formatViews(item.views)}
          </>
        )}
      </div>
    </a>
  );
}

/** Kleine 3er-Vorschau für die TikTok-Karte */
export function TikTokPreview() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {tiktokPreviewItems.map((item, i) => (
        <PreviewTile key={item.id} item={item} index={i} />
      ))}
    </div>
  );
}

export { tiktokProfile };
