import { vereinUnterschrift } from "@/data/vereinUnterschrift";
import { formatFormDateDe } from "@/lib/relativeTime";

type VereinUnterschriftBlockProps = {
  /** z. B. ISO-Datum oder bereits formatierter Text */
  ausgestelltAm?: string;
  ort?: string;
  /** zentriert (Urkunde) oder links (Briefe) */
  align?: "center" | "left";
  /** Kompakte Variante für Nachweise */
  compact?: boolean;
  showAusstellungszeile?: boolean;
  className?: string;
};

export function VereinUnterschriftBlock({
  ausgestelltAm,
  ort,
  align = "left",
  compact = false,
  showAusstellungszeile = true,
  className = "",
}: VereinUnterschriftBlockProps) {
  const alignment = align === "center" ? "text-center items-center" : "text-left items-start";
  const objectPosition = align === "center" ? "object-center" : "object-left";
  const datumText = ausgestelltAm
    ? formatFormDateDe(ausgestelltAm.length > 10 ? ausgestelltAm.slice(0, 10) : ausgestelltAm)
    : formatFormDateDe(new Date().toISOString().slice(0, 10));

  const height = compact ? 40 : 56;
  const width = Math.round(height * vereinUnterschrift.aspectRatio);

  return (
    <div className={`flex flex-col ${alignment} ${className}`}>
      {showAusstellungszeile && ort ? (
        <p className={`text-sm text-forest ${compact ? "mb-2" : "mb-3"}`}>
          {ort}, den <strong>{datumText}</strong>
        </p>
      ) : null}

      {/* SVG mit transparentem Hintergrund */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={vereinUnterschrift.imageSrc}
        alt={`Unterschrift ${vereinUnterschrift.name}`}
        width={width}
        height={height}
        className={`block max-w-full bg-transparent ${objectPosition}`}
        style={{ width, height }}
        crossOrigin="anonymous"
      />

      <div className={align === "center" ? "mt-1" : "mt-2"}>
        <p className={`font-medium text-forest ${compact ? "text-sm" : "text-base"}`}>
          {vereinUnterschrift.name}
        </p>
        <p className={`text-muted ${compact ? "text-[11px]" : "text-xs"}`}>
          {vereinUnterschrift.funktion}
        </p>
      </div>
    </div>
  );
}
