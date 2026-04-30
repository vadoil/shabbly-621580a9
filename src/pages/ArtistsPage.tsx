import { useMemo, useState } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import ArtistCard from "@/components/ArtistCard";
import ArtistFilters, { FilterState, initialFilters } from "@/components/ArtistFilters";
import { useArtists } from "@/hooks/use-agency-data";
import { Music2, Sparkles, Heart } from "lucide-react";
import desireStageRelease from "@/assets/desire-stage-release.jpg";

const ArtistsPage = () => {
  const { data: artists, isLoading } = useArtists();
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const { genres, formats, cities } = useMemo(() => {
    const g = new Set<string>();
    const f = new Set<string>();
    const c = new Set<string>();
    (artists || []).forEach((a: any) => {
      (a.genres || []).forEach((x: string) => g.add(x));
      (a.formats || []).forEach((x: string) => f.add(x));
      (a.cities || []).forEach((x: string) => c.add(x));
    });
    return {
      genres: [...g].sort(),
      formats: [...f].sort(),
      cities: [...c].sort(),
    };
  }, [artists]);

  const filtered = useMemo(() => {
    let list = [...(artists || [])];
    const q = filters.q.trim().toLowerCase();
    if (q) {
      list = list.filter((a: any) =>
        a.name.toLowerCase().includes(q) ||
        (a.short_description || "").toLowerCase().includes(q) ||
        (a.genres || []).some((g: string) => g.toLowerCase().includes(q))
      );
    }
    if (filters.genre) list = list.filter((a: any) => (a.genres || []).includes(filters.genre));
    if (filters.format) list = list.filter((a: any) => (a.formats || []).includes(filters.format));
    if (filters.city) list = list.filter((a: any) => (a.cities || []).includes(filters.city));
    if (filters.budget) {
      const [lo, hi] = filters.budget.split("-").map(Number);
      list = list.filter((a: any) => {
        const min = a.price_min ?? a.price_max ?? 0;
        return min >= lo && min <= hi;
      });
    }
    switch (filters.sort) {
      case "alpha":
        list.sort((a: any, b: any) => a.name.localeCompare(b.name, "ru"));
        break;
      case "price_asc":
        list.sort((a: any, b: any) => (a.price_min ?? Infinity) - (b.price_min ?? Infinity));
        break;
      case "price_desc":
        list.sort((a: any, b: any) => (b.price_min ?? 0) - (a.price_min ?? 0));
        break;
      default:
        list.sort((a: any, b: any) => (b.popularity ?? 0) - (a.popularity ?? 0));
    }
    return list;
  }, [artists, filters]);

  return (
    <Layout>
      <SEO
        title="Артисты — каталог исполнителей агентства SHABBLY"
        description="Каталог артистов SHABBLY Agency: певцы, группы и проекты разных жанров для корпоративов, свадеб, частных вечеров и фестивалей. Фильтры по жанру, формату и городу."
        canonical="/artists"
      />
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-secondary/30 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.18),transparent_60%)]" />
        <div className="container relative py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 lg:items-stretch">
            <div className="lg:order-1 order-2 flex flex-col justify-center gap-6">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5">
                <Sparkles size={14} className="text-primary" />
                <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-semibold">Каталог артистов · Вечер вашей мечты</span>
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.05] tracking-tighter">
                Подберите артиста <br />
                <span className="text-gradient-fuchsia">для момента, который запомнят</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {(artists?.length ?? 0)}+ проверенных исполнителей: вокалисты, бэнды, DJ, классические форматы. Закрытая площадка, артист, который попадает в настроение с первой ноты, — и гости, которые забудут про телефоны.
              </p>
              <p className="text-sm md:text-base text-muted-foreground/80 leading-relaxed">
                Мы подбираем не «звёзд из топа» — мы подбираем правильного артиста под вашу сцену, формат и людей в зале.
              </p>

              <div className="my-2 h-px w-16 bg-gradient-to-r from-primary/60 to-transparent" />

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5">
                <Heart size={14} className="text-primary" />
                <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-semibold">Эмоция, которую вы покупаете</span>
              </div>
              <h2 className="font-display text-2xl md:text-4xl font-bold leading-[1.1] tracking-tighter">
                Не выступление.{" "}
                <span className="text-gradient-fuchsia">Раскрытие желаний</span>
              </h2>
              <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                <p>
                  Когда первый аккорд бьёт в грудь, и вы вдруг ловите себя на том, что подняли руки вверх, не думая ни о чём. Когда зал поёт ваш любимый припев — это то, ради чего люди возвращаются.
                </p>
                <p className="text-muted-foreground/80">
                  Мы делаем мероприятия, после которых гости пишут вам спасибо ещё неделю.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/5] lg:aspect-auto lg:h-full min-h-[420px] overflow-hidden rounded-3xl border border-border lg:order-2 order-1">
              <img
                src={desireStageRelease}
                alt="Эмоциональный момент на концерте — толпа с поднятыми руками"
                loading="lazy"
                width={1600}
                height={2000}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="container py-10 space-y-8">
        <ArtistFilters
          filters={filters}
          onChange={setFilters}
          genres={genres}
          formats={formats}
          cities={cities}
          total={filtered.length}
        />

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-2xl bg-secondary/40 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border/60 bg-card/40 py-20 text-center">
            <Music2 size={32} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">По выбранным фильтрам никого не нашлось.</p>
            <button
              onClick={() => setFilters(initialFilters)}
              className="rounded-full border border-border px-4 py-2 text-xs font-semibold hover:border-primary/60"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((a: any) => (
              <ArtistCard key={a.id} artist={a} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default ArtistsPage;
