import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Upload } from "lucide-react";

const AdminReleases = () => {
  const qc = useQueryClient();
  const { data: releases, isLoading } = useQuery({
    queryKey: ["admin_releases"],
    queryFn: async () => {
      const { data, error } = await supabase.from("releases").select("*, tracks(*), platform_links(*)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", type: "single" as "album" | "single" | "ep", release_date: "", description: "", published: false });

  const resetForm = () => { setForm({ title: "", slug: "", type: "single", release_date: "", description: "", published: false }); setEditing(null); };

  const handleSave = async () => {
    if (!form.title || !form.slug) return toast.error("Заполните название и slug");
    if (editing) {
      const { error } = await supabase.from("releases").update({ title: form.title, slug: form.slug, type: form.type, release_date: form.release_date || null, description: form.description || null, published: form.published }).eq("id", editing);
      if (error) return toast.error(error.message);
      toast.success("Обновлено");
    } else {
      const { error } = await supabase.from("releases").insert({ title: form.title, slug: form.slug, type: form.type, release_date: form.release_date || null, description: form.description || null, published: form.published });
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

  const startEdit = (r: any) => {
    setEditing(r.id);
    setForm({ title: r.title, slug: r.slug, type: r.type, release_date: r.release_date || "", description: r.description || "", published: r.published });
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
            <div key={r.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
              <div className="w-12 h-12 rounded bg-secondary overflow-hidden shrink-0">
                {r.cover_url && <img src={r.cover_url} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.type} · {r.published ? "✓ Опубл." : "Черновик"}</p>
              </div>
              <label className="cursor-pointer shrink-0">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleCoverUpload(r.id, e.target.files[0])} />
                <Upload size={14} className="text-muted-foreground hover:text-foreground" />
              </label>
              <button onClick={() => startEdit(r)} className="text-muted-foreground hover:text-foreground"><Edit size={14} /></button>
              <button onClick={() => handleDelete(r.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReleases;
