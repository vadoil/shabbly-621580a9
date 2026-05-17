// Original Supabase host (used everywhere in the DB / storage URLs).
const SUPABASE_HOST = "udidrfcqeyaohjykddgs.supabase.co";

const PUBLIC_STORAGE_BASE = `https://${SUPABASE_HOST}/storage/v1/object/public`;
const STORAGE_PUBLIC_PREFIX = "/storage/v1/object/public";

/**
 * Rewrites public storage URLs to local VPS-served files in production.
 * Safe to call on any string (including non-supabase URLs, empty values).
 */
export function proxify(url?: string | null): string {
  if (!url) return url || "";
  if (!import.meta.env.PROD) return url;

  const directStorageUrl = `${PUBLIC_STORAGE_BASE}/`;
  if (url.startsWith(directStorageUrl)) {
    return `${STORAGE_PUBLIC_PREFIX}/${url.slice(directStorageUrl.length)}`;
  }

  return url;
}

export function getPublicStorageUrl(path: string): string {
  if (!path) return path;
  if (path.startsWith("http")) return proxify(path);
  // Local public assets (e.g. "/news/foo.jpg" served from /public)
  if (path.startsWith("/")) return path;
  return proxify(`${PUBLIC_STORAGE_BASE}/${path}`);
}

export function photoUrl(filename: string): string {
  return proxify(`${PUBLIC_STORAGE_BASE}/covers/photos/${filename}`);
}

export function thumbUrl(filename: string): string {
  return proxify(`${PUBLIC_STORAGE_BASE}/covers/photos/${filename}`);
}
