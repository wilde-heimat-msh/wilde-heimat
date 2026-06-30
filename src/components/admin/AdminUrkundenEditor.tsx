"use client";

import { useEffect, useRef, useState } from "react";
import { AdminLogoutButton, AdminNav } from "@/components/admin/AdminLogin";
import { PatenschaftUrkunde } from "@/components/PatenschaftUrkunde";
import { FormField } from "@/components/forms/FormFields";
import {
  createDefaultUrkundeDaten,
  suggestUrkundenNr,
  type PatenschaftStufeId,
  type PatenschaftUrkundeDaten,
} from "@/data/patenschaften";
import { getWaschbaerProfilfoto } from "@/data/photos";
import { patenschaftUrkundeFormat } from "@/data/privacy";
import { patenschaftsStufen } from "@/data/site";
import { waschbaeren } from "@/data/waschbaeren";
import { exportUrkundePdf, urkundePdfFilename } from "@/lib/exportUrkundePdf";

const STORAGE_KEY = "wh-admin-urkunde-draft";

function loadDraft(): PatenschaftUrkundeDaten {
  if (typeof window === "undefined") return createDefaultUrkundeDaten();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultUrkundeDaten();
    return { ...createDefaultUrkundeDaten(), ...JSON.parse(raw) };
  } catch {
    return createDefaultUrkundeDaten();
  }
}

function saveDraft(data: PatenschaftUrkundeDaten) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function AdminUrkundenEditor() {
  const [data, setData] = useState<PatenschaftUrkundeDaten>(() => createDefaultUrkundeDaten());
  const [exporting, setExporting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const printRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setData(loadDraft());
  }, []);

  function update(partial: Partial<PatenschaftUrkundeDaten>) {
    setData((prev) => {
      const next = { ...prev, ...partial };
      saveDraft(next);
      return next;
    });
  }

  function handleWaschbaerChange(slug: string) {
    const waschbaer = waschbaeren.find((w) => w.slug === slug);
    if (!waschbaer) return;
    update({
      waschbaerSlug: waschbaer.slug,
      waschbaer: waschbaer.name,
      waschbaerFoto: getWaschbaerProfilfoto(waschbaer.slug),
    });
  }

  function handlePrint() {
    window.print();
  }

  async function handlePdfExport() {
    const element = printRef.current;
    if (!element) return;

    if (!data.pate.trim()) {
      setStatus("Bitte zuerst den Namen des Paten/der Patin eintragen.");
      return;
    }

    setExporting(true);
    setStatus(null);

    try {
      await exportUrkundePdf(element, urkundePdfFilename(data.pate, data.urkundenNr));
      setStatus("PDF wurde gespeichert.");
    } catch {
      setStatus("PDF-Export fehlgeschlagen. Bitte Drucken → Als PDF speichern nutzen.");
    } finally {
      setExporting(false);
    }
  }

  function handleReset() {
    const fresh = createDefaultUrkundeDaten();
    setData(fresh);
    saveDraft(fresh);
    setStatus("Formular zurückgesetzt.");
  }

  return (
    <div className="admin-urkunden space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium text-forest">Patenschaftsurkunden</h1>
          <p className="mt-1 text-sm text-muted max-w-2xl">
            Urkunde personalisieren, Vorschau prüfen und als PDF speichern oder drucken (
            {patenschaftUrkundeFormat.label}).
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      <AdminNav />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,22rem)_1fr] xl:items-start">
        <section className="rounded-2xl border border-border bg-background/90 p-5 sm:p-6 shadow-soft space-y-4 xl:sticky xl:top-24">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted">Daten</h2>

          <FormField
            label="Pate / Patin"
            name="pate"
            required
            hint="Name auf der Urkunde"
          >
            <input
              id="pate"
              name="pate"
              type="text"
              required
              value={data.pate}
              onChange={(event) => update({ pate: event.target.value })}
              className="w-full min-w-0 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
            />
          </FormField>

          <FormField label="Waschbär" name="waschbaerSlug">
            <select
              id="waschbaerSlug"
              name="waschbaerSlug"
              value={data.waschbaerSlug}
              onChange={(event) => handleWaschbaerChange(event.target.value)}
              className="w-full min-w-0 min-h-11 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
            >
              {waschbaeren.map((w) => (
                <option key={w.slug} value={w.slug}>
                  {w.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Patenschaftsstufe" name="stufeId">
            <select
              id="stufeId"
              name="stufeId"
              value={data.stufeId}
              onChange={(event) =>
                update({ stufeId: event.target.value as PatenschaftStufeId })
              }
              className="w-full min-w-0 min-h-11 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
            >
              {patenschaftsStufen.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.preis} €/Monat)
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Ausgestellt am" name="ausgestelltAm" type="date">
            <input
              id="ausgestelltAm"
              name="ausgestelltAm"
              type="date"
              value={data.ausgestelltAm}
              onChange={(event) => update({ ausgestelltAm: event.target.value })}
              className="w-full min-w-0 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
            />
          </FormField>

          <FormField
            label="Urkunden-Nummer"
            name="urkundenNr"
            hint="Eindeutige Referenz für eure Unterlagen"
          >
            <div className="flex gap-2">
              <input
                id="urkundenNr"
                name="urkundenNr"
                type="text"
                value={data.urkundenNr}
                onChange={(event) => update({ urkundenNr: event.target.value })}
                className="w-full min-w-0 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
              />
              <button
                type="button"
                onClick={() => update({ urkundenNr: suggestUrkundenNr() })}
                className="shrink-0 min-h-11 px-3 text-xs rounded-xl border border-border hover:bg-muted-light/60 transition-colors"
                title="Neue Nummer vorschlagen"
              >
                Neu
              </button>
            </div>
          </FormField>

          <FormField label="Ort" name="ort">
            <input
              id="ort"
              name="ort"
              type="text"
              value={data.ort}
              onChange={(event) => update({ ort: event.target.value })}
              className="w-full min-w-0 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
            />
          </FormField>

          <FormField label="Unterzeichnerin" name="unterzeichnerin">
            <input
              id="unterzeichnerin"
              name="unterzeichnerin"
              type="text"
              value={data.unterzeichnerin}
              onChange={(event) => update({ unterzeichnerin: event.target.value })}
              className="w-full min-w-0 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
            />
          </FormField>

          <FormField label="Funktion" name="funktion">
            <input
              id="funktion"
              name="funktion"
              type="text"
              value={data.funktion}
              onChange={(event) => update({ funktion: event.target.value })}
              className="w-full min-w-0 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
            />
          </FormField>

          <FormField
            label="Grußbotschaft (optional)"
            name="grussbotschaft"
            hint="Erscheint unter dem Waschbär-Namen – z. B. für Geschenk-Patenschaften"
          >
            <textarea
              id="grussbotschaft"
              name="grussbotschaft"
              rows={3}
              value={data.grussbotschaft ?? ""}
              onChange={(event) => update({ grussbotschaft: event.target.value })}
              className="w-full px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none resize-y"
            />
          </FormField>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              onClick={handlePdfExport}
              disabled={exporting}
              className="min-h-11 px-4 py-3 text-sm font-medium bg-foreground text-background hover:bg-accent rounded-xl transition-all duration-200 disabled:opacity-60"
            >
              {exporting ? "PDF wird erstellt …" : "Als PDF speichern"}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="min-h-11 px-4 py-3 text-sm font-medium rounded-xl border border-border hover:bg-muted-light/60 transition-colors"
            >
              Drucken
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="min-h-11 px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
            >
              Formular zurücksetzen
            </button>
          </div>

          {status ? (
            <p className="text-xs text-muted" role="status">
              {status}
            </p>
          ) : null}
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted">Vorschau</h2>
          <div className="rounded-2xl border border-border bg-muted-light/30 p-4 sm:p-6 overflow-x-auto">
            <PatenschaftUrkunde data={data} mode="preview" />
          </div>
        </section>
      </div>

      {/* A4-Original für Druck & PDF – außerhalb des sichtbaren Layouts */}
      <div className="admin-urkunden-print-source" aria-hidden>
        <PatenschaftUrkunde ref={printRef} data={data} mode="a4" />
      </div>
    </div>
  );
}
