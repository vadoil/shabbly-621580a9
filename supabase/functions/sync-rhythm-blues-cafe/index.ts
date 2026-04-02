import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { DOMParser, Element } from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SOURCE_URL = "https://rhythm-blues-cafe.ru/";
const BAR_SLUG = "rhythm-blues-cafe";

interface ParsedEvent {
  title: string;
  dateStart: string; // ISO
  dateEnd: string | null;
  hall: string | null;
  ticketUrl: string | null;
  sourceUrl: string;
}

function parseEventsFromHTML(html: string): ParsedEvent[] {
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) return [];

  const events: ParsedEvent[] = [];
  const eventEls = doc.querySelectorAll(".eventon_list_event");

  for (let i = 0; i < eventEls.length; i++) {
    const el = eventEls[i] as Element;

    // Title from itemprop='name'
    const titleEl = el.querySelector("[itemprop='name']");
    const title = titleEl ? (titleEl.textContent || "").trim() : null;
    if (!title) continue;

    // Start date from itemprop='startDate'
    const startEl = el.querySelector("[itemprop='startDate']");
    const startContent = startEl?.getAttribute("content");
    if (!startContent) continue;

    // Parse date like "2026-4-2T20:00+3:00"
    const dateStart = parseEventDate(startContent);
    if (!dateStart) continue;

    // End date
    const endEl = el.querySelector("[itemprop='endDate']");
    const endContent = endEl?.getAttribute("content");
    const dateEnd = endContent ? parseEventDate(endContent) : null;

    // Hall from subtitle
    const subtitleEl = el.querySelector(".evcal_event_subtitle");
    const hallRaw = subtitleEl ? (subtitleEl.textContent || "").trim() : null;
    const hall = hallRaw ? normalizeHall(hallRaw) : null;

    // Source URL - event page link
    const linkEl = el.querySelector("a.desc_trig");
    const sourceUrl = linkEl?.getAttribute("href") || `${SOURCE_URL}#event-${i}`;

    // Ticket URL - ticketscloud link
    const ticketEl = el.querySelector("a.evo_clik_row[href*='ticketscloud']");
    const ticketUrl = ticketEl?.getAttribute("href")?.replace(/&amp;/g, "&") || null;

    events.push({
      title,
      dateStart,
      dateEnd,
      hall,
      ticketUrl,
      sourceUrl,
    });
  }

  return events;
}

function parseEventDate(content: string): string | null {
  // Format: "2026-4-2T20:00+3:00"
  const match = content.match(
    /(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{2})([+-]\d{1,2}:\d{2})/
  );
  if (!match) return null;

  const [, year, month, day, hours, minutes, tz] = match;
  // Pad month and day
  const m = month.padStart(2, "0");
  const d = day.padStart(2, "0");
  const h = hours.padStart(2, "0");
  // Pad timezone: "+3:00" → "+03:00"
  const tzMatch = tz.match(/([+-])(\d{1,2}):(\d{2})/);
  const tzFormatted = tzMatch
    ? `${tzMatch[1]}${tzMatch[2].padStart(2, "0")}:${tzMatch[3]}`
    : tz;

  const isoStr = `${year}-${m}-${d}T${h}:${minutes}:00${tzFormatted}`;
  const date = new Date(isoStr);
  return isNaN(date.getTime()) ? null : date.toISOString();
}

function normalizeHall(raw: string): string {
  const lower = raw.toLowerCase().replace(/\s+/g, " ").trim();
  if (lower.includes("большой")) return "Большой зал";
  if (lower.includes("малый")) return "Малый зал";
  return raw.trim();
}

async function fetchHTML(url: string): Promise<string | null> {
  try {
    const resp = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "ru-RU,ru;q=0.9",
      },
      signal: AbortSignal.timeout(20000),
    });
    if (!resp.ok) {
      console.error(`HTTP ${resp.status} for ${url}`);
      return null;
    }
    return await resp.text();
  } catch (e) {
    console.error(`Fetch error for ${url}:`, e);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    console.log("Fetching R&B Cafe homepage...");
    const html = await fetchHTML(SOURCE_URL);
    if (!html) {
      return new Response(
        JSON.stringify({ success: false, error: "Failed to fetch R&B Cafe" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const parsed = parseEventsFromHTML(html);
    console.log(`Parsed ${parsed.length} events from HTML`);

    // Get bar_id
    const { data: bar, error: barErr } = await supabase
      .from("bars")
      .select("id")
      .eq("slug", BAR_SLUG)
      .single();

    if (barErr || !bar) {
      return new Response(
        JSON.stringify({ success: false, error: "Bar not found in DB" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const syncedAt = new Date().toISOString();
    let inserted = 0;
    let updated = 0;
    let errors = 0;

    // Filter to next 180 days
    const now = new Date();
    const maxDate = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);

    for (const ev of parsed) {
      const evDate = new Date(ev.dateStart);
      if (evDate > maxDate) continue;

      const { data: existing } = await supabase
        .from("bar_events")
        .select("id")
        .eq("source_url", ev.sourceUrl)
        .maybeSingle();

      const payload = {
        bar_id: bar.id,
        title: ev.title,
        date_start: ev.dateStart,
        hall: ev.hall,
        ticket_url: ev.ticketUrl,
        source_url: ev.sourceUrl,
        last_synced_at: syncedAt,
        published: true,
      };

      if (existing) {
        const { error } = await supabase
          .from("bar_events")
          .update(payload)
          .eq("id", existing.id);
        if (error) {
          console.error("Update error:", error);
          errors++;
        } else {
          updated++;
        }
      } else {
        const { error } = await supabase
          .from("bar_events")
          .insert(payload);
        if (error) {
          console.error("Insert error:", error);
          errors++;
        } else {
          inserted++;
        }
      }
    }

    const result = {
      success: true,
      parsed: parsed.length,
      inserted,
      updated,
      errors,
      total: inserted + updated,
      synced_at: syncedAt,
    };

    console.log("Sync result:", result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Sync error:", err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
