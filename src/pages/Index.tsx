import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { useFeaturedReleases, usePublishedEvents, usePublishedNews, useSiteSection, useFeaturedGalleryItems, useMerchProducts, useBarEvents } from "@/hooks/use-data";
import { useCases } from "@/hooks/use-agency-data";
import { formatDate, formatDateShort } from "@/lib/format";
import { getPublicStorageUrl } from "@/lib/storage";
import { useState, useMemo } from "react";
import TicketRequestModal from "@/components/TicketRequestModal";
import EmptyState from "@/components/EmptyState";
import { Calendar, Music, Newspaper, ArrowRight, MapPin, ShoppingBag, Image, Ticket, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import AgencyHero from "@/components/AgencyHero";
import AgencyServicesPreview from "@/components/AgencyServicesPreview";
import AgencyArtistMatcher from "@/components/AgencyArtistMatcher";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, getDay } from "date-fns";
import { ru } from "date-fns/locale";

const BarsCalendarWidget = () => {
  const [month, setMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const start = startOfMonth(month).toISOString();
  const end = endOfMonth(month).toISOString();
  const { data: barEvents } = useBarEvents(start, end);

  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  const offset = ((getDay(startOfMonth(month)) || 7) - 1);
  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  const eventsByDay = useMemo(() => {
    const map = new Map<string, typeof barEvents>();
    (barEvents || []).forEach((e: any) => {
      const key = format(new Date(e.date_start), "yyyy-MM-dd");
      const arr = map.get(key) || [];
      arr.push(e);
      map.set(key, arr);
    });
    return map;
  }, [barEvents]);

  const dayEvents = selectedDay
    ? eventsByDay.get(format(selectedDay, "yyyy-MM-dd")) || []
    : (barEvents || []).slice(0, 5);

  return (
    <section className="container py-16 space-y-8">
      <div className="flex items-end justify-between">
        <h2 className="font-display text-3xl md:text-4xl font-bold">
          Rhythm & Blues <span className="text-primary">Cafe</span>
        </h2>
        <Link to="/bars" className="text-sm text-primary hover:underline flex items-center gap-1">
          Всё расписание <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        {/* Mini Calendar */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setMonth(subMonths(month, 1))} className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft size={16} />
            </button>
            <h3 className="font-display text-sm font-semibold capitalize">
              {format(month, "LLLL yyyy", { locale: ru })}
            </h3>
            <button onClick={() => setMonth(addMonths(month, 1))} className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {weekDays.map((d) => (
              <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-0.5">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: offset }).map((_, i) => <div key={`b-${i}`} />)}
            {days.map((day) => {
              const key = format(day, "yyyy-MM-dd");
              const count = eventsByDay.get(key)?.length || 0;
              const isSelected = selectedDay && isSameDay(day, selectedDay);
              const isToday = isSameDay(day, new Date());
              return (
                <button
                  key={key}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  className={`aspect-square rounded-md flex flex-col items-center justify-center text-xs transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : isToday
                      ? "bg-secondary text-foreground ring-1 ring-primary/30"
                      : count > 0
                      ? "hover:bg-secondary text-foreground font-medium"
                      : "text-muted-foreground/40 hover:bg-secondary/50"
                  }`}
                >
                  {format(day, "d")}
                  {count > 0 && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-primary mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Events for day */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {selectedDay
              ? format(selectedDay, "d MMMM, EEEE", { locale: ru })
              : "Ближайшие события"}
          </p>
          {(dayEvents as any[]).length > 0 ? (
            (dayEvents as any[]).map((ev: any) => (
              <div key={ev.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-colors">
                <div className="space-y-1 min-w-0">
                  <h4 className="font-display font-semibold text-sm truncate">{ev.title}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Clock size={10} className="text-primary shrink-0" />
                    {format(new Date(ev.date_start), "d MMM, HH:mm", { locale: ru })}
                    {ev.hall && <span className="ml-1 rounded-full bg-secondary px-2 py-0.5 text-[10px]">{ev.hall}</span>}
                  </p>
                </div>
                {ev.ticket_url && (
                  <a href={ev.ticket_url} target="_blank" rel="noopener noreferrer"
                    className="shrink-0 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] transition-all">
                    <Ticket size={10} className="inline mr-1" />Билет
                  </a>
                )}
              </div>
            ))
          ) : (
            <EmptyState icon={Calendar} title="Нет событий" description={selectedDay ? "Выберите другой день" : "Скоро появится афиша"} />
          )}
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  const { data: releases } = useFeaturedReleases();
  const { data: events } = usePublishedEvents();
  const { data: news } = usePublishedNews();
  const { data: heroTagline } = useSiteSection("hero_tagline");
  const { data: galleryItems } = useFeaturedGalleryItems();
  const { data: merch } = useMerchProducts();
  const { data: cases } = useCases({ limit: 4 });

  const [ticketModal, setTicketModal] = useState(false);

  const featured = releases?.[0];

  return (
    <Layout>
      {/* HERO — AGENCY */}
      <AgencyHero />

      {/* SERVICES PREVIEW */}
      <AgencyServicesPreview />

      {/* ARTIST MATCHER CTA */}
      <AgencyArtistMatcher />

      {/* RELEASES & SINGLES — flagship artist SHABBLY */}
      <section className="container py-20 space-y-10">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Релизы</h2>
            <p className="text-muted-foreground text-sm mt-1">Синглы и альбомы на всех площадках</p>
          </div>
          <Link to="/music" className="text-sm text-primary hover:underline flex items-center gap-1">
            Вся музыка <ArrowRight size={14} />
          </Link>
        </div>

        {releases && releases.length > 0 ? (
          <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {releases.slice(0, 8).map((r) => (
              <div key={r.id} className="group space-y-3">
                <Link to={`/music/${r.slug}`} className="block">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary border border-border group-hover:border-primary/40 transition-all">
                    {r.cover_url ? (
                      <img
                        src={getPublicStorageUrl(r.cover_url)}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-secondary/50">
                        <Music size={40} className="text-muted-foreground/30" />
                      </div>
                    )}
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/40">
                      <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-primary-foreground ml-0.5">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    {/* Type badge */}
                    <span className="absolute top-2 left-2 rounded-md bg-background/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground">
                      {r.type === "single" ? "Сингл" : r.type === "album" ? "Альбом" : "EP"}
                    </span>
                  </div>
                </Link>
                <div>
                  <Link to={`/music/${r.slug}`}>
                    <h3 className="font-display font-semibold text-sm truncate group-hover:text-primary transition-colors">
                      {r.title}
                    </h3>
                  </Link>
                  {r.release_date && (
                    <p className="text-xs text-muted-foreground mt-0.5">{formatDate(r.release_date)}</p>
                  )}
                  {/* Platform icons */}
                  {r.platform_links && r.platform_links.length > 0 && (
                    <div className="flex gap-1.5 mt-2">
                      {r.platform_links.slice(0, 4).map((pl) => (
                        <a
                          key={pl.id}
                          href={pl.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-7 h-7 rounded-full bg-secondary hover:bg-primary/20 hover:text-primary transition-all"
                          title={pl.platform === "yandex" ? "Яндекс Музыка" : pl.platform === "spotify" ? "Spotify" : pl.platform === "apple" ? "Apple Music" : "YouTube"}
                        >
                          {pl.platform === "youtube" && (
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                          )}
                          {pl.platform === "spotify" && (
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                          )}
                          {pl.platform === "apple" && (
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                          )}
                          {pl.platform === "yandex" && (
                            <span className="text-[10px] font-bold">Я</span>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={Music} title="Релизы скоро появятся" description="Следите за обновлениями" />
        )}
      </section>

      {/* UPCOMING SHOWS — checkerboard */}
      <section className="container py-16 space-y-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Ближайшие концерты</h2>
          <Link to="/events" className="text-sm text-primary hover:underline flex items-center gap-1">Все даты <ArrowRight size={14} /></Link>
        </div>
        {events && events.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0">
            {events.slice(0, 5).map((e, i) => {
              const isEven = i % 2 === 0;
              return (
                <div
                  key={e.id}
                  className={`group relative p-5 md:p-6 flex flex-col justify-between min-h-[200px] border border-border/50 transition-all hover:border-primary/50 ${
                    isEven ? "bg-card" : "bg-secondary/50"
                  }`}
                >
                  {/* Date big */}
                  <div>
                    <p className="font-display text-3xl md:text-4xl font-bold text-primary/80 leading-none">
                      {new Date(e.date_start).getDate()}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                      {new Date(e.date_start).toLocaleDateString("ru-RU", { month: "short", weekday: "short" })}
                    </p>
                  </div>

                  <div className="mt-4 space-y-2">
                    <h3 className="font-display text-sm font-semibold leading-tight group-hover:text-primary transition-colors">
                      {e.title}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin size={10} /> {e.city}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70">{e.venue}</p>
                  </div>

                  <div className="mt-3 flex gap-1.5">
                    {e.ticket_url ? (
                      <a href={e.ticket_url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-primary px-3 py-1 text-[10px] font-semibold text-primary-foreground hover:shadow-[0_0_20px_hsl(322_80%_55%/0.3)] transition-all">
                        <Ticket size={10} className="inline mr-0.5" />Билет
                      </a>
                    ) : (
                      <button onClick={() => setTicketModal(true)} className="rounded-full border border-border px-3 py-1 text-[10px] font-semibold text-foreground hover:border-primary/50 transition-colors">
                        Заявка
                      </button>
                    )}
                  </div>

                  {/* Corner accent */}
                  <div className={`absolute top-0 right-0 w-6 h-6 ${isEven ? "bg-primary/10" : "bg-primary/5"}`} />
                </div>
              );
            })}
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

      {/* BARS — mini calendar */}
      <BarsCalendarWidget />

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
