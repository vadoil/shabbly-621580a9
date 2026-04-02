const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

export function getPublicStorageUrl(path: string): string {
  if (path.startsWith("http")) return path;
  // Ensure path starts with /
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SUPABASE_URL}${cleanPath}`;
}
