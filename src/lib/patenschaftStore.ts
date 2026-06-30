import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import * as supabaseStore from "@/lib/supabase/patenschaftStore";
import { loadPatenschaftStore, savePatenschaftStore } from "@/lib/patenschaftStorage";
import type {
  PatenschaftPate,
  PatenschaftStore,
  PatenschaftUpdate,
} from "@/types/patenschaftPortal";
import { normalizeAccessCode, stufeMeetsMinimum } from "@/lib/patenschaftTier";

async function readStore(): Promise<PatenschaftStore> {
  return loadPatenschaftStore();
}

async function writeStore(store: PatenschaftStore): Promise<void> {
  await savePatenschaftStore(store);
}

export async function getPatenschaftStore(): Promise<PatenschaftStore> {
  if (isSupabaseConfigured()) {
    const [paten, updates] = await Promise.all([
      supabaseStore.supabaseListPaten(),
      supabaseStore.supabaseListUpdates(),
    ]);
    return { paten, updates };
  }
  return readStore();
}

export async function getPatenByAccessCode(code: string): Promise<PatenschaftPate | null> {
  if (isSupabaseConfigured()) {
    return supabaseStore.supabaseGetPatenByAccessCode(code);
  }
  const normalized = normalizeAccessCode(code);
  const store = await readStore();
  return (
    store.paten.find(
      (p) => p.active && normalizeAccessCode(p.accessCode) === normalized
    ) ?? null
  );
}

export async function getPatenById(id: string): Promise<PatenschaftPate | null> {
  if (isSupabaseConfigured()) {
    return supabaseStore.supabaseGetPatenById(id);
  }
  const store = await readStore();
  return store.paten.find((p) => p.id === id) ?? null;
}

export async function listPaten(): Promise<PatenschaftPate[]> {
  if (isSupabaseConfigured()) {
    return supabaseStore.supabaseListPaten();
  }
  const store = await readStore();
  return [...store.paten].sort((a, b) => a.name.localeCompare(b.name, "de"));
}

export async function listUpdates(): Promise<PatenschaftUpdate[]> {
  if (isSupabaseConfigured()) {
    return supabaseStore.supabaseListUpdates();
  }
  const store = await readStore();
  return [...store.updates].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function isAccessCodeTaken(code: string, excludeId?: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    return supabaseStore.supabaseIsAccessCodeTaken(code, excludeId);
  }
  const normalized = normalizeAccessCode(code);
  const store = await readStore();
  return store.paten.some(
    (p) =>
      p.id !== excludeId && normalizeAccessCode(p.accessCode) === normalized
  );
}

export async function createPaten(
  input: Omit<PatenschaftPate, "id" | "createdAt" | "updatedAt">
): Promise<PatenschaftPate> {
  if (isSupabaseConfigured()) {
    return supabaseStore.supabaseCreatePaten(input);
  }
  const store = await readStore();
  const now = new Date().toISOString();
  const pate: PatenschaftPate = {
    ...input,
    accessCode: normalizeAccessCode(input.accessCode),
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  store.paten.push(pate);
  await writeStore(store);
  return pate;
}

export async function updatePaten(
  id: string,
  input: Partial<Omit<PatenschaftPate, "id" | "createdAt">>
): Promise<PatenschaftPate | null> {
  if (isSupabaseConfigured()) {
    return supabaseStore.supabaseUpdatePaten(id, input);
  }
  const store = await readStore();
  const index = store.paten.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = store.paten[index];
  const updated: PatenschaftPate = {
    ...current,
    ...input,
    accessCode: input.accessCode
      ? normalizeAccessCode(input.accessCode)
      : current.accessCode,
    updatedAt: new Date().toISOString(),
  };
  store.paten[index] = updated;
  await writeStore(store);
  return updated;
}

export async function deletePaten(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    return supabaseStore.supabaseDeletePaten(id);
  }
  const store = await readStore();
  const before = store.paten.length;
  store.paten = store.paten.filter((p) => p.id !== id);
  if (store.paten.length === before) return false;
  await writeStore(store);
  return true;
}

export async function createUpdate(
  input: Omit<PatenschaftUpdate, "id" | "createdAt" | "updatedAt">
): Promise<PatenschaftUpdate> {
  if (isSupabaseConfigured()) {
    return supabaseStore.supabaseCreateUpdate(input);
  }
  const store = await readStore();
  const now = new Date().toISOString();
  const update: PatenschaftUpdate = {
    ...input,
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  store.updates.push(update);
  await writeStore(store);
  return update;
}

export async function updatePatenschaftUpdate(
  id: string,
  input: Partial<Omit<PatenschaftUpdate, "id" | "createdAt">>
): Promise<PatenschaftUpdate | null> {
  if (isSupabaseConfigured()) {
    return supabaseStore.supabaseUpdatePatenschaftUpdate(id, input);
  }
  const store = await readStore();
  const index = store.updates.findIndex((u) => u.id === id);
  if (index === -1) return null;

  const current = store.updates[index];
  const updated: PatenschaftUpdate = {
    ...current,
    ...input,
    updatedAt: new Date().toISOString(),
  };
  store.updates[index] = updated;
  await writeStore(store);
  return updated;
}

export async function deleteUpdate(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    return supabaseStore.supabaseDeleteUpdate(id);
  }
  const store = await readStore();
  const before = store.updates.length;
  store.updates = store.updates.filter((u) => u.id !== id);
  if (store.updates.length === before) return false;
  await writeStore(store);
  return true;
}

export function getUpdatesForPaten(
  updates: PatenschaftUpdate[],
  pate: PatenschaftPate
): PatenschaftUpdate[] {
  return updates
    .filter((update) => {
      if (update.waschbaerSlug !== pate.waschbaerSlug) return false;
      if (update.patronId && update.patronId !== pate.id) return false;
      return stufeMeetsMinimum(pate.stufeId, update.minStufe);
    })
    .sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}
