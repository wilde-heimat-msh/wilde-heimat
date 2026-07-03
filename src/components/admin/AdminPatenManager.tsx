"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AdminLogoutButton, AdminNav } from "@/components/admin/AdminLogin";
import { FormField } from "@/components/forms/FormFields";
import type { PatenschaftStufeId } from "@/data/patenschaften";
import { patenschaftsStufen } from "@/data/site";
import { useWaschbaeren } from "@/hooks/useWaschbaeren";
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

export function AdminPatenManager() {
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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPaten();
  }, [loadPaten]);

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
    if (!confirm("Pate wirklich löschen? Der Zugangscode funktioniert danach nicht mehr.")) {
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

  function copyPortalLink(code: string) {
    const url = `${window.location.origin}/paten/zugang/${encodeURIComponent(code)}`;
    navigator.clipboard.writeText(url);
    setStatus("Portal-Link kopiert.");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium text-forest">Paten verwalten</h1>
          <p className="mt-1 text-sm text-muted max-w-2xl">
            Lege Paten an und vergebe individuelle Zugangscodes. Gold-Paten sehen wöchentliche
            Updates, Silber-Paten die Foto-Updates.
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
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
            {editingId ? "Pate bearbeiten" : "Neuer Pate"}
          </h2>

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
            hint="Vom Admin festgelegt – z. B. PEDRO-GOLD-2026"
          >
            <input
              id="accessCode"
              required
              value={form.accessCode}
              onChange={(e) => setForm((f) => ({ ...f, accessCode: e.target.value.toUpperCase() }))}
              className="w-full min-w-0 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none font-mono text-sm"
            />
          </FormField>

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
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-medium text-forest">
              {loading ? "Lade …" : `${paten.length} Paten`}
            </h2>
          </div>

          {paten.length === 0 && !loading ? (
            <p className="p-5 text-sm text-muted">Noch keine Paten angelegt.</p>
          ) : (
            <ul className="divide-y divide-border">
              {paten.map((pate) => {
                const waschbaer = waschbaeren.find((w) => w.slug === pate.waschbaerSlug);
                const stufe = patenschaftsStufen.find((s) => s.id === pate.stufeId);

                return (
                  <li key={pate.id} className="p-5 space-y-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-medium text-forest">{pate.name}</p>
                        <p className="text-sm text-muted">
                          {waschbaer?.name ?? pate.waschbaerSlug} · {stufe?.name}
                          {!pate.active ? " · inaktiv" : ""}
                        </p>
                        <p className="mt-1 font-mono text-xs text-forest/80">{pate.accessCode}</p>
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
                          onClick={() => copyPortalLink(pate.accessCode)}
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
