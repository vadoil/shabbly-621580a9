import Layout from "@/components/Layout";
import { getPublicStorageUrl , proxify} from "@/lib/storage";
import { Image, X, Play } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";

const useAllGalleryItems = () =>
  useQuery({
    queryKey: ["gallery_items_all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

const GalleryPage = () => {
  const { data: items, isLoading } = useAllGalleryItems();
  const [lightbox, setLightbox] = useState<{ url: string; type: string } | null>(null);

  return (
    <Layout>
      <section className="container py-16 space-y-8">
        <div className="space-y-2">
          <h1 className="font-display text-4xl md:text-5xl font-bold">Галерея</h1>
          <p className="text-muted-foreground">Фото и видео с концертов, бэкстейджа и студии</p>
        </div>

        {isLoading ? (
          <LoadingSkeleton count={12} />
        ) : items && items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {items.map((item: any) => {
              const url = getPublicStorageUrl(item.image_url);
              const isVideo = item.media_type === "video" || /\.(mp4|webm|mov)$/i.test(item.image_url);
              return (
                <button
                  key={item.id}
                  onClick={() => setLightbox({ url, type: isVideo ? "video" : "image" })}
                  className="relative aspect-square rounded-xl overflow-hidden bg-secondary group cursor-pointer"
                >
                  {isVideo ? (
                    <>
                      <video src={url} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-background/30 group-hover:bg-background/10 transition-colors">
                        <div className="rounded-full bg-primary/90 p-3 shadow-[0_0_30px_hsl(var(--primary)/0.5)]">
                          <Play size={20} className="text-primary-foreground fill-primary-foreground" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <img src={proxify(url)} alt={item.caption || ""} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <EmptyState icon={Image} title="Фотографии скоро появятся" description="Следите за обновлениями" />
        )}
      </section>

      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 text-muted-foreground hover:text-foreground z-10" aria-label="Закрыть"><X size={28} /></button>
          {lightbox.type === "video" ? (
            <video src={lightbox.url} controls autoPlay className="max-w-full max-h-[90vh] rounded-lg" onClick={(e) => e.stopPropagation()} />
          ) : (
            <img src={proxify(lightbox.url)} alt="" className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
          )}
        </div>
      )}
    </Layout>
  );
};

export default GalleryPage;
