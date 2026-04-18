import { Link } from "react-router-dom";
import { MapPin, Music2 } from "lucide-react";

type Artist = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  photo_url: string | null;
  genres: string[];
  formats: string[];
  cities: string[];
  price_min: number | null;
  price_max: number | null;
  featured?: boolean;
};

const formatPrice = (min: number | null, max: number | null) => {
  if (!min && !max) return "По запросу";
  const fmt = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)} млн` : `${Math.round(n / 1000)}k`);
  if (min && max) return `от ${fmt(min)} ₽`;
  if (min) return `от ${fmt(min)} ₽`;
  return `до ${fmt(max!)} ₽`;
};

const ArtistCard = ({ artist }: { artist: Artist }) => {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:border-primary/40 hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.3)]">
      <Link to={`/artists/${artist.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-secondary">
        {artist.photo_url ? (
          <img
            src={artist.photo_url}
            alt={artist.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Music2 size={48} />
          </div>
        )}
        {artist.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground backdrop-blur">
            Топ
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-card via-card/70 to-transparent p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">
            {formatPrice(artist.price_min, artist.price_max)}
          </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <Link to={`/artists/${artist.slug}`}>
            <h3 className="font-display text-lg font-bold leading-tight hover:text-primary transition-colors">{artist.name}</h3>
          </Link>
          {artist.short_description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{artist.short_description}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {artist.genres.slice(0, 3).map((g) => (
            <span key={g} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              {g}
            </span>
          ))}
        </div>
        {artist.cities.length > 0 && (
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <MapPin size={11} /> {artist.cities.slice(0, 2).join(", ")}
          </div>
        )}
        <div className="mt-auto flex gap-2 pt-2">
          <Link
            to={`/artists/${artist.slug}`}
            className="flex-1 rounded-full border border-border px-3 py-2 text-center text-xs font-semibold hover:border-primary/60 transition-colors"
          >
            Подробнее
          </Link>
          <Link
            to={`/contacts?artist=${artist.slug}`}
            className="flex-1 rounded-full bg-primary px-3 py-2 text-center text-xs font-semibold text-primary-foreground hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] transition-all"
          >
            Забронировать
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ArtistCard;
