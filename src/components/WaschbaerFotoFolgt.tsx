type WaschbaerFotoFolgtProps = {
  name?: string;
  className?: string;
  compact?: boolean;
};

export function WaschbaerFotoFolgt({
  name,
  className = "",
  compact = false,
}: WaschbaerFotoFolgtProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-muted-light text-center ${className}`}
      role="img"
      aria-label={name ? `${name} – Fotos folgen` : "Fotos folgen"}
    >
      <span
        className={`select-none opacity-25 ${compact ? "text-3xl" : "text-5xl"}`}
        aria-hidden
      >
        🦝
      </span>
      <p
        className={`mt-2 font-medium tracking-wide text-muted ${
          compact ? "text-xs" : "text-sm"
        }`}
      >
        Fotos folgen
      </p>
    </div>
  );
}
