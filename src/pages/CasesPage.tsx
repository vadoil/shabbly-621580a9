import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { useCases } from "@/hooks/use-agency-data";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { MapPin, Calendar, Sparkles, X, Crown } from "lucide-react";
import desirePrivateEvent from "@/assets/desire-private-event.jpg";

import { proxify } from "@/lib/storage";
const CasesPage = () => {
  const { data: cases, isLoading } = useCases();
  const [formatFilter, setFormatFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  const formats = useMemo(
    () => [...new Set((cases || []).map((c: any) => c.format).filter(Boolean))].sort(),
    [cases]
  );
  const cities = useMemo(
    () => [...new Set((cases || []).map((c: any) => c.city).filter(Boolean))].sort(),
    [cases]
  );
  const years = useMemo(
    () =>
      [...new Set((cases || []).map((c: any) => (c.event_date ? new Date(c.event_date).getFullYear() : null)).filter(Boolean))]
        .sort((a: any, b: any) => b - a),
    [cases]
  );

  const filtered = useMemo(() => {
    let list = cases || [];
    if (formatFilter) list = list.filter((c: any) => c.format === formatFilter);
    if (cityFilter) list = list.filter((c: any) => c.city === cityFilter);
    if (yearFilter) list = list.filter((c: any) => c.event_date && new Date(c.event_date).getFullYear() === Number(yearFilter));
    return list;
  }, [cases, formatFilter, cityFilter, yearFilter]);

  const isDirty = formatFilter || cityFilter || yearFilter;
  const select = "rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors";

  return (
    <Layout>
      <SEO
        title="Проекты — реализованные мероприятия SHABBLY Agency"
        description="Кейсы SHABBLY Agency: корпоративы крупных брендов, частные торжества, фестивали и презентации. Артисты, форматы, площадки и результаты."
        canonical="/cases"
      />
      {/* Hero + Desire split */}
      <section className="container py-12 md:py-16 border-b border-border/40">
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          <div className="relative overflow-hidden rounded-3xl border border-border min-h-[420px] lg:min-h-[560px]">
            <img
              src={desirePrivateEvent}
              alt="Атмосфера премиального торжества"
              loading="lazy"
              width={1600}
              height={1000}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
          </div>
          <div className="flex flex-col justify-between gap-6 lg:max-h-[560px] overflow-hidden">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Проекты и форматы</p>
              <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight">
                Реализованные <br /><span className="text-primary">мероприятия</span>
              </h1>
              <p className="text-base text-muted-foreground">
                Корпоративы, частные торжества, фестивали и презентации брендов. Каждый проект — формат, артист, площадка и результат.
              </p>
            </div>
            <div className="space-y-4 border-t border-border/60 pt-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5">
                <Crown size={14} className="text-primary" />
                <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-semibold">Каждый проект — история</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight tracking-tighter">
                За каждым кейсом — <span className="text-gradient-fuchsia">вечер, который запомнили</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Корпоратив, на котором CEO впервые за год улыбнулся искренне. Свадьба, где гости танцевали до пяти утра. Презентация бренда, после которой инвесторы сами написали в личку.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Это не «пункты сметы» — это эмоции, которые вы получаете, доверяя событие нам.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/50 p-4">
          <div className="flex flex-wrap gap-2">
            <select value={formatFilter} onChange={(e) => setFormatFilter(e.target.value)} className={select}>
              <option value="">Все форматы</option>
              {formats.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
            <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className={select}>
              <option value="">Все города</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className={select}>
              <option value="">Любой год</option>
              {years.map((y: any) => <option key={y} value={y}>{y}</option>)}
            </select>
            {isDirty && (
              <button
                onClick={() => { setFormatFilter(""); setCityFilter(""); setYearFilter(""); }}
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline px-2"
              >
                <X size={12} /> Сбросить
              </button>
            )}
          </div>
          <span className="text-xs text-muted-foreground">Найдено: <span className="text-foreground font-semibold">{filtered.length}</span></span>
        </div>

        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-2xl bg-secondary/40 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border/60 bg-card/40 py-20 text-center">
            <Sparkles size={32} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {(cases?.length ?? 0) === 0
                ? "Проекты скоро появятся. Добавьте первый через админку."
                : "По выбранным фильтрам ничего не нашлось."}
            </p>
            {(cases?.length ?? 0) === 0 && (
              <Link to="/contacts" className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground">
                Обсудить ваше мероприятие
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c: any) => (
              <article key={c.id} className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:border-primary/40 hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.3)]">
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                  {c.cover_url ? (
                    <img src={proxify(c.cover_url)} alt={c.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <Sparkles size={36} />
                    </div>
                  )}
                  {c.featured && (
                    <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground backdrop-blur">
                      Проект года
                    </span>
                  )}
                  {c.format && (
                    <span className="absolute right-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-[10px] font-semibold backdrop-blur">
                      {c.format}
                    </span>
                  )}
                </div>
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-display text-lg font-bold leading-tight group-hover:text-primary transition-colors">{c.title}</h3>
                    {c.client && <p className="text-xs text-muted-foreground mt-0.5">Клиент: {c.client}</p>}
                  </div>
                  {c.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                    {c.event_date && (
                      <span className="flex items-center gap-1">
                        <Calendar size={11} /> {format(new Date(c.event_date), "LLLL yyyy", { locale: ru })}
                      </span>
                    )}
                    {c.city && (
                      <span className="flex items-center gap-1">
                        <MapPin size={11} /> {c.city}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="rounded-2xl border border-border/60 bg-secondary/20 p-6 md:p-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-bold">Готовы к новому проекту</h3>
            <p className="text-sm text-muted-foreground mt-1">Расскажите о задаче — мы предложим формат, артиста и смету.</p>
          </div>
          <Link to="/contacts" className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:shadow-[0_0_24px_hsl(var(--primary)/0.4)] transition-all">
            Обсудить мероприятие
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default CasesPage;
