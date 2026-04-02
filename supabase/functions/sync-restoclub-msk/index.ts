import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { DOMParser, Element } from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const BASE_URL = "https://www.restoclub.ru/msk/search/bary-moskvy-s-shou-programmoj";
const MAX_PAGES = 10;
const DELAY_MIN = 300;
const DELAY_MAX = 800;
const SOURCE = "restoclub";

const RU_MONTHS: Record<string, number> = {
  января: 0, февраля: 1, марта: 2, апреля: 3, мая: 4, июня: 5,
  июля: 6, августа: 7, сентября: 8, октября: 9, ноября: 10, декабря: 11,
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function randomDelay() {
  return DELAY_MIN + Math.random() * (DELAY_MAX - DELAY_MIN);
}

async function hashString(str: string): Promise<string> {
  const data = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 24);
}

function getMoscowNow(): Date {
  // UTC+3
  const now = new Date();
  return new Date(now.getTime() + 3 * 60 * 60 * 1000);
}

function getMonthBounds(year: number, month: number) {
  // month is 1-based; returns UTC timestamps for Moscow midnight boundaries
  const start = new Date(Date.UTC(year, month - 1, 1, -3, 0, 0)); // midnight MSK = 21:00 UTC prev day
  const lastDay = new Date(year, month, 0).getDate();
  const end = new Date(Date.UTC(year, month - 1, lastDay, 20, 59, 59)); // 23:59:59 MSK
  return { start, end, lastDay };
}

function parseRuDate(text: string, targetYear: number, targetMonth: number): { date: Date | null; assumptions: string[] } {
  const assumptions: string[] = [];
  const clean = text.toLowerCase().trim();

  // "сегодня" / "завтра" — convert to actual date
  const mskNow = getMoscowNow();
  let baseDate: Date | null = null;

  if (clean.includes("сегодня")) {
    baseDate = new Date(mskNow);
  } else if (clean.includes("завтра")) {
    baseDate = new Date(mskNow);
    baseDate.setDate(baseDate.getDate() + 1);
  }

  if (baseDate) {
    // Extract time if present
    const timeMatch = clean.match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      baseDate.setHours(parseInt(timeMatch[1]), parseInt(timeMatch[2]), 0, 0);
    } else {
      baseDate.setHours(19, 0, 0, 0);
      assumptions.push("default_time_19:00");
    }
    // Convert from MSK to UTC
    const utc = new Date(baseDate.getTime() - 3 * 60 * 60 * 1000);
    return { date: utc, assumptions };
  }

  // "5 апреля в 21:00" or "5 апреля"
  const dateMatch = clean.match(/(\d{1,2})\s+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)/);
  if (dateMatch) {
    const day = parseInt(dateMatch[1]);
    const monthIdx = RU_MONTHS[dateMatch[2]];
    
    // Determine year: if parsed month matches target or is close
    let year = targetYear;
    if (monthIdx + 1 !== targetMonth) {
      // Could be next year's January parsed in December context, etc.
      if (monthIdx + 1 < targetMonth && targetMonth - (monthIdx + 1) > 6) {
        year = targetYear + 1;
      }
    }

    const timeMatch = clean.match(/(\d{1,2}):(\d{2})/);
    let hours = 19, minutes = 0;
    if (timeMatch) {
      hours = parseInt(timeMatch[1]);
      minutes = parseInt(timeMatch[2]);
    } else {
      assumptions.push("default_time_19:00");
    }

    const utc = new Date(Date.UTC(year, monthIdx, day, hours - 3, minutes, 0));
    return { date: utc, assumptions };
  }

  return { date: null, assumptions: ["unparseable"] };
}

async function fetchPage(url: string, retries = 3): Promise<string | null> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const resp = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.5",
        },
        signal: AbortSignal.timeout(15000),
      });
      if (resp.ok) return await resp.text();
      console.warn(`HTTP ${resp.status} for ${url}, attempt ${attempt + 1}`);
    } catch (e) {
      console.warn(`Fetch error for ${url}, attempt ${attempt + 1}:`, e);
    }
    if (attempt < retries - 1) await sleep(1000 * (attempt + 1));
  }
  return null;
}

interface ParsedVenue {
  name: string;
  url: string;
  address: string | null;
  metro: string | null;
  events: { title: string; dateText: string; url: string }[];
}

function parseSearchPage(html: string): { venues: ParsedVenue[]; hasNext: boolean } {
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) return { venues: [], hasNext: false };

  const venues: ParsedVenue[] = [];

  // Try multiple selectors for venue cards
  const cards = doc.querySelectorAll(".search-place-card, .place-card, .search_results_item, article, .card");

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i] as Element;
    const nameEl = card.querySelector("h2 a, h3 a, .place-card__title a, .search-place-card__title a, a[class*='title']");
    if (!nameEl) continue;

    const name = (nameEl.textContent || "").trim();
    const venueUrl = nameEl.getAttribute("href") || "";
    const fullUrl = venueUrl.startsWith("http") ? venueUrl : `https://www.restoclub.ru${venueUrl}`;

    const addressEl = card.querySelector(".address, .place-card__address, [class*='address'], .search-place-card__address");
    const address = addressEl ? (addressEl.textContent || "").trim() : null;

    const metroEl = card.querySelector(".metro, [class*='metro'], .search-place-card__metro");
    const metro = metroEl ? (metroEl.textContent || "").trim() : null;

    // Look for event announcements within the card
    const eventEls = card.querySelectorAll(".event, .announcement, [class*='event'], [class*='announce'], .search-place-card__event, li");
    const events: { title: string; dateText: string; url: string }[] = [];

    for (let j = 0; j < eventEls.length; j++) {
      const evEl = eventEls[j] as Element;
      const text = (evEl.textContent || "").trim();
      if (!text || text.length < 3) continue;

      // Try to find a date pattern in the text
      const hasDate = /(\d{1,2}\s+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)|сегодня|завтра)/i.test(text);
      if (!hasDate && events.length > 0) continue; // skip non-date items if we already have some

      const evLink = evEl.querySelector("a");
      const evUrl = evLink?.getAttribute("href") || "";
      const evFullUrl = evUrl ? (evUrl.startsWith("http") ? evUrl : `https://www.restoclub.ru${evUrl}`) : fullUrl;

      // Split date and title
      const dateMatch = text.match(/(сегодня|завтра|\d{1,2}\s+(?:января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)(?:\s+в\s+\d{1,2}:\d{2})?)/i);
      const dateText = dateMatch ? dateMatch[0] : text.slice(0, 30);
      const title = text.replace(dateText, "").trim() || name;

      events.push({ title: title || name, dateText, url: evFullUrl });
    }

    // If no structured events found, create one generic entry for the venue
    if (events.length === 0) {
      events.push({ title: `Шоу-программа: ${name}`, dateText: "", url: fullUrl });
    }

    venues.push({ name, url: fullUrl, address, metro, events });
  }

  // Check for next page link
  const hasNext = !!doc.querySelector("a.next, a[rel='next'], .pagination__next, [class*='next']");

  return { venues, hasNext };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Determine target month
    let year: number, month: number;
    const url = new URL(req.url);
    const qYear = url.searchParams.get("year");
    const qMonth = url.searchParams.get("month");

    if (qYear && qMonth) {
      year = parseInt(qYear);
      month = parseInt(qMonth);
    } else if (req.method === "POST") {
      try {
        const body = await req.json();
        year = body.year;
        month = body.month;
      } catch {
        year = 0;
        month = 0;
      }
    } else {
      year = 0;
      month = 0;
    }

    if (!year || !month) {
      const msk = getMoscowNow();
      if (msk.getUTCDate() >= 24) {
        // Next month
        const nextMonth = new Date(msk);
        nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);
        year = nextMonth.getUTCFullYear();
        month = nextMonth.getUTCMonth() + 1;
      } else {
        year = msk.getUTCFullYear();
        month = msk.getUTCMonth() + 1;
      }
    }

    const { start: monthStart, end: monthEnd } = getMonthBounds(year, month);
    const syncStartedAt = new Date().toISOString();

    console.log(`Syncing restoclub for ${year}-${String(month).padStart(2, "0")}`);

    // Crawl pages
    const allVenues: ParsedVenue[] = [];
    let page = 1;
    let hasNext = true;

    while (hasNext && page <= MAX_PAGES) {
      const pageUrl = page === 1 ? BASE_URL : `${BASE_URL}?page=${page}`;
      console.log(`Fetching page ${page}: ${pageUrl}`);
      
      const html = await fetchPage(pageUrl);
      if (!html) {
        console.warn(`Failed to fetch page ${page}, stopping.`);
        break;
      }

      const result = parseSearchPage(html);
      allVenues.push(...result.venues);
      hasNext = result.hasNext;
      page++;

      if (hasNext) await sleep(randomDelay());
    }

    console.log(`Found ${allVenues.length} venues across ${page - 1} pages`);

    // Upsert venues and events
    let insertedVenues = 0, updatedVenues = 0;
    let insertedEvents = 0, updatedEvents = 0, skippedEvents = 0;

    for (const venue of allVenues) {
      const venueSourceId = await hashString(`restoclub:${venue.url}`);

      // Upsert venue
      const { data: venueData, error: venueErr } = await supabase
        .from("venues_external")
        .upsert({
          source: SOURCE,
          source_id: venueSourceId,
          name: venue.name,
          url: venue.url,
          address: venue.address,
          metro: venue.metro,
          last_seen_at: syncStartedAt,
        }, { onConflict: "source,source_id" })
        .select("id")
        .single();

      if (venueErr) {
        console.error(`Venue upsert error for ${venue.name}:`, venueErr);
        continue;
      }

      insertedVenues++;

      // Process events
      for (const ev of venue.events) {
        if (!ev.dateText) {
          skippedEvents++;
          continue;
        }

        const { date, assumptions } = parseRuDate(ev.dateText, year, month);
        if (!date) {
          skippedEvents++;
          continue;
        }

        // Check if event falls within target month
        if (date < monthStart || date > monthEnd) {
          skippedEvents++;
          continue;
        }

        const eventSourceId = await hashString(`${venue.url}:${ev.dateText}:${ev.title}`);

        const { error: evErr } = await supabase
          .from("bar_events_external")
          .upsert({
            source: SOURCE,
            source_id: eventSourceId,
            venue_id: venueData.id,
            title: ev.title,
            date_start: date.toISOString(),
            date_text_raw: ev.dateText,
            url: ev.url,
            city: "Москва",
            last_seen_at: syncStartedAt,
          }, { onConflict: "source,source_id" });

        if (evErr) {
          console.error(`Event upsert error:`, evErr);
        } else {
          insertedEvents++;
        }
      }
    }

    // Mark stale events for this month (last_seen_at < sync start)
    const { data: staleEvents } = await supabase
      .from("bar_events_external")
      .select("id")
      .eq("source", SOURCE)
      .gte("date_start", monthStart.toISOString())
      .lte("date_start", monthEnd.toISOString())
      .lt("last_seen_at", syncStartedAt);

    const staleCount = staleEvents?.length || 0;

    const result = {
      success: true,
      target: `${year}-${String(month).padStart(2, "0")}`,
      pages_crawled: page - 1,
      venues_found: allVenues.length,
      events_upserted: insertedEvents,
      events_skipped: skippedEvents,
      stale_events: staleCount,
      synced_at: syncStartedAt,
    };

    console.log("Sync result:", result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Sync error:", err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
