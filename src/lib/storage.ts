const PUBLIC_STORAGE_BASE = "https://udidrfcqeyaohjykddgs.supabase.co/storage/v1/object/public";

export function getPublicStorageUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${PUBLIC_STORAGE_BASE}${cleanPath}`;
}

export function photoUrl(filename: string): string {
  return `${PUBLIC_STORAGE_BASE}/covers/photos/${filename}`;
}

export function thumbUrl(filename: string): string {
  return `${PUBLIC_STORAGE_BASE}/covers/photos/${filename}`;
}
