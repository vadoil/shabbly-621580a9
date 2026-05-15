// Original Supabase host (used everywhere in the DB / storage URLs).
const SUPABASE_HOST = "udidrfcqeyaohjykddgs.supabase.co";

// In production we route Supabase traffic through our own nginx proxy
// (api.shabbly.ru) to bypass Supabase being blocked in Russia.
// In dev / Lovable preview we keep the original host.
const PROXY_HOST =
  import.meta.env.PROD ? "api.shabbly.ru" : SUPABASE_HOST;

const PUBLIC_STORAGE_BASE = `https://${SUPABASE_HOST}/storage/v1/object/public`;

/**
 * Rewrites any direct Supabase URL to go through our proxy in production.
 * Safe to call on any string (including non-supabase URLs, empty values).
 */
export function proxify(url?: string | null): string {
  if (!url) return url || "";
  if (PROXY_HOST === SUPABASE_HOST) return url;
  return url.replace(SUPABASE_HOST, PROXY_HOST);
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
