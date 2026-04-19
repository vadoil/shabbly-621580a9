import Layout from "@/components/Layout";
import { useReleaseBySlug } from "@/hooks/use-data";
import { useParams, Link } from "react-router-dom";
import { formatDate, platformLabels, platformColors } from "@/lib/format";
import { getPublicStorageUrl } from "@/lib/storage";
import { Music, Play, Pause, ArrowLeft, ExternalLink } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import SafeImage from "@/components/SafeImage";

const ReleaseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: release, isLoading } = useReleaseBySlug(slug || "");
  const [playing, setPlaying] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  const togglePlay = (trackId: string, url: string) => {
    if (playing === trackId) {
      audioRef.current?.pause();
      setPlaying(null);
      clearInterval(intervalRef.current);
      return;
    }
    audioRef.current?.pause();
    clearInterval(intervalRef.current);
    const audio = new Audio(url);
    audio.play();
    audio.onended = () => {
      setPlaying(null);
      setProgress(0);
      clearInterval(intervalRef.current);
    };
    audioRef.current = audio;
    setPlaying(trackId);
    intervalRef.current = window.setInterval(() => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    }, 200);
  };

  if (isLoading) return <Layout><div className="container py-16"><LoadingSkeleton variant="hero" /></div></Layout>;
  if (!release) return (
    <Layout>
      <div className="container py-16 text-center space-y-4">
        <Music size={64} className="mx-auto text-muted-foreground/20" />
        <p className="text-muted-foreground font-display text-xl">Релиз не найден</p>
        <Link to="/music" className="text-sm text-primary hover:underline">← Все релизы</Link>
      </div>
    </Layout>
  );

  const tracks = release.tracks?.sort((a, b) => a.order_index - b.order_index) || [];
  const links = release.platform_links || [];
  const hasAudio = tracks.some((t) => t.audio_url);
  const playingTrack = tracks.find((t) => t.id === playing);

  return (
    <Layout>
      <section className="container py-16">
        <Link to="/music" className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft size={14} /> Все релизы
        </Link>
        <div className="grid gap-10 md:grid-cols-[minmax(280px,400px)_1fr]">
          <div className="sticky top-24 aspect-square overflow-hidden rounded-2xl bg-secondary glow-fuchsia">
            <SafeImage
              src={getPublicStorageUrl(release.cover_url)}
              alt={release.title}
              className="h-full w-full object-cover"
              fallbackClassName="flex h-full w-full items-center justify-center text-muted-foreground"
              iconSize={80}
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">{release.type}</p>
              <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">{release.title}</h1>
              {release.release_date && <p className="mt-3 text-sm text-muted-foreground">{formatDate(release.release_date)}</p>}
              {release.description && <p className="mt-4 leading-relaxed text-secondary-foreground">{release.description}</p>}
            </div>

            {(release as any).artist && (() => {
              const a = (release as any).artist;
              return (
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/50">
                  <Link to={`/artists/${a.slug}`} className="shrink-0">
                    <div className="h-20 w-20 overflow-hidden rounded-xl bg-secondary">
                      <SafeImage
                        src={a.photo_url}
                        alt={a.name}
                        className="h-full w-full object-cover"
                        fallbackClassName="flex h-full w-full items-center justify-center text-muted-foreground"
                        iconSize={28}
                      />
                    </div>
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Исполнитель</p>
                    <Link to={`/artists/${a.slug}`} className="block truncate font-display text-xl font-bold transition-colors hover:text-primary">
                      {a.name}
                    </Link>
                    {a.short_description && <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{a.short_description}</p>}
                  </div>
                  <div className="shrink-0 flex flex-col gap-2">
                    <Link to={`/artists/${a.slug}`} className="rounded-full border border-border px-4 py-1.5 text-center text-xs font-semibold text-foreground transition-colors hover:border-primary/60 hover:text-primary">
                      Профиль
                    </Link>
                    <Link to={`/services?artist=${a.id}`} className="rounded-full bg-primary px-4 py-1.5 text-center text-xs font-semibold text-primary-foreground transition-all hover:shadow-[0_0_20px_hsl(322_80%_55%/0.4)]">
                      Заказать
                    </Link>
                  </div>
                </div>
              );
            })()}

            {links.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">Слушать</h3>
                <div className="flex flex-wrap gap-2">
                  {links.map((pl) => (
                    <a key={pl.id} href={pl.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-opacity hover:opacity-80 ${platformColors[pl.platform] || "bg-secondary text-foreground"}`}>
                      <ExternalLink size={12} />
                      {platformLabels[pl.platform] || pl.platform}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {tracks.length > 0 && (
              <div className="space-y-1">
                <h3 className="mb-4 font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">Треклист</h3>
                {tracks.map((t, i) => (
                  <div key={t.id} className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${playing === t.id ? "border border-primary/20 bg-primary/10" : "hover:bg-secondary"}`}>
                    <span className="w-5 text-right font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                    {t.audio_url ? (
                      <button onClick={() => togglePlay(t.id, t.audio_url!)} className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20">
                        {playing === t.id ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                      </button>
                    ) : (
                      <span className="w-8" />
                    )}
                    <span className="flex-1 text-sm font-medium">{t.title}</span>
                    {t.duration_sec && (
                      <span className="font-mono text-xs text-muted-foreground">
                        {Math.floor(t.duration_sec / 60)}:{String(t.duration_sec % 60).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!hasAudio && links.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-8 text-center">
                <Music size={32} className="mx-auto mb-2 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Скоро будет доступно для прослушивания</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {playingTrack && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl">
          <div className="h-0.5 bg-secondary">
            <div className="h-full bg-primary transition-all duration-200" style={{ width: `${progress}%` }} />
          </div>
          <div className="container flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => togglePlay(playingTrack.id, playingTrack.audio_url!)} className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Pause size={16} />
              </button>
              <div>
                <p className="text-sm font-medium">{playingTrack.title}</p>
                <p className="text-xs text-muted-foreground">{release.title}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ReleaseDetail;
