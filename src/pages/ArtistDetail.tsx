import { Link, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import InquiryForm from "@/components/InquiryForm";
import ArtistCard from "@/components/ArtistCard";
import { useArtistBySlug, useArtistMedia, useRelatedArtists } from "@/hooks/use-agency-data";
import { ArrowLeft, MapPin, Music2, Wallet, FileText } from "lucide-react";

const formatPrice = (min: number | null, max: number | null) => {
  if (!min && !max) return "По запросу";
  const fmt = (n: number) => n.toLocaleString("ru-RU");
  if (min && max) return `${fmt(min)} – ${fmt(max)} ₽`;
  if (min) return `от ${fmt(min)} ₽`;
  return `до ${fmt(max!)} ₽`;
};

const ArtistDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: artist, isLoading } = useArtistBySlug(slug);
  const { data: media } = useArtistMedia(artist?.id);
  const { data: related } = useRelatedArtists(artist || undefined);

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-20 text-sm text-muted-foreground">Загрузка…</div>
      </Layout>
    );
  }

  if (!artist) {
    return (
      <Layout>
        <div className="container py-20 text-center space-y-4">
          <h1 className="font-display text-3xl font-bold">Артист не найден</h1>
          <Link to="/artists" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft size={14} /> К каталогу
          </Link>
        </div>
      </Layout>
    );
  }

  const photos = (media || []).filter((m: any) => m.type === "photo");
  const videos = (media || []).filter((m: any) => m.type === "video");

  return (
    <Layout>
      <section className="border-b border-border/40 bg-gradient-to-b from-secondary/30 to-background">
        <div className="container py-10">
          <Link to="/artists" className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary">
            <ArrowLeft size={12} /> Все артисты
          </Link>
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] items-start">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-secondary">
              {artist.photo_url ? (
                <img src={artist.photo_url} alt={artist.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <Music2 size={64} />
                </div>
              )}
            </div>
            <div className="space-y-6">
              <div>
                {artist.featured && (
                  <span className="inline-block rounded-full bg-primary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary mb-3">
                    Топ-артист агентства
                  </span>
                )}
                <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight">{artist.name}</h1>
                {artist.short_description && (
                  <p className="mt-3 text-base text-muted-foreground">{artist.short_description}</p>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border/60 bg-card p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Wallet size={12} /> Бюджет
                  </div>
                  <div className="mt-1 font-display text-lg font-bold">{formatPrice(artist.price_min, artist.price_max)}</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-card p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <MapPin size={12} /> География
                  </div>
                  <div className="mt-1 text-sm">{(artist.cities || []).join(", ") || "По запросу"}</div>
                </div>
              </div>

              {artist.genres?.length > 0 && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Жанры</div>
                  <div className="flex flex-wrap gap-2">
                    {artist.genres.map((g: string) => (
                      <span key={g} className="rounded-full bg-secondary px-3 py-1 text-xs">{g}</span>
                    ))}
                  </div>
                </div>
              )}

              {artist.formats?.length > 0 && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Форматы</div>
                  <div className="flex flex-wrap gap-2">
                    {artist.formats.map((f: string) => (
                      <span key={f} className="rounded-full border border-border px-3 py-1 text-xs">{f}</span>
                    ))}
                  </div>
                </div>
              )}

              <a
                href="#booking"
                className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] transition-all"
              >
                Забронировать артиста
              </a>
            </div>
          </div>
        </div>
      </section>

      {artist.bio && (
        <section className="container py-14">
          <h2 className="font-display text-2xl font-bold mb-4">О артисте</h2>
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground whitespace-pre-line">{artist.bio}</p>
        </section>
      )}

      {photos.length > 0 && (
        <section className="container py-10">
          <h2 className="font-display text-2xl font-bold mb-5">Фото</h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {photos.map((m: any) => (
              <div key={m.id} className="aspect-square overflow-hidden rounded-xl bg-secondary">
                <img src={m.url} alt={m.caption || artist.name} loading="lazy" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {videos.length > 0 && (
        <section className="container py-10">
          <h2 className="font-display text-2xl font-bold mb-5">Видео</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {videos.map((m: any) => (
              <div key={m.id} className="aspect-video overflow-hidden rounded-xl bg-secondary">
                <iframe src={m.url} title={m.caption || artist.name} className="h-full w-full" allowFullScreen />
              </div>
            ))}
          </div>
        </section>
      )}

      {artist.rider && (
        <section className="container py-10">
          <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
            <FileText size={20} /> Технический райдер
          </h2>
          <pre className="max-w-3xl whitespace-pre-wrap rounded-2xl border border-border/60 bg-card p-5 text-sm text-muted-foreground font-sans">
            {artist.rider}
          </pre>
        </section>
      )}

      <section id="booking" className="border-t border-border/40 bg-secondary/20">
        <div className="container py-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] items-start">
            <div>
              <h2 className="font-display text-3xl font-bold">Забронировать {artist.name}</h2>
              <p className="mt-3 text-sm text-muted-foreground max-w-md">
                Заполните форму, и менеджер свяжется в течение 24 часов с подробным предложением: даты, условия, технические требования.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-6">
              <InquiryForm artistId={artist.id} />
            </div>
          </div>
        </div>
      </section>

      {related && related.length > 0 && (
        <section className="container py-14">
          <h2 className="font-display text-2xl font-bold mb-5">Похожие артисты</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((a: any) => (
              <ArtistCard key={a.id} artist={a} />
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ArtistDetail;
