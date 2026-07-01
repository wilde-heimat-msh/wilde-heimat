import Image from "next/image";
import { Stagger, StaggerItem } from "@/components/motion/FadeIn";
import type { WaschbaerGalerieFoto } from "@/data/photos";

function aspectClass(foto: WaschbaerGalerieFoto, featured: boolean): string {
  if (featured) {
    return foto.aspect === "portrait" ? "aspect-[4/5]" : "aspect-[16/10]";
  }
  if (foto.aspect === "portrait") return "aspect-[3/4]";
  if (foto.aspect === "landscape") return "aspect-[4/3]";
  return "aspect-square";
}

type WaschbaerGalleryProps = {
  fotos: WaschbaerGalerieFoto[];
  name: string;
};

export function WaschbaerGallery({ fotos, name }: WaschbaerGalleryProps) {
  if (fotos.length === 0) return null;

  return (
    <Stagger className="grid grid-cols-2 gap-2 sm:gap-3" stagger={0.08}>
      {fotos.map((foto, index) => {
        const featured = foto.featured ?? index === 0;

        return (
          <StaggerItem key={foto.src} className={featured ? "col-span-2" : undefined}>
            <div
              className={`relative overflow-hidden rounded-2xl bg-neutral-800 shadow-soft ${aspectClass(foto, featured)}`}
            >
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                className="object-cover"
                style={{ objectPosition: foto.objectPosition ?? "center center" }}
                sizes={featured ? "(max-width: 768px) 100vw, 480px" : "240px"}
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
