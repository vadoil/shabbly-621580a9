import { Search, X } from "lucide-react";

export type SortKey = "popularity" | "alpha" | "price_asc" | "price_desc";

export type FilterState = {
  q: string;
  genre: string;
  format: string;
  city: string;
  budget: string;
  sort: SortKey;
};

export const initialFilters: FilterState = {
  q: "",
  genre: "",
  format: "",
  city: "",
  budget: "",
  sort: "popularity",
};

const select =
  "rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors";

const ArtistFilters = ({
  filters,
  onChange,
  genres,
  formats,
  cities,
  total,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  genres: string[];
  formats: string[];
  cities: string[];
  total: number;
}) => {
  const update = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch });
  const isDirty =
    filters.q || filters.genre || filters.format || filters.city || filters.budget || filters.sort !== "popularity";

  return (
    <div className="space-y-4 rounded-2xl border border-border/60 bg-card/50 p-4 backdrop-blur">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={filters.q}
          onChange={(e) => update({ q: e.target.value })}
          placeholder="Поиск по имени или жанру…"
          className={`w-full pl-9 ${select}`}
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <select value={filters.genre} onChange={(e) => update({ genre: e.target.value })} className={select}>
          <option value="">Все жанры</option>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <select value={filters.format} onChange={(e) => update({ format: e.target.value })} className={select}>
          <option value="">Все форматы</option>
          {formats.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        <select value={filters.city} onChange={(e) => update({ city: e.target.value })} className={select}>
          <option value="">Все города</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={filters.budget} onChange={(e) => update({ budget: e.target.value })} className={select}>
          <option value="">Любой бюджет</option>
          <option value="0-200000">до 200 000 ₽</option>
          <option value="200000-500000">200–500 000 ₽</option>
          <option value="500000-1000000">500 000 – 1 млн ₽</option>
          <option value="1000000-99999999">от 1 млн ₽</option>
        </select>
        <select value={filters.sort} onChange={(e) => update({ sort: e.target.value as SortKey })} className={select}>
          <option value="popularity">По популярности</option>
          <option value="alpha">По алфавиту</option>
          <option value="price_asc">Цена ↑</option>
          <option value="price_desc">Цена ↓</option>
        </select>
      </div>
      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>Найдено: <span className="text-foreground font-semibold">{total}</span></span>
        {isDirty && (
          <button
            onClick={() => onChange(initialFilters)}
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <X size={12} /> Сбросить
          </button>
        )}
      </div>
    </div>
  );
};

export default ArtistFilters;
