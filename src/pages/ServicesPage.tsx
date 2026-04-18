import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { useServices } from "@/hooks/use-agency-data";
import { ArrowRight, Music2, Mic2, Briefcase, PartyPopper, Sparkles, Check } from "lucide-react";
import EmptyState from "@/components/EmptyState";

const iconMap: Record<string, any> = {
  music: Music2,
  mic: Mic2,
  briefcase: Briefcase,
  party: PartyPopper,
  sparkles: Sparkles,
};

const ServicesPage = () => {
  const { data: services, isLoading } = useServices();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,hsl(322_80%_55%/0.1)_0%,transparent_60%)]" />
        <div className="container relative z-10 pt-24 pb-16 max-w-4xl">
          <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium mb-6">Услуги агентства</p>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tighter leading-[0.95]">
            От подбора артиста <br />
            до <span className="text-gradient-fuchsia">шоу под ключ</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-8 max-w-2xl leading-relaxed">
            Прозрачные пакеты под разные задачи — от точечного букинга до полного продакшна.
          </p>
        </div>
      </section>

      {/* Services list */}
      <section className="container py-16 space-y-6">
        {isLoading ? (
          <div className="text-center text-muted-foreground py-20">Загрузка…</div>
        ) : services && services.length > 0 ? (
          services.map((s, idx) => {
            const Icon = iconMap[s.icon || ""] || Sparkles;
            const packages = (s.packages as any[]) || [];
            return (
              <div
                key={s.id}
                className="rounded-3xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-colors"
              >
                <div className="grid lg:grid-cols-[1fr_2fr] gap-px bg-border">
                  {/* Left: meta */}
                  <div className="bg-card p-8 md:p-10 space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Icon size={22} />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">0{idx + 1}</span>
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">{s.title}</h2>
                    {s.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                    )}
                    <Link
                      to="/contacts"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
                    >
                      Запросить смету <ArrowRight size={14} />
                    </Link>
                  </div>

                  {/* Right: packages */}
                  <div className="bg-card p-8 md:p-10">
                    {packages.length > 0 ? (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {packages.map((p: any, i: number) => (
                          <div
                            key={i}
                            className="rounded-2xl border border-border bg-secondary/30 p-5 space-y-3 hover:border-primary/40 transition-colors"
                          >
                            <div className="flex items-baseline justify-between gap-2">
                              <h3 className="font-display font-bold">{p.name || `Пакет ${i + 1}`}</h3>
                              {p.price && <span className="text-xs text-primary font-semibold">{p.price}</span>}
                            </div>
                            {Array.isArray(p.features) && (
                              <ul className="space-y-1.5">
                                {p.features.map((f: string, k: number) => (
                                  <li key={k} className="text-xs text-muted-foreground flex items-start gap-2">
                                    <Check size={12} className="text-primary mt-0.5 shrink-0" />
                                    <span>{f}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                        Стоимость рассчитывается индивидуально
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <EmptyState icon={Sparkles} title="Услуги скоро появятся" />
        )}
      </section>

      {/* CTA */}
      <section className="container py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tighter">
            Не нашли подходящий пакет?
          </h2>
          <p className="text-muted-foreground">Соберём решение под вашу задачу — расскажите детали.</p>
          <Link
            to="/contacts"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] transition-all"
          >
            Обсудить проект <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default ServicesPage;
