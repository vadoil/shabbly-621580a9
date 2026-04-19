const PUBLIC_STORAGE_BASE = "https://udidrfcqeyaohjykddgs.supabase.co/storage/v1/object/public";

export function getPublicStorageUrl(path: string): string {
  if (!path) return path;
  if (path.startsWith("http")) return path;
  // Local public assets (e.g. "/news/foo.jpg" served from /public)
  if (path.startsWith("/")) return path;
  return `${PUBLIC_STORAGE_BASE}/${path}`;
}

export function photoUrl(filename: string): string {
  return `${PUBLIC_STORAGE_BASE}/covers/photos/${filename}`;
}

export function thumbUrl(filename: string): string {
  return `${PUBLIC_STORAGE_BASE}/covers/photos/${filename}`;
}
