import Image from "next/image";
import { Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { normalizeWaschbaerGalerie, type WaschbaerGalerieFoto } from "@/data/photos";

type WaschbaerGalleryProps = {
  fotos: WaschbaerGalerieFoto[];
};

export function WaschbaerGallery({ fotos }: WaschbaerGalleryProps) {
  const ordered = normalizeWaschbaerGalerie(fotos);
  if (ordered.length === 0) return null;

  return (
    <Stagger className="grid grid-cols-2 gap-2 sm:gap-3" stagger={0.08}>
      {ordered.map((foto, index) => {
        const isFeatured = index === 0;

        return (
          <StaggerItem key={foto.src} className={isFeatured ? "col-span-2" : undefined}>
            <div className="overflow-hidden rounded-2xl bg-neutral-800 shadow-soft">
              <Image
                src={foto.src}
                alt={foto.alt}
                width={foto.width}
                height={foto.height}
                className="h-auto w-full"
                style={{ objectPosition: foto.objectPosition ?? "center center" }}
                sizes={isFeatured ? "(max-width: 768px) 100vw, 480px" : "240px"}
              />
            </div>
            {foto.caption ? (
              <p className="mt-2 text-xs text-muted leading-relaxed">{foto.caption}</p>
            ) : null}
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
