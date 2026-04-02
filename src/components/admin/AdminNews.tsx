import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Edit } from "lucide-react";

const AdminNews = () => {
  const qc = useQueryClient();
  const { data: news, isLoading } = useQuery({
    queryKey: ["admin_news"],
    queryFn: async () => {
      const { data, error } = await supabase.from("news").select("*").order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", content: "", published: false });

  const resetForm = () => { setForm({ title: "", slug: "", content: "", published: false }); setEditing(null); };

  const handleSave = async () => {
    if (!form.title || !form.slug || !form.content) return toast.error("Заполните все поля");
    const payload = { title: form.title, slug: form.slug, content: form.content, published: form.published };
    if (editing) {
      const { error } = await supabase.from("news").update(payload).eq("id", editing);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("news").insert(payload);
      if (error) return toast.error(error.message);
    }
    toast.success(editing ? "Обновлено" : "Создано");
    resetForm();
    qc.invalidateQueries({ queryKey: ["admin_news"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить?")) return;
    await supabase.from("news").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin_news"] });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Новости</h2>
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-semibold">{editing ? "Редактировать" : "Новая статья"}</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <input placeholder="Заголовок" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
          <input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
        </div>
        <textarea placeholder="Содержание" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground resize-none" />
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Опубликовать</label>
          <button onClick={handleSave} className="rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">{editing ? "Сохранить" : "Создать"}</button>
          {editing && <button onClick={resetForm} className="text-xs text-muted-foreground">Отмена</button>}
        </div>
      </div>
      {isLoading ? <p className="text-muted-foreground">Загрузка...</p> : (
        <div className="space-y-3">
          {news?.map((n) => (
            <div key={n.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
              <div>
                <p className="text-sm font-semibold">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.published ? "✓" : "Черновик"}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(n.id); setForm({ title: n.title, slug: n.slug, content: n.content, published: n.published || false }); }} className="text-muted-foreground hover:text-foreground"><Edit size={14} /></button>
                <button onClick={() => handleDelete(n.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNews;
