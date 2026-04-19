import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Music, Search, X, Disc3 } from "lucide-react";
import { useMemo, useState } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import { Input } from "@/components/ui/input";
import SafeImage from "@/components/SafeImage";

const TYPE_LABEL: Record<string, string> = { album: "Альбом", single: "Сингл", ep: "EP" };

const useReleases = () =>
  useQuery({
    queryKey: ["music_releases_with_artist"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("releases")
        .select("*, artist:artists(id, name, slug, photo_url)")
        .eq("published", true)
        .order("release_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

const MusicPage = () => {
  const { data: releases, isLoading } = useReleases();
  const [activeGenre, setActiveGenre] = useState<string>("all");
  const [query, setQuery] = useState("");

  const genres = useMemo(() => {
    const set = new Set<string>();
    (releases ?? []).forEach((r: any) => r.genre && set.add(r.genre));
    return Array.from(set).sort();
  }, [releases]);

  const filtered = useMemo(() => {
    let list = releases ?? [];
    if (activeGenre !== "all") list = list.filter((r: any) => r.genre === activeGenre);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((r: any) =>
        r.title.toLowerCase().includes(q) || r.artist?.name?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [releases, activeGenre, query]);

  const grouped = useMemo(() => {
    if (activeGenre !== "all" || query.trim()) return null;
    const map = new Map<string, any[]>();
    filtered.forEach((r: any) => {
      const g = r.genre || "Другое";
      const arr = map.get(g) ?? [];
      arr.push(r);
      map.set(g, arr);
    });
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [filtered, activeGenre, query]);

  const hasFilters = activeGenre !== "all" || !!query.trim();

  return (
    <Layout>
      <SEO
        title="Музыка — релизы артистов SHABBLY Agency"
        description="Каталог альбомов, синглов и EP артистов SHABBLY. Слушайте на Яндекс Музыке, Spotify, Apple Music и YouTube. Фильтры по жанру и поиск."
        canonical="/music"
      />
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="container relative py-16 md:py-20">
          <div className="mb-4 flex items-center gap-3">
            <Disc3 className="animate-spin-slow text-primary" size={32} />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Музыка</span>
          </div>
          <h1 className="font-display text-5xl font-bold leading-tight md:text-6xl">Каталог релизов</h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            Альбомы, EP и синглы артистов агентства. Слушайте на странице артиста или переходите в любимый стриминг.
          </p>
        </div>
      </section>

      <section className="container space-y-8 py-10">
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по релизу или артисту…" className="pl-9" />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveGenre("all")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                activeGenre === "all"
                  ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              Все жанры
            </button>
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setActiveGenre(g)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeGenre === g
                    ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {g}
              </button>
            ))}
            {hasFilters && (
              <button
                onClick={() => {
                  setActiveGenre("all");
                  setQuery("");
                }}
                className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <X size={12} /> Сбросить
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <LoadingSkeleton count={8} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Music} title="Ничего не найдено" description="Попробуйте другой жанр или сбросить поиск" />
        ) : grouped ? (
          <div className="space-y-14">
            {grouped.map(([genre, items]) => (
              <div key={genre} className="space-y-5 animate-fade-in">
                <div className="flex items-center gap-4">
                  <h2 className="font-display text-2xl font-bold md:text-3xl">{genre}</h2>
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">{items.length} релиз{items.length === 1 ? "" : items.length < 5 ? "а" : "ов"}</span>
                </div>
                <ReleaseGrid items={items} />
              </div>
            ))}
          </div>
        ) : (
          <ReleaseGrid items={filtered} />
        )}
      </section>
    </Layout>
  );
};

const ReleaseGrid = ({ items }: { items: any[] }) => (
  <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
    {items.map((r) => (
      <Link key={r.id} to={`/music/${r.slug}`} className="group space-y-3 animate-fade-in">
        <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-secondary transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]">
          <SafeImage
            src={r.cover_url}
            alt={r.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            fallbackClassName="flex h-full w-full items-center justify-center text-muted-foreground"
            iconSize={48}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/0 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <span className="absolute left-2 top-2 rounded-full border border-border bg-background/80 px-2 py-0.5 text-[10px] uppercase tracking-wider backdrop-blur">
            {TYPE_LABEL[r.type] ?? r.type}
          </span>
        </div>
        <div className="px-1">
          <h3 className="truncate font-display text-sm font-semibold transition-colors group-hover:text-primary">{r.title}</h3>
          {r.artist && <p className="truncate text-xs text-muted-foreground">{r.artist.name}</p>}
        </div>
      </Link>
    ))}
  </div>
);

export default MusicPage;
