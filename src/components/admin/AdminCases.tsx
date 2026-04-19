import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Edit, Plus, X } from "lucide-react";

const empty = {
  slug: "",
  title: "",
  client: "",
  city: "",
  format: "",
  event_date: "",
  cover_url: "",
  description: "",
  gallery: "[]",
  sort_order: "0",
  featured: false,
  published: true,
};

const AdminCases = () => {
  const qc = useQueryClient();
  const { data: items, isLoading } = useQuery({
    queryKey: ["admin_cases"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cases").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const [editing, setEditing] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(empty);

  const startEdit = (c: any) => {
    setEditing(c.id);
    setForm({
      slug: c.slug || "",
      title: c.title || "",
      client: c.client || "",
      city: c.city || "",
      format: c.format || "",
      event_date: c.event_date || "",
      cover_url: c.cover_url || "",
      description: c.description || "",
      gallery: JSON.stringify(c.gallery || [], null, 2),
      sort_order: c.sort_order?.toString() || "0",
      featured: !!c.featured,
      published: !!c.published,
    });
    setShow(true);
  };

  const reset = () => { setForm(empty); setEditing(null); setShow(false); };

  const save = async () => {
    if (!form.title || !form.slug) return toast.error("Заполните slug и название");
    let gal: any = [];
    try { gal = JSON.parse(form.gallery || "[]"); } catch { return toast.error("Галерея: невалидный JSON"); }
    const payload = {
      slug: form.slug,
      title: form.title,
      client: form.client || null,
      city: form.city || null,
      format: form.format || null,
      event_date: form.event_date || null,
      cover_url: form.cover_url || null,
      description: form.description || null,
      gallery: gal,
      sort_order: parseInt(form.sort_order) || 0,
      featured: form.featured,
      published: form.published,
    };
    const { error } = editing
      ? await supabase.from("cases").update(payload).eq("id", editing)
      : await supabase.from("cases").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Обновлено" : "Создано");
    reset();
    qc.invalidateQueries({ queryKey: ["admin_cases"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить проект?")) return;
    await supabase.from("cases").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin_cases"] });
  };

  const input = "rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground w-full";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Проекты</h2>
        <button onClick={() => (show ? reset() : setShow(true))} className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
          {show ? <><X size={14} /> Отмена</> : <><Plus size={14} /> Новый проект</>}
        </button>
      </div>

      {show && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <input placeholder="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={input} />
            <input placeholder="Название" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={input} />
            <input placeholder="Клиент" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} className={input} />
            <input placeholder="Город" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={input} />
            <input placeholder="Формат" value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} className={input} />
            <input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} className={input} />
            <input placeholder="URL обложки" value={form.cover_url} onChange={(e) => setForm({ ...form, cover_url: e.target.value })} className={`${input} md:col-span-2`} />
            <textarea placeholder="Описание" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={`${input} md:col-span-2 resize-none`} />
            <input type="number" placeholder="Сортировка" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className={input} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Галерея (JSON массив URL):</label>
            <textarea value={form.gallery} onChange={(e) => setForm({ ...form, gallery: e.target.value })} rows={5} className={`${input} font-mono text-xs resize-y`} placeholder='["https://...jpg", "https://...jpg"]' />
          </div>
          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> На главную</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Опубликовано</label>
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">{editing ? "Сохранить" : "Создать"}</button>
            <button onClick={reset} className="rounded-md border border-border px-4 py-2 text-sm">Отмена</button>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Загрузка…</div>
        ) : items && items.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left p-3">Название</th>
                <th className="text-left p-3">Клиент</th>
                <th className="text-left p-3">Дата</th>
                <th className="text-left p-3">На главной</th>
                <th className="text-left p-3">Публ.</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="p-3 font-medium">{c.title}</td>
                  <td className="p-3 text-xs text-muted-foreground">{c.client || "—"}</td>
                  <td className="p-3 text-xs">{c.event_date || "—"}</td>
                  <td className="p-3">{c.featured ? "✓" : "—"}</td>
                  <td className="p-3">{c.published ? "✓" : "Скрыто"}</td>
                  <td className="p-3 flex gap-2 justify-end">
                    <button onClick={() => startEdit(c)} className="text-muted-foreground hover:text-foreground"><Edit size={14} /></button>
                    <button onClick={() => remove(c.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-sm text-muted-foreground">Проектов пока нет</div>
        )}
      </div>
    </div>
  );
};

export default AdminCases;
