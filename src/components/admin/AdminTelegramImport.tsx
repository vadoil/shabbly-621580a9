import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { photoUrl } from "@/lib/storage";
import { Upload, FileText, Music, Newspaper, Image, Loader2, CheckCircle } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ParsedMessage {
  message_id: string;
  datetime: string;
  text: string;
  photos: string[]; // filenames only
  thumbs: string[];
  links: string[];
  classification: "music" | "news";
  title: string;
}

interface ImportReport {
  releases: { inserted: number; skipped: number };
  news: { inserted: number; skipped: number };
  gallery: { inserted: number; skipped: number };
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[«»""]/g, "")
    .replace(/[^\w\sа-яё-]/gi, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 80);
}

function extractTitle(text: string): string {
  // Try quoted title first «…» or "…"
  const quoted = text.match(/[«""]([^»""]+)[»""]/);
  if (quoted) return quoted[1].trim();
  // First line up to 80 chars
  const firstLine = text.split("\n")[0] || "";
  return firstLine.substring(0, 80).trim() || "Без названия";
}

function classifyMessage(text: string, links: string[]): "music" | "news" {
  const musicKeywords = /релиз|трек|вышел|слушать|вышла|новый сингл|новый альбом|премьера/i;
  const musicDomains = /yandex|music\.apple|spotify|youtube|youtu\.be/i;
  const hasKeyword = musicKeywords.test(text);
  const hasMusicLink = links.some((l) => musicDomains.test(l));
  return hasKeyword && hasMusicLink ? "music" : "news";
}

function detectPlatform(url: string): string | null {
  if (/music\.yandex|yandex.*music/i.test(url)) return "yandex";
  if (/spotify/i.test(url)) return "spotify";
  if (/music\.apple/i.test(url)) return "apple";
  if (/youtube|youtu\.be/i.test(url)) return "youtube";
  return null;
}

// ── Parser ─────────────────────────────────────────────────────────────────────

function parseMessages(html: string): ParsedMessage[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const msgDivs = doc.querySelectorAll("div.message.default");
  const results: ParsedMessage[] = [];

  msgDivs.forEach((div) => {
    const msgId = div.getAttribute("id") || `msg-${results.length}`;
    // Date
    const dateEl = div.querySelector(".date") || div.querySelector(".pull_right.date");
    const datetime = dateEl?.getAttribute("title") || "";
    // Text
    const textEl = div.querySelector(".text");
    let text = "";
    if (textEl) {
      // Replace <br> with newlines
      const clone = textEl.cloneNode(true) as HTMLElement;
      clone.querySelectorAll("br").forEach((br) => br.replaceWith("\n"));
      text = clone.textContent?.trim() || "";
    }
    // Photos
    const photos: string[] = [];
    const thumbs: string[] = [];
    div.querySelectorAll("a.photo_wrap").forEach((a) => {
      const href = a.getAttribute("href") || "";
      if (href) {
        const filename = href.split("/").pop() || "";
        if (filename && !filename.includes("_thumb")) {
          photos.push(filename);
        }
        if (filename && filename.includes("_thumb")) {
          thumbs.push(filename);
        }
      }
    });
    // Also check for photo in media wrap
    div.querySelectorAll(".media_wrap a").forEach((a) => {
      const href = a.getAttribute("href") || "";
      if (href && href.includes("photo")) {
        const filename = href.split("/").pop() || "";
        if (filename && !photos.includes(filename) && !filename.includes("_thumb")) {
          photos.push(filename);
        }
      }
    });
    // Links
    const links: string[] = [];
    if (textEl) {
      textEl.querySelectorAll("a").forEach((a) => {
        const href = a.getAttribute("href") || "";
        if (href.startsWith("http")) links.push(href);
      });
    }

    if (!text && photos.length === 0) return;

    const classification = classifyMessage(text, links);
    const title = extractTitle(text);

    results.push({ message_id: msgId, datetime, text, photos, thumbs, links, classification, title });
  });

  return results;
}

// ── Component ──────────────────────────────────────────────────────────────────

const AdminTelegramImport = () => {
  const [messages, setMessages] = useState<ParsedMessage[]>([]);
  const [importing, setImporting] = useState(false);
  const [report, setReport] = useState<ImportReport | null>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);

  const handleFiles = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const allMsgs: ParsedMessage[] = [];
    const names: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const text = await files[i].text();
      names.push(files[i].name);
      allMsgs.push(...parseMessages(text));
    }
    // Deduplicate by message_id
    const seen = new Set<string>();
    const unique = allMsgs.filter((m) => {
      if (seen.has(m.message_id)) return false;
      seen.add(m.message_id);
      return true;
    });
    // Sort by date
    unique.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
    setMessages(unique);
    setFileNames(names);
    setReport(null);
  }, []);

  const doImport = async (mode: "all" | "music" | "news" | "gallery") => {
    setImporting(true);
    const rep: ImportReport = {
      releases: { inserted: 0, skipped: 0 },
      news: { inserted: 0, skipped: 0 },
      gallery: { inserted: 0, skipped: 0 },
    };

    try {
      // ── Gallery album ──
      let galleryAlbumId: string | null = null;
      if (mode === "all" || mode === "gallery") {
        const { data: existing } = await supabase
          .from("gallery_albums")
          .select("id")
          .eq("slug", "telegram")
          .maybeSingle();
        if (existing) {
          galleryAlbumId = existing.id;
        } else {
          const { data: created } = await supabase
            .from("gallery_albums")
            .insert({ slug: "telegram", title: "Telegram", published: true, sort_order: 99 })
            .select("id")
            .single();
          galleryAlbumId = created?.id ?? null;
        }
      }

      for (const msg of messages) {
        const coverFile = msg.photos[0] || null;
        const coverUrlValue = coverFile ? photoUrl(coverFile) : null;

        // ── Music ──
        if ((mode === "all" || mode === "music") && msg.classification === "music") {
          const sourceId = `tg_${msg.message_id}`;
          const { data: existingRel } = await supabase
            .from("releases")
            .select("id")
            .eq("source_id", sourceId)
            .maybeSingle();
          if (existingRel) {
            rep.releases.skipped++;
          } else {
            const dateStr = msg.datetime ? new Date(msg.datetime).toISOString().slice(0, 10) : null;
            const slug = slugify(msg.title) || `release-${Date.now()}`;
            const { data: rel } = await supabase
              .from("releases")
              .insert({
                title: msg.title,
                slug,
                release_date: dateStr,
                cover_url: coverUrlValue,
                description: msg.text.substring(0, 500),
                published: false,
                source_id: sourceId,
                source: "telegram_export",
              })
              .select("id")
              .single();
            if (rel) {
              // Create track
              const { data: track } = await supabase
                .from("tracks")
                .insert({ release_id: rel.id, title: msg.title, order_index: 1, published: false })
                .select("id")
                .single();

              // Platform links
              for (const link of msg.links) {
                const platform = detectPlatform(link);
                if (platform && (platform === "yandex" || platform === "spotify" || platform === "apple" || platform === "youtube")) {
                  await supabase.from("platform_links").insert({
                    release_id: rel.id,
                    platform: platform as "yandex" | "spotify" | "apple" | "youtube",
                    url: link,
                  });
                  // Also track-level link
                  if (track) {
                    await supabase.from("track_links").insert({
                      track_id: track.id,
                      platform,
                      url: link,
                    });
                  }
                }
              }
              rep.releases.inserted++;
            }
          }
        }

        // ── News ──
        if ((mode === "all" || mode === "news") && msg.classification === "news" && msg.text.length > 10) {
          const sourceId = `tg_${msg.message_id}`;
          const { data: existingNews } = await supabase
            .from("news")
            .select("id")
            .eq("source_id", sourceId)
            .maybeSingle();
          if (existingNews) {
            rep.news.skipped++;
          } else {
            const dateStr = msg.datetime ? new Date(msg.datetime).toISOString() : new Date().toISOString();
            const slug = slugify(msg.title + "-" + dateStr.slice(0, 10)) || `news-${Date.now()}`;
            await supabase.from("news").insert({
              title: msg.title,
              slug,
              content: msg.text,
              cover_url: coverUrlValue,
              published: false,
              published_at: dateStr,
              source_id: sourceId,
              source: "telegram_export",
            });
            rep.news.inserted++;
          }
        }

        // ── Gallery ──
        if ((mode === "all" || mode === "gallery") && galleryAlbumId && msg.photos.length > 0) {
          for (const photo of msg.photos) {
            const sourceId = `tg_${msg.message_id}_${photo}`;
            const { data: existingItem } = await supabase
              .from("gallery_items")
              .select("id")
              .eq("source_id", sourceId)
              .maybeSingle();
            if (existingItem) {
              rep.gallery.skipped++;
            } else {
              await supabase.from("gallery_items").insert({
                album_id: galleryAlbumId,
                image_url: photoUrl(photo),
                caption: msg.title || "",
                published: false,
                source_id: sourceId,
                source: "telegram_export",
              });
              rep.gallery.inserted++;
            }
          }
        }
      }
    } catch (err) {
      console.error("Import error:", err);
    }
    setReport(rep);
    setImporting(false);
  };

  const musicCount = messages.filter((m) => m.classification === "music").length;
  const newsCount = messages.filter((m) => m.classification === "news").length;
  const photoCount = messages.reduce((s, m) => s + m.photos.length, 0);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Импорт из Telegram</h2>

      {/* Upload */}
      <label className="flex items-center gap-3 cursor-pointer rounded-lg border-2 border-dashed border-border p-6 hover:border-primary transition-colors">
        <Upload size={24} className="text-muted-foreground" />
        <div>
          <p className="text-sm font-medium text-foreground">Выберите messages.html / messages2.html</p>
          <p className="text-xs text-muted-foreground">Можно выбрать несколько файлов</p>
        </div>
        <input type="file" accept=".html" multiple onChange={handleFiles} className="hidden" />
      </label>

      {fileNames.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Загружено: {fileNames.join(", ")} — {messages.length} сообщений
        </p>
      )}

      {/* Stats */}
      {messages.length > 0 && (
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm">
            <Music size={14} className="text-primary" /> Релизов: {musicCount}
          </div>
          <div className="flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm">
            <Newspaper size={14} className="text-primary" /> Новостей: {newsCount}
          </div>
          <div className="flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm">
            <Image size={14} className="text-primary" /> Фото: {photoCount}
          </div>
        </div>
      )}

      {/* Preview */}
      {messages.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Предпросмотр (первые 20)</h3>
          <div className="max-h-96 overflow-y-auto space-y-1 rounded-md border border-border">
            {messages.slice(0, 20).map((m) => (
              <div key={m.message_id} className="flex items-start gap-3 p-3 border-b border-border last:border-0">
                <span
                  className={`shrink-0 mt-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                    m.classification === "music"
                      ? "bg-primary/20 text-primary"
                      : "bg-accent/20 text-accent-foreground"
                  }`}
                >
                  {m.classification === "music" ? "муз" : "нов"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">{m.datetime}</p>
                  <p className="text-sm text-foreground truncate">{m.text.substring(0, 120)}</p>
                  <p className="text-xs text-muted-foreground">
                    📷 {m.photos.length} фото · 🔗 {m.links.length} ссылок
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Import buttons */}
      {messages.length > 0 && !importing && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => doImport("all")}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Импортировать всё
          </button>
          <button
            onClick={() => doImport("news")}
            className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/80"
          >
            Только Новости
          </button>
          <button
            onClick={() => doImport("music")}
            className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/80"
          >
            Только Музыку
          </button>
          <button
            onClick={() => doImport("gallery")}
            className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/80"
          >
            Только Галерею
          </button>
        </div>
      )}

      {importing && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 size={16} className="animate-spin" /> Импорт…
        </div>
      )}

      {/* Report */}
      {report && (
        <div className="rounded-md border border-border bg-card p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <CheckCircle size={16} className="text-green-500" /> Импорт завершён
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Релизы</p>
              <p className="text-foreground">+{report.releases.inserted} / пропущено {report.releases.skipped}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Новости</p>
              <p className="text-foreground">+{report.news.inserted} / пропущено {report.news.skipped}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Галерея</p>
              <p className="text-foreground">+{report.gallery.inserted} / пропущено {report.gallery.skipped}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTelegramImport;
