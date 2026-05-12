import { Store } from "@tanstack/store";
import { z } from "zod";
import { storageKey } from "#/shared/lib/storageKey";

const STORAGE_KEY = storageKey("asset_metadata");
const STORAGE_TS_KEY = storageKey("asset_metadata_ts");
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

const assetMetadataSchema = z.object({
  symbol: z.string().nullable(),
  decimals: z.number().nullable(),
});

const assetMetadataMapSchema = z.record(z.string(), assetMetadataSchema);

export type AssetMetadata = z.infer<typeof assetMetadataSchema>;

type AssetMetadataMap = Record<string, AssetMetadata>;

const DEFAULT_TOKENS: AssetMetadataMap = {
  base: { symbol: "GBYTE", decimals: 9 },
};

function isCacheValid(): boolean {
  try {
    const ts = localStorage.getItem(STORAGE_TS_KEY);
    if (!ts) return false;
    return Date.now() - Number(ts) < CACHE_TTL;
  } catch {
    return false;
  }
}

function loadFromStorage(): AssetMetadataMap {
  try {
    if (!isCacheValid()) return { ...DEFAULT_TOKENS };
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_TOKENS };
    const parsed = assetMetadataMapSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return { ...DEFAULT_TOKENS };
    return { ...DEFAULT_TOKENS, ...parsed.data };
  } catch {}
  return { ...DEFAULT_TOKENS };
}

function saveToStorage(state: AssetMetadataMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    localStorage.setItem(STORAGE_TS_KEY, String(Date.now()));
  } catch {}
}

export const assetMetadataStore = new Store<AssetMetadataMap>(
  loadFromStorage(),
);

assetMetadataStore.subscribe(() => {
  saveToStorage(assetMetadataStore.state);
});

export const hasAssetMetadata = (asset: string): boolean => {
  const entry = assetMetadataStore.state[asset] as AssetMetadata | undefined;
  return (
    entry !== undefined && entry.symbol !== null && entry.decimals !== null
  );
};

export const setAssetMetadata = (asset: string, metadata: AssetMetadata) => {
  assetMetadataStore.setState((prev) => ({
    ...prev,
    [asset]: metadata,
  }));
};
