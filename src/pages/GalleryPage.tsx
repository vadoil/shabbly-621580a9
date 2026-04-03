import Layout from "@/components/Layout";
import { useGalleryAlbums } from "@/hooks/use-data";
import { getPublicStorageUrl } from "@/lib/storage";
import { Link } from "react-router-dom";
import { Image, X } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";

const useGalleryLatest = () =>
  useQuery({
    queryKey: ["gallery_items_latest_30"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .eq("published", true)
        .not("image_url", "ilike", "%thumb%")
        .order("created_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return data;
    },
  });

const GalleryPage = () => {
  const { data: albums, isLoading: albumsLoading } = useGalleryAlbums();
  const { data: items, isLoading: itemsLoading } = useGalleryLatest();
  const [lightbox, setLightbox] = useState<string | null>(null);

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
        ) : items && items.length > 0 ? (
          <div className="space-y-6">
            <h2 className="font-display text-xl font-semibold">Последние фото</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {items.map((item) => (
                <button key={item.id} onClick={() => setLightbox(item.image_url)} className="aspect-square rounded-xl overflow-hidden bg-secondary group cursor-pointer">
                  <img src={getPublicStorageUrl(item.image_url)} alt={item.caption || ""} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </button>
              ))}
            </div>
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
