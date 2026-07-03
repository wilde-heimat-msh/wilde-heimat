import { Logo } from "@/components/Logo";
import { getPatenschaftStufe, type PatenschaftUrkundeDaten } from "@/data/patenschaften";
import { getWiderrufContactBlock } from "@/data/legal";
import { paypalDonation } from "@/data/paypal";
import type { PatenDokumentId } from "@/data/patenDokumente";
import { siteConfig, patenschaftHinweis } from "@/data/site";
import { formatContactAddressLines } from "@/lib/contact";
import { formatDateTimeDe, formatFormDateDe } from "@/lib/relativeTime";
import {
  URKUNDE_PREVIEW_SCALE,
  URKUNDE_PREVIEW_WIDTH_PX,
} from "@/lib/urkundeScale";
import type { PatenschaftPate } from "@/types/patenschaftPortal";
import type { ReactNode } from "react";
import { forwardRef } from "react";

export type PatenDokumentContext = {
  pate: PatenschaftPate;
  waschbaerName: string;
  urkunde?: PatenschaftUrkundeDaten;
};

function DokumentShell({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`bg-white text-forest px-12 py-10 text-[13px] leading-relaxed ${className}`}
      style={{ width: "210mm", minHeight: "297mm" }}
    >
      <header className="border-b border-border pb-5 mb-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <Logo surface="light" size={48} className="h-12 w-12" alt="" />
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.16em]">Wilde Heimat</p>
            <p className="text-xs text-muted">{siteConfig.region}</p>
          </div>
          <div className="text-right text-xs text-muted">
            <p>{siteConfig.email}</p>
            <p>{siteConfig.contact.name}</p>
          </div>
        </div>
        <h1 className="mt-5 text-xl font-medium text-forest">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
      </header>
      {children}
      <footer className="mt-10 border-t border-border pt-4 text-[11px] text-muted">
        <p>
          {siteConfig.name} · {siteConfig.contact.name} · {formatContactAddressLines().join(", ")}
        </p>
        <p className="mt-1">Dokument erstellt am {formatFormDateDe(new Date().toISOString().slice(0, 10))}</p>
      </footer>
    </article>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value?.trim()) return null;
  return (
    <div className="grid grid-cols-[9rem_1fr] gap-3 py-1.5 border-b border-border/60">
      <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
      <dd className="text-forest whitespace-pre-wrap">{value}</dd>
    </div>
  );
}

function PatenschaftBestaetigung({ ctx }: { ctx: PatenDokumentContext }) {
  const stufe = getPatenschaftStufe(ctx.pate.stufeId);
  const displayName = ctx.pate.name;
  const payerName = ctx.pate.isGift ? ctx.pate.notiz : undefined;

  return (
    <DokumentShell
      title="Patenschaftsbestätigung"
      subtitle={`Urkunden-Nr. ${ctx.pate.urkundenNr ?? "–"}`}
    >
      <p className="mb-4">
        Hiermit bestätigen wir die Aufnahme der folgenden Patenschaft bei der privaten Initiative{" "}
        <strong>Wilde Heimat</strong>.
      </p>

      <dl className="mb-6">
        <InfoRow label="Pate/Patin" value={displayName} />
        <InfoRow label="Waschbär" value={ctx.waschbaerName} />
        <InfoRow label="Stufe" value={`${stufe.name} (${stufe.preis} €/Monat)`} />
        <InfoRow label="Start" value={ctx.pate.patenschaftStart ? formatFormDateDe(ctx.pate.patenschaftStart) : undefined} />
        <InfoRow label="Anschrift" value={ctx.pate.anschrift} />
        <InfoRow label="E-Mail" value={ctx.pate.email} />
        <InfoRow label="Telefon" value={ctx.pate.telefon} />
        <InfoRow label="Zugangscode" value={ctx.pate.accessCode} />
        {ctx.pate.isGift ? (
          <>
            <InfoRow label="Geschenk" value="Ja" />
            <InfoRow label="Besteller" value={payerName ?? "Siehe Anfrage"} />
            <InfoRow label="Beschenkter" value={ctx.pate.beschenkterName} />
          </>
        ) : null}
        {ctx.pate.grussbotschaft ? (
          <InfoRow label="Grußbotschaft" value={`„${ctx.pate.grussbotschaft}"`} />
        ) : null}
      </dl>

      <p className="text-sm text-muted mb-4">{patenschaftHinweis}</p>

      <p className="text-sm">
        Ausgestellt am{" "}
        <strong>
          {ctx.pate.ausgestelltAm ? formatFormDateDe(ctx.pate.ausgestelltAm) : formatFormDateDe(new Date().toISOString().slice(0, 10))}
        </strong>{" "}
        in {siteConfig.operatingArea}.
      </p>

      <p className="mt-6 rounded-lg border border-border bg-muted-light/25 px-4 py-3 text-xs text-muted leading-relaxed">
        Dieses Dokument wurde maschinell erstellt. Es ist ohne handschriftliche Unterschrift gültig
        und bestätigt die aufgenommene Patenschaft mit den oben genannten Angaben.
      </p>

      <div className="mt-8">
        <div className="w-48 border-b border-forest/40 pb-1">
          <p className="italic text-forest">{siteConfig.contact.name}</p>
        </div>
        <p className="text-xs text-muted mt-1">Gründerin, Wilde Heimat (maschinell ausgestellt)</p>
      </div>
    </DokumentShell>
  );
}

function Zahlungsinfo({ ctx }: { ctx: PatenDokumentContext }) {
  const stufe = getPatenschaftStufe(ctx.pate.stufeId);

  return (
    <DokumentShell
      title="Zahlungsinformationen zur Patenschaft"
      subtitle={`${ctx.pate.name} · ${ctx.waschbaerName}`}
    >
      <p className="mb-4">
        Vielen Dank für deine Patenschaft! Nachfolgend die Informationen zur monatlichen
        Unterstützung.
      </p>

      <dl className="mb-6">
        <InfoRow label="Monatlicher Beitrag" value={`${stufe.preis} €`} />
        <InfoRow label="Patenschaftsstufe" value={stufe.name} />
        <InfoRow label="Patentier" value={ctx.waschbaerName} />
        <InfoRow label="Zahlungsart" value="PayPal (monatlich)" />
      </dl>

      <h2 className="text-sm font-medium text-forest mb-2">So richtest du die Zahlung ein</h2>
      <ol className="list-decimal pl-5 space-y-2 text-sm mb-6">
        <li>
          Wir senden dir nach Bestätigung der Patenschaft einen persönlichen PayPal-Link für den
          monatlichen Beitrag von <strong>{stufe.preis} €</strong>.
        </li>
        <li>
          Alternativ kannst du uns unter{" "}
          <strong>{siteConfig.email}</strong> kontaktieren, falls PayPal für dich keine Option ist.
        </li>
        <li>
          Einmalspenden sind jederzeit über unseren PayPal-Pool möglich:{" "}
          <span className="break-all text-xs">{paypalDonation.donateUrl}</span>
        </li>
      </ol>

      <div className="rounded-lg border border-border bg-muted-light/20 p-4 text-sm mb-6">
        <p className="font-medium text-forest mb-1">Wichtige Hinweise</p>
        <ul className="list-disc pl-5 space-y-1 text-muted">
          <li>Die Patenschaft ist monatlich kündbar – ohne Mindestlaufzeit.</li>
          <li>Bereits geleistete Beiträge sind freiwillige Unterstützungen.</li>
          <li>Bei Kündigung bitte zusätzlich laufende PayPal-Zahlungen bei PayPal beenden.</li>
          <li>{paypalDonation.patenschaftNote}</li>
        </ul>
      </div>

      <p className="text-sm text-muted">
        Rückfragen zur Zahlung: {siteConfig.email}
        {ctx.pate.telefon ? ` · ${ctx.pate.telefon}` : ""}
      </p>
    </DokumentShell>
  );
}

function WiderrufNachweis({ ctx }: { ctx: PatenDokumentContext }) {
  const timestamp = ctx.pate.widerrufBestaetigtAt;

  return (
    <DokumentShell
      title="Nachweis Widerrufsbelehrung"
      subtitle="Kenntnisnahme bei Patenschaftsanfrage"
    >
      <p className="mb-4">
        Der/die unten genannte Verbraucher:in hat bei der Patenschaftsanfrage über die Website{" "}
        <strong>wilde-heimat-msh.de</strong> die Kenntnisnahme der Widerrufsbelehrung bestätigt.
      </p>

      <dl className="mb-6">
        <InfoRow label="Name" value={ctx.pate.name} />
        <InfoRow label="E-Mail" value={ctx.pate.email} />
        <InfoRow label="Anschrift" value={ctx.pate.anschrift} />
        <InfoRow
          label="Bestätigt am"
          value={timestamp ? formatDateTimeDe(timestamp) : "– (kein Zeitstempel)"}
        />
        <InfoRow label="Patenschaft" value={`${ctx.waschbaerName} · ${getPatenschaftStufe(ctx.pate.stufeId).name}`} />
      </dl>

      <p className="text-sm text-muted mb-4">
        Die vollständige Widerrufsbelehrung ist unter{" "}
        <strong>{siteConfig.url}/widerruf</strong> einsehbar.
      </p>

      <p className="text-xs text-muted">
        Dieses Dokument dient der internen Dokumentation und wurde automatisch aus den
        Formulardaten erstellt.
      </p>
    </DokumentShell>
  );
}

function DatenschutzNachweis({ ctx }: { ctx: PatenDokumentContext }) {
  const timestamp = ctx.pate.datenschutzBestaetigtAt;

  return (
    <DokumentShell
      title="Nachweis Datenschutz-Einwilligung"
      subtitle="Einwilligung bei Patenschaftsanfrage"
    >
      <p className="mb-4">
        Der/die unten genannte Verbraucher:in hat bei der Patenschaftsanfrage die
        Datenschutzerklärung gelesen und der Verarbeitung der angegebenen Daten zugestimmt.
      </p>

      <dl className="mb-6">
        <InfoRow label="Name" value={ctx.pate.name} />
        <InfoRow label="E-Mail" value={ctx.pate.email} />
        <InfoRow label="Anschrift" value={ctx.pate.anschrift} />
        <InfoRow label="Telefon" value={ctx.pate.telefon} />
        <InfoRow
          label="Einwilligung am"
          value={timestamp ? formatDateTimeDe(timestamp) : "– (kein Zeitstempel)"}
        />
      </dl>

      <p className="text-sm text-muted">
        Datenschutzerklärung: <strong>{siteConfig.url}/datenschutz</strong>
      </p>
    </DokumentShell>
  );
}

function Widerrufsformular({ ctx }: { ctx: PatenDokumentContext }) {
  const stufe = getPatenschaftStufe(ctx.pate.stufeId);
  const contactBlock = getWiderrufContactBlock();
  const startDate = ctx.pate.patenschaftStart
    ? formatFormDateDe(ctx.pate.patenschaftStart)
    : "_________________";

  return (
    <DokumentShell title="Muster-Widerrufsformular" subtitle="§ 355 BGB">
      <p className="mb-4 text-sm">
        Wenn du den Vertrag widerrufen willst, fülle dieses Formular aus und sende es zurück an:
      </p>

      <pre className="whitespace-pre-wrap rounded-lg border border-border bg-muted-light/20 p-4 text-xs mb-6">
        {contactBlock}
      </pre>

      <div className="space-y-4 text-sm">
        <p>
          Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die
          Erbringung der folgenden Leistung (*)/den Kauf der folgenden Waren (*)
        </p>

        <p>
          – Patenschaft / folgende Leistung:{" "}
          <strong>
            {stufe.name}-Patenschaft für {ctx.waschbaerName} ({stufe.preis} €/Monat)
          </strong>
        </p>

        <p>– Bestellt am (*) / erhalten am (*): <strong>{startDate}</strong></p>

        <p>– Name des/der Verbraucher(s): <strong>{ctx.pate.name}</strong></p>

        <p>– Anschrift des/der Verbraucher(s): <strong>{ctx.pate.anschrift ?? "_________________"}</strong></p>

        <p>– Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier): _________________________________</p>

        <p>– Datum: _________________________________</p>

        <p className="text-xs text-muted">(*) Unzutreffendes streichen.</p>
      </div>
    </DokumentShell>
  );
}

type PatenDokumentSheetProps = {
  dokumentId: PatenDokumentId;
  ctx: PatenDokumentContext;
  mode?: "preview" | "print";
  className?: string;
};

export const PatenDokumentSheet = forwardRef<HTMLElement, PatenDokumentSheetProps>(
  function PatenDokumentSheet({ dokumentId, ctx, mode = "print", className = "" }, ref) {
    let content: ReactNode;

    switch (dokumentId) {
      case "patenschaft-bestaetigung":
        content = <PatenschaftBestaetigung ctx={ctx} />;
        break;
      case "zahlungsinfo":
        content = <Zahlungsinfo ctx={ctx} />;
        break;
      case "widerruf-nachweis":
        content = <WiderrufNachweis ctx={ctx} />;
        break;
      case "datenschutz-nachweis":
        content = <DatenschutzNachweis ctx={ctx} />;
        break;
      case "widerrufsformular":
        content = <Widerrufsformular ctx={ctx} />;
        break;
      default:
        content = null;
    }

    const sheet = (
      <div ref={mode === "print" ? (ref as React.RefObject<HTMLDivElement>) : undefined} className={className}>
        {content}
      </div>
    );

    if (mode === "preview") {
      return (
        <div
          className="relative mx-auto overflow-hidden"
          style={{ width: URKUNDE_PREVIEW_WIDTH_PX }}
        >
          <div
            style={{
              transform: `scale(${URKUNDE_PREVIEW_SCALE})`,
              transformOrigin: "top left",
              width: "210mm",
            }}
          >
            {sheet}
          </div>
        </div>
      );
    }

    return sheet;
  }
);
