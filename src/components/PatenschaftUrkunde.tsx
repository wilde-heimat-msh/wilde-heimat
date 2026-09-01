"use client";

import { Logo } from "@/components/Logo";
import {
  getPatenschaftStufe,
  patenschaftUrkundeMedallionSvg,
  patenschaftUrkundeStufeRender,
  type PatenschaftStufeId,
  type PatenschaftUrkundeDaten,
} from "@/data/patenschaften";
import { patenschaftUrkundeFormat } from "@/data/privacy";
import { formatAbsoluteDateDe } from "@/lib/relativeTime";
import { VereinUnterschriftBlock } from "@/components/VereinUnterschriftBlock";
import {
  URKUNDE_PREVIEW_HEIGHT_PX,
  URKUNDE_PREVIEW_SCALE,
  URKUNDE_PREVIEW_WIDTH_PX,
} from "@/lib/urkundeScale";
import { forwardRef, useId } from "react";

function UrkundeStufeMedallion({
  stufeId,
  label,
}: {
  stufeId: PatenschaftStufeId;
  label: string;
}) {
  const reactId = useId().replace(/:/g, "");
  const spec = patenschaftUrkundeMedallionSvg[stufeId];
  const gradientId = `urkunde-medallion-${stufeId}-${reactId}`;

  return (
    <svg
      viewBox="0 0 56 56"
      width={48}
      height={48}
      className="h-12 w-12 shrink-0"
      role="img"
      aria-label={`Stufe ${label}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="8%" y1="8%" x2="92%" y2="92%">
          {spec.gradientStops.map((stop) => (
            <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
      </defs>
      <circle cx="28" cy="28" r="27" fill={spec.ringColor} />
      <circle
        cx="28"
        cy="28"
        r="24"
        fill={`url(#${gradientId})`}
        stroke={spec.borderColor}
        strokeWidth="2"
      />
      <ellipse cx="22" cy="18" rx="10" ry="6" fill={spec.highlightColor} />
      <text
        x="28"
        y="32"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill={spec.textColor}
        fontFamily="var(--font-geist-sans), system-ui, sans-serif"
      >
        {label}
      </text>
    </svg>
  );
}

function UrkundeStufeBand({ stufeId }: { stufeId: PatenschaftStufeId }) {
  const reactId = useId().replace(/:/g, "");
  const gradientId = `urkunde-band-${stufeId}-${reactId}`;

  const bandStops: Record<PatenschaftStufeId, { offset: string; color: string }[]> = {
    bronze: [
      { offset: "0%", color: "#78350f" },
      { offset: "50%", color: "#b45309" },
      { offset: "100%", color: "#78350f" },
    ],
    silber: [
      { offset: "0%", color: "#78716c" },
      { offset: "50%", color: "#d6d3d1" },
      { offset: "100%", color: "#78716c" },
    ],
    gold: [
      { offset: "0%", color: "#d97706" },
      { offset: "50%", color: "#facc15" },
      { offset: "100%", color: "#d97706" },
    ],
  };

  return (
    <svg
      viewBox="0 0 800 8"
      preserveAspectRatio="none"
      className="h-2 w-full shrink-0 block"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          {bandStops[stufeId].map((stop) => (
            <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
      </defs>
      <rect width="800" height="8" fill={`url(#${gradientId})`} />
    </svg>
  );
}

function CornerOrnament({
  className,
  style,
}: {
  className: string;
  style?: React.CSSProperties;
}) {
  return <span className={`absolute h-5 w-5 ${className}`} style={style} aria-hidden />;
}

function UrkundeHauptblock({
  stufeId,
  waschbaerName,
  waschbaerFoto,
  eagerImages = false,
}: {
  stufeId: PatenschaftStufeId;
  waschbaerName: string;
  waschbaerFoto: string;
  eagerImages?: boolean;
}) {
  const stufe = getPatenschaftStufe(stufeId);
  const render = patenschaftUrkundeStufeRender[stufeId];
  const manyLeistungen = stufe.leistungen.length >= 4;

  return (
    <div className="w-full space-y-2.5">
      <div className="grid grid-cols-[8.25rem_1fr] gap-3 items-start">
        <figure className="text-center">
          <div
            className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border-[3px] bg-neutral-200"
            style={{ borderColor: render.fotoRahmen.borderColor }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={waschbaerFoto}
              alt={`${waschbaerName} – Patentier`}
              className="h-full w-full object-cover object-center"
              crossOrigin="anonymous"
              loading={eagerImages ? "eager" : "lazy"}
            />
          </div>
          <figcaption className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted font-medium">
            Dein Patentier
          </figcaption>
        </figure>

        <div
          className="rounded-lg border-[2px] px-3 py-2.5 text-left"
          style={{
            backgroundColor: render.panel.backgroundColor,
            borderColor: render.panel.borderColor,
          }}
        >
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted font-medium">
            Patenschaftsstufe
          </p>
          <div className="mt-1.5 flex items-center gap-2.5">
            <UrkundeStufeMedallion stufeId={stufeId} label={stufe.name} />
            <div className="min-w-0">
              <p
                className="text-lg font-semibold leading-none"
                style={{ color: render.nameColor }}
              >
                {stufe.name}
              </p>
              <p
                className="mt-0.5 text-lg font-light tabular-nums leading-none"
                style={{ color: render.priceColor }}
              >
                {stufe.preis} €
                <span className="text-[11px] text-muted font-normal"> / Monat</span>
              </p>
            </div>
          </div>
          <p className="mt-2 text-[12px] italic text-muted leading-snug">{stufe.tagline}</p>
          <p className="mt-1.5 text-[11px] text-forest/75 leading-snug">{stufe.beschreibung}</p>
        </div>
      </div>

      <div
        className="rounded-lg border-[2px] px-4 py-2.5"
        style={{
          backgroundColor: render.panel.backgroundColor,
          borderColor: render.panel.borderColor,
        }}
      >
        <p className="text-[10px] uppercase tracking-[0.14em] text-muted font-medium text-left">
          Deine Patenschaft beinhaltet
        </p>
        <ul className={`mt-2 text-left ${manyLeistungen ? "space-y-1" : "space-y-1.5"}`}>
          {stufe.leistungen.map((leistung) => (
            <li
              key={leistung}
              className={`flex items-start gap-2 text-forest/90 leading-snug ${manyLeistungen ? "text-[12px]" : "text-[13px]"}`}
            >
              <span
                className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full"
                style={render.perkDot}
                aria-hidden
              />
              {leistung}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

type PatenschaftUrkundeProps = {
  data: PatenschaftUrkundeDaten;
  mode?: "preview" | "a4";
  showBeispielHinweis?: boolean;
  className?: string;
};

export const PatenschaftUrkunde = forwardRef<HTMLElement, PatenschaftUrkundeProps>(
  function PatenschaftUrkunde(
    { data, mode = "preview", showBeispielHinweis = false, className = "" },
    ref
  ) {
    const {
      pate,
      waschbaer,
      waschbaerFoto,
      stufeId,
      ausgestelltAm,
      urkundenNr,
      ort,
      unterzeichnerin,
      funktion,
      grussbotschaft,
    } = data;

    const render = patenschaftUrkundeStufeRender[stufeId];
    const datumLang = formatAbsoluteDateDe(ausgestelltAm);
    const stufe = getPatenschaftStufe(stufeId);

    /** Ein Layout – Vorschau nur verkleinert, PDF/Druck identisch. */
    const isScaledPreview = mode === "preview";
    const eagerImages = mode === "a4";

    const article = (
      <article
        ref={ref}
        className={`patenschaft-urkunde relative overflow-hidden rounded-sm border-[6px] border-double bg-[linear-gradient(168deg,#fdf8f0_0%,#f5ede0_48%,#efe4d4_100%)] shadow-[0_14px_44px_-14px_rgba(42,51,38,0.28)] ${className}`}
        style={{
          width: "210mm",
          height: "297mm",
          boxSizing: "border-box",
          transform: isScaledPreview ? `scale(${URKUNDE_PREVIEW_SCALE})` : undefined,
          transformOrigin: "top left",
          borderColor: render.articleBorder,
        }}
        aria-label={`Patenschaftsurkunde für ${pate}, Stufe ${stufe.name}, ${patenschaftUrkundeFormat.label}`}
      >
        <UrkundeStufeBand stufeId={stufeId} />

        <div
          className="absolute inset-2.5 top-3.5 bottom-2.5 border-[1.5px] pointer-events-none"
          style={{ borderColor: render.innerBorder }}
          aria-hidden
        />

        <CornerOrnament
          className="top-3.5 left-3.5 border-t-[3px] border-l-[3px]"
          style={{ borderColor: render.cornerBorder }}
        />
        <CornerOrnament
          className="top-3.5 right-3.5 border-t-[3px] border-r-[3px]"
          style={{ borderColor: render.cornerBorder }}
        />
        <CornerOrnament
          className="bottom-3.5 left-3.5 border-b-[3px] border-l-[3px]"
          style={{ borderColor: render.cornerBorder }}
        />
        <CornerOrnament
          className="bottom-3.5 right-3.5 border-b-[3px] border-r-[3px]"
          style={{ borderColor: render.cornerBorder }}
        />

        <div className="relative flex h-[calc(100%-0.5rem)] min-h-0 flex-col px-8 py-5 text-center">
          <header className="shrink-0">
            <Logo
              surface="light"
              size={56}
              className="mx-auto h-14 w-14"
              alt=""
              priority={eagerImages}
            />
            <p className="mt-1 text-[13px] uppercase tracking-[0.2em] text-forest/80 font-medium">
              Wilde Heimat
            </p>
            <p className="text-[10px] uppercase tracking-[0.1em] text-muted">
              Private Initiative · {ort}
            </p>

            <div className="my-2 flex items-center gap-3" aria-hidden>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-900/25 to-transparent" />
              <span className="text-amber-800/40 text-[10px]">✦</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-900/25 to-transparent" />
            </div>

            <p className="text-[13px] uppercase tracking-[0.16em] text-forest/70 font-semibold">
              Patenschaftsurkunde
            </p>
          </header>

          <main className="flex min-h-0 flex-1 flex-col py-2">
            <div className="shrink-0 space-y-0.5">
              <p className="text-[13px] text-muted">Hiermit bestätigen wir, dass</p>
              <p className="text-[1.5rem] font-medium text-forest leading-tight">{pate}</p>
              <p className="text-[12px] text-muted">Pate/Patin des Waschbären</p>
              <p className="text-[1.65rem] font-light text-forest leading-tight tracking-tight">
                {waschbaer}
              </p>

              {grussbotschaft ? (
                <p className="mx-auto mt-1.5 max-w-[90%] text-[12px] italic text-forest/75 leading-snug">
                  „{grussbotschaft}“
                </p>
              ) : null}
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center py-1">
              <UrkundeHauptblock
                stufeId={stufeId}
                waschbaerName={waschbaer}
                waschbaerFoto={waschbaerFoto}
                eagerImages={eagerImages}
              />
            </div>
          </main>

          <footer className="shrink-0 border-t-[1.5px] border-amber-900/15 pt-3 pb-0.5">
            <div className="grid grid-cols-2 gap-x-5 text-left text-[12px] mb-2.5">
              <div>
                <p className="uppercase tracking-wider text-muted text-[9px] font-medium">
                  Ausgestellt in
                </p>
                <p className="mt-0.5 text-forest font-semibold leading-tight">{ort}</p>
                <p className="mt-1.5 uppercase tracking-wider text-muted text-[9px] font-medium">
                  am
                </p>
                <p className="mt-0.5 text-forest font-semibold leading-tight">{datumLang}</p>
              </div>
              <div className="text-right">
                <p className="uppercase tracking-wider text-muted text-[9px] font-medium">
                  Urkunden-Nr.
                </p>
                <p className="mt-0.5 text-forest font-semibold tabular-nums">{urkundenNr}</p>
                <p className="mt-1.5 uppercase tracking-wider text-muted text-[9px] font-medium">
                  Ausgestellt von
                </p>
                <p className="mt-0.5 text-forest font-semibold leading-tight">{unterzeichnerin}</p>
                <p className="text-[10px] text-muted">{funktion}</p>
              </div>
            </div>

            <div className="flex justify-center border-t border-amber-900/10 pt-2.5">
              <VereinUnterschriftBlock
                align="center"
                compact
                showAusstellungszeile={false}
                ausgestelltAm={ausgestelltAm}
                ort={ort}
              />
            </div>

            {showBeispielHinweis ? (
              <p className="mt-2 text-[10px] text-muted/80 italic">
                Beispieldarstellung · {patenschaftUrkundeFormat.label}
              </p>
            ) : null}
          </footer>
        </div>
      </article>
    );

    if (isScaledPreview) {
      return (
        <div
          className="urkunde-preview relative mx-auto overflow-visible"
          style={{ width: URKUNDE_PREVIEW_WIDTH_PX, height: URKUNDE_PREVIEW_HEIGHT_PX }}
        >
          {article}
        </div>
      );
    }

    return article;
  }
);
