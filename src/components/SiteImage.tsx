import Image from "next/image";

type SiteImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
};

export function SiteImage({
  src,
  alt,
  className = "object-cover",
  priority = false,
  fill = true,
  sizes = "100vw",
}: SiteImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={fill ? undefined : 1200}
      height={fill ? undefined : 800}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}
