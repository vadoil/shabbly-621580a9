import Layout from "@/components/Layout";
import { usePublishedEvents } from "@/hooks/use-data";
import { formatDateTime } from "@/lib/format";
import { useState, useMemo } from "react";
import TicketRequestModal from "@/components/TicketRequestModal";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import { MapPin, Calendar as CalendarIcon, Ticket, ChevronLeft, ChevronRight, X, List, LayoutGrid, Building2 } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
  isAfter,
  startOfDay,
} from "date-fns";
import { ru } from "date-fns/locale";

type ViewMode = "list" | "calendar";

const EventsPage = () => {
  const { data: events, isLoading } = usePublishedEvents();
  const [view, setView] = useState<ViewMode>("list");
  const [cityFilter, setCityFilter] = useState("");
  const [venueFilter, setVenueFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [ticketEvent, setTicketEvent] = useState<{ id: string; title: string } | null>(null);

  const cities = useMemo(() => [...new Set((events || []).map((e: any) => e.city).filter(Boolean))].sort(), [events]);
  const venues = useMemo(() => [...new Set((events || []).map((e: any) => e.venue).filter(Boolean))].sort(), [events]);
  const statuses = useMemo(() => [...new Set((events || []).map((e: any) => e.status).filter(Boolean))].sort(), [events]);

  const filtered = useMemo(() => {
    let list = events || [];
    if (cityFilter) list = list.filter((e: any) => e.city === cityFilter);
    if (venueFilter) list = list.filter((e: any) => e.venue === venueFilter);
    if (statusFilter) list = list.filter((e: any) => e.status === statusFilter);
    if (selectedDay) list = list.filter((e: any) => isSameDay(new Date(e.date_start), selectedDay));
    return list;
  }, [events, cityFilter, venueFilter, statusFilter, selectedDay]);

  const upcoming = useMemo(
    () => filtered.filter((e: any) => isAfter(new Date(e.date_start), startOfDay(new Date()))),
    [filtered]
  );
  const past = useMemo(
    () => filtered.filter((e: any) => !isAfter(new Date(e.date_start), startOfDay(new Date()))),
    [filtered]
  );

  const eventsByDay = useMemo(() => {
    const map = new Map<string, any[]>();
    (events || []).forEach((e: any) => {
      const key = format(new Date(e.date_start), "yyyy-MM-dd");
      const arr = map.get(key) || [];
      arr.push(e);
      map.set(key, arr);
    });
    return map;
  }, [events]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const offset = (getDay(monthStart) + 6) % 7;
  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  const isDirty = cityFilter || venueFilter || statusFilter || selectedDay;
  const reset = () => {
    setCityFilter("");
    setVenueFilter("");
    setStatusFilter("");
    setSelectedDay(null);
  };

  const EventCard = ({ e }: { e: any }) => (
    <div className="group flex flex-col md:flex-row md:items-center justify-between rounded-xl border border-border bg-card p-5 gap-4 hover:border-primary/40 transition-all">
      <div className="flex gap-4 md:gap-5 items-start">
        <div className="shrink-0 flex flex-col items-center justify-center rounded-lg bg-secondary/60 px-3 py-2 min-w-[64px]">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">{format(new Date(e.date_start), "MMM", { locale: ru })}</span>
          <span className="font-display text-2xl font-bold leading-none">{format(new Date(e.date_start), "d")}</span>
          <span className="text-[10px] text-muted-foreground mt-1">{format(new Date(e.date_start), "HH:mm")}</span>
        </div>
        <div className="space-y-1.5">
          <h3 className="font-display text-lg font-semibold group-hover:text-primary transition-colors">{e.title}</h3>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin size={13} /> {e.city}{e.venue ? `, ${e.venue}` : ""}</span>
            {e.address && <span className="text-xs">{e.address}</span>}
          </div>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        {e.ticket_url && (
          <a href={e.ticket_url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] transition-all">
            <Ticket size={12} className="inline mr-1" /> Билет
          </a>
        )}
        <button onClick={() => setTicketEvent({ id: e.id, title: e.title })} className="rounded-full border border-border px-5 py-2 text-xs font-semibold hover:border-primary/50 transition-colors">
          Заявка
        </button>
      </div>
    </div>
  );

  const select = "rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors";

  return (
    <Layout>
      <section className="border-b border-border/40 bg-gradient-to-b from-secondary/30 to-background">
        <div className="container py-12 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Афиша</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight">События агентства</h1>
          <p className="mt-3 text-base text-muted-foreground max-w-2xl">
            Концерты, шоу-программы и выступления артистов SHABBLY. Фильтруйте по городу, площадке и дате.
          </p>
        </div>
      </section>

      <section className="container py-10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-full border border-border bg-card p-1">
            <button onClick={() => setView("list")} className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              <List size={12} /> Список
            </button>
            <button onClick={() => setView("calendar")} className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${view === "calendar" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              <LayoutGrid size={12} /> Календарь
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className={select}>
              <option value="">Все города</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={venueFilter} onChange={(e) => setVenueFilter(e.target.value)} className={select}>
              <option value="">Все площадки</option>
              {venues.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
            {statuses.length > 1 && (
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={select}>
                <option value="">Все статусы</option>
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            )}
            {isDirty && (
              <button onClick={reset} className="inline-flex items-center gap-1 text-xs text-primary hover:underline px-2">
                <X size={12} /> Сбросить
              </button>
            )}
          </div>
        </div>

        {view === "calendar" ? (
          <div className="grid lg:grid-cols-[380px_1fr] gap-6">
            <div className="rounded-2xl border border-border bg-card p-5 h-fit">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground"><ChevronLeft size={16} /></button>
                <h3 className="font-display font-semibold capitalize">{format(currentMonth, "LLLL yyyy", { locale: ru })}</h3>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground"><ChevronRight size={16} /></button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-1">
                {weekDays.map((d) => <div key={d} className="text-center text-xs text-muted-foreground py-1">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: offset }).map((_, i) => <div key={`b-${i}`} />)}
                {days.map((day) => {
                  const key = format(day, "yyyy-MM-dd");
                  const count = (eventsByDay.get(key) || []).length;
                  const isSelected = selectedDay && isSameDay(day, selectedDay);
                  const isToday = isSameDay(day, new Date());
                  return (
                    <button key={key} onClick={() => setSelectedDay(isSelected ? null : day)} className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all ${isSelected ? "bg-primary text-primary-foreground" : isToday ? "bg-secondary ring-1 ring-primary/30" : count > 0 ? "hover:bg-secondary text-foreground" : "text-muted-foreground/40"}`}>
                      <span className="font-medium">{format(day, "d")}</span>
                      {count > 0 && <span className={`text-[9px] font-bold ${isSelected ? "text-primary-foreground/80" : "text-primary"}`}>{count}</span>}
                    </button>
                  );
                })}
              </div>
              {selectedDay && (
                <button onClick={() => setSelectedDay(null)} className="mt-3 w-full text-xs text-muted-foreground hover:text-foreground">
                  Сбросить день
                </button>
              )}
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <LoadingSkeleton variant="list" count={5} />
              ) : filtered.length > 0 ? (
                filtered.map((e: any) => <EventCard key={e.id} e={e} />)
              ) : (
                <EmptyState icon={CalendarIcon} title="Событий нет" description="Попробуйте другой фильтр или дату" />
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold">Ближайшие</h2>
                <span className="text-xs text-muted-foreground">{upcoming.length}</span>
              </div>
              {isLoading ? (
                <LoadingSkeleton variant="list" count={4} />
              ) : upcoming.length > 0 ? (
                <div className="space-y-3">{upcoming.map((e: any) => <EventCard key={e.id} e={e} />)}</div>
              ) : (
                <EmptyState icon={CalendarIcon} title="Нет ближайших событий" description="Загляните позже или подпишитесь на обновления" />
              )}
            </div>

            {past.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-bold text-muted-foreground">Прошедшие</h2>
                  <span className="text-xs text-muted-foreground">{past.length}</span>
                </div>
                <div className="space-y-3 opacity-70">
                  {past.slice(0, 8).map((e: any) => <EventCard key={e.id} e={e} />)}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="rounded-2xl border border-border/60 bg-card/50 p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Building2 size={20} className="text-primary" />
            <div>
              <p className="font-semibold">Хотите своё мероприятие?</p>
              <p className="text-xs text-muted-foreground">Подберём артиста, площадку и техническое оснащение под задачу.</p>
            </div>
          </div>
          <a href="/contacts" className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:shadow-[0_0_24px_hsl(var(--primary)/0.4)] transition-all">
            Оставить заявку
          </a>
        </div>
      </section>

      <TicketRequestModal open={!!ticketEvent} eventId={ticketEvent?.id} eventTitle={ticketEvent?.title} onClose={() => setTicketEvent(null)} />
    </Layout>
  );
};

export default EventsPage;
