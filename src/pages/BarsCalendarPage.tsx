import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, getDay } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar, MapPin, ExternalLink, Search, ChevronLeft, ChevronRight, X, Ticket, Phone, Globe, Clock } from "lucide-react";
import EmptyState from "@/components/EmptyState";

const useBar = () =>
  useQuery({
    queryKey: ["bar", "rhythm-blues-cafe"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bars")
        .select("*")
        .eq("slug", "rhythm-blues-cafe")
        .eq("published", true)
        .single();
      if (error) throw error;
      return data;
    },
  });

const useBarEvents = (monthDate: Date) => {
  const start = startOfMonth(monthDate).toISOString();
  const end = endOfMonth(monthDate).toISOString();
  return useQuery({
    queryKey: ["bar_events_new", start, end],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bar_events")
        .select("*")
        .eq("published", true)
        .gte("date_start", start)
        .lte("date_start", end)
        .order("date_start", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};

const BarsCalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [hallFilter, setHallFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const { data: bar } = useBar();
  const { data: events, isLoading } = useBarEvents(currentMonth);

  const halls = useMemo(() => {
    const set = new Set<string>();
    (events || []).forEach((e) => { if (e.hall) set.add(e.hall); });
    return Array.from(set).sort();
  }, [events]);

  const filtered = useMemo(() => {
    let result = events || [];
    if (hallFilter) result = result.filter((e) => e.hall === hallFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((e) => e.title.toLowerCase().includes(q));
    }
    if (selectedDay) result = result.filter((e) => isSameDay(new Date(e.date_start), selectedDay));
    return result;
  }, [events, hallFilter, searchQuery, selectedDay]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);
  const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

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
        {/* Bar Info Card */}
        {bar && (
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-3">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gradient-fuchsia">{bar.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {bar.address && (
                <span className="inline-flex items-center gap-1.5"><MapPin size={14} className="text-primary" /> {bar.address}</span>
              )}
              {bar.phone && (
                <a href={`tel:${bar.phone}`} className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">
                  <Phone size={14} className="text-primary" /> {bar.phone}
                </a>
              )}
              {bar.website_url && (
                <a href={bar.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">
                  <Globe size={14} className="text-primary" /> Сайт
                </a>
              )}
            </div>
          </div>
        )}

        <h2 className="font-display text-2xl md:text-3xl font-bold">Афиша</h2>

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
            value={hallFilter}
            onChange={(e) => setHallFilter(e.target.value)}
            className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-w-[160px]"
          >
            <option value="">Все залы</option>
            {halls.map((h) => (
              <option key={h} value={h}>{h}</option>
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
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft size={18} />
              </button>
              <h3 className="font-display text-lg font-semibold capitalize">
                {format(currentMonth, "LLLL yyyy", { locale: ru })}
              </h3>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
              {weekDays.map((d) => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: offset }).map((_, i) => <div key={`blank-${i}`} />)}
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
                      <span className={`text-[10px] font-bold mt-0.5 ${isSelected ? "text-primary-foreground/80" : "text-primary"}`}>
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
                  <div key={i} className="h-24 rounded-lg bg-secondary animate-pulse" />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="space-y-3">
                {filtered.map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    className="w-full text-left rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5 min-w-0">
                        <h4 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                          {ev.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Clock size={12} className="text-primary" />
                            {format(new Date(ev.date_start), "d MMM, HH:mm", { locale: ru })}
                          </span>
                          {ev.hall && (
                            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">{ev.hall}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {ev.ticket_url && (
                          <a
                            href={ev.ticket_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:shadow-[0_0_20px_hsl(322_80%_55%/0.3)] transition-all"
                          >
                            <Ticket size={12} className="inline mr-1" />Билет
                          </a>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <EmptyState icon={Calendar} title="Событий не найдено" description="Попробуйте другой месяц или сбросьте фильтры" />
            )}
          </div>
        </div>
      </section>

      {/* Event Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={() => setSelectedEvent(null)}>
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start">
              <h3 className="font-display text-xl font-bold text-foreground">{selectedEvent.title}</h3>
              <button onClick={() => setSelectedEvent(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock size={16} className="text-primary" />
                <p className="text-foreground">{format(new Date(selectedEvent.date_start), "d MMMM yyyy, HH:mm", { locale: ru })}</p>
              </div>
              {selectedEvent.hall && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin size={16} className="text-primary" />
                  <p className="text-foreground">{selectedEvent.hall}</p>
                </div>
              )}
              {bar && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe size={16} className="text-primary" />
                  <p className="text-foreground">{bar.name} — {bar.address}</p>
                </div>
              )}
              {selectedEvent.description && (
                <p className="text-muted-foreground">{selectedEvent.description}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedEvent.ticket_url && (
                <a href={selectedEvent.ticket_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                  <Ticket size={14} /> Купить билет
                </a>
              )}
              {selectedEvent.source_url && (
                <a href={selectedEvent.source_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary/50 transition-colors">
                  <ExternalLink size={14} /> Подробнее
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default BarsCalendarPage;
