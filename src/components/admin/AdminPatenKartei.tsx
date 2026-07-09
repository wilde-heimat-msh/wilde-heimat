"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AdminLogoutButton, AdminNav } from "@/components/admin/AdminLogin";
import { PatenDokumentVersand, type PatenMailAttachment } from "@/components/admin/PatenDokumentVersand";
import { PatenDokumentPreviewDialog } from "@/components/admin/PatenDokumentPreviewDialog";
import { PatenDokumentSheet } from "@/components/admin/PatenDokumentSheet";
import { PatenPatenschaftenManager,
  type PatenschaftOverview,
} from "@/components/admin/PatenPatenschaftenManager";
import { PatenZahlungenPanel } from "@/components/admin/PatenZahlungenPanel";
import { PatenschaftUrkunde } from "@/components/PatenschaftUrkunde";
import {
  patenDokumente,
  patenDokumentFilename,
  type PatenDokumentId,
} from "@/data/patenDokumente";
import type { PatenschaftUrkundeDaten } from "@/data/patenschaften";
import { patenschaftsStufen } from "@/data/site";
import {
  blobToBase64,
  exportHtmlToPdf,
  exportUrkundePdf,
  renderElementToPdfBlob,
  renderUrkundeToPdfBlob,
  urkundePdfFilename,
} from "@/lib/exportUrkundePdf";
import { formatDateTimeDe, formatFormDateDe } from "@/lib/relativeTime";
import type { FormSubmissionRecord } from "@/lib/supabase/formSubmissions";
import type { PatenschaftPate } from "@/types/patenschaftPortal";

type KarteiData = {
  pate: PatenschaftPate;
  waschbaer?: { name: string; slug: string };
  patenschaften?: PatenschaftOverview[];
  zahlungszielTag?: number;
  submission?: FormSubmissionRecord | null;
  urkunde: PatenschaftUrkundeDaten;
  mail?: { configured: boolean };
};

function KarteiField({ label, value }: { label: string; value?: string | null }) {
  if (!value?.trim()) return null;
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
      <dd className="text-sm text-foreground whitespace-pre-wrap mt-0.5">{value}</dd>
    </div>
  );
}

export function AdminPatenKartei({ pateId }: { pateId: string }) {
  const [data, setData] = useState<KarteiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<PatenDokumentId | "all" | null>(null);
  const [previewDocId, setPreviewDocId] = useState<PatenDokumentId | null>(null);

  const urkundePrintRef = useRef<HTMLElement>(null);
  const docRefs = useRef<Partial<Record<PatenDokumentId, HTMLElement | null>>>({});

  const loadKartei = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/paten/${encodeURIComponent(pateId)}`, {
        credentials: "same-origin",
      });
      const json = (await res.json()) as KarteiData & { error?: string };
      if (!res.ok) {
        setError(json.error ?? "Kartei konnte nicht geladen werden.");
        setData(null);
        return;
      }
      setData(json);
    } finally {
      setLoading(false);
    }
  }, [pateId]);

  useEffect(() => {
    loadKartei();
  }, [loadKartei]);

  async function exportDocument(id: PatenDokumentId) {
    if (!data) return;

    setExportingId(id);
    setStatus(null);

    try {
      if (id === "urkunde") {
        const element = urkundePrintRef.current;
        if (!element) throw new Error("Urkunde nicht bereit");
        await exportUrkundePdf(
          element,
          urkundePdfFilename(data.pate.name, data.urkunde.urkundenNr)
        );
      } else {
        const element = docRefs.current[id];
        if (!element) throw new Error("Dokument nicht bereit");
        const meta = patenDokumente.find((d) => d.id === id)!;
        await exportHtmlToPdf(
          element,
          patenDokumentFilename(meta.filenamePrefix, data.pate.name, data.pate.urkundenNr)
        );
      }
      setStatus("PDF wurde gespeichert.");
    } catch {
      setStatus("PDF-Export fehlgeschlagen.");
    } finally {
      setExportingId(null);
    }
  }

  async function generateMailAttachments(documentIds: PatenDokumentId[]): Promise<PatenMailAttachment[]> {
    if (!data) return [];

    const attachments: PatenMailAttachment[] = [];

    for (const id of documentIds) {
      if (id === "urkunde") {
        const element = urkundePrintRef.current;
        if (!element) throw new Error("Urkunde nicht bereit");
        const blob = await renderUrkundeToPdfBlob(element, { forMail: true });
        attachments.push({
          filename: urkundePdfFilename(data.pate.name, data.urkunde.urkundenNr),
          contentBase64: await blobToBase64(blob),
        });
        continue;
      }

      const element = docRefs.current[id];
      if (!element) throw new Error(`Dokument „${id}“ nicht bereit`);
      const meta = patenDokumente.find((doc) => doc.id === id)!;
      const blob = await renderElementToPdfBlob(element, { forMail: true });
      attachments.push({
        filename: patenDokumentFilename(meta.filenamePrefix, data.pate.name, data.pate.urkundenNr),
        contentBase64: await blobToBase64(blob),
      });
    }

    return attachments;
  }

  async function exportAllDocuments() {
    if (!data) return;
    setExportingId("all");
    setStatus(null);

    try {
      for (const doc of patenDokumente) {
        await exportDocument(doc.id);
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
      setStatus("Alle Dokumente wurden als PDF gespeichert.");
    } finally {
      setExportingId(null);
    }
  }

  const stufe = data
    ? patenschaftsStufen.find((s) => s.id === data.pate.stufeId)
    : undefined;

  const docCtx = data
    ? {
        pate: data.pate,
        waschbaerName: data.waschbaer?.name ?? data.pate.waschbaerSlug,
        urkunde: data.urkunde,
        zahlungszielTag: data.zahlungszielTag ?? 5,
      }
    : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-muted">
            <Link href="/admin/paten" className="hover:text-forest underline">
              ← Paten
            </Link>
          </p>
          <h1 className="text-2xl font-medium text-forest mt-1">
            {loading ? "Paten-Kartei …" : data?.pate.name ?? "Paten-Kartei"}
          </h1>
          <p className="mt-1 text-sm text-muted max-w-2xl">
            Alle Daten, die ursprüngliche Anfrage und herunterladbare Dokumente für diese
            Patenschaft.
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      <AdminNav />

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      {status ? (
        <p className="text-sm text-muted" role="status">
          {status}
        </p>
      ) : null}

      {data ? (
        <>
          {data.patenschaften && data.patenschaften.length > 0 ? (
            <PatenPatenschaftenManager
              pateId={pateId}
              accessCode={data.pate.accessCode}
              patenschaften={data.patenschaften}
              onChanged={loadKartei}
              onStatus={setStatus}
              onError={setError}
            />
          ) : null}

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
            <section className="rounded-2xl border border-border bg-background/90 p-5 sm:p-6 shadow-soft space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-medium text-forest">Stammdaten</h2>
                  <p className="text-sm text-muted mt-1">
                    {data.waschbaer?.name ?? data.pate.waschbaerSlug} · {stufe?.name}
                    {!data.pate.active ? " · inaktiv" : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/urkunden?pateId=${encodeURIComponent(data.pate.id)}`}
                    className="min-h-9 inline-flex items-center px-3 text-xs rounded-lg border border-border hover:bg-muted-light/60"
                  >
                    Urkunde bearbeiten
                  </Link>
                  <Link
                    href={`/admin/paten?edit=${encodeURIComponent(data.pate.id)}`}
                    className="min-h-9 inline-flex items-center px-3 text-xs rounded-lg border border-border hover:bg-muted-light/60"
                  >
                    Pate bearbeiten
                  </Link>
                </div>
              </div>

              <dl className="grid gap-4 sm:grid-cols-2">
                <KarteiField label="Name" value={data.pate.name} />
                <KarteiField label="E-Mail" value={data.pate.email} />
                <KarteiField label="Telefon" value={data.pate.telefon} />
                <KarteiField label="Anschrift" value={data.pate.anschrift} />
                <KarteiField label="Zugangscode" value={data.pate.accessCode} />
                <KarteiField label="Urkunden-Nr." value={data.pate.urkundenNr} />
                <KarteiField
                  label="Patenschaft seit"
                  value={
                    data.pate.patenschaftStart
                      ? formatFormDateDe(data.pate.patenschaftStart)
                      : undefined
                  }
                />
                <KarteiField
                  label="Widerruf bestätigt"
                  value={
                    data.pate.widerrufBestaetigtAt
                      ? formatDateTimeDe(data.pate.widerrufBestaetigtAt)
                      : undefined
                  }
                />
                <KarteiField
                  label="Datenschutz bestätigt"
                  value={
                    data.pate.datenschutzBestaetigtAt
                      ? formatDateTimeDe(data.pate.datenschutzBestaetigtAt)
                      : undefined
                  }
                />
                {data.pate.isGift ? (
                  <>
                    <KarteiField label="Geschenk-Patenschaft" value="Ja" />
                    <KarteiField label="Beschenkter" value={data.pate.beschenkterName} />
                    <KarteiField
                      label="Anschrift Beschenkter"
                      value={data.pate.beschenkterAnschrift}
                    />
                  </>
                ) : null}
                {data.pate.grussbotschaft ? (
                  <div className="sm:col-span-2">
                    <KarteiField label="Grußbotschaft" value={data.pate.grussbotschaft} />
                  </div>
                ) : null}
                {data.pate.notiz ? (
                  <div className="sm:col-span-2">
                    <KarteiField label="Interne Notiz" value={data.pate.notiz} />
                  </div>
                ) : null}
              </dl>

              {data.submission ? (
                <div className="border-t border-border pt-5">
                  <h3 className="text-sm font-medium text-forest mb-2">Ursprüngliche Anfrage</h3>
                  <p className="text-xs text-muted mb-3">
                    Eingegangen am {formatDateTimeDe(data.submission.createdAt)}
                    {data.submission.replyTo ? ` · ${data.submission.replyTo}` : ""}
                  </p>
                  <Link
                    href="/admin/anfragen"
                    className="text-xs underline text-forest hover:no-underline"
                  >
                    Alle Anfragen ansehen
                  </Link>
                </div>
              ) : null}
            </section>

            <section className="rounded-2xl border border-border bg-background/90 p-5 shadow-soft space-y-4">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-medium text-forest">Dokumente</h2>
                <button
                  type="button"
                  onClick={exportAllDocuments}
                  disabled={exportingId !== null}
                  className="min-h-9 px-3 text-xs rounded-lg border border-border hover:bg-muted-light/60 disabled:opacity-60"
                >
                  {exportingId === "all" ? "Export …" : "Alle als PDF"}
                </button>
              </div>

              <ul className="space-y-2">
                {patenDokumente.map((doc) => (
                  <li
                    key={doc.id}
                    className="rounded-xl border border-border p-3 hover:bg-muted-light/20"
                  >
                    <p className="text-sm font-medium text-forest">{doc.title}</p>
                    <p className="text-xs text-muted mt-1">{doc.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewDocId(doc.id)}
                        className="min-h-8 px-3 text-xs rounded-lg border border-border hover:bg-muted-light/60"
                      >
                        Vorschau
                      </button>
                      <button
                        type="button"
                        onClick={() => exportDocument(doc.id)}
                        disabled={exportingId !== null}
                        className="min-h-8 px-3 text-xs rounded-lg bg-foreground text-background hover:bg-accent disabled:opacity-60"
                      >
                        {exportingId === doc.id ? "Erstelle PDF …" : "PDF speichern"}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <PatenZahlungenPanel
            pateId={pateId}
            pate={data.pate}
            waschbaerName={data.waschbaer?.name ?? data.pate.waschbaerSlug}
            recipientEmail={data.pate.email ?? data.submission?.replyTo}
            mailConfigured={data.mail?.configured ?? false}
            hasMultiplePatentiere={(data.patenschaften?.length ?? 1) > 1}
            onStatus={setStatus}
            onError={setError}
          />

          <PatenDokumentVersand
            pateId={pateId}
            pate={data.pate}
            waschbaerName={data.waschbaer?.name ?? data.pate.waschbaerSlug}
            recipientEmail={data.pate.email ?? data.submission?.replyTo}
            mailConfigured={data.mail?.configured ?? false}
            hasMultiplePatentiere={(data.patenschaften?.length ?? 1) > 1}
            zahlungszielTag={data.zahlungszielTag ?? 5}
            generateAttachments={generateMailAttachments}
            onSent={(message) => {
              setError(null);
              setStatus(message);
            }}
            onError={(message) => {
              setError(message);
            }}
          />

          <section className="rounded-2xl border border-border bg-muted-light/20 p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
                Schnellvorschau Urkunde
              </h2>
              <button
                type="button"
                onClick={() => setPreviewDocId("urkunde")}
                className="min-h-8 px-3 text-xs rounded-lg border border-border bg-background hover:bg-muted-light/60"
              >
                Vollbild-Vorschau
              </button>
            </div>
            <div className="overflow-x-auto">
              <PatenschaftUrkunde data={data.urkunde} mode="preview" />
            </div>
          </section>

          {previewDocId && docCtx ? (
            <PatenDokumentPreviewDialog
              dokumentId={previewDocId}
              ctx={docCtx}
              urkunde={data.urkunde}
              exporting={exportingId === previewDocId}
              onClose={() => setPreviewDocId(null)}
              onDownload={() => exportDocument(previewDocId)}
            />
          ) : null}
        </>
      ) : null}

      {/* Versteckte Druckquellen für PDF-Export */}
      {data && docCtx ? (
        <div className="admin-urkunden-print-source" aria-hidden>
          <PatenschaftUrkunde ref={urkundePrintRef} data={data.urkunde} mode="a4" />
          {patenDokumente
            .filter((doc) => doc.id !== "urkunde")
            .map((doc) => (
              <PatenDokumentSheet
                key={doc.id}
                ref={(node) => {
                  docRefs.current[doc.id] = node;
                }}
                dokumentId={doc.id}
                ctx={docCtx}
              />
            ))}
        </div>
      ) : null}
    </div>
  );
}
