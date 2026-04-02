import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { usePublishedReleases, usePublishedEvents, usePublishedNews, useFriendEvents, useSiteSection } from "@/hooks/use-data";
import { formatDate, formatDateShort } from "@/lib/format";
import { useState } from "react";
import TicketRequestModal from "@/components/TicketRequestModal";
import { Calendar, Music, Newspaper, ExternalLink, ArrowRight } from "lucide-react";

const Index = () => {
  const { data: releases } = usePublishedReleases();
  const { data: events } = usePublishedEvents();
  const { data: news } = usePublishedNews();
  const { data: friendEvents } = useFriendEvents();
  const { data: heroTagline } = useSiteSection("hero_tagline");
  const { data: therapySection } = useSiteSection("about_therapy");
  const [ticketModal, setTicketModal] = useState(false);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative flex items-center justify-center min-h-[80vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[100px]" />
        <div className="relative z-10 text-center space-y-6 px-4">
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-gradient-fuchsia animate-fade-in">
            SHABBLY
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {heroTagline?.content || "Музыка, которая звучит в каждом баре города"}
          </p>
          <div className="flex gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Link
              to="/music"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Music size={16} /> Слушать
            </Link>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              <Calendar size={16} /> Афиша
            </Link>
          </div>
        </div>
      </section>

      {/* Art as therapy teaser */}
      {therapySection && (
        <section className="container py-20">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="font-display text-3xl md:text-4xl font-bold">{therapySection.title}</h2>
            <p className="text-muted-foreground leading-relaxed line-clamp-3 text-lg">
              {therapySection.content}
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              Узнать больше <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

      {/* Upcoming events */}
      {events && events.length > 0 && (
        <section className="container py-16 space-y-8">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl font-bold">Ближайшие концерты</h2>
            <Link to="/events" className="text-sm text-primary hover:underline">Все →</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {events.slice(0, 3).map((e) => (
              <div key={e.id} className="group rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition-colors space-y-3">
                <p className="text-xs font-medium text-primary">{formatDate(e.date_start)}</p>
                <h3 className="font-display text-lg font-semibold">{e.title}</h3>
                <p className="text-sm text-muted-foreground">{e.city} · {e.venue}</p>
                <button
                  onClick={() => setTicketModal(true)}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Заявка на билет →
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Releases */}
      {releases && releases.length > 0 && (
        <section className="container py-16 space-y-8">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl font-bold">Релизы</h2>
            <Link to="/music" className="text-sm text-primary hover:underline">Все →</Link>
          </div>
          <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
            {releases.slice(0, 4).map((r) => (
              <Link key={r.id} to={`/music/${r.slug}`} className="group space-y-3">
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                  {r.cover_url ? (
                    <img src={r.cover_url} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Music size={48} />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-display font-semibold truncate">{r.title}</h3>
                  <p className="text-xs text-muted-foreground">{r.type} · {r.release_date && formatDateShort(r.release_date)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* News */}
      {news && news.length > 0 && (
        <section className="container py-16 space-y-8">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl font-bold">Новости</h2>
            <Link to="/news" className="text-sm text-primary hover:underline">Все →</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {news.slice(0, 3).map((n) => (
              <Link key={n.id} to={`/news/${n.slug}`} className="group space-y-3">
                {n.cover_url && (
                  <div className="aspect-video rounded-lg overflow-hidden bg-secondary">
                    <img src={n.cover_url} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">{n.published_at && formatDate(n.published_at)}</p>
                  <h3 className="font-display font-semibold line-clamp-2">{n.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Friend events */}
      {friendEvents && friendEvents.length > 0 && (
        <section className="container py-16 space-y-8">
          <h2 className="font-display text-3xl font-bold">Друзья по барам</h2>
          <div className="space-y-3">
            {friendEvents.map((fe) => (
              <a
                key={fe.id}
                href={fe.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-colors"
              >
                <div className="space-y-1">
                  <h4 className="font-display font-semibold">{fe.title}</h4>
                  <p className="text-sm text-muted-foreground">{fe.city} · {fe.venue}</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{formatDateShort(fe.date_start)}</span>
                  <ExternalLink size={14} />
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      <TicketRequestModal open={ticketModal} onClose={() => setTicketModal(false)} />
    </Layout>
  );
};

export default Index;
