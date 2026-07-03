"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FormField } from "@/components/forms/FormFields";
import type { PatenschaftStufeId } from "@/data/patenschaften";
import { patenschaftsStufen } from "@/data/site";
import { useWaschbaeren } from "@/hooks/useWaschbaeren";

export type PatenschaftOverview = {
  id: string;
  waschbaerSlug: string;
  waschbaerName: string;
  stufeId: PatenschaftStufeId;
  active: boolean;
  urkundenNr?: string;
  patenschaftStart?: string;
};

type PatenPatenschaftenManagerProps = {
  pateId: string;
  accessCode?: string;
  patenschaften: PatenschaftOverview[];
  onChanged: () => void;
  onStatus: (message: string | null) => void;
  onError: (message: string | null) => void;
};

export function PatenPatenschaftenManager({
  pateId,
  accessCode,
  patenschaften,
  onChanged,
  onStatus,
  onError,
}: PatenPatenschaftenManagerProps) {
  const router = useRouter();
  const { waschbaeren } = useWaschbaeren();
  const [showAddForm, setShowAddForm] = useState(false);
  const [waschbaerSlug, setWaschbaerSlug] = useState("");
  const [stufeId, setStufeId] = useState<PatenschaftStufeId>("silber");
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const assignedSlugs = useMemo(
    () => new Set(patenschaften.map((p) => p.waschbaerSlug)),
    [patenschaften]
  );

  const availableWaschbaeren = useMemo(
    () => waschbaeren.filter((w) => !assignedSlugs.has(w.slug)),
    [waschbaeren, assignedSlugs]
  );

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    if (!waschbaerSlug) {
      onError("Bitte einen Waschbären wählen.");
      return;
    }

    setSaving(true);
    onError(null);
    onStatus(null);

    try {
      const res = await fetch(`/api/admin/paten/${encodeURIComponent(pateId)}/patenschaften`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ waschbaerSlug, stufeId }),
      });

      const json = (await res.json()) as { error?: string; pate?: { id: string } };
      if (!res.ok) {
        onError(json.error ?? "Patenschaft konnte nicht hinzugefügt werden.");
        return;
      }

      onStatus("Patenschaft hinzugefügt. Dokumente und E-Mail beziehen sich jetzt auf das neue Patentier.");
      setShowAddForm(false);
      setWaschbaerSlug("");

      if (json.pate?.id) {
        router.push(`/admin/paten/${json.pate.id}`);
      } else {
        onChanged();
      }
    } catch {
      onError("Patenschaft konnte nicht hinzugefügt werden.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(patenschaft: PatenschaftOverview) {
    const stufe = patenschaftsStufen.find((s) => s.id === patenschaft.stufeId)?.name;
    const message =
      patenschaften.length === 1
        ? `Letzte Patenschaft (${patenschaft.waschbaerName}) wirklich entfernen? Der Pate wird vollständig gelöscht.`
        : `Patenschaft für ${patenschaft.waschbaerName} (${stufe ?? patenschaft.stufeId}) wirklich entfernen?`;

    if (!confirm(message)) return;

    setRemovingId(patenschaft.id);
    onError(null);
    onStatus(null);

    try {
      const res = await fetch(
        `/api/admin/paten/${encodeURIComponent(pateId)}/patenschaften?patenschaftId=${encodeURIComponent(patenschaft.id)}`,
        { method: "DELETE", credentials: "same-origin" }
      );

      const json = (await res.json()) as {
        error?: string;
        redirectTo?: string;
      };

      if (!res.ok) {
        onError(json.error ?? "Patenschaft konnte nicht entfernt werden.");
        return;
      }

      onStatus("Patenschaft entfernt.");
      if (json.redirectTo) {
        router.push(json.redirectTo);
      } else {
        onChanged();
      }
    } catch {
      onError("Patenschaft konnte nicht entfernt werden.");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-background/90 p-5 sm:p-6 shadow-soft space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-medium text-forest">Patentiere dieser Person</h2>
          <p className="mt-1 text-sm text-muted max-w-2xl">
            Alle Patenschaften teilen denselben Zugangscode
            {accessCode ? (
              <>
                {" "}
                (<span className="font-mono text-forest">{accessCode}</span>)
              </>
            ) : null}
            . Dokumente und E-Mails gelten jeweils für das ausgewählte Patentier.
          </p>
        </div>
        {availableWaschbaeren.length > 0 ? (
          <button
            type="button"
            onClick={() => {
              setShowAddForm((open) => !open);
              if (!waschbaerSlug && availableWaschbaeren[0]) {
                setWaschbaerSlug(availableWaschbaeren[0].slug);
              }
            }}
            className="min-h-10 shrink-0 px-4 text-sm rounded-xl border border-forest/30 bg-forest/5 text-forest hover:bg-forest/10"
          >
            {showAddForm ? "Abbrechen" : "+ Patentier hinzufügen"}
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {patenschaften.map((patenschaft) => {
          const stufe = patenschaftsStufen.find((s) => s.id === patenschaft.stufeId);
          const isCurrent = patenschaft.id === pateId;

          return (
            <div
              key={patenschaft.id}
              className={`flex items-center gap-1 rounded-xl border p-1 ${
                isCurrent ? "border-forest/30 bg-sage/10" : "border-border bg-background/80"
              }`}
            >
              <Link
                href={`/admin/paten/${encodeURIComponent(patenschaft.id)}`}
                className={`min-h-9 inline-flex items-center px-3 text-sm rounded-lg transition-colors ${
                  isCurrent
                    ? "font-medium text-forest"
                    : "text-muted hover:text-foreground hover:bg-muted-light/50"
                }`}
              >
                {patenschaft.waschbaerName}
                <span className="ml-2 text-xs text-muted">{stufe?.name}</span>
                {!patenschaft.active ? (
                  <span className="ml-2 text-[10px] uppercase text-red-700">inaktiv</span>
                ) : null}
              </Link>
              <button
                type="button"
                onClick={() => handleRemove(patenschaft)}
                disabled={removingId === patenschaft.id}
                title={`Patenschaft für ${patenschaft.waschbaerName} entfernen`}
                className="min-h-9 min-w-9 inline-flex items-center justify-center rounded-lg text-muted hover:text-red-700 hover:bg-red-50 disabled:opacity-60"
                aria-label={`Patenschaft für ${patenschaft.waschbaerName} entfernen`}
              >
                {removingId === patenschaft.id ? "…" : "×"}
              </button>
            </div>
          );
        })}
      </div>

      {showAddForm ? (
        <form
          onSubmit={handleAdd}
          className="rounded-xl border border-dashed border-border bg-muted-light/20 p-4 space-y-4"
        >
          <p className="text-sm font-medium text-forest">Weiteres Patentier hinzufügen</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Waschbär" name="newWaschbaer">
              <select
                id="newWaschbaer"
                value={waschbaerSlug}
                onChange={(e) => setWaschbaerSlug(e.target.value)}
                className="w-full min-w-0 min-h-11 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
              >
                {availableWaschbaeren.map((w) => (
                  <option key={w.slug} value={w.slug}>
                    {w.name}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Patenschaftsstufe" name="newStufe">
              <select
                id="newStufe"
                value={stufeId}
                onChange={(e) => setStufeId(e.target.value as PatenschaftStufeId)}
                className="w-full min-w-0 min-h-11 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
              >
                {patenschaftsStufen.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <p className="text-xs text-muted">
            Stammdaten, Zugangscode und E-Mail werden übernommen. Es wird eine neue Urkunden-Nummer
            vergeben – danach kannst du die Unterlagen für dieses Patentier versenden.
          </p>

          <button
            type="submit"
            disabled={saving || !waschbaerSlug}
            className="min-h-10 px-4 text-sm font-medium rounded-xl bg-foreground text-background hover:bg-accent disabled:opacity-60"
          >
            {saving ? "Wird angelegt …" : "Patenschaft anlegen"}
          </button>
        </form>
      ) : null}
    </section>
  );
}
