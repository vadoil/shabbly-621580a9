import Layout from "@/components/Layout";
import { usePublishedReleases } from "@/hooks/use-data";
import { Link } from "react-router-dom";
import { formatDateShort } from "@/lib/format";
import { Music } from "lucide-react";

const MusicPage = () => {
  const { data: releases, isLoading } = usePublishedReleases();

  return (
    <Layout>
      <section className="container py-16 space-y-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold">Музыка</h1>
        {isLoading ? (
          <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3 animate-pulse">
                <div className="aspect-square rounded-lg bg-secondary" />
                <div className="h-4 w-2/3 rounded bg-secondary" />
              </div>
            ))}
          </div>
        ) : releases && releases.length > 0 ? (
          <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {releases.map((r) => (
              <Link key={r.id} to={`/music/${r.slug}`} className="group space-y-3">
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                  {r.cover_url ? (
                    <img src={r.cover_url} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Music size={48} /></div>
                  )}
                </div>
                <div>
                  <h3 className="font-display font-semibold truncate">{r.title}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{r.type}{r.release_date && ` · ${formatDateShort(r.release_date)}`}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Релизов пока нет.</p>
        )}
      </section>
    </Layout>
  );
};

export default MusicPage;
