import { Link } from "react-router-dom";
import { ArrowRight, Search, Music2 } from "lucide-react";
import { useArtists } from "@/hooks/use-agency-data";
import ArtistCard from "@/components/ArtistCard";
import EmptyState from "@/components/EmptyState";

const AgencyArtistMatcher = () => {
  // Try featured first, fallback to all
  const { data: featured, isLoading: l1 } = useArtists({ featured: true, limit: 8 });
  const { data: all, isLoading: l2 } = useArtists({ limit: 8 });
  const isLoading = l1 || l2;
  const artists = featured && featured.length > 0 ? featured : all;

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,hsl(322_80%_55%/0.08)_0%,transparent_70%)]" />
      <div className="container relative z-10 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="flex items-start gap-4 max-w-2xl">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary shrink-0">
              <Search size={22} />
            </div>
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium">Наш состав</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tighter">
                Артисты агентства
              </h2>
              <p className="text-muted-foreground">
                Подберём идеального исполнителя под формат вашего мероприятия — от джаза до электроники.
              </p>
            </div>
          </div>
          <Link
            to="/artists"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline shrink-0"
          >
            Весь каталог <ArrowRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-2xl bg-card animate-pulse" />
            ))}
          </div>
        ) : artists && artists.length > 0 ? (
          <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {artists.slice(0, 4).map((a) => (
              <ArtistCard key={a.id} artist={a} />
            ))}
          </div>
        ) : (
          <EmptyState icon={Music2} title="Скоро добавим артистов" description="Каталог наполняется" />
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/artists"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] transition-all"
          >
            Открыть каталог артистов <ArrowRight size={14} />
          </Link>
          <Link
            to="/contacts"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-6 py-3 text-sm font-semibold text-foreground hover:border-primary/40 transition-colors"
          >
            Получить персональную подборку
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AgencyArtistMatcher;
