import Layout from "@/components/Layout";
import { usePublishedNews } from "@/hooks/use-data";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib/format";

import { proxify } from "@/lib/storage";
const NewsPage = () => {
  const { data: news, isLoading } = usePublishedNews();

  return (
    <Layout>
      <section className="container py-16 space-y-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold">Новости</h1>
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3 animate-pulse">
                <div className="aspect-video rounded-lg bg-secondary" />
                <div className="h-4 w-2/3 rounded bg-secondary" />
              </div>
            ))}
          </div>
        ) : news && news.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((n) => (
              <Link key={n.id} to={`/news/${n.slug}`} className="group space-y-3">
                {n.cover_url && (
                  <div className="aspect-video rounded-lg overflow-hidden bg-secondary">
                    <img src={proxify(n.cover_url)} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">{n.published_at && formatDate(n.published_at)}</p>
                  <h3 className="font-display font-semibold line-clamp-2 mt-1">{n.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mt-1">{n.content}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Новостей пока нет.</p>
        )}
      </section>
    </Layout>
  );
};

export default NewsPage;
