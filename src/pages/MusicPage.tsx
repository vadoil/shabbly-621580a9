import Layout from "@/components/Layout";
import { usePublishedReleases } from "@/hooks/use-data";
import { Link } from "react-router-dom";
import { formatDateShort } from "@/lib/format";
import { getPublicStorageUrl } from "@/lib/storage";
import { Music, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TYPES = [
  { value: "all", label: "Все типы" },
  { value: "album", label: "Альбомы" },
  { value: "single", label: "Синглы" },
  { value: "ep", label: "EP" },
];

const SORTS = [
  { value: "alpha-asc", label: "А → Я" },
  { value: "alpha-desc", label: "Я → А" },
  { value: "date-desc", label: "Сначала новые" },
  { value: "date-asc", label: "Сначала старые" },
];

const TYPE_LABEL: Record<string, string> = {
  album: "Альбом",
  single: "Сингл",
  ep: "EP",
};

// Derive index letter for grouping
const getLetter = (title: string): string => {
  const t = title.trim();
  if (!t) return "#";
  const ch = t[0].toUpperCase();
  if (/[А-ЯЁ]/.test(ch)) return ch === "Ё" ? "Е" : ch;
  if (/[A-Z]/.test(ch)) return ch;
  return "#";
};

const MusicPage = () => {
  const { data: releases, isLoading } = usePublishedReleases();
  const [typeFilter, setTypeFilter] = useState("all");
  const [sort, setSort] = useState("alpha-asc");
  const [query, setQuery] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = releases ?? [];
    if (typeFilter !== "all") list = list.filter((r) => r.type === typeFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((r) => r.title.toLowerCase().includes(q));
    }
    if (activeLetter) list = list.filter((r) => getLetter(r.title) === activeLetter);

    const sorted = [...list];
    sorted.sort((a, b) => {
      switch (sort) {
        case "alpha-asc":
          return a.title.localeCompare(b.title, "ru");
        case "alpha-desc":
          return b.title.localeCompare(a.title, "ru");
        case "date-desc":
          return (b.release_date ?? "").localeCompare(a.release_date ?? "");
        case "date-asc":
          return (a.release_date ?? "").localeCompare(b.release_date ?? "");
        default:
          return 0;
      }
    });
    return sorted;
  }, [releases, typeFilter, sort, query, activeLetter]);

  // Build alphabet of available letters
  const availableLetters = useMemo(() => {
    const set = new Set<string>();
    (releases ?? []).forEach((r) => set.add(getLetter(r.title)));
    return set;
  }, [releases]);

  const ALPHABET_RU = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ".split("");
  const ALPHABET_EN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Group filtered results by letter when sorted alphabetically
  const grouped = useMemo(() => {
    if (!sort.startsWith("alpha")) return null;
    const map = new Map<string, typeof filtered>();
    filtered.forEach((r) => {
      const l = getLetter(r.title);
      const arr = map.get(l) ?? [];
      arr.push(r);
      map.set(l, arr);
    });
    return Array.from(map.entries());
  }, [filtered, sort]);

  const totalCount = releases?.length ?? 0;
  const hasFilters = typeFilter !== "all" || !!query.trim() || !!activeLetter;

  const resetFilters = () => {
    setTypeFilter("all");
    setQuery("");
    setActiveLetter(null);
  };

  return (
    <Layout>
      <section className="container py-16 space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Каталог</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="font-display text-4xl md:text-5xl font-bold">Музыка</h1>
              <p className="text-muted-foreground max-w-xl">
                Релизы артистов агентства — альбомы, EP и синглы. Используйте поиск и фильтры для навигации.
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              {filtered.length} из {totalCount} {totalCount === 1 ? "релиза" : "релизов"}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="space-y-4 rounded-xl border border-border bg-card/40 p-4 md:p-5">
          <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск по названию релиза…"
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORTS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Alphabet index */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground mr-2">Алфавит:</span>
            {[...ALPHABET_RU, ...ALPHABET_EN, "#"].map((letter) => {
              const enabled = availableLetters.has(letter);
              const isActive = activeLetter === letter;
              return (
                <button
                  key={letter}
                  disabled={!enabled}
                  onClick={() => setActiveLetter(isActive ? null : letter)}
                  className={`h-7 min-w-7 px-1.5 rounded text-xs font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : enabled
                      ? "text-foreground hover:bg-secondary"
                      : "text-muted-foreground/30 cursor-not-allowed"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
            {hasFilters && (
              <button
                onClick={resetFilters}
                className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" /> Сбросить
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <LoadingSkeleton count={8} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Music}
            title="Ничего не найдено"
            description={hasFilters ? "Попробуйте изменить фильтры или сбросить поиск" : "Скоро здесь появятся релизы"}
          />
        ) : grouped ? (
          <div className="space-y-12">
            {grouped.map(([letter, items]) => (
              <div key={letter} className="space-y-5">
                <div className="flex items-center gap-4">
                  <h2 className="font-display text-3xl font-bold text-primary">{letter}</h2>
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted-foreground">{items.length}</span>
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
  <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {items.map((r) => (
      <Link key={r.id} to={`/music/${r.slug}`} className="group space-y-3">
        <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary border border-border group-hover:border-primary/40 group-hover:glow-fuchsia transition-all">
          {r.cover_url ? (
            <img
              src={getPublicStorageUrl(r.cover_url)}
              alt={r.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Music size={48} />
            </div>
          )}
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider bg-background/80 backdrop-blur border border-border">
            {TYPE_LABEL[r.type] ?? r.type}
          </span>
        </div>
        <div>
          <h3 className="font-display font-semibold truncate group-hover:text-primary transition-colors">{r.title}</h3>
          <p className="text-xs text-muted-foreground">
            {TYPE_LABEL[r.type] ?? r.type}
            {r.release_date && ` · ${formatDateShort(r.release_date)}`}
          </p>
        </div>
      </Link>
    ))}
  </div>
);

export default MusicPage;
