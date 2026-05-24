import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const BOT = Deno.env.get('TELEGRAM_BOT_TOKEN');
const CHAT = Deno.env.get('TELEGRAM_CHAT_ID');

function esc(s: unknown): string {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function fmtLines(obj: Record<string, unknown>): string {
  return Object.entries(obj)
    .filter(([, v]) => v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0))
    .map(([k, v]) => {
      const val = Array.isArray(v) ? v.join(', ') : v;
      return `<b>${esc(k)}:</b> ${esc(val)}`;
    })
    .join('\n');
}

function buildMessage(type: string, data: Record<string, any>): string {
  switch (type) {
    case 'artist_application':
      return `🎤 <b>Новая заявка артиста</b>\n\n` + fmtLines({
        'Имя/проект': data.name,
        'Название проекта': data.project_name,
        'Контакт': data.contact,
        'Город': data.city,
        'Города': data.cities,
        'Жанры': data.genres,
        'Опыт': data.experience,
        'О себе': data.about,
        'Ожидания': data.expectations,
        'Музыка': (data.music_links || []).map((l: any) => l?.url || l).join('\n'),
        'Видео': (data.video_links || []).map((l: any) => l?.url || l).join('\n'),
        'Соцсети': (data.social_links || []).map((l: any) => l?.url || l).join('\n'),
      });
    case 'event_inquiry':
      return `📅 <b>Новая заявка на ивент</b>\n\n` + fmtLines({
        'Имя': data.name,
        'Компания': data.company,
        'Контакт': data.contact,
        'Город': data.city,
        'Формат': data.format,
        'Дата': data.event_date,
        'Бюджет': data.budget,
        'Артист': data.artist_name || data.artist_id,
        'Комментарий': data.comment,
      });
    case 'ticket_request':
      return `🎟 <b>Заявка на билеты</b>\n\n` + fmtLines({
        'Имя': data.name,
        'Контакт': data.contact,
        'Кол-во': data.qty,
        'Событие': data.event_title || data.event_id,
        'Комментарий': data.comment,
      });
    case 'merch_request':
      return `👕 <b>Заявка на мерч</b>\n\n` + fmtLines({
        'Имя': data.name,
        'Контакт': data.contact,
        'Товар': data.product_title || data.product_id,
        'Комментарий': data.comment,
      });
    default:
      return `📩 <b>Новая заявка (${esc(type)})</b>\n\n` + fmtLines(data);
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    if (!BOT || !CHAT) {
      return new Response(JSON.stringify({ error: 'Telegram is not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const { type, data } = body || {};
    if (!type || typeof type !== 'string') {
      return new Response(JSON.stringify({ error: 'type is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const text = buildMessage(type, data || {});
    const tgRes = await fetch(`https://api.telegram.org/bot${BOT}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const tgJson = await tgRes.json().catch(() => ({}));
    if (!tgRes.ok || !tgJson.ok) {
      console.error('Telegram error', tgRes.status, tgJson);
      return new Response(JSON.stringify({ error: 'Telegram send failed', details: tgJson }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('notify-telegram error', e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
