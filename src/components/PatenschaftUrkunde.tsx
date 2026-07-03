"use client";

import { Logo } from "@/components/Logo";
import {
  getPatenschaftStufe,
  patenschaftUrkundeStufeStyles,
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
import { forwardRef } from "react";

function CornerOrnament({ className }: { className: string }) {
  return <span className={`absolute h-6 w-6 ${className}`} aria-hidden />;
}

function UrkundeHauptblock({
  stufeId,
  waschbaerName,
  waschbaerFoto,
}: {
  stufeId: PatenschaftStufeId;
  waschbaerName: string;
  waschbaerFoto: string;
}) {
  const stufe = getPatenschaftStufe(stufeId);
  const styles = patenschaftUrkundeStufeStyles[stufeId];
  const manyLeistungen = stufe.leistungen.length >= 4;

  return (
    <div className="w-full space-y-5">
      <div className="grid grid-cols-[10.5rem_1fr] gap-5 items-start">
        <figure className="text-center">
          <div
            className={`relative aspect-[3/4] w-full overflow-hidden rounded-lg border-[3px] shadow-md bg-neutral-200 ${styles.fotoRahmen}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={waschbaerFoto}
              alt={`${waschbaerName} – Patentier`}
              className="h-full w-full object-cover object-center"
              crossOrigin="anonymous"
            />
          </div>
          <figcaption className="mt-2 text-[12px] uppercase tracking-[0.12em] text-muted font-medium">
            Dein Patentier
          </figcaption>
        </figure>

        <div
          className={`rounded-lg border-[2px] px-4 py-4 text-left ${styles.panel}`}
        >
          <p className="text-[12px] uppercase tracking-[0.16em] text-muted font-medium">
            Patenschaftsstufe
          </p>
          <div className="mt-2.5 flex items-center gap-3">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${styles.medallion} ${styles.medallionRing}`}
            >
              <span className={`text-[12px] font-bold ${styles.nameColor}`}>{stufe.name}</span>
            </div>
            <div className="min-w-0">
              <p className={`text-xl font-semibold leading-none ${styles.nameColor}`}>
                {stufe.name}
              </p>
              <p
                className={`mt-1 text-xl font-light tabular-nums leading-none ${styles.priceColor}`}
              >
                {stufe.preis} €
                <span className="text-[12px] text-muted font-normal"> / Monat</span>
              </p>
            </div>
          </div>
          <p className="mt-3 text-[13px] italic text-muted leading-snug">{stufe.tagline}</p>
          <p className="mt-2.5 text-[12px] text-forest/75 leading-snug">{stufe.beschreibung}</p>
        </div>
      </div>

      <div className={`rounded-lg border-[2px] px-5 py-4 ${styles.panel}`}>
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted font-medium text-left">
          Deine Patenschaft beinhaltet
        </p>
        <ul
          className={`mt-3 text-left ${manyLeistungen ? "space-y-2" : "space-y-2.5"}`}
        >
          {stufe.leistungen.map((leistung) => (
            <li
              key={leistung}
              className={`flex items-start gap-2.5 text-forest/90 leading-snug ${manyLeistungen ? "text-[13px]" : "text-[14px]"}`}
            >
              <span
                className={`mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full ${styles.perkDot}`}
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

    const styles = patenschaftUrkundeStufeStyles[stufeId];
    const datumLang = formatAbsoluteDateDe(ausgestelltAm);
    const stufe = getPatenschaftStufe(stufeId);

    const article = (
      <article
        ref={ref}
        className={`relative overflow-hidden rounded-sm border-[6px] border-double ${styles.border} bg-[linear-gradient(168deg,#fdf8f0_0%,#f5ede0_48%,#efe4d4_100%)] shadow-[0_8px_32px_-8px_rgba(42,51,38,0.18)] transition-colors duration-300 ${className}`}
        style={{
          width: "210mm",
          height: "297mm",
          transform: mode === "preview" ? `scale(${URKUNDE_PREVIEW_SCALE})` : undefined,
          transformOrigin: "top left",
        }}
        aria-label={`Patenschaftsurkunde für ${pate}, Stufe ${stufe.name}, ${patenschaftUrkundeFormat.label}`}
      >
        <div className={`h-2 w-full shrink-0 ${styles.band}`} aria-hidden />

        <div
          className={`absolute inset-2.5 top-3.5 bottom-2.5 border-[1.5px] pointer-events-none ${styles.innerBorder}`}
          aria-hidden
        />

        <CornerOrnament className={`top-3.5 left-3.5 border-t-[3px] border-l-[3px] ${styles.corner}`} />
        <CornerOrnament className={`top-3.5 right-3.5 border-t-[3px] border-r-[3px] ${styles.corner}`} />
        <CornerOrnament
          className={`bottom-3.5 left-3.5 border-b-[3px] border-l-[3px] ${styles.corner}`}
        />
        <CornerOrnament
          className={`bottom-3.5 right-3.5 border-b-[3px] border-r-[3px] ${styles.corner}`}
        />

        <div className="relative flex h-[calc(100%-0.5rem)] min-h-0 flex-col px-9 py-6 text-center">
          <header className="shrink-0">
            <Logo surface="light" size={64} className="mx-auto h-16 w-16" alt="" />
            <p className="mt-1.5 text-[14px] uppercase tracking-[0.22em] text-forest/80 font-medium">
              Wilde Heimat
            </p>
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted">
              Private Initiative · {ort}
            </p>

            <div className="my-3 flex items-center gap-3" aria-hidden>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-900/25 to-transparent" />
              <span className="text-amber-800/40 text-[10px]">✦</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-900/25 to-transparent" />
            </div>

            <p className="text-[14px] uppercase tracking-[0.18em] text-forest/70 font-semibold">
              Patenschaftsurkunde
            </p>
          </header>

          <main className="flex min-h-0 flex-1 flex-col py-4">
            <div className="shrink-0 space-y-0.5">
              <p className="text-[14px] text-muted">Hiermit bestätigen wir, dass</p>
              <p className="text-[1.75rem] font-medium text-forest leading-tight">{pate}</p>
              <p className="text-[13px] text-muted">Pate/Patin des Waschbären</p>
              <p className="text-[2rem] font-light text-forest leading-tight tracking-tight">
                {waschbaer}
              </p>

              {grussbotschaft ? (
                <p className="mx-auto mt-2 max-w-[90%] text-[13px] italic text-forest/75 leading-snug">
                  „{grussbotschaft}“
                </p>
              ) : null}
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center py-3">
              <UrkundeHauptblock
                stufeId={stufeId}
                waschbaerName={waschbaer}
                waschbaerFoto={waschbaerFoto}
              />
            </div>
          </main>

          <footer className="shrink-0 border-t-[1.5px] border-amber-900/15 pt-4 pb-0.5">
            <div className="grid grid-cols-2 gap-x-6 text-left text-[13px] mb-4">
              <div>
                <p className="uppercase tracking-wider text-muted text-[10px] font-medium">
                  Ausgestellt in
                </p>
                <p className="mt-0.5 text-forest font-semibold leading-tight">{ort}</p>
                <p className="mt-2 uppercase tracking-wider text-muted text-[10px] font-medium">
                  am
                </p>
                <p className="mt-0.5 text-forest font-semibold leading-tight">{datumLang}</p>
              </div>
              <div className="text-right">
                <p className="uppercase tracking-wider text-muted text-[10px] font-medium">
                  Urkunden-Nr.
                </p>
                <p className="mt-0.5 text-forest font-semibold tabular-nums">{urkundenNr}</p>
                <p className="mt-2 uppercase tracking-wider text-muted text-[10px] font-medium">
                  Ausgestellt von
                </p>
                <p className="mt-0.5 text-forest font-semibold leading-tight">{unterzeichnerin}</p>
                <p className="text-[11px] text-muted">{funktion}</p>
              </div>
            </div>

            <div className="flex justify-center border-t border-amber-900/10 pt-4">
              <VereinUnterschriftBlock
                align="center"
                showAusstellungszeile={false}
                ausgestelltAm={ausgestelltAm}
                ort={ort}
              />
            </div>

            {showBeispielHinweis ? (
              <p className="mt-3 text-[10px] text-muted/80 italic">
                Beispieldarstellung · {patenschaftUrkundeFormat.label}
              </p>
            ) : null}
          </footer>
        </div>
      </article>
    );

    if (mode === "preview") {
      return (
        <div
          className="relative mx-auto overflow-hidden"
          style={{ width: URKUNDE_PREVIEW_WIDTH_PX, height: URKUNDE_PREVIEW_HEIGHT_PX }}
        >
          <div
            className="absolute inset-0 translate-x-1 translate-y-1 rounded-sm bg-amber-900/8"
            aria-hidden
          />
          <div className="relative">{article}</div>
        </div>
      );
    }

    return article;
  }
);
