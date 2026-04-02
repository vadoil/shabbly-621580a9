import Layout from "@/components/Layout";
import { usePublishedReleases } from "@/hooks/use-data";
import { Link } from "react-router-dom";
import { formatDateShort } from "@/lib/format";
import { getPublicStorageUrl } from "@/lib/storage";
import { Music } from "lucide-react";
import { useState } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";

const TYPES = [
  { value: "", label: "Все" },
  { value: "album", label: "Альбомы" },
  { value: "single", label: "Синглы" },
  { value: "ep", label: "EP" },
];

const MusicPage = () => {
  const { data: releases, isLoading } = usePublishedReleases();
  const [typeFilter, setTypeFilter] = useState("");

  const filtered = typeFilter ? releases?.filter((r) => r.type === typeFilter) : releases;

  return (
    <Layout>
      <section className="container py-16 space-y-8">
        <div className="space-y-2">
          <h1 className="font-display text-4xl md:text-5xl font-bold">Музыка</h1>
          <p className="text-muted-foreground">Все релизы SHABBLY</p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setTypeFilter(t.value)}
              className={`rounded-full px-5 py-2 text-xs font-medium transition-all ${
                typeFilter === t.value
                  ? "bg-primary text-primary-foreground shadow-[0_0_15px_hsl(322_80%_55%/0.3)]"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <LoadingSkeleton count={8} />
        ) : filtered && filtered.length > 0 ? (
          <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((r) => (
              <Link key={r.id} to={`/music/${r.slug}`} className="group space-y-3">
                <div className="aspect-square rounded-xl overflow-hidden bg-secondary border border-border group-hover:border-primary/40 group-hover:glow-fuchsia transition-all">
                  {r.cover_url ? (
                    <img src={getPublicStorageUrl(r.cover_url)} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Music size={48} /></div>
                  )}
                </div>
                <div>
                  <h3 className="font-display font-semibold truncate group-hover:text-primary transition-colors">{r.title}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{r.type}{r.release_date && ` · ${formatDateShort(r.release_date)}`}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState icon={Music} title="Релизов пока нет" description="Скоро здесь появятся треки" />
        )}
      </section>
    </Layout>
  );
};

export default MusicPage;
