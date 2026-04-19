import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { usePublishedEvents } from "@/hooks/use-data";
import { useState, useMemo } from "react";
import TicketRequestModal from "@/components/TicketRequestModal";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import { MapPin, Calendar as CalendarIcon, Ticket, X, Building2, Sparkles, ArrowRight } from "lucide-react";
import { format, isAfter, startOfDay } from "date-fns";
import { ru } from "date-fns/locale";

// Fallback poster pool for events without uploaded cover
const POSTER_POOL = [
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200",
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200",
  "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1200",
  "https://images.unsplash.com/photo-1501612780327-45045538702b?w=1200",
];

const posterFor = (event: any, idx: number) =>
  event.cover_url || POSTER_POOL[(event.id.charCodeAt(0) + idx) % POSTER_POOL.length];

const EventsPage = () => {
  const { data: events, isLoading } = usePublishedEvents();
  const [cityFilter, setCityFilter] = useState("");
  const [ticketEvent, setTicketEvent] = useState<{ id: string; title: string } | null>(null);

  const cities = useMemo(
    () => [...new Set((events || []).map((e: any) => e.city).filter(Boolean))].sort(),
    [events]
  );

  const filtered = useMemo(() => {
    let list = events || [];
    if (cityFilter) list = list.filter((e: any) => e.city === cityFilter);
    return list;
  }, [events, cityFilter]);

  const upcoming = useMemo(
    () => filtered.filter((e: any) => isAfter(new Date(e.date_start), startOfDay(new Date()))),
    [filtered]
  );
  const past = useMemo(
    () => filtered.filter((e: any) => !isAfter(new Date(e.date_start), startOfDay(new Date()))),
    [filtered]
  );

  return (
    <Layout>
      <SEO
        title="Афиша концертов и мероприятий SHABBLY Agency"
        description="Ближайшие концерты и выступления артистов SHABBLY: даты, площадки, билеты. Афиша по всей России — Москва, Санкт-Петербург, Сочи и другие города."
        canonical="/events"
      />
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-background" />
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div className="container relative py-16 md:py-20">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-primary" size={28} />
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-bold">Афиша</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight">
            События агентства
          </h1>
          <p className="mt-4 text-base text-muted-foreground max-w-2xl">
            Концерты, шоу-программы и выступления артистов. Выбирайте дату — мы организуем визит.
          </p>

          {cities.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={() => setCityFilter("")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  !cityFilter ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                Все города
              </button>
              {cities.map((c) => (
                <button
                  key={c}
                  onClick={() => setCityFilter(c)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                    cityFilter === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
              {cityFilter && (
                <button onClick={() => setCityFilter("")} className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <X size={12} /> Сбросить
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="container py-12 space-y-12">
        {/* UPCOMING */}
        <div className="space-y-6">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl md:text-3xl font-bold">Ближайшие концерты</h2>
            <span className="text-sm text-muted-foreground">{upcoming.length}</span>
          </div>

          {isLoading ? (
            <LoadingSkeleton variant="list" count={3} />
          ) : upcoming.length > 0 ? (
            <div className="space-y-6">
              {upcoming.map((e: any, i: number) => (
                <PosterEventCard key={e.id} event={e} index={i} onTicket={() => setTicketEvent({ id: e.id, title: e.title })} />
              ))}
            </div>
          ) : (
            <EmptyState icon={CalendarIcon} title="Нет ближайших событий" description="Загляните позже или подпишитесь на обновления" />
          )}
        </div>

        {/* PAST */}
        {past.length > 0 && (
          <div className="space-y-6 opacity-70">
            <div className="flex items-end justify-between">
              <h2 className="font-display text-xl font-bold text-muted-foreground">Прошедшие</h2>
              <span className="text-sm text-muted-foreground">{past.length}</span>
            </div>
            <div className="space-y-4">
              {past.slice(0, 5).map((e: any, i: number) => (
                <PosterEventCard key={e.id} event={e} index={i} compact onTicket={() => setTicketEvent({ id: e.id, title: e.title })} />
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="rounded-2xl border border-border/60 bg-gradient-to-r from-card via-card to-primary/5 p-6 md:p-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Building2 size={28} className="text-primary shrink-0" />
            <div>
              <p className="font-display text-lg font-bold">Хотите своё мероприятие?</p>
              <p className="text-sm text-muted-foreground mt-0.5">Подберём артиста, площадку и техническое оснащение.</p>
            </div>
          </div>
          <a href="/contacts" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] transition-all hover:scale-105">
            Оставить заявку
          </a>
        </div>
      </section>

      <TicketRequestModal open={!!ticketEvent} eventId={ticketEvent?.id} eventTitle={ticketEvent?.title} onClose={() => setTicketEvent(null)} />
    </Layout>
  );
};

const PosterEventCard = ({
  event,
  index,
  compact,
  onTicket,
}: {
  event: any;
  index: number;
  compact?: boolean;
  onTicket: () => void;
}) => {
  const date = new Date(event.date_start);
  const poster = posterFor(event, index);

  return (
    <article
      className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_50px_-10px_hsl(var(--primary)/0.4)] animate-fade-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Link to={`/events/${event.id}`} className="absolute inset-0 z-0" aria-label={event.title} />
      <div className={`relative grid ${compact ? "md:grid-cols-[180px_1fr]" : "md:grid-cols-[280px_1fr_auto]"} gap-0 pointer-events-none`}>
        {/* DATE BLOCK */}
        <div className="relative flex flex-col justify-center items-center p-6 md:p-8 bg-gradient-to-br from-secondary/80 to-secondary/30 border-b md:border-b-0 md:border-r border-border/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative text-center space-y-1">
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              {format(date, "EEEE", { locale: ru })}
            </div>
            <div className={`font-display font-black leading-none text-primary ${compact ? "text-5xl" : "text-7xl md:text-8xl"} group-hover:scale-110 transition-transform duration-500 origin-center`}>
              {format(date, "d")}
            </div>
            <div className={`uppercase tracking-[0.2em] font-bold text-foreground/90 ${compact ? "text-sm" : "text-base"}`}>
              {format(date, "LLLL", { locale: ru })}
            </div>
            <div className="text-xs text-muted-foreground pt-1">
              {format(date, "yyyy")} · {format(date, "HH:mm")}
            </div>
          </div>
        </div>

        {/* INFO */}
        <div className="p-6 md:p-8 space-y-3 min-w-0">
          <h3 className={`font-display font-bold leading-tight group-hover:text-primary transition-colors ${compact ? "text-lg" : "text-2xl md:text-3xl"}`}>
            {event.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-primary" /> {event.city}
            </span>
            {event.venue && <span className="font-medium text-foreground">{event.venue}</span>}
          </div>
          {event.address && <p className="text-xs text-muted-foreground">{event.address}</p>}

          {!compact && (
            <div className="flex flex-wrap gap-2 pt-3 pointer-events-auto relative z-10">
              {event.ticket_url && (
                <a href={event.ticket_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] transition-all">
                  <Ticket size={12} /> Купить билет
                </a>
              )}
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTicket(); }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2 text-xs font-semibold hover:border-primary/50 transition-colors">
                Оставить заявку
              </button>
              <Link to={`/events/${event.id}`} onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold text-primary hover:underline">
                Подробнее <ArrowRight size={12} />
              </Link>
            </div>
          )}
        </div>

        {/* POSTER */}
        {!compact && (
          <div className="relative h-64 md:h-auto md:w-[320px] overflow-hidden">
            <img
              src={poster}
              alt={event.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-card/30 to-card md:to-card/0" />
            <div className="absolute top-3 right-3 rounded-full bg-background/80 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-wider border border-border">
              Афиша
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default EventsPage;
