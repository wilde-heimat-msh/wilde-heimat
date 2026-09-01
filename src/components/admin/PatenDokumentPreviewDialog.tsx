"use client";

import { PatenDokumentSheet, type PatenDokumentContext } from "@/components/admin/PatenDokumentSheet";
import { PatenschaftUrkunde } from "@/components/PatenschaftUrkunde";
import {
  getPatenDokumentMeta,
  type PatenDokumentId,
} from "@/data/patenDokumente";
import type { PatenschaftUrkundeDaten } from "@/data/patenschaften";
import { useEffect } from "react";

type PatenDokumentPreviewDialogProps = {
  dokumentId: PatenDokumentId;
  ctx: PatenDokumentContext;
  urkunde: PatenschaftUrkundeDaten;
  exporting: boolean;
  onClose: () => void;
  onDownload: () => void;
};

export function PatenDokumentPreviewDialog({
  dokumentId,
  ctx,
  urkunde,
  exporting,
  onClose,
  onDownload,
}: PatenDokumentPreviewDialogProps) {
  const meta = getPatenDokumentMeta(dokumentId);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="paten-dokument-preview-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-forest/40 backdrop-blur-[2px]"
        aria-label="Vorschau schließen"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[100dvh] w-full max-w-5xl flex-col rounded-t-2xl sm:rounded-2xl border border-border bg-background shadow-2xl">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">PDF-Vorschau</p>
            <h2 id="paten-dokument-preview-title" className="text-lg font-medium text-forest">
              {meta.title}
            </h2>
            <p className="mt-1 text-sm text-muted">{meta.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-9 min-w-9 rounded-lg border border-border px-3 text-sm hover:bg-muted-light/60"
            aria-label="Schließen"
          >
            ✕
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-auto bg-muted-light/25 p-4 sm:p-6">
          <div className="mx-auto w-fit max-w-full">
            {dokumentId === "urkunde" ? (
              <PatenschaftUrkunde data={urkunde} mode="preview" />
            ) : (
              <div className="mx-auto w-full max-w-[210mm] shadow-[0_8px_32px_-8px_rgba(42,51,38,0.18)]">
                <PatenDokumentSheet dokumentId={dokumentId} ctx={ctx} />
              </div>
            )}
          </div>
        </div>

        <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-border px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 px-4 py-2 text-sm rounded-xl border border-border hover:bg-muted-light/60"
          >
            Schließen
          </button>
          <button
            type="button"
            onClick={onDownload}
            disabled={exporting}
            className="min-h-11 px-4 py-2 text-sm font-medium rounded-xl bg-foreground text-background hover:bg-accent disabled:opacity-60"
          >
            {exporting ? "PDF wird erstellt …" : "PDF speichern"}
          </button>
        </footer>
      </div>
    </div>
  );
}
