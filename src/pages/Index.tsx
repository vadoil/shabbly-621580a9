import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { usePublishedReleases, usePublishedEvents, usePublishedNews, useSiteSection, usePublishedGalleryItems, useMerchProducts, useBarEvents } from "@/hooks/use-data";
import { formatDate, formatDateShort } from "@/lib/format";
import { getPublicStorageUrl } from "@/lib/storage";
import { useState, useMemo } from "react";
import TicketRequestModal from "@/components/TicketRequestModal";
import EmptyState from "@/components/EmptyState";
import { Calendar, Music, Newspaper, ExternalLink, ArrowRight, MapPin, ShoppingBag, Image, Ticket } from "lucide-react";
import { startOfMonth, endOfMonth } from "date-fns";

const Index = () => {
  const { data: releases } = usePublishedReleases();
  const { data: events } = usePublishedEvents();
  const { data: news } = usePublishedNews();
  const { data: heroTagline } = useSiteSection("hero_tagline");
  const { data: galleryItems } = usePublishedGalleryItems(8);
  const { data: merch } = useMerchProducts();

  const now = new Date();
  const barStart = now.toISOString();
  const barEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: barEvents } = useBarEvents(barStart, barEnd);

  const [ticketModal, setTicketModal] = useState(false);

  const featured = releases?.[0];

  return (
    <Layout>
      {/* HERO */}
      <section className="relative flex items-center justify-center min-h-[85vh] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(322_80%_55%/0.08)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent" />
        <div className="relative z-10 text-center space-y-8 px-4 max-w-3xl">
          <h1 className="font-display text-7xl md:text-9xl font-bold tracking-tighter text-gradient-fuchsia">
            SHABBLY
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
            {heroTagline?.content || "Музыка, которая звучит в каждом баре города"}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/music" className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:shadow-[0_0_30px_hsl(322_80%_55%/0.4)] transition-all">
              <Music size={16} /> Слушать
            </Link>
            <Link to="/events" className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-3.5 text-sm font-semibold text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all">
              <Calendar size={16} /> Афиша
            </Link>
            <Link to="/merch" className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-3.5 text-sm font-semibold text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all">
              <ShoppingBag size={16} /> Мерч
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED RELEASE */}
      <section className="container py-20">
        {featured ? (
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Link to={`/music/${featured.slug}`} className="group">
              <div className="aspect-square rounded-2xl overflow-hidden bg-secondary glow-fuchsia">
                {featured.cover_url ? (
                  <img src={getPublicStorageUrl(featured.cover_url)} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Music size={80} /></div>
                )}
              </div>
            </Link>
            <div className="space-y-6">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest">Новый релиз</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold">{featured.title}</h2>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">{featured.type}{featured.release_date && ` · ${formatDate(featured.release_date)}`}</p>
              {featured.description && <p className="text-secondary-foreground leading-relaxed">{featured.description}</p>}
              {featured.platform_links && featured.platform_links.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {featured.platform_links.map((pl) => (
                    <a key={pl.id} href={pl.url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-border px-5 py-2 text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors">
                      {pl.platform === "yandex" ? "Яндекс Музыка" : pl.platform === "spotify" ? "Spotify" : pl.platform === "apple" ? "Apple Music" : "YouTube"}
                    </a>
                  ))}
                </div>
              )}
              <Link to={`/music/${featured.slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                Подробнее <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          <EmptyState icon={Music} title="Скоро будет новый релиз" description="Следите за обновлениями" />
        )}
      </section>

      {/* UPCOMING SHOWS */}
      <section className="container py-16 space-y-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Ближайшие концерты</h2>
          <Link to="/events" className="text-sm text-primary hover:underline flex items-center gap-1">Все даты <ArrowRight size={14} /></Link>
        </div>
        {events && events.length > 0 ? (
          <div className="space-y-3">
            {events.slice(0, 5).map((e) => (
              <div key={e.id} className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-border bg-card p-5 hover:border-primary/40 transition-all">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-primary bg-primary/10 rounded-md px-2 py-1">{formatDateShort(e.date_start)}</span>
                    <h3 className="font-display text-lg font-semibold group-hover:text-primary transition-colors">{e.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin size={12} /> {e.city} · {e.venue}</p>
                </div>
                <div className="flex gap-2 mt-3 sm:mt-0">
                  {e.ticket_url && (
                    <a href={e.ticket_url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:shadow-[0_0_20px_hsl(322_80%_55%/0.3)] transition-all">
                      <Ticket size={12} className="inline mr-1" />Билет
                    </a>
                  )}
                  <button onClick={() => setTicketModal(true)} className="rounded-full border border-border px-5 py-2 text-xs font-semibold text-foreground hover:border-primary/50 transition-colors">
                    Заявка
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={Calendar} title="Скоро объявим даты" description="Следите за афишей" ctaLabel="Перейти в афишу" ctaLink="/events" />
        )}
      </section>

      {/* NEWS */}
      <section className="container py-16 space-y-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Новости</h2>
          <Link to="/news" className="text-sm text-primary hover:underline flex items-center gap-1">Все <ArrowRight size={14} /></Link>
        </div>
        {news && news.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {news.slice(0, 3).map((n) => (
              <Link key={n.id} to={`/news/${n.slug}`} className="group space-y-3">
                <div className="aspect-video rounded-xl overflow-hidden bg-secondary">
                  {n.cover_url ? (
                    <img src={getPublicStorageUrl(n.cover_url)} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30"><Newspaper size={40} /></div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{n.published_at && formatDate(n.published_at)}</p>
                  <h3 className="font-display font-semibold line-clamp-2 mt-1 group-hover:text-primary transition-colors">{n.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState icon={Newspaper} title="Новости скоро появятся" />
        )}
      </section>

      {/* GALLERY */}
      <section className="container py-16 space-y-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Галерея</h2>
          <Link to="/gallery" className="text-sm text-primary hover:underline flex items-center gap-1">Все фото <ArrowRight size={14} /></Link>
        </div>
        {galleryItems && galleryItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {galleryItems.slice(0, 8).map((item) => (
              <div key={item.id} className="aspect-square rounded-xl overflow-hidden bg-secondary group cursor-pointer">
                <img src={getPublicStorageUrl(item.image_url)} alt={item.caption || ""} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={Image} title="Галерея скоро появится" ctaLabel="Смотреть" ctaLink="/gallery" />
        )}
      </section>

      {/* BARS */}
      <section className="container py-16 space-y-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Rhythm & Blues <span className="text-gradient-fuchsia">Cafe</span></h2>
          <Link to="/bars" className="text-sm text-primary hover:underline flex items-center gap-1">Вся афиша <ArrowRight size={14} /></Link>
        </div>
        {barEvents && barEvents.length > 0 ? (
          <div className="space-y-3">
            {barEvents.slice(0, 5).map((be: any) => (
              <div key={be.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-colors">
                <div className="space-y-1">
                  <h4 className="font-display font-semibold text-sm">{be.title}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar size={10} /> {formatDateShort(be.date_start)}
                    {be.hall && <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-[10px]">{be.hall}</span>}
                  </p>
                </div>
                {be.ticket_url && (
                  <a href={be.ticket_url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground" onClick={(e) => e.stopPropagation()}>
                    <Ticket size={10} className="inline mr-1" />Билет
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={MapPin} title="Скоро появится афиша" description="Запустите синхронизацию в админке" />
        )}
      </section>

      {/* MERCH TEASER */}
      <section className="container py-16 space-y-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Мерч</h2>
          <Link to="/merch" className="text-sm text-primary hover:underline flex items-center gap-1">В магазин <ArrowRight size={14} /></Link>
        </div>
        {merch && merch.length > 0 ? (
          <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
            {merch.slice(0, 4).map((p) => (
              <Link key={p.id} to={`/merch/${p.slug}`} className="group space-y-3">
                <div className="aspect-square rounded-xl overflow-hidden bg-secondary border border-border group-hover:border-primary/40 transition-colors">
                  {p.cover_url ? (
                    <img src={getPublicStorageUrl(p.cover_url)} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30"><ShoppingBag size={40} /></div>
                  )}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm truncate group-hover:text-primary transition-colors">{p.title}</h3>
                  {p.price_text && <p className="text-xs text-primary font-medium mt-0.5">{p.price_text}</p>}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState icon={ShoppingBag} title="Мерч скоро появится" ctaLabel="В магазин" ctaLink="/merch" />
        )}
      </section>

      <TicketRequestModal open={ticketModal} onClose={() => setTicketModal(false)} />
    </Layout>
  );
};

export default Index;
