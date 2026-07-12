import { promises as fs } from "fs";
import path from "path";

export type KeyRecord = {
  email: string;
  enabled?: boolean;
  expiresAt?: string | null;
  refreshToken?: string | null;
  demo?: boolean;
};

export type KeyStore = Record<string, KeyRecord>;

function normalizeKey(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

async function readFileStore(): Promise<KeyStore> {
  const file = path.join(process.cwd(), "data", "keys.json");
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as KeyStore;
  } catch {
    return {};
  }
}

export async function loadKeys(): Promise<KeyStore> {
  if (process.env.KEYS_JSON?.trim()) {
    try {
      return JSON.parse(process.env.KEYS_JSON) as KeyStore;
    } catch {
      // fall through to file
    }
  }
  return readFileStore();
}

export async function resolveKey(cdKey: string): Promise<{ key: string; record: KeyRecord } | null> {
  const store = await loadKeys();
  const normalized = normalizeKey(cdKey);

  // exact / case-insensitive match
  for (const [k, record] of Object.entries(store)) {
    if (normalizeKey(k) === normalized) {
      return { key: k, record };
    }
  }
  return null;
}
