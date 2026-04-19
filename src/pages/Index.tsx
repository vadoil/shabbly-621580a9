import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { usePublishedEvents, usePublishedNews, useSiteSection, useFeaturedGalleryItems, useMerchProducts, useBarEvents } from "@/hooks/use-data";
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayEvents = selectedDay
    ? eventsByDay.get(format(selectedDay, "yyyy-MM-dd")) || []
    : (barEvents || []).filter((e: any) => new Date(e.date_start) >= today).slice(0, 5);

  return (
    <section className="container py-16 space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Афиша</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">Афиша баров</h2>
          <p className="text-muted-foreground text-sm mt-1">События в барах-партнёрах агентства</p>
        </div>
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
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
                    <Clock size={10} className="text-primary shrink-0" />
                    {format(new Date(ev.date_start), "d MMM, HH:mm", { locale: ru })}
                    {ev.bar?.name && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] text-foreground">
                        <MapPin size={9} className="text-primary" />{ev.bar.name}
                      </span>
                    )}
                    {ev.hall && <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px]">{ev.hall}</span>}
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
  const { data: events } = usePublishedEvents();
  const { data: news } = usePublishedNews();
  const { data: heroTagline } = useSiteSection("hero_tagline");
  const { data: galleryItems } = useFeaturedGalleryItems();
  const { data: merch } = useMerchProducts();
  const { data: cases } = useCases({ limit: 4 });

  const [ticketModal, setTicketModal] = useState(false);

  return (
    <Layout>
      <SEO
        title="SHABBLY Agency — заказать артиста и организовать мероприятие"
        description="Продюсерское агентство SHABBLY: подбор артистов, постановка концертов и мероприятий под ключ — корпоративы, частные вечера, фестивали по всей России."
        canonical="/"
      />
      {/* HERO — AGENCY */}
      <AgencyHero />

      {/* SERVICES PREVIEW */}
      <AgencyServicesPreview />

      {/* ARTIST MATCHER CTA */}
      <AgencyArtistMatcher />

      {/* LATEST CASES — agency portfolio */}
      {cases && cases.length > 0 && (
        <section className="container py-20 space-y-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Портфолио</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">Последние проекты</h2>
              <p className="text-muted-foreground text-sm mt-1">Мероприятия, которые мы организовали</p>
            </div>
            <Link to="/cases" className="text-sm text-primary hover:underline flex items-center gap-1 shrink-0">
              Все проекты <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {cases.slice(0, 4).map((c) => (
              <Link
                key={c.id}
                to="/cases"
                className="group block rounded-xl overflow-hidden border border-border bg-card hover:border-primary/40 hover:glow-fuchsia transition-all"
              >
                <div className="relative aspect-[4/3] bg-secondary overflow-hidden">
                  {c.cover_url ? (
                    <img
                      src={getPublicStorageUrl(c.cover_url)}
                      alt={c.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                      <Image size={40} />
                    </div>
                  )}
                  {c.format && (
                    <span className="absolute top-2 left-2 rounded-full bg-background/80 backdrop-blur px-2.5 py-0.5 text-[10px] uppercase tracking-wider border border-border">
                      {c.format}
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-1.5">
                  <h3 className="font-display font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {c.title}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                    {c.city && (<><MapPin size={10} className="text-primary" />{c.city}</>)}
                    {c.event_date && <span>· {formatDateShort(c.event_date)}</span>}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}


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
