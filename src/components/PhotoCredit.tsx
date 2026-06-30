import Link from "next/link";
import type { StockPhotoCredit } from "@/data/photoCredits";

type PhotoCreditProps = {
  credit: StockPhotoCredit;
  /** Dezente Variante für Hero-Hintergründe */
  variant?: "hero" | "inline";
};

export function PhotoCredit({ credit, variant = "inline" }: PhotoCreditProps) {
  if (variant === "hero") {
    return (
      <p className="text-xs sm:text-sm text-background/50 max-w-[14rem] sm:max-w-none text-right leading-relaxed">
        Foto:{" "}
        <a
          href={credit.photographerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-background/70 transition-colors break-words"
        >
          {credit.photographer}
        </a>
        <span className="hidden sm:inline">{" / "}</span>
        <span className="block sm:inline">
          <a
            href={credit.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-background/70 transition-colors break-words"
          >
            {credit.source}
          </a>
        </span>
      </p>
    );
  }

  return (
    <p className="text-sm text-muted">
      <strong className="text-foreground">{credit.title}</strong>
      <br />
      Foto:{" "}
      <Link
        href={credit.photographerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:no-underline"
      >
        {credit.photographer}
      </Link>{" "}
      via{" "}
      <Link
        href={credit.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:no-underline"
      >
        {credit.source}
      </Link>
      <br />
      Lizenz:{" "}
      <Link
        href={credit.licenseUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:no-underline"
      >
        {credit.license}
      </Link>
      <br />
      Verwendung: {credit.usedOn.join(", ")}
    </p>
  );
}
