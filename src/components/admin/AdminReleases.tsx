import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Upload, Star, Music, Play, Pause } from "lucide-react";

const AdminReleases = () => {
  const qc = useQueryClient();
  const { data: releases, isLoading } = useQuery({
    queryKey: ["admin_releases"],
    queryFn: async () => {
      const { data, error } = await supabase.from("releases").select("*, tracks(*), platform_links(*), artist:artists(id, name)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: artists } = useQuery({
    queryKey: ["admin_releases_artists"],
    queryFn: async () => {
      const { data, error } = await supabase.from("artists").select("id, name").order("name");
      if (error) throw error;
      return data;
    },
  });

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", type: "single" as "album" | "single" | "ep", release_date: "", description: "", published: false, featured: false, artist_id: "" });

  const resetForm = () => { setForm({ title: "", slug: "", type: "single", release_date: "", description: "", published: false, featured: false, artist_id: "" }); setEditing(null); };

  const handleSave = async () => {
    if (!form.title || !form.slug) return toast.error("Заполните название и slug");
    const payload = { title: form.title, slug: form.slug, type: form.type, release_date: form.release_date || null, description: form.description || null, published: form.published, featured: form.featured, artist_id: form.artist_id || null };
    if (editing) {
      const { error } = await supabase.from("releases").update(payload).eq("id", editing);
      if (error) return toast.error(error.message);
      toast.success("Обновлено");
    } else {
      const { error } = await supabase.from("releases").insert(payload);
      if (error) return toast.error(error.message);
      toast.success("Создано");
    }
    resetForm();
    qc.invalidateQueries({ queryKey: ["admin_releases"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить?")) return;
    await supabase.from("releases").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin_releases"] });
  };

  const handleCoverUpload = async (releaseId: string, file: File) => {
    const path = `releases/${releaseId}/${file.name}`;
    const { error: uploadErr } = await supabase.storage.from("covers").upload(path, file, { upsert: true });
    if (uploadErr) return toast.error(uploadErr.message);
    const { data: { publicUrl } } = supabase.storage.from("covers").getPublicUrl(path);
    await supabase.from("releases").update({ cover_url: publicUrl }).eq("id", releaseId);
    qc.invalidateQueries({ queryKey: ["admin_releases"] });
    toast.success("Обложка загружена");
  };

  const handleAudioUpload = async (trackId: string, file: File) => {
    const path = `tracks/${trackId}/${file.name}`;
    const { error: uploadErr } = await supabase.storage.from("audio").upload(path, file, { upsert: true });
    if (uploadErr) return toast.error(uploadErr.message);
    const { data: { publicUrl } } = supabase.storage.from("audio").getPublicUrl(path);
    await supabase.from("tracks").update({ audio_url: publicUrl }).eq("id", trackId);
    qc.invalidateQueries({ queryKey: ["admin_releases"] });
    toast.success("Аудио загружено");
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    await supabase.from("releases").update({ featured: !current }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin_releases"] });
    toast.success(!current ? "На главную" : "Убрано с главной");
  };

  // Track management
  const [trackForm, setTrackForm] = useState({ releaseId: "", title: "" });

  const addTrack = async () => {
    if (!trackForm.releaseId || !trackForm.title) return toast.error("Заполните название трека");
    const { error } = await supabase.from("tracks").insert({
      release_id: trackForm.releaseId,
      title: trackForm.title,
      published: true,
    });
    if (error) return toast.error(error.message);
    toast.success("Трек добавлен");
    setTrackForm({ releaseId: "", title: "" });
    qc.invalidateQueries({ queryKey: ["admin_releases"] });
  };

  const deleteTrack = async (id: string) => {
    await supabase.from("tracks").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin_releases"] });
  };

  // Audio preview
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = (url: string) => {
    if (playing === url) {
      audioRef.current?.pause();
      setPlaying(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      const a = new Audio(url);
      a.play();
      a.onended = () => setPlaying(null);
      audioRef.current = a;
      setPlaying(url);
    }
  };

  const startEdit = (r: any) => {
    setEditing(r.id);
    setForm({ title: r.title, slug: r.slug, type: r.type, release_date: r.release_date || "", description: r.description || "", published: r.published, featured: !!r.featured, artist_id: r.artist_id || "" });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Релизы</h2>

      {/* Form */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-semibold">{editing ? "Редактировать" : "Новый релиз"}</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <input placeholder="Название" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
          <input placeholder="Slug (URL)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground">
            <option value="single">Сингл</option>
            <option value="album">Альбом</option>
            <option value="ep">EP</option>
          </select>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <input type="date" value={form.release_date} onChange={(e) => setForm({ ...form, release_date: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
          <textarea placeholder="Описание" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground resize-none" rows={2} />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Опубликовать
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            <Star size={14} className="text-yellow-400" /> На главную
          </label>
          <button onClick={handleSave} className="rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90">
            {editing ? "Сохранить" : "Создать"}
          </button>
          {editing && <button onClick={resetForm} className="text-xs text-muted-foreground hover:text-foreground">Отмена</button>}
        </div>
      </div>

      {/* List */}
      {isLoading ? <p className="text-muted-foreground">Загрузка...</p> : (
        <div className="space-y-3">
          {releases?.map((r) => (
            <div key={r.id} className="rounded-lg border border-border bg-card p-4 space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-secondary overflow-hidden shrink-0">
                  {r.cover_url && <img src={r.cover_url} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {(r as any).featured && <Star size={12} className="inline text-yellow-400 mr-1" fill="currentColor" />}
                    {r.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{r.type} · {r.published ? "✓ Опубл." : "Черновик"}</p>
                </div>
                <button onClick={() => toggleFeatured(r.id, !!(r as any).featured)} className={`p-1.5 rounded-md ${(r as any).featured ? "text-yellow-400" : "text-muted-foreground hover:text-yellow-400"}`} title="На главную">
                  <Star size={14} fill={(r as any).featured ? "currentColor" : "none"} />
                </button>
                <label className="cursor-pointer shrink-0" title="Загрузить обложку">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleCoverUpload(r.id, e.target.files[0])} />
                  <Upload size={14} className="text-muted-foreground hover:text-foreground" />
                </label>
                <button onClick={() => startEdit(r)} className="text-muted-foreground hover:text-foreground"><Edit size={14} /></button>
                <button onClick={() => handleDelete(r.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
              </div>

              {/* Tracks */}
              {r.tracks && r.tracks.length > 0 && (
                <div className="pl-16 space-y-1">
                  {r.tracks.map((t: any) => (
                    <div key={t.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                      {t.audio_url ? (
                        <button onClick={() => togglePlay(t.audio_url)} className="text-primary hover:text-primary/80">
                          {playing === t.audio_url ? <Pause size={12} /> : <Play size={12} />}
                        </button>
                      ) : (
                        <Music size={12} className="text-muted-foreground/40" />
                      )}
                      <span className="flex-1 truncate">{t.title}</span>
                      <label className="cursor-pointer" title="Загрузить аудио">
                        <input type="file" accept="audio/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleAudioUpload(t.id, e.target.files[0])} />
                        <Upload size={10} className="text-muted-foreground hover:text-foreground" />
                      </label>
                      <button onClick={() => deleteTrack(t.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={10} /></button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add track */}
              {trackForm.releaseId === r.id ? (
                <div className="pl-16 flex gap-2">
                  <input placeholder="Название трека" value={trackForm.title} onChange={(e) => setTrackForm({ ...trackForm, title: e.target.value })} className="flex-1 rounded-md border border-input bg-secondary px-2 py-1 text-xs text-foreground" />
                  <button onClick={addTrack} className="rounded-md bg-primary px-2 py-1 text-[10px] font-semibold text-primary-foreground">Добавить</button>
                  <button onClick={() => setTrackForm({ releaseId: "", title: "" })} className="text-xs text-muted-foreground">✕</button>
                </div>
              ) : (
                <button onClick={() => setTrackForm({ releaseId: r.id, title: "" })} className="pl-16 text-xs text-primary hover:underline flex items-center gap-1">
                  <Plus size={12} /> Добавить трек
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReleases;
