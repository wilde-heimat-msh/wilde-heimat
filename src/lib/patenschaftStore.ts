import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type {
  PatenschaftPate,
  PatenschaftStore,
  PatenschaftUpdate,
} from "@/types/patenschaftPortal";
import { normalizeAccessCode, stufeMeetsMinimum } from "@/lib/patenschaftTier";

const DATA_DIR = path.join(process.cwd(), "data/patenschaft");
const STORE_FILE = path.join(DATA_DIR, "store.json");

const EMPTY_STORE: PatenschaftStore = { paten: [], updates: [] };

async function ensureStore(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(path.join(process.cwd(), "public/paten-updates"), { recursive: true });

  try {
    await readFile(STORE_FILE, "utf8");
  } catch {
    await writeFile(STORE_FILE, JSON.stringify(EMPTY_STORE, null, 2), "utf8");
  }
}

async function readStore(): Promise<PatenschaftStore> {
  await ensureStore();
  const raw = await readFile(STORE_FILE, "utf8");
  const parsed = JSON.parse(raw) as PatenschaftStore;
  return {
    paten: parsed.paten ?? [],
    updates: parsed.updates ?? [],
  };
}

async function writeStore(store: PatenschaftStore): Promise<void> {
  await ensureStore();
  await writeFile(STORE_FILE, JSON.stringify(store, null, 2), "utf8");
}

export async function getPatenschaftStore(): Promise<PatenschaftStore> {
  return readStore();
}

export async function getPatenByAccessCode(code: string): Promise<PatenschaftPate | null> {
  const normalized = normalizeAccessCode(code);
  const store = await readStore();
  return (
    store.paten.find(
      (p) => p.active && normalizeAccessCode(p.accessCode) === normalized
    ) ?? null
  );
}

export async function getPatenById(id: string): Promise<PatenschaftPate | null> {
  const store = await readStore();
  return store.paten.find((p) => p.id === id) ?? null;
}

export async function listPaten(): Promise<PatenschaftPate[]> {
  const store = await readStore();
  return [...store.paten].sort((a, b) => a.name.localeCompare(b.name, "de"));
}

export async function listUpdates(): Promise<PatenschaftUpdate[]> {
  const store = await readStore();
  return [...store.updates].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function isAccessCodeTaken(code: string, excludeId?: string): Promise<boolean> {
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
