"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AdminLogoutButton, AdminNav } from "@/components/admin/AdminLogin";
import { Checkbox, FormField } from "@/components/forms/FormFields";
import { slugifyWaschbaerName } from "@/lib/waschbaerSlug";
import { normalizeWaschbaerGalerie } from "@/data/photos";
import type { WaschbaerGalleryItem, WaschbaerWithGallery } from "@/types/waschbaer";

const FARBE_OPTIONS = [
  { value: "from-neutral-800 to-neutral-600", label: "Dunkelgrau" },
  { value: "from-neutral-700 to-neutral-500", label: "Mittelgrau" },
  { value: "from-neutral-600 to-neutral-400", label: "Hellgrau" },
  { value: "from-neutral-500 to-neutral-300", label: "Sehr hell" },
];

type GalleryDraft = {
  id?: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  featured: boolean;
  objectPosition: string;
};

const emptyForm = {
  slug: "",
  name: "",
  aufgenommen: "",
  eigenschaften: "",
  kurztext: "",
  geschichte: "",
  charakter: "",
  farbe: FARBE_OPTIONS[1].value,
  published: true,
  sortOrder: 0,
};

function toGalleryDraft(items: WaschbaerGalleryItem[]): GalleryDraft[] {
  const idsBySrc = new Map(items.map((item) => [item.src, item.id]));

  return normalizeWaschbaerGalerie(
    items.map(({ id: _id, waschbaerId: _wid, sortOrder: _sort, ...foto }) => ({
      ...foto,
      objectPosition: foto.objectPosition ?? "center center",
    }))
  ).map((foto) => ({
    id: idsBySrc.get(foto.src),
    src: foto.src,
    alt: foto.alt,
    width: foto.width,
    height: foto.height,
    caption: foto.caption ?? "",
    featured: foto.featured ?? false,
    objectPosition: foto.objectPosition ?? "center center",
  }));
}

function prepareGalleryForSave(items: GalleryDraft[]): GalleryDraft[] {
  const bySrc = new Map(items.map((item) => [item.src, item]));
  const normalized = normalizeWaschbaerGalerie(
    items.map(({ id: _id, ...foto }) => ({
      ...foto,
      objectPosition: foto.objectPosition ?? "center center",
    }))
  );

  return normalized.map((foto, index) => ({
    ...bySrc.get(foto.src)!,
    ...foto,
    featured: index === 0,
  }));
}

async function readImageSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: 768, height: 1024 });
    };
    img.src = url;
  });
}

export function AdminWaschbaerenManager() {
  const [waschbaeren, setWaschbaeren] = useState<WaschbaerWithGallery[]>([]);
  const [usesDatabase, setUsesDatabase] = useState(true);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [gallery, setGallery] = useState<GalleryDraft[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadWaschbaeren = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/waschbaeren", { credentials: "same-origin" });
      const data = (await res.json()) as {
        waschbaeren?: WaschbaerWithGallery[];
        usesDatabase?: boolean;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Laden fehlgeschlagen.");
        setUsesDatabase(false);
        setWaschbaeren([]);
        return;
      }
      setUsesDatabase(data.usesDatabase ?? true);
      setWaschbaeren(data.waschbaeren ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWaschbaeren();
  }, [loadWaschbaeren]);

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setGallery([]);
    setError(null);
    setStatus(null);
  }

  function startEdit(waschbaer: WaschbaerWithGallery) {
    setEditingId(waschbaer.id);
    setForm({
      slug: waschbaer.slug,
      name: waschbaer.name,
      aufgenommen: waschbaer.aufgenommen,
      eigenschaften: waschbaer.eigenschaften.join(", "),
      kurztext: waschbaer.kurztext,
      geschichte: waschbaer.geschichte,
      charakter: waschbaer.charakter,
      farbe: waschbaer.farbe,
      published: waschbaer.published,
      sortOrder: waschbaer.sortOrder,
    });
    setGallery(toGalleryDraft(waschbaer.gallery));
    setError(null);
    setStatus(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setGallery([]);
  }

  async function handleImport() {
    if (!confirm("Alle Waschbären und Fotos von der Website in die Datenbank importieren?")) {
      return;
    }

    setError(null);
    setStatus(null);
    const res = await fetch("/api/admin/waschbaeren/import", {
      method: "POST",
      credentials: "same-origin",
    });
    const data = (await res.json()) as { imported?: number; error?: string };

    if (!res.ok) {
      setError(data.error ?? "Import fehlgeschlagen.");
      return;
    }

    setStatus(`${data.imported ?? 0} Waschbären importiert.`);
    await loadWaschbaeren();
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !form.slug.trim()) {
      setError("Bitte zuerst ein URL-Kürzel vergeben, bevor du Fotos hochlädst.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const dimensions = await readImageSize(file);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "waschbaeren");
      formData.append("subfolder", form.slug.trim());

      const res = await fetch("/api/admin/uploads", {
        method: "POST",
        credentials: "same-origin",
        body: formData,
      });
      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        setError(data.error ?? "Upload fehlgeschlagen.");
        return;
      }

      setGallery((items) => [
        ...items,
        {
          src: data.url!,
          alt: `${form.name || form.slug} – Foto`,
          width: dimensions.width,
          height: dimensions.height,
          caption: "",
          featured: items.length === 0,
          objectPosition: "center center",
        },
      ]);
      setStatus("Foto hochgeladen.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function updateGalleryItem(index: number, patch: Partial<GalleryDraft>) {
    setGallery((items) => {
      let next = items.map((item, i) => {
        if (i !== index) {
          if (patch.featured) return { ...item, featured: false };
          return item;
        }
        return { ...item, ...patch };
      });

      if (patch.featured) {
        const featured = next[index];
        next = [featured, ...next.filter((_, i) => i !== index)];
      }

      return next;
    });
  }

  function removeGalleryItem(index: number) {
    setGallery((items) => items.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setStatus(null);

    const payload = {
      ...form,
      eigenschaften: form.eigenschaften
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      gallery: prepareGalleryForSave(gallery),
    };

    const res = await fetch("/api/admin/waschbaeren", {
      method: editingId ? "PUT" : "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
    });

    const data = (await res.json()) as { error?: string };

    if (!res.ok) {
      setError(data.error ?? "Speichern fehlgeschlagen.");
      return;
    }

    setStatus(editingId ? "Waschbär gespeichert." : "Waschbär angelegt.");
    cancelEdit();
    await loadWaschbaeren();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Waschbär „${name}“ wirklich löschen?`)) return;

    const res = await fetch(`/api/admin/waschbaeren?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      credentials: "same-origin",
    });

    if (!res.ok) {
      setError("Löschen fehlgeschlagen.");
      return;
    }

    setStatus("Waschbär gelöscht.");
    if (editingId === id) cancelEdit();
    await loadWaschbaeren();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium text-forest">Waschbären verwalten</h1>
          <p className="mt-1 text-sm text-muted">
            Profile, Steckbrief, Geschichte, Charakter und Galerie-Fotos bearbeiten.
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      <AdminNav />

      {!usesDatabase ? (
        <div className="rounded-2xl border border-amber-300/60 bg-amber-50/80 p-5 text-sm text-amber-950">
          Waschbär-Verwaltung erfordert Supabase. Bitte Datenbank einrichten und Migration{" "}
          <code className="text-xs">supabase/migration-waschbaeren.sql</code> ausführen.
        </div>
      ) : null}

      {waschbaeren.length === 0 && usesDatabase && !loading ? (
        <div className="rounded-2xl border border-border bg-muted-light/30 p-5">
          <p className="text-sm text-muted">
            Noch keine Waschbären in der Datenbank. Importiere die bestehenden Profile von der
            Website – danach kannst du sie hier bearbeiten.
          </p>
          <button
            type="button"
            onClick={handleImport}
            className="mt-4 rounded-xl bg-forest px-4 py-2 text-sm font-medium text-background hover:bg-forest-mid"
          >
            Bestehende Waschbären importieren
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={startCreate}
          className="rounded-xl bg-forest px-4 py-2 text-sm font-medium text-background hover:bg-forest-mid"
        >
          Neuer Waschbär
        </button>
        {waschbaeren.length > 0 ? (
          <button
            type="button"
            onClick={handleImport}
            className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted-light/50"
          >
            Erneut importieren
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      {status ? <p className="text-sm text-forest">{status}</p> : null}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-background/90 p-5 sm:p-6">
        <h2 className="text-lg font-medium text-forest">
          {editingId ? "Waschbär bearbeiten" : "Neuen Waschbär anlegen"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField label="Name" name="name" required>
            <input
              id="name"
              name="name"
              required
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                setForm((f) => ({
                  ...f,
                  name,
                  slug: editingId ? f.slug : slugifyWaschbaerName(name),
                }));
              }}
              className="block w-full px-4 py-3 border border-border bg-background input-base"
            />
          </FormField>
          <FormField label="URL-Kürzel (Slug)" name="slug" required hint="z. B. pedro">
            <input
              id="slug"
              name="slug"
              required
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: slugifyWaschbaerName(e.target.value) }))}
              className="block w-full px-4 py-3 border border-border bg-background input-base"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField label="Aufgenommen" name="aufgenommen" hint="z. B. Mai 2026">
            <input
              id="aufgenommen"
              name="aufgenommen"
              value={form.aufgenommen}
              onChange={(e) => setForm((f) => ({ ...f, aufgenommen: e.target.value }))}
              className="block w-full px-4 py-3 border border-border bg-background input-base"
            />
          </FormField>
          <FormField label="Sortierung" name="sortOrder">
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              value={form.sortOrder}
              onChange={(e) =>
                setForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))
              }
              className="block w-full px-4 py-3 border border-border bg-background input-base"
            />
          </FormField>
        </div>

        <FormField
          label="Eigenschaften"
          name="eigenschaften"
          hint="Kommagetrennt, z. B. verspielt, neugierig"
        >
          <input
            id="eigenschaften"
            name="eigenschaften"
            value={form.eigenschaften}
            onChange={(e) => setForm((f) => ({ ...f, eigenschaften: e.target.value }))}
            className="block w-full px-4 py-3 border border-border bg-background input-base"
          />
        </FormField>

        <label htmlFor="kurztext" className="block text-sm font-medium mb-2">
          Kurztext <span className="text-muted ml-1">*</span>
        </label>
        <textarea
          id="kurztext"
          name="kurztext"
          required
          rows={2}
          value={form.kurztext}
          onChange={(e) => setForm((f) => ({ ...f, kurztext: e.target.value }))}
          className="block w-full px-4 py-3 border border-border bg-background input-base resize-y"
        />

        <label htmlFor="geschichte" className="block text-sm font-medium mb-2">
          Geschichte <span className="text-muted ml-1">*</span>
        </label>
        <textarea
          id="geschichte"
          name="geschichte"
          required
          rows={5}
          value={form.geschichte}
          onChange={(e) => setForm((f) => ({ ...f, geschichte: e.target.value }))}
          className="block w-full px-4 py-3 border border-border bg-background input-base resize-y"
        />

        <label htmlFor="charakter" className="block text-sm font-medium mb-2">
          Charakter <span className="text-muted ml-1">*</span>
        </label>
        <textarea
          id="charakter"
          name="charakter"
          required
          rows={4}
          value={form.charakter}
          onChange={(e) => setForm((f) => ({ ...f, charakter: e.target.value }))}
          className="block w-full px-4 py-3 border border-border bg-background input-base resize-y"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="farbe" className="block text-sm font-medium mb-2">
              Karten-Farbverlauf
            </label>
            <select
              id="farbe"
              value={form.farbe}
              onChange={(e) => setForm((f) => ({ ...f, farbe: e.target.value }))}
              className="block w-full min-h-11 px-4 py-3 border border-border bg-background input-base"
            >
              {FARBE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Checkbox
              label="Veröffentlicht (auf Website sichtbar)"
              name="published"
              checked={form.published}
              onChange={(checked) => setForm((f) => ({ ...f, published: checked }))}
            />
          </div>
        </div>

        <div className="space-y-4 border-t border-border pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-medium text-forest">Galerie-Fotos</h3>
              <p className="mt-1 text-xs text-muted">
                Das Profilbild erscheint oben groß, weitere Fotos darunter im 2-Spalten-Raster –
                wie auf der öffentlichen Profilseite.
              </p>
            </div>
            <label className="cursor-pointer rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted-light/50">
              {uploading ? "Wird hochgeladen …" : "Foto hochladen"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                disabled={uploading}
                onChange={handleUpload}
              />
            </label>
          </div>

          {gallery.length === 0 ? (
            <p className="text-sm text-muted">Noch keine Fotos. Lade Bilder für die Galerie hoch.</p>
          ) : (
            <div className="space-y-4">
              {gallery.map((photo, index) => (
                <div
                  key={`${photo.src}-${index}`}
                  className="grid gap-4 rounded-xl border border-border p-4 sm:grid-cols-[120px_1fr]"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted-light">
                    <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="120px" />
                  </div>
                  <div className="space-y-3">
                    <input
                      value={photo.alt}
                      onChange={(e) => updateGalleryItem(index, { alt: e.target.value })}
                      placeholder="Alt-Text"
                      className="block w-full px-3 py-2 border border-border bg-background text-sm"
                    />
                    <input
                      value={photo.caption}
                      onChange={(e) => updateGalleryItem(index, { caption: e.target.value })}
                      placeholder="Bildunterschrift"
                      className="block w-full px-3 py-2 border border-border bg-background text-sm"
                    />
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="featured"
                        checked={photo.featured}
                        onChange={() => updateGalleryItem(index, { featured: true })}
                      />
                      Als Profilbild verwenden
                    </label>
                    <button
                      type="button"
                      onClick={() => removeGalleryItem(index)}
                      className="text-sm text-red-700 hover:underline"
                    >
                      Foto entfernen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-xl bg-forest px-5 py-2.5 text-sm font-medium text-background hover:bg-forest-mid"
          >
            {editingId ? "Speichern" : "Anlegen"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted-light/50"
            >
              Abbrechen
            </button>
          ) : null}
        </div>
      </form>

      <div className="rounded-2xl border border-border overflow-hidden">
        <div className="border-b border-border bg-muted-light/30 px-4 py-3">
          <h2 className="font-medium text-forest">Alle Waschbären ({waschbaeren.length})</h2>
        </div>
        {loading ? (
          <p className="p-6 text-sm text-muted">Lädt …</p>
        ) : waschbaeren.length === 0 ? (
          <p className="p-6 text-sm text-muted">Keine Einträge.</p>
        ) : (
          <ul className="divide-y divide-border">
            {waschbaeren.map((waschbaer) => {
              const featured = waschbaer.gallery.find((f) => f.featured) ?? waschbaer.gallery[0];
              return (
                <li
                  key={waschbaer.id}
                  className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {featured ? (
                      <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-muted-light">
                        <Image
                          src={featured.src}
                          alt={featured.alt}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    ) : null}
                    <div className="min-w-0">
                      <p className="font-medium text-forest">
                        {waschbaer.name}{" "}
                        {!waschbaer.published ? (
                          <span className="text-xs text-muted">(Entwurf)</span>
                        ) : null}
                      </p>
                      <p className="text-sm text-muted truncate">{waschbaer.kurztext}</p>
                      <p className="text-xs text-muted mt-1">
                        /waschbaeren/{waschbaer.slug} · {waschbaer.gallery.length} Foto
                        {waschbaer.gallery.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/waschbaeren/${waschbaer.slug}`}
                      className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted-light/50"
                      target="_blank"
                    >
                      Ansehen
                    </Link>
                    <button
                      type="button"
                      onClick={() => startEdit(waschbaer)}
                      className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted-light/50"
                    >
                      Bearbeiten
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(waschbaer.id, waschbaer.name)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                    >
                      Löschen
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
