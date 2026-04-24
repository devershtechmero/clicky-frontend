import { getAuthUser } from "@/lib/auth";
import { Site } from "@/lib/types";

const CACHE_VERSION = "v1";
const CACHE_PREFIX = `sitewatch.sites.${CACHE_VERSION}`;

type CachedSites = {
  savedAt: number;
  sites: Site[];
};

function getCacheKey(): string {
  const userId = getAuthUser()?.id ?? "anonymous";
  return `${CACHE_PREFIX}.${userId}`;
}

function isSite(value: unknown): value is Site {
  if (typeof value !== "object" || value === null) return false;

  const site = value as Partial<Site>;
  return (
    typeof site.id === "string" &&
    typeof site.name === "string" &&
    typeof site.url === "string" &&
    typeof site.siteId === "string" &&
    typeof site.siteKey === "string" &&
    typeof site.bookmarkColor === "string" &&
    typeof site.onlineNow === "number" &&
    Array.isArray(site.dailyData)
  );
}

export function readCachedSites(): CachedSites | null {
  try {
    const raw = localStorage.getItem(getCacheKey());
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<CachedSites>;
    if (typeof parsed.savedAt !== "number" || !Array.isArray(parsed.sites)) {
      return null;
    }

    const sites = parsed.sites.filter(isSite);
    if (sites.length !== parsed.sites.length) return null;

    return {
      savedAt: parsed.savedAt,
      sites,
    };
  } catch {
    return null;
  }
}

export function writeCachedSites(sites: Site[]): void {
  try {
    const payload: CachedSites = {
      savedAt: Date.now(),
      sites,
    };

    localStorage.setItem(getCacheKey(), JSON.stringify(payload));
  } catch {
    // Cache writes can fail in private browsing or when storage is full.
  }
}

export function clearCachedSites(): void {
  try {
    localStorage.removeItem(getCacheKey());
  } catch {
    // Ignore storage failures; React Query still owns the live session cache.
  }
}
