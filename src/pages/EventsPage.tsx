import Layout from "@/components/Layout";
import { usePublishedEvents } from "@/hooks/use-data";
import { formatDateTime } from "@/lib/format";
import { useState } from "react";
import TicketRequestModal from "@/components/TicketRequestModal";
import { MapPin, Calendar } from "lucide-react";

const EventsPage = () => {
  const { data: events, isLoading } = usePublishedEvents();
  const [cityFilter, setCityFilter] = useState("");
  const [ticketEvent, setTicketEvent] = useState<{ id: string; title: string } | null>(null);

  const cities = [...new Set(events?.map((e) => e.city) || [])];
  const filtered = events?.filter((e) => !cityFilter || e.city === cityFilter) || [];

  return (
    <Layout>
      <section className="container py-16 space-y-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold">Афиша</h1>

        {/* Filters */}
        {cities.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCityFilter("")}
              className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${!cityFilter ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}
            >
              Все
            </button>
            {cities.map((c) => (
              <button
                key={c}
                onClick={() => setCityFilter(c)}
                className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${cityFilter === c ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 rounded-lg bg-secondary animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map((e) => (
              <div key={e.id} className="flex flex-col md:flex-row md:items-center justify-between rounded-lg border border-border bg-card p-6 gap-4 hover:border-primary/50 transition-colors">
                <div className="space-y-2">
                  <h3 className="font-display text-lg font-semibold">{e.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {formatDateTime(e.date_start)}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {e.city}, {e.venue}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {e.ticket_url && (
                    <a href={e.ticket_url} target="_blank" rel="noopener noreferrer" className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                      Купить билет
                    </a>
                  )}
                  <button
                    onClick={() => setTicketEvent({ id: e.id, title: e.title })}
                    className="rounded-md border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
                  >
                    Заявка
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Событий пока нет.</p>
        )}
      </section>

      <TicketRequestModal
        open={!!ticketEvent}
        eventId={ticketEvent?.id}
        eventTitle={ticketEvent?.title}
        onClose={() => setTicketEvent(null)}
      />
    </Layout>
  );
};

export default EventsPage;
