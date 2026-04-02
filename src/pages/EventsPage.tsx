import Layout from "@/components/Layout";
import { usePublishedEvents } from "@/hooks/use-data";
import { formatDateTime, formatDateShort } from "@/lib/format";
import { useState, useMemo } from "react";
import TicketRequestModal from "@/components/TicketRequestModal";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import { MapPin, Calendar, Ticket, ChevronLeft, ChevronRight, X } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, getDay } from "date-fns";
import { ru } from "date-fns/locale";

const EventsPage = () => {
  const { data: events, isLoading } = usePublishedEvents();
  const [cityFilter, setCityFilter] = useState("");
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [ticketEvent, setTicketEvent] = useState<{ id: string; title: string } | null>(null);

  const cities = [...new Set(events?.map((e) => e.city) || [])];

  const filtered = useMemo(() => {
    let result = events || [];
    if (cityFilter) result = result.filter((e) => e.city === cityFilter);
    if (selectedDay) result = result.filter((e) => isSameDay(new Date(e.date_start), selectedDay));
    return result;
  }, [events, cityFilter, selectedDay]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, number>();
    (events || []).forEach((e) => {
      const key = format(new Date(e.date_start), "yyyy-MM-dd");
      map.set(key, (map.get(key) || 0) + 1);
    });
    return map;
  }, [events]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const offset = (getDay(monthStart) + 6) % 7;
  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  return (
    <Layout>
      <section className="container py-16 space-y-8">
        <div className="space-y-2">
          <h1 className="font-display text-4xl md:text-5xl font-bold">Афиша</h1>
          <p className="text-muted-foreground">Все концерты и выступления SHABBLY</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setCityFilter("")} className={`rounded-full px-5 py-2 text-xs font-medium transition-all ${!cityFilter ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>
            Все города
          </button>
          {cities.map((c) => (
            <button key={c} onClick={() => setCityFilter(c)} className={`rounded-full px-5 py-2 text-xs font-medium transition-all ${cityFilter === c ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>
              {c}
            </button>
          ))}
          {selectedDay && (
            <button onClick={() => setSelectedDay(null)} className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-4 py-2 text-xs font-medium">
              {format(selectedDay, "d MMMM", { locale: ru })} <X size={12} />
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-[350px_1fr] gap-8">
          {/* Mini calendar */}
          <div className="rounded-xl border border-border bg-card p-5 h-fit">
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
                const count = eventsByDay.get(key) || 0;
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
          </div>

          {/* Event list */}
          <div className="space-y-3">
            {isLoading ? (
              <LoadingSkeleton variant="list" count={5} />
            ) : filtered.length > 0 ? (
              filtered.map((e) => (
                <div key={e.id} className="group flex flex-col md:flex-row md:items-center justify-between rounded-xl border border-border bg-card p-5 gap-4 hover:border-primary/40 transition-all">
                  <div className="space-y-1.5">
                    <h3 className="font-display text-lg font-semibold group-hover:text-primary transition-colors">{e.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar size={13} /> {formatDateTime(e.date_start)}</span>
                      <span className="flex items-center gap-1"><MapPin size={13} /> {e.city}, {e.venue}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {e.ticket_url && (
                      <a href={e.ticket_url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:shadow-[0_0_20px_hsl(322_80%_55%/0.3)] transition-all">
                        <Ticket size={12} className="inline mr-1" /> Билет
                      </a>
                    )}
                    <button onClick={() => setTicketEvent({ id: e.id, title: e.title })} className="rounded-full border border-border px-5 py-2 text-xs font-semibold text-foreground hover:border-primary/50 transition-colors">
                      Заявка
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState icon={Calendar} title="Событий не найдено" description="Попробуйте другой фильтр или дату" />
            )}
          </div>
        </div>
      </section>

      <TicketRequestModal open={!!ticketEvent} eventId={ticketEvent?.id} eventTitle={ticketEvent?.title} onClose={() => setTicketEvent(null)} />
    </Layout>
  );
};

export default EventsPage;
