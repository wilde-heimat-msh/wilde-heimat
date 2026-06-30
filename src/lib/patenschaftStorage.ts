import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { PatenschaftStore } from "@/types/patenschaftPortal";

const DATA_DIR = path.join(process.cwd(), "data/patenschaft");
const STORE_FILE = path.join(DATA_DIR, "store.json");

const EMPTY_STORE: PatenschaftStore = { paten: [], updates: [] };

export async function loadPatenschaftStore(): Promise<PatenschaftStore> {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await readFile(STORE_FILE, "utf8");
    const parsed = JSON.parse(raw) as PatenschaftStore;
    return {
      paten: parsed.paten ?? [],
      updates: parsed.updates ?? [],
    };
  } catch {
    await writeFile(STORE_FILE, JSON.stringify(EMPTY_STORE, null, 2), "utf8");
    return EMPTY_STORE;
  }
}

export async function savePatenschaftStore(store: PatenschaftStore): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(STORE_FILE, JSON.stringify(store, null, 2), "utf8");
}
