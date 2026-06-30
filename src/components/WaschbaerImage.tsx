import Image from "next/image";
import { waschbaerProfilPlatzhalter } from "@/data/photos";

type WaschbaerImageProps = {
  slug: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
};

export function WaschbaerImage({
  alt,
  className = "object-cover",
  priority = false,
  fill = true,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: WaschbaerImageProps) {
  if (fill) {
    return (
      <Image
        src={waschbaerProfilPlatzhalter}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={waschbaerProfilPlatzhalter}
      alt={alt}
      width={800}
      height={600}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}
