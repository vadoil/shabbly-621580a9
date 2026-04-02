import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, getDay } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar, MapPin, ExternalLink, Search, ChevronLeft, ChevronRight, X } from "lucide-react";

interface BarEvent {
  id: string;
  title: string;
  date_start: string;
  date_text_raw: string | null;
  url: string;
  city: string;
  venue_id: string;
  venue?: { id: string; name: string; url: string; address: string | null; metro: string | null };
}

const useBarEvents = (monthDate: Date) => {
  const start = startOfMonth(monthDate).toISOString();
  const end = endOfMonth(monthDate).toISOString();

  return useQuery({
    queryKey: ["bar_events", start, end],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bar_events_external")
        .select("*, venue:venues_external(*)")
        .gte("date_start", start)
        .lte("date_start", end)
        .order("date_start", { ascending: true });
      if (error) throw error;
      return data as unknown as BarEvent[];
    },
  });
};

const useVenues = () =>
  useQuery({
    queryKey: ["venues_external"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("venues_external")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

const BarsCalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [venueFilter, setVenueFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<BarEvent | null>(null);

  const { data: events, isLoading } = useBarEvents(currentMonth);
  const { data: venues } = useVenues();

  const filtered = useMemo(() => {
    let result = events || [];
    if (venueFilter) result = result.filter((e) => e.venue_id === venueFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((e) => e.title.toLowerCase().includes(q) || e.venue?.name.toLowerCase().includes(q));
    }
    if (selectedDay) result = result.filter((e) => isSameDay(new Date(e.date_start), selectedDay));
    return result;
  }, [events, venueFilter, searchQuery, selectedDay]);

  // Calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart); // 0=Sun
  const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // Monday-first

  const eventsByDay = useMemo(() => {
    const map = new Map<string, number>();
    (events || []).forEach((e) => {
      const key = format(new Date(e.date_start), "yyyy-MM-dd");
      map.set(key, (map.get(key) || 0) + 1);
    });
    return map;
  }, [events]);

  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  return (
    <Layout>
      <section className="container py-12 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="font-display text-4xl md:text-5xl font-bold">
            Бары Москвы <span className="text-gradient-fuchsia">с шоу</span>
          </h1>
          <p className="text-muted-foreground text-lg">Афиша мероприятий в барах города</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <select
            value={venueFilter}
            onChange={(e) => setVenueFilter(e.target.value)}
            className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-w-[180px]"
          >
            <option value="">Все заведения</option>
            {venues?.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
          {selectedDay && (
            <button
              onClick={() => setSelectedDay(null)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 text-primary px-3 py-2 text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              {format(selectedDay, "d MMMM", { locale: ru })}
              <X size={14} />
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-[380px_1fr] gap-8">
          {/* Calendar Grid */}
          <div className="rounded-xl border border-border bg-card p-5 h-fit">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <h3 className="font-display text-lg font-semibold capitalize">
                {format(currentMonth, "LLLL yyyy", { locale: ru })}
              </h3>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {weekDays.map((d) => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: offset }).map((_, i) => (
                <div key={`blank-${i}`} />
              ))}
              {days.map((day) => {
                const key = format(day, "yyyy-MM-dd");
                const count = eventsByDay.get(key) || 0;
                const isSelected = selectedDay && isSameDay(day, selectedDay);
                const isToday = isSameDay(day, new Date());

                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDay(isSelected ? null : day)}
                    className={`relative aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground ring-2 ring-primary/50"
                        : isToday
                        ? "bg-secondary text-foreground ring-1 ring-primary/30"
                        : count > 0
                        ? "hover:bg-secondary text-foreground"
                        : "text-muted-foreground/50 hover:bg-secondary/50"
                    }`}
                  >
                    <span className="font-medium">{format(day, "d")}</span>
                    {count > 0 && (
                      <span
                        className={`text-[10px] font-bold mt-0.5 ${
                          isSelected ? "text-primary-foreground/80" : "text-primary"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold">
                {selectedDay
                  ? `События ${format(selectedDay, "d MMMM", { locale: ru })}`
                  : `Все события за ${format(currentMonth, "LLLL", { locale: ru })}`}
              </h3>
              <span className="text-sm text-muted-foreground">{filtered.length} событий</span>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-20 rounded-lg bg-secondary animate-pulse" />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="space-y-3">
                {filtered.map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    className="w-full text-left rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:glow-fuchsia transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5 min-w-0">
                        <h4 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                          {ev.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={12} />
                            {ev.venue?.name || "—"}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar size={12} />
                            {format(new Date(ev.date_start), "d MMM, HH:mm", { locale: ru })}
                          </span>
                        </div>
                        {ev.venue?.metro && (
                          <span className="text-xs text-primary/70">м. {ev.venue.metro}</span>
                        )}
                      </div>
                      <ExternalLink size={14} className="shrink-0 text-muted-foreground mt-1" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
                <Calendar size={40} className="mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground font-medium">Событий не найдено</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Попробуйте другой месяц или сбросьте фильтры
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Event Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={() => setSelectedEvent(null)}>
          <div
            className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-display text-xl font-bold text-foreground">{selectedEvent.title}</h3>
              <button onClick={() => setSelectedEvent(null)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={16} className="text-primary" />
                <div>
                  <p className="text-foreground font-medium">{selectedEvent.venue?.name}</p>
                  {selectedEvent.venue?.address && <p>{selectedEvent.venue.address}</p>}
                  {selectedEvent.venue?.metro && <p className="text-primary/70">м. {selectedEvent.venue.metro}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar size={16} className="text-primary" />
                <p className="text-foreground">{format(new Date(selectedEvent.date_start), "d MMMM yyyy, HH:mm", { locale: ru })}</p>
              </div>

              {selectedEvent.date_text_raw && (
                <p className="text-xs text-muted-foreground italic">Оригинал: «{selectedEvent.date_text_raw}»</p>
              )}
            </div>

            <a
              href={selectedEvent.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <ExternalLink size={14} />
              Подробнее на Restoclub
            </a>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default BarsCalendarPage;
