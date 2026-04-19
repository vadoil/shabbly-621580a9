import Layout from "@/components/Layout";
import { useReleaseBySlug } from "@/hooks/use-data";
import { useParams, Link } from "react-router-dom";
import { formatDate, platformLabels, platformColors } from "@/lib/format";
import { getPublicStorageUrl } from "@/lib/storage";
import { Music, Play, Pause, ArrowLeft, ExternalLink } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

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
    audio.onended = () => { setPlaying(null); setProgress(0); clearInterval(intervalRef.current); };
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
        <Link to="/music" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft size={14} /> Все релизы
        </Link>
        <div className="grid gap-10 md:grid-cols-[minmax(280px,400px)_1fr]">
          <div className="aspect-square rounded-2xl overflow-hidden bg-secondary glow-fuchsia sticky top-24 relative">
            {release.cover_url ? (
              <img
                src={getPublicStorageUrl(release.cover_url)}
                alt={release.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const t = e.currentTarget;
                  t.style.display = "none";
                  t.parentElement?.classList.add("flex", "items-center", "justify-center");
                  const ph = document.createElement("div");
                  ph.className = "text-muted-foreground";
                  ph.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>';
                  t.parentElement?.appendChild(ph);
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Music size={80} /></div>
            )}
          </div>
          <div className="space-y-8">
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest">{release.type}</p>
              <h1 className="font-display text-4xl md:text-5xl font-bold mt-2">{release.title}</h1>
              {release.release_date && <p className="text-sm text-muted-foreground mt-3">{formatDate(release.release_date)}</p>}
              {release.description && <p className="text-secondary-foreground mt-4 leading-relaxed">{release.description}</p>}
            </div>

            {/* Artist card */}
            {(release as any).artist && (() => {
              const a = (release as any).artist;
              return (
                <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4 hover:border-primary/50 transition-colors">
                  <Link to={`/artists/${a.slug}`} className="shrink-0">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-secondary">
                      {a.photo_url ? (
                        <img src={a.photo_url} alt={a.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Music size={28} /></div>
                      )}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Исполнитель</p>
                    <Link to={`/artists/${a.slug}`} className="font-display text-xl font-bold hover:text-primary transition-colors block truncate">
                      {a.name}
                    </Link>
                    {a.short_description && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{a.short_description}</p>}
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Link to={`/artists/${a.slug}`} className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:border-primary/60 hover:text-primary transition-colors text-center">
                      Профиль
                    </Link>
                    <Link to={`/services?artist=${a.id}`} className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:shadow-[0_0_20px_hsl(322_80%_55%/0.4)] transition-all text-center">
                      Заказать
                    </Link>
                  </div>
                </div>
              );
            })()}

            {/* Platform links */}
            {links.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-display text-xs font-semibold text-muted-foreground uppercase tracking-widest">Слушать</h3>
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

            {/* Tracklist */}
            {tracks.length > 0 && (
              <div className="space-y-1">
                <h3 className="font-display text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Треклист</h3>
                {tracks.map((t, i) => (
                  <div key={t.id} className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${playing === t.id ? "bg-primary/10 border border-primary/20" : "hover:bg-secondary"}`}>
                    <span className="text-xs text-muted-foreground w-5 text-right font-mono">{String(i + 1).padStart(2, "0")}</span>
                    {t.audio_url ? (
                      <button onClick={() => togglePlay(t.id, t.audio_url!)} className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
                        {playing === t.id ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                      </button>
                    ) : (
                      <span className="w-8" />
                    )}
                    <span className="flex-1 text-sm font-medium">{t.title}</span>
                    {t.duration_sec && (
                      <span className="text-xs text-muted-foreground font-mono">
                        {Math.floor(t.duration_sec / 60)}:{String(t.duration_sec % 60).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!hasAudio && links.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-8 text-center">
                <Music size={32} className="mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">Скоро будет доступно для прослушивания</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sticky mini-player */}
      {playingTrack && (
        <div className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl">
          <div className="h-0.5 bg-secondary">
            <div className="h-full bg-primary transition-all duration-200" style={{ width: `${progress}%` }} />
          </div>
          <div className="container flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => togglePlay(playingTrack.id, playingTrack.audio_url!)} className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
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
