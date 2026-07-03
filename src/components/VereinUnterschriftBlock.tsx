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
  const datumText = ausgestelltAm
    ? formatFormDateDe(ausgestelltAm.length > 10 ? ausgestelltAm.slice(0, 10) : ausgestelltAm)
    : formatFormDateDe(new Date().toISOString().slice(0, 10));

  return (
    <div className={`flex flex-col ${alignment} ${className}`}>
      {showAusstellungszeile && ort ? (
        <p className={`text-sm text-forest ${compact ? "mb-2" : "mb-3"}`}>
          {ort}, den <strong>{datumText}</strong>
        </p>
      ) : null}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={vereinUnterschrift.imageSrc}
        alt={`Unterschrift ${vereinUnterschrift.name}`}
        className={`object-contain object-left invert ${
          compact ? "h-10 w-44 max-w-full" : "h-14 w-52 max-w-full"
        }`}
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
