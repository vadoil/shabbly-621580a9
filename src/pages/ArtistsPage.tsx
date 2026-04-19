import { useMemo, useState } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import ArtistCard from "@/components/ArtistCard";
import ArtistFilters, { FilterState, initialFilters } from "@/components/ArtistFilters";
import { useArtists } from "@/hooks/use-agency-data";
import { Music2 } from "lucide-react";

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
      <section className="border-b border-border/40 bg-gradient-to-b from-secondary/30 to-background">
        <div className="container py-14 md:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Каталог артистов</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight">
              Подберите артиста <br />
              <span className="text-primary">для вашего события</span>
            </h1>
            <p className="mt-4 text-base text-muted-foreground max-w-2xl">
              {(artists?.length ?? 0)}+ проверенных исполнителей: вокалисты, бэнды, DJ, классические форматы. Фильтруйте по жанру, городу и бюджету — или напишите нам, и мы подберём идеальный вариант.
            </p>
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
