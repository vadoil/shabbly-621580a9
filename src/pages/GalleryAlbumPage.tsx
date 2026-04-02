import Layout from "@/components/Layout";
import { useGalleryAlbum } from "@/hooks/use-data";
import { getPublicStorageUrl } from "@/lib/storage";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Image, X } from "lucide-react";
import { useState } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

const GalleryAlbumPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: album, isLoading } = useGalleryAlbum(slug || "");
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (isLoading) return <Layout><div className="container py-16"><LoadingSkeleton variant="hero" /></div></Layout>;
  if (!album) return (
    <Layout>
      <div className="container py-16 text-center">
        <Image size={64} className="mx-auto text-muted-foreground/20 mb-4" />
        <p className="text-muted-foreground">Альбом не найден</p>
        <Link to="/gallery" className="text-sm text-primary hover:underline mt-2 inline-block">← Галерея</Link>
      </div>
    </Layout>
  );

  const items = (album.gallery_items || []).sort((a: any, b: any) => a.sort_order - b.sort_order);

  return (
    <Layout>
      <section className="container py-16 space-y-8">
        <Link to="/gallery" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft size={14} /> Галерея
        </Link>
        <div className="space-y-2">
          <h1 className="font-display text-4xl font-bold">{album.title}</h1>
          {album.description && <p className="text-muted-foreground">{album.description}</p>}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((item: any) => (
            <button key={item.id} onClick={() => setLightbox(item.image_url)} className="aspect-square rounded-xl overflow-hidden bg-secondary group cursor-pointer">
              <img src={getPublicStorageUrl(item.image_url)} alt={item.caption || ""} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </button>
          ))}
        </div>
      </section>
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 text-muted-foreground hover:text-foreground"><X size={28} /></button>
          <img src={getPublicStorageUrl(lightbox)} alt="" className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </Layout>
  );
};

export default GalleryAlbumPage;
