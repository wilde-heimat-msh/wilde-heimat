"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AdminLogoutButton, AdminNav } from "@/components/admin/AdminLogin";
import { FormField } from "@/components/forms/FormFields";
import type { PatenschaftStufeId } from "@/data/patenschaften";
import { patenschaftsStufen } from "@/data/site";
import { useWaschbaeren } from "@/hooks/useWaschbaeren";
import { getPatenPortalUrl, suggestPatenAccessCode } from "@/lib/patenschaftTier";
import type { PatenschaftPate } from "@/types/patenschaftPortal";

const emptyForm = {
  name: "",
  accessCode: "",
  waschbaerSlug: "pedro",
  stufeId: "gold" as PatenschaftStufeId,
  email: "",
  notiz: "",
  active: true,
};

function copyText(value: string, onDone: (message: string) => void) {
  navigator.clipboard.writeText(value);
  onDone("In Zwischenablage kopiert.");
}

export function AdminPatenManager() {
  const searchParams = useSearchParams();
  const editParam = searchParams.get("edit");
  const { waschbaeren } = useWaschbaeren();
  const [paten, setPaten] = useState<PatenschaftPate[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadPaten = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/paten", { credentials: "same-origin" });
      const data = (await res.json()) as { paten?: PatenschaftPate[] };
      setPaten(data.paten ?? []);
      return data.paten ?? [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPaten();
  }, [loadPaten]);

  useEffect(() => {
    if (!editParam || paten.length === 0) return;
    const pate = paten.find((item) => item.id === editParam);
    if (pate) startEdit(pate);
  }, [editParam, paten]);

  function suggestCodeForForm(current = form) {
    return suggestPatenAccessCode({
      waschbaerSlug: current.waschbaerSlug,
      stufeId: current.stufeId,
      name: current.name,
    });
  }

  function applySuggestedCode() {
    const existingCode = findExistingCodeForForm();
    if (existingCode) {
      setForm((current) => ({ ...current, accessCode: existingCode }));
      setStatus("Bestehender Zugangscode übernommen – gleicher Login für alle Patentiere.");
      return;
    }
    setForm((current) => ({ ...current, accessCode: suggestCodeForForm(current) }));
    setStatus("Zugangscode vorgeschlagen.");
  }

  function findExistingCodeForForm(current = form) {
    const email = current.email.trim().toLowerCase();
    if (email) {
      const match = paten.find((p) => p.email?.trim().toLowerCase() === email);
      if (match) return match.accessCode;
    }
    const name = current.name.trim().toLowerCase();
    if (name) {
      const match = paten.find((p) => p.name.trim().toLowerCase() === name);
      if (match) return match.accessCode;
    }
    return null;
  }

  function reuseCodeFromExistingPatron() {
    const existingCode = findExistingCodeForForm();
    if (!existingCode) return;
    setForm((current) => ({
      ...current,
      accessCode: existingCode,
    }));
    setStatus("Bestehender Zugangscode übernommen.");
  }

  function startEdit(pate: PatenschaftPate) {
    setEditingId(pate.id);
    setForm({
      name: pate.name,
      accessCode: pate.accessCode,
      waschbaerSlug: pate.waschbaerSlug,
      stufeId: pate.stufeId,
      email: pate.email ?? "",
      notiz: pate.notiz ?? "",
      active: pate.active,
    });
    setError(null);
    setStatus(null);
  }

  function startNewPaten() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      accessCode: suggestPatenAccessCode({
        waschbaerSlug: emptyForm.waschbaerSlug,
        stufeId: emptyForm.stufeId,
      }),
    });
    setError(null);
    setStatus(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setStatus(null);

    const payload = {
      ...form,
      name: form.name.trim(),
      accessCode: form.accessCode.trim().toUpperCase(),
    };

    const res = await fetch("/api/admin/paten", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
    });

    const data = (await res.json()) as { error?: string };

    if (!res.ok) {
      setError(data.error ?? "Speichern fehlgeschlagen.");
      return;
    }

    setStatus(editingId ? "Pate aktualisiert." : "Pate angelegt.");
    cancelEdit();
    await loadPaten();
  }

  async function handleDelete(id: string) {
    if (!confirm("Diese Patenschaft wirklich löschen? Andere Patentiere mit demselben Code bleiben erhalten.")) {
      return;
    }

    const res = await fetch(`/api/admin/paten?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      credentials: "same-origin",
    });

    if (!res.ok) {
      setError("Löschen fehlgeschlagen.");
      return;
    }

    setStatus("Pate gelöscht.");
    if (editingId === id) cancelEdit();
    await loadPaten();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium text-forest">Paten verwalten</h1>
          <p className="mt-1 text-sm text-muted max-w-2xl">
            Jeder Pate erhält einen persönlichen Zugangscode (
            <Link href="/paten" className="underline hover:no-underline">
              /paten
            </Link>
            ). Hat jemand mehrere Patentiere, denselben Code bei jeder Patenschaft verwenden – dann
            sieht die Person alle Tiere mit einem Login.
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      <AdminNav />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,22rem)_1fr] xl:items-start">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-background/90 p-5 sm:p-6 shadow-soft space-y-4 xl:sticky xl:top-24"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
              {editingId ? "Pate bearbeiten" : "Neuer Pate"}
            </h2>
            {!editingId ? (
              <button
                type="button"
                onClick={startNewPaten}
                className="text-xs text-muted hover:text-foreground underline"
              >
                Neu
              </button>
            ) : null}
          </div>

          <FormField label="Name auf dem Portal" name="name" required>
            <input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full min-w-0 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
            />
          </FormField>

          <FormField
            label="Zugangscode"
            name="accessCode"
            required
            hint="Ein Code pro Person. Bei mehreren Patentiere denselben Code erneut verwenden."
          >
            <div className="flex gap-2">
              <input
                id="accessCode"
                required
                value={form.accessCode}
                onChange={(e) =>
                  setForm((f) => ({ ...f, accessCode: e.target.value.toUpperCase() }))
                }
                className="w-full min-w-0 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none font-mono text-sm"
              />
              <button
                type="button"
                onClick={applySuggestedCode}
                className="shrink-0 min-h-11 px-3 text-xs rounded-xl border border-border hover:bg-muted-light/60"
                title="Neuen Code vorschlagen"
              >
                Generieren
              </button>
            </div>
          </FormField>

          {form.accessCode ? (
            <div className="rounded-xl border border-forest/20 bg-forest/5 px-4 py-3 text-sm space-y-2">
              <p className="text-xs uppercase tracking-wide text-muted">Vorschau Portal-Link</p>
              <p className="font-mono text-xs break-all text-forest">
                {typeof window !== "undefined"
                  ? getPatenPortalUrl(window.location.origin, form.accessCode)
                  : `/paten/zugang/${form.accessCode}`}
              </p>
            </div>
          ) : null}

          <FormField label="Waschbär" name="waschbaerSlug">
            <select
              id="waschbaerSlug"
              value={form.waschbaerSlug}
              onChange={(e) => setForm((f) => ({ ...f, waschbaerSlug: e.target.value }))}
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
              value={form.stufeId}
              onChange={(e) =>
                setForm((f) => ({ ...f, stufeId: e.target.value as PatenschaftStufeId }))
              }
              className="w-full min-w-0 min-h-11 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
            >
              {patenschaftsStufen.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="E-Mail (intern)" name="email">
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              onBlur={reuseCodeFromExistingPatron}
              className="w-full min-w-0 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
            />
          </FormField>

          <FormField label="Notiz (intern)" name="notiz">
            <textarea
              id="notiz"
              rows={2}
              value={form.notiz}
              onChange={(e) => setForm((f) => ({ ...f, notiz: e.target.value }))}
              className="w-full px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none resize-y"
            />
          </FormField>

          <label className="flex items-center gap-3 min-h-11 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              className="h-4 w-4 rounded border-border"
            />
            <span className="text-sm">Zugang aktiv</span>
          </label>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              className="min-h-11 px-4 py-3 text-sm font-medium bg-foreground text-background hover:bg-accent rounded-xl transition-all"
            >
              {editingId ? "Speichern" : "Pate anlegen"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={cancelEdit}
                className="min-h-11 px-4 py-2 text-sm text-muted hover:text-foreground"
              >
                Abbrechen
              </button>
            ) : null}
          </div>

          {error ? (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          {status ? (
            <p className="text-xs text-muted" role="status">
              {status}
            </p>
          ) : null}
        </form>

        <div className="rounded-2xl border border-border bg-background/90 shadow-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3">
            <h2 className="font-medium text-forest">
              {loading ? "Lade …" : `${paten.length} Paten`}
            </h2>
            <button
              type="button"
              onClick={startNewPaten}
              className="min-h-9 px-3 text-xs rounded-lg border border-border hover:bg-muted-light/60"
            >
              Neuer Pate
            </button>
          </div>

          {paten.length === 0 && !loading ? (
            <p className="p-5 text-sm text-muted">Noch keine Paten angelegt.</p>
          ) : (
            <ul className="divide-y divide-border">
              {paten.map((pate) => {
                const waschbaer = waschbaeren.find((w) => w.slug === pate.waschbaerSlug);
                const stufe = patenschaftsStufen.find((s) => s.id === pate.stufeId);
                const portalUrl =
                  typeof window !== "undefined"
                    ? getPatenPortalUrl(window.location.origin, pate.accessCode)
                    : "";
                const sameCodeCount = paten.filter(
                  (item) => item.accessCode === pate.accessCode
                ).length;

                return (
                  <li key={pate.id} className="p-5 space-y-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="font-medium text-forest">{pate.name}</p>
                        <p className="text-sm text-muted">
                          {waschbaer?.name ?? pate.waschbaerSlug} · {stufe?.name}
                          {!pate.active ? " · inaktiv" : ""}
                        </p>
                        <div className="mt-3 rounded-lg border border-border bg-muted-light/20 px-3 py-2">
                          <p className="text-[10px] uppercase tracking-wide text-muted">
                            Zugangscode
                          </p>
                          <p className="mt-0.5 font-mono text-sm text-forest break-all">
                            {pate.accessCode}
                          </p>
                          {sameCodeCount > 1 ? (
                            <p className="mt-1 text-[11px] text-muted">
                              {sameCodeCount} Patentiere mit diesem Code
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/paten/${encodeURIComponent(pate.id)}`}
                          className="min-h-9 inline-flex items-center px-3 text-xs rounded-lg border border-forest/30 bg-forest/5 text-forest hover:bg-forest/10"
                        >
                          Kartei
                        </Link>
                        <button
                          type="button"
                          onClick={() => copyText(pate.accessCode, setStatus)}
                          className="min-h-9 px-3 text-xs rounded-lg border border-border hover:bg-muted-light/60"
                        >
                          Code kopieren
                        </button>
                        <button
                          type="button"
                          onClick={() => portalUrl && copyText(portalUrl, setStatus)}
                          className="min-h-9 px-3 text-xs rounded-lg border border-border hover:bg-muted-light/60"
                        >
                          Link kopieren
                        </button>
                        <button
                          type="button"
                          onClick={() => startEdit(pate)}
                          className="min-h-9 px-3 text-xs rounded-lg border border-border hover:bg-muted-light/60"
                        >
                          Bearbeiten
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(pate.id)}
                          className="min-h-9 px-3 text-xs rounded-lg border border-red-200 text-red-700 hover:bg-red-50"
                        >
                          Löschen
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
