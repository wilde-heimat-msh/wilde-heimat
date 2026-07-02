"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AdminLogoutButton, AdminNav } from "@/components/admin/AdminLogin";
import { FormField } from "@/components/forms/FormFields";
import type { PatenschaftStufeId } from "@/data/patenschaften";
import { patenschaftsStufen } from "@/data/site";
import { useWaschbaeren } from "@/hooks/useWaschbaeren";
import { formatAbsoluteDateDe } from "@/lib/relativeTime";
import type { PatenschaftPate, PatenschaftUpdate } from "@/types/patenschaftPortal";

const emptyForm = {
  waschbaerSlug: "pedro",
  minStufe: "gold" as PatenschaftStufeId,
  patronId: "",
  title: "",
  body: "",
  imageUrls: [] as string[],
  publishedAt: new Date().toISOString().slice(0, 10),
};

export function AdminUpdatesManager() {
  const { waschbaeren } = useWaschbaeren();
  const [updates, setUpdates] = useState<PatenschaftUpdate[]>([]);
  const [paten, setPaten] = useState<PatenschaftPate[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/updates", { credentials: "same-origin" });
      const data = (await res.json()) as {
        updates?: PatenschaftUpdate[];
        paten?: PatenschaftPate[];
      };
      setUpdates(data.updates ?? []);
      setPaten(data.paten ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function startEdit(update: PatenschaftUpdate) {
    setEditingId(update.id);
    setForm({
      waschbaerSlug: update.waschbaerSlug,
      minStufe: update.minStufe,
      patronId: update.patronId ?? "",
      title: update.title,
      body: update.body,
      imageUrls: update.imageUrls,
      publishedAt: update.publishedAt.slice(0, 10),
    });
    setError(null);
    setStatus(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
        credentials: "same-origin",
      });
      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        setError(data.error ?? "Upload fehlgeschlagen.");
        return;
      }

      setForm((f) => ({ ...f, imageUrls: [...f.imageUrls, data.url!] }));
      setStatus("Bild hochgeladen.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function removeImage(url: string) {
    setForm((f) => ({ ...f, imageUrls: f.imageUrls.filter((u) => u !== url) }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setStatus(null);

    const payload = {
      waschbaerSlug: form.waschbaerSlug,
      minStufe: form.minStufe,
      patronId: form.patronId || undefined,
      title: form.title.trim(),
      body: form.body.trim(),
      imageUrls: form.imageUrls,
      publishedAt: new Date(form.publishedAt).toISOString(),
    };

    const res = await fetch("/api/admin/updates", {
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

    setStatus(editingId ? "Update gespeichert." : "Update veröffentlicht.");
    cancelEdit();
    await loadData();
  }

  async function handleDelete(id: string) {
    if (!confirm("Update wirklich löschen?")) return;

    const res = await fetch(`/api/admin/updates?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      credentials: "same-origin",
    });

    if (!res.ok) {
      setError("Löschen fehlgeschlagen.");
      return;
    }

    setStatus("Update gelöscht.");
    if (editingId === id) cancelEdit();
    await loadData();
  }

  const filteredPaten = paten.filter((p) => p.waschbaerSlug === form.waschbaerSlug);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium text-forest">Paten-Updates</h1>
          <p className="mt-1 text-sm text-muted max-w-2xl">
            Schreibe Neuigkeiten mit Text und Bildern. Gold-Paten sehen Updates mit Mindest-Stufe
            Gold, Silber-Paten ab Silber.
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      <AdminNav />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,24rem)_1fr] xl:items-start">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-background/90 p-5 sm:p-6 shadow-soft space-y-4 xl:sticky xl:top-24"
        >
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
            {editingId ? "Update bearbeiten" : "Neues Update"}
          </h2>

          <FormField label="Waschbär" name="waschbaerSlug">
            <select
              id="waschbaerSlug"
              value={form.waschbaerSlug}
              onChange={(e) =>
                setForm((f) => ({ ...f, waschbaerSlug: e.target.value, patronId: "" }))
              }
              className="w-full min-w-0 min-h-11 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
            >
              {waschbaeren.map((w) => (
                <option key={w.slug} value={w.slug}>
                  {w.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Mindest-Stufe" name="minStufe" hint="Gold = wöchentliche Updates">
            <select
              id="minStufe"
              value={form.minStufe}
              onChange={(e) =>
                setForm((f) => ({ ...f, minStufe: e.target.value as PatenschaftStufeId }))
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

          <FormField
            label="Nur für einen Paten (optional)"
            name="patronId"
            hint="Leer = alle Paten dieses Waschbären mit passender Stufe"
          >
            <select
              id="patronId"
              value={form.patronId}
              onChange={(e) => setForm((f) => ({ ...f, patronId: e.target.value }))}
              className="w-full min-w-0 min-h-11 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
            >
              <option value="">Alle Paten</option>
              {filteredPaten.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.accessCode})
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Titel" name="title" required>
            <input
              id="title"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full min-w-0 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
            />
          </FormField>

          <FormField label="Text" name="body" required>
            <textarea
              id="body"
              required
              rows={6}
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              className="w-full px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none resize-y"
            />
          </FormField>

          <FormField label="Veröffentlichungsdatum" name="publishedAt" type="date">
            <input
              id="publishedAt"
              type="date"
              value={form.publishedAt}
              onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
              className="w-full min-w-0 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
            />
          </FormField>

          <div>
            <label className="block text-sm font-medium mb-2">Bilder</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleUpload}
              disabled={uploading}
              className="block w-full text-sm text-muted file:mr-3 file:min-h-10 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-muted-light file:text-foreground"
            />
            {form.imageUrls.length > 0 ? (
              <ul className="mt-3 grid grid-cols-2 gap-2">
                {form.imageUrls.map((url) => (
                  <li key={url} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border">
                    <Image src={url} alt="" fill className="object-cover" sizes="160px" />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute top-1 right-1 min-h-8 min-w-8 rounded-lg bg-black/60 text-white text-xs"
                      aria-label="Bild entfernen"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              disabled={uploading}
              className="min-h-11 px-4 py-3 text-sm font-medium bg-foreground text-background hover:bg-accent rounded-xl transition-all disabled:opacity-60"
            >
              {editingId ? "Update speichern" : "Update veröffentlichen"}
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
              {loading ? "Lade …" : `${updates.length} Updates`}
            </h2>
          </div>

          {updates.length === 0 && !loading ? (
            <p className="p-5 text-sm text-muted">Noch keine Updates veröffentlicht.</p>
          ) : (
            <ul className="divide-y divide-border">
              {updates.map((update) => {
                const waschbaer = waschbaeren.find((w) => w.slug === update.waschbaerSlug);
                const stufe = patenschaftsStufen.find((s) => s.id === update.minStufe);
                const pate = update.patronId
                  ? paten.find((p) => p.id === update.patronId)
                  : null;

                return (
                  <li key={update.id} className="p-5 space-y-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-medium text-forest">{update.title}</p>
                        <p className="text-xs text-muted">
                          {formatAbsoluteDateDe(update.publishedAt)} · {waschbaer?.name} · ab{" "}
                          {stufe?.name}
                          {pate ? ` · nur ${pate.name}` : ""}
                        </p>
                        <p className="mt-2 text-sm text-muted line-clamp-3 whitespace-pre-wrap">
                          {update.body}
                        </p>
                        {update.imageUrls.length > 0 ? (
                          <p className="mt-1 text-xs text-muted">
                            {update.imageUrls.length} Bild
                            {update.imageUrls.length !== 1 ? "er" : ""}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => startEdit(update)}
                          className="min-h-9 px-3 text-xs rounded-lg border border-border hover:bg-muted-light/60"
                        >
                          Bearbeiten
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(update.id)}
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
