import Layout from "@/components/Layout";
import { useSiteSections, useBandMembers, usePartners, usePublishedEvents } from "@/hooks/use-data";
import { formatDate } from "@/lib/format";
import { Link } from "react-router-dom";
import { useState } from "react";
import TicketRequestModal from "@/components/TicketRequestModal";
import { Music, Users, Award, Headphones, Calendar } from "lucide-react";

const AboutPage = () => {
  const { data: sections } = useSiteSections(["about_therapy", "about_band", "stats", "partners_text", "hero_tagline"]);
  const { data: members } = useBandMembers();
  const { data: partners } = usePartners();
  const { data: events } = usePublishedEvents();
  const [ticketModal, setTicketModal] = useState(false);

  const getSection = (key: string) => sections?.find((s) => s.key === key);

  const therapy = getSection("about_therapy");
  const band = getSection("about_band");
  const statsSection = getSection("stats");
  const partnersText = getSection("partners_text");

  const stats = statsSection?.content?.split("\n").map((line) => {
    const [value, label] = line.split("|");
    return { value: value?.trim(), label: label?.trim() };
  }) || [];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative flex items-center justify-center min-h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="relative z-10 text-center space-y-4 px-4">
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tighter text-gradient-fuchsia animate-fade-in">
            О нас
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {getSection("hero_tagline")?.content || "Музыка, которая звучит в каждом баре города"}
          </p>
        </div>
      </section>

      {/* Art as therapy */}
      {therapy && (
        <section className="container py-20">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Headphones size={20} className="text-primary" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold">{therapy.title}</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {therapy.content}
            </p>
          </div>
        </section>
      )}

      {/* Band */}
      {band && (
        <section className="container py-20">
          <div className="space-y-12">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users size={20} className="text-primary" />
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold">{band.title}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">{band.content}</p>
            </div>

            {/* Members */}
            {members && members.length > 0 ? (
              <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-4xl mx-auto">
                {members.map((m) => (
                  <div key={m.id} className="group text-center space-y-4">
                    <div className="aspect-square rounded-xl overflow-hidden bg-secondary border border-border group-hover:border-primary/40 transition-colors glow-fuchsia">
                      {m.photo_url ? (
                        <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Music size={48} className="opacity-30" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-display font-semibold">{m.name}</p>
                      <p className="text-xs text-primary">{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Users size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-sm">Состав группы скоро появится</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Stats */}
      {stats.length > 0 && (
        <section className="container py-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-6 md:grid-cols-3">
              {stats.map((s, i) => (
                <div key={i} className="text-center p-8 rounded-xl border border-border bg-card/50 hover:border-primary/30 transition-colors">
                  <p className="font-display text-5xl font-bold text-gradient-fuchsia">{s.value}</p>
                  <p className="text-sm text-muted-foreground mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming events */}
      {events && events.length > 0 && (
        <section className="container py-20 space-y-8">
          <div className="flex items-center gap-3 max-w-3xl mx-auto">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar size={20} className="text-primary" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Предстоящие концерты</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {events.slice(0, 4).map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-5 hover:border-primary/30 transition-colors">
                <div>
                  <h3 className="font-display font-semibold">{e.title}</h3>
                  <p className="text-sm text-muted-foreground">{e.city} · {e.venue}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-primary font-medium">{formatDate(e.date_start)}</span>
                  <button onClick={() => setTicketModal(true)} className="text-xs font-medium text-primary hover:underline">
                    Билет →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Partners */}
      {partnersText && (
        <section className="container py-20">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Award size={20} className="text-primary" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold">{partnersText.title}</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">{partnersText.content}</p>
            {partners && partners.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-6 items-center">
                {partners.map((p) => (
                  <a key={p.id} href={p.url || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 rounded-lg border border-border bg-card/50 hover:border-primary/30 transition-colors h-20">
                    {p.logo_url ? (
                      <img src={p.logo_url} alt={p.name} className="max-h-10 max-w-full object-contain opacity-60 hover:opacity-100 transition-opacity" />
                    ) : (
                      <span className="text-xs text-muted-foreground font-medium">{p.name}</span>
                    )}
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Award size={40} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">Партнёры скоро появятся</p>
              </div>
            )}
          </div>
        </section>
      )}

      <TicketRequestModal open={ticketModal} onClose={() => setTicketModal(false)} />
    </Layout>
  );
};

export default AboutPage;
