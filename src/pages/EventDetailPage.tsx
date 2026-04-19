import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getPublicStorageUrl } from "@/lib/storage";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { ArrowLeft, Calendar, MapPin, Ticket, Building2 } from "lucide-react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import TicketRequestModal from "@/components/TicketRequestModal";
import { useState } from "react";
import hero2 from "@/assets/hero/hero-2.jpg";
import hero4 from "@/assets/hero/hero-4.jpg";
import hero5 from "@/assets/hero/hero-5.jpg";

const FALLBACKS = [hero2, hero4, hero5];

const useEvent = (id: string) =>
  useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading } = useEvent(id || "");
  const [ticketOpen, setTicketOpen] = useState(false);

  if (isLoading)
    return (
      <Layout>
        <div className="container py-16">
          <LoadingSkeleton variant="hero" />
        </div>
      </Layout>
    );

  if (!event)
    return (
      <Layout>
        <div className="container py-20">
          <EmptyState icon={Calendar} title="Событие не найдено" description="Возможно, оно было удалено или ещё не опубликовано." ctaLabel="Вся афиша" ctaLink="/events" />
        </div>
      </Layout>
    );

  const date = new Date(event.date_start);
  const cover = event.cover_url
    ? getPublicStorageUrl(event.cover_url)
    : FALLBACKS[(event.id?.charCodeAt(0) || 0) % FALLBACKS.length];

  return (
    <Layout>
      <SEO
        title={`${event.title} — ${format(date, "d MMMM yyyy", { locale: ru })} · ${event.city}`}
        description={`${event.title} в ${event.venue}, ${event.city}. ${format(date, "d MMMM yyyy, HH:mm", { locale: ru })}.`}
        canonical={`/events/${event.id}`}
      />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0">
          <img src={cover} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>
        <div className="container relative py-20 md:py-28">
          <Link to="/events" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft size={14} /> Афиша
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="rounded-full bg-primary/15 border border-primary/40 px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold text-primary">
              {format(date, "d MMMM yyyy", { locale: ru })}
            </span>
            <span className="rounded-full bg-secondary border border-border px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
              {format(date, "EEEE · HH:mm", { locale: ru })}
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight max-w-4xl">{event.title}</h1>
          <p className="mt-4 text-base text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="inline-flex items-center gap-1.5"><MapPin size={14} className="text-primary" />{event.city}</span>
            {event.venue && <span className="font-medium text-foreground">{event.venue}</span>}
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="container py-12 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <div className="rounded-2xl overflow-hidden border border-border/60 bg-card">
            <img src={cover} alt={event.title} className="w-full max-h-[560px] object-cover" />
          </div>

          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold">Площадка</h2>
            <div className="rounded-xl border border-border bg-card p-5 space-y-2">
              <p className="font-display font-semibold flex items-center gap-2">
                <Building2 size={16} className="text-primary" />
                {event.venue}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <MapPin size={14} className="text-primary" />
                {event.city}{event.address ? `, ${event.address}` : ""}
              </p>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-4 lg:sticky lg:top-24 self-start">
          <div className="rounded-2xl border border-primary/30 bg-card p-6 space-y-4 shadow-[0_0_40px_-10px_hsl(var(--primary)/0.4)]">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Когда</p>
              <p className="font-display text-4xl font-black text-primary mt-1 leading-none">
                {format(date, "d")}
              </p>
              <p className="font-display font-bold uppercase tracking-wider mt-1">
                {format(date, "LLLL", { locale: ru })}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {format(date, "EEEE, HH:mm", { locale: ru })}
              </p>
            </div>

            <div className="border-t border-border/60 pt-4 space-y-2">
              {event.ticket_url ? (
                <a
                  href={event.ticket_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] transition-all"
                >
                  <Ticket size={14} /> Купить билет
                </a>
              ) : (
                <button
                  onClick={() => setTicketOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] transition-all"
                >
                  <Ticket size={14} /> Оставить заявку
                </button>
              )}
              <Link
                to="/contacts"
                className="w-full inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-xs font-semibold hover:border-primary/60 hover:text-primary transition-colors"
              >
                Связаться с агентством
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <TicketRequestModal
        open={ticketOpen}
        onClose={() => setTicketOpen(false)}
        eventId={event.id}
        eventTitle={event.title}
      />
    </Layout>
  );
};

export default EventDetailPage;
