import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { Play, Pause, Music2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const PLATFORM_LABEL: Record<string, { label: string; color: string }> = {
  yandex: { label: "Яндекс Музыка", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" },
  spotify: { label: "Spotify", color: "bg-green-500/10 text-green-400 border-green-500/30" },
  apple: { label: "Apple Music", color: "bg-pink-500/10 text-pink-400 border-pink-500/30" },
  youtube: { label: "YouTube", color: "bg-red-500/10 text-red-400 border-red-500/30" },
};

const fmtDur = (s: number | null) => {
  if (!s) return "";
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const ArtistMusicSection = ({ artistId }: { artistId: string }) => {
  const { data: releases } = useQuery({
    queryKey: ["artist_releases", artistId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("releases")
        .select("*, tracks(*), platform_links(*)")
        .eq("artist_id", artistId)
        .eq("published", true)
        .order("release_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = (trackId: string, url: string | null) => {
    if (!url) return;
    if (playingId === trackId) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(url);
    audio.play().catch(() => {});
    audio.addEventListener("ended", () => setPlayingId(null));
    audioRef.current = audio;
    setPlayingId(trackId);
  };

  if (!releases || releases.length === 0) return null;

  return (
    <section className="container py-14 space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Дискография</span>
          <h2 className="font-display text-3xl font-bold mt-2 flex items-center gap-2">
            <Music2 size={24} className="text-primary" /> Музыка
          </h2>
        </div>
      </div>

      <div className="space-y-10">
        {releases.map((r: any) => {
          const tracks = (r.tracks || []).sort((a: any, b: any) => a.order_index - b.order_index);
          const links = r.platform_links || [];
          return (
            <div key={r.id} className="grid lg:grid-cols-[260px_1fr] gap-6 rounded-2xl border border-border/60 bg-card p-5">
              <div className="space-y-3">
                <Link to={`/music/${r.slug}`} className="block aspect-square rounded-xl overflow-hidden bg-secondary group">
                  {r.cover_url ? (
                    <img src={r.cover_url} alt={r.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground"><Music2 size={48} /></div>
                  )}
                </Link>
                <div>
                  <Link to={`/music/${r.slug}`}>
                    <h3 className="font-display font-bold text-lg hover:text-primary transition-colors">{r.title}</h3>
                  </Link>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {r.type === "album" ? "Альбом" : r.type === "single" ? "Сингл" : "EP"}
                    {r.release_date && ` · ${new Date(r.release_date).getFullYear()}`}
                  </p>
                </div>

                {links.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {links.map((l: any) => {
                      const meta = PLATFORM_LABEL[l.platform];
                      if (!meta) return null;
                      return (
                        <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider hover:scale-105 transition-transform ${meta.color}`}>
                          {meta.label} <ExternalLink size={9} />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                {tracks.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">Треки появятся скоро</p>
                ) : (
                  tracks.map((t: any, i: number) => {
                    const isPlaying = playingId === t.id;
                    return (
                      <div key={t.id} className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${isPlaying ? "bg-primary/10" : "hover:bg-secondary/50"}`}>
                        <button
                          onClick={() => togglePlay(t.id, t.audio_url)}
                          disabled={!t.audio_url}
                          className={`shrink-0 flex h-9 w-9 items-center justify-center rounded-full transition-all ${isPlaying ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground group-hover:bg-primary group-hover:text-primary-foreground"} ${!t.audio_url && "opacity-30 cursor-not-allowed"}`}
                        >
                          {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                        </button>
                        <span className="w-6 text-xs text-muted-foreground tabular-nums">{(i + 1).toString().padStart(2, "0")}</span>
                        <span className={`flex-1 text-sm font-medium truncate ${isPlaying ? "text-primary" : ""}`}>{t.title}</span>
                        <span className="text-xs text-muted-foreground tabular-nums">{fmtDur(t.duration_sec)}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ArtistMusicSection;
