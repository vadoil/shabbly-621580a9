// Generates public/sitemap.xml from static routes + published dynamic content.
// Runs on `predev` / `prebuild`.
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const BASE_URL = "https://shabbly.ru";
const SUPABASE_URL = "https://udidrfcqeyaohjykddgs.supabase.co";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaWRyZmNxZXlhb2hqeWtkZGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwODAxODAsImV4cCI6MjA5MDY1NjE4MH0.dGzztep6ylbqalpImgp5DNRIsxBCbiewClF7cIBhnT8";

async function q(path) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    });
    if (!r.ok) return [];
    return await r.json();
  } catch {
    return [];
  }
}

const staticRoutes = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/services", changefreq: "monthly", priority: "0.9" },
  { path: "/artists", changefreq: "weekly", priority: "0.9" },
  { path: "/music", changefreq: "weekly", priority: "0.8" },
  { path: "/events", changefreq: "daily", priority: "0.9" },
  { path: "/cases", changefreq: "monthly", priority: "0.7" },
  { path: "/gallery", changefreq: "weekly", priority: "0.7" },
  { path: "/news", changefreq: "daily", priority: "0.8" },
  { path: "/merch", changefreq: "weekly", priority: "0.6" },
  { path: "/bars", changefreq: "weekly", priority: "0.7" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/contacts", changefreq: "monthly", priority: "0.6" },
];

const [artists, releases, events, news, albums, merch] = await Promise.all([
  q("artists?select=slug,updated_at&published=eq.true"),
  q("releases?select=slug,updated_at&published=eq.true"),
  q("events?select=id,updated_at&published=eq.true"),
  q("news?select=slug,updated_at,published_at&published=eq.true"),
  q("gallery_albums?select=slug,updated_at&published=eq.true"),
  q("merch_products?select=slug,updated_at&published=eq.true"),
]);

const dyn = [
  ...artists.map((r) => ({ path: `/artists/${r.slug}`, lastmod: r.updated_at, changefreq: "monthly", priority: "0.7" })),
  ...releases.map((r) => ({ path: `/music/${r.slug}`, lastmod: r.updated_at, changefreq: "monthly", priority: "0.6" })),
  ...events.map((r) => ({ path: `/events/${r.id}`, lastmod: r.updated_at, changefreq: "weekly", priority: "0.7" })),
  ...news.map((r) => ({ path: `/news/${r.slug}`, lastmod: r.updated_at || r.published_at, changefreq: "monthly", priority: "0.6" })),
  ...albums.map((r) => ({ path: `/gallery/${r.slug}`, lastmod: r.updated_at, changefreq: "monthly", priority: "0.5" })),
  ...merch.map((r) => ({ path: `/merch/${r.slug}`, lastmod: r.updated_at, changefreq: "monthly", priority: "0.5" })),
].filter((e) => e.path && !e.path.endsWith("/undefined") && !e.path.endsWith("/null"));

const entries = [...staticRoutes, ...dyn];

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${new Date(e.lastmod).toISOString().split("T")[0]}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ].filter(Boolean).join("\n")
  ),
  `</urlset>`,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml: ${entries.length} entries (${dyn.length} dynamic)`);
