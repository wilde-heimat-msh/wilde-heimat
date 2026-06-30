import Image from "next/image";

type LogoProps = {
  /** Hintergrund, auf dem das Logo liegt */
  surface?: "light" | "dark";
  size?: number;
  className?: string;
  priority?: boolean;
  alt?: string;
};

export function Logo({
  surface = "light",
  size = 40,
  className = "",
  priority = false,
  alt = "Wilde Heimat",
}: LogoProps) {
  const src = surface === "dark" ? "/logo.png" : "/logo.svg";

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`object-contain ${surface === "dark" ? "drop-shadow-md rounded-full" : ""} ${className}`}
      priority={priority}
    />
  );
}
