import Layout from "@/components/Layout";
import { useReleaseBySlug } from "@/hooks/use-data";
import { useParams } from "react-router-dom";
import { formatDate, platformLabels, platformColors } from "@/lib/format";
import { Music, Play, Pause } from "lucide-react";
import { useRef, useState } from "react";

const ReleaseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: release, isLoading } = useReleaseBySlug(slug || "");
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = (trackId: string, url: string) => {
    if (playing === trackId) {
      audioRef.current?.pause();
      setPlaying(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      const audio = new Audio(url);
      audio.play();
      audio.onended = () => setPlaying(null);
      audioRef.current = audio;
      setPlaying(trackId);
    }
  };

  if (isLoading) return <Layout><div className="container py-16"><div className="animate-pulse h-64 bg-secondary rounded-lg" /></div></Layout>;
  if (!release) return <Layout><div className="container py-16"><p className="text-muted-foreground">Релиз не найден.</p></div></Layout>;

  const tracks = release.tracks?.sort((a, b) => a.order_index - b.order_index) || [];
  const links = release.platform_links || [];

  return (
    <Layout>
      <section className="container py-16">
        <div className="grid gap-8 md:grid-cols-[300px_1fr] lg:grid-cols-[400px_1fr]">
          <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
            {release.cover_url ? (
              <img src={release.cover_url} alt={release.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Music size={64} /></div>
            )}
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-xs font-medium text-primary uppercase tracking-wider">{release.type}</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">{release.title}</h1>
              {release.release_date && <p className="text-sm text-muted-foreground mt-2">{formatDate(release.release_date)}</p>}
              {release.description && <p className="text-sm text-secondary-foreground mt-4 leading-relaxed">{release.description}</p>}
            </div>

            {/* Platform links */}
            {links.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {links.map((pl) => (
                  <a
                    key={pl.id}
                    href={pl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 rounded-md px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-80 ${platformColors[pl.platform] || "bg-secondary text-foreground"}`}
                  >
                    {platformLabels[pl.platform] || pl.platform}
                  </a>
                ))}
              </div>
            )}

            {/* Tracklist */}
            {tracks.length > 0 && (
              <div className="space-y-1">
                <h3 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Треклист</h3>
                {tracks.map((t, i) => (
                  <div key={t.id} className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-secondary transition-colors">
                    <span className="text-xs text-muted-foreground w-5 text-right">{i + 1}</span>
                    {t.audio_url ? (
                      <button onClick={() => togglePlay(t.id, t.audio_url!)} className="text-primary hover:opacity-80">
                        {playing === t.id ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                    ) : (
                      <span className="w-4" />
                    )}
                    <span className="flex-1 text-sm">{t.title}</span>
                    {t.duration_sec && (
                      <span className="text-xs text-muted-foreground">
                        {Math.floor(t.duration_sec / 60)}:{String(t.duration_sec % 60).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ReleaseDetail;
