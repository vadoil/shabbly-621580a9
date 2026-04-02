import Layout from "@/components/Layout";
import { useGalleryAlbums } from "@/hooks/use-data";
import { getPublicStorageUrl } from "@/lib/storage";
import { Link } from "react-router-dom";
import { Image, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";

const PAGE_SIZE = 30;

const useGalleryPage = (page: number) =>
  useQuery({
    queryKey: ["gallery_items_paged", page],
    queryFn: async () => {
      // Count total (excluding thumbs)
      const { count } = await supabase
        .from("gallery_items")
        .select("*", { count: "exact", head: true })
        .eq("published", true)
        .not("image_url", "ilike", "%thumb%");

      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .eq("published", true)
        .not("image_url", "ilike", "%thumb%")
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;
      return { items: data, total: count || 0 };
    },
  });

const GalleryPage = () => {
  const { data: albums, isLoading: albumsLoading } = useGalleryAlbums();
  const [page, setPage] = useState(0);
  const { data, isLoading: itemsLoading } = useGalleryPage(page);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;
  const isLoading = albumsLoading || itemsLoading;

  return (
    <Layout>
      <section className="container py-16 space-y-8">
        <div className="space-y-2">
          <h1 className="font-display text-4xl md:text-5xl font-bold">Галерея</h1>
          <p className="text-muted-foreground">Фото с концертов, бэкстейджа и студии</p>
        </div>

        {/* Albums */}
        {albums && albums.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold">Альбомы</h2>
            <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {albums.map((a) => (
                <Link key={a.id} to={`/gallery/${a.slug}`} className="group space-y-3">
                  <div className="aspect-video rounded-xl overflow-hidden bg-secondary border border-border group-hover:border-primary/40 transition-all">
                    {a.cover_url ? (
                      <img src={getPublicStorageUrl(a.cover_url)} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/30"><Image size={32} /></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold group-hover:text-primary transition-colors">{a.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Photos grid */}
        {isLoading ? (
          <LoadingSkeleton count={12} />
        ) : data && data.items.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Все фото</h2>
              <span className="text-sm text-muted-foreground">{data.total} фото</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {data.items.map((item) => (
                <button key={item.id} onClick={() => setLightbox(item.image_url)} className="aspect-square rounded-xl overflow-hidden bg-secondary group cursor-pointer">
                  <img src={getPublicStorageUrl(item.image_url)} alt={item.caption || ""} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </button>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="p-2 rounded-lg border border-border bg-card hover:bg-secondary disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      i === page
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-card hover:bg-secondary text-foreground"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="p-2 rounded-lg border border-border bg-card hover:bg-secondary disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <EmptyState icon={Image} title="Фотографии скоро появятся" description="Следите за обновлениями" />
        )}
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 text-muted-foreground hover:text-foreground z-10"><X size={28} /></button>
          <img src={getPublicStorageUrl(lightbox)} alt="" className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </Layout>
  );
};

export default GalleryPage;
