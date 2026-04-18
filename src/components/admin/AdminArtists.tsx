import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Edit, Plus, X } from "lucide-react";

type Form = {
  slug: string;
  name: string;
  short_description: string;
  bio: string;
  photo_url: string;
  genres: string;
  formats: string;
  cities: string;
  price_min: string;
  price_max: string;
  rider: string;
  popularity: string;
  sort_order: string;
  featured: boolean;
  published: boolean;
};

const empty: Form = {
  slug: "",
  name: "",
  short_description: "",
  bio: "",
  photo_url: "",
  genres: "",
  formats: "",
  cities: "",
  price_min: "",
  price_max: "",
  rider: "",
  popularity: "0",
  sort_order: "0",
  featured: false,
  published: true,
};

const AdminArtists = () => {
  const qc = useQueryClient();
  const { data: artists, isLoading } = useQuery({
    queryKey: ["admin_artists"],
    queryFn: async () => {
      const { data, error } = await supabase.from("artists").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Form>(empty);

  const startEdit = (a: any) => {
    setEditing(a.id);
    setForm({
      slug: a.slug || "",
      name: a.name || "",
      short_description: a.short_description || "",
      bio: a.bio || "",
      photo_url: a.photo_url || "",
      genres: (a.genres || []).join(", "),
      formats: (a.formats || []).join(", "),
      cities: (a.cities || []).join(", "),
      price_min: a.price_min?.toString() || "",
      price_max: a.price_max?.toString() || "",
      rider: a.rider || "",
      popularity: a.popularity?.toString() || "0",
      sort_order: a.sort_order?.toString() || "0",
      featured: !!a.featured,
      published: !!a.published,
    });
    setShowForm(true);
  };

  const reset = () => {
    setForm(empty);
    setEditing(null);
    setShowForm(false);
  };

  const save = async () => {
    if (!form.name || !form.slug) return toast.error("Заполните slug и имя");
    const payload = {
      slug: form.slug,
      name: form.name,
      short_description: form.short_description || null,
      bio: form.bio || null,
      photo_url: form.photo_url || null,
      genres: form.genres ? form.genres.split(",").map((s) => s.trim()).filter(Boolean) : [],
      formats: form.formats ? form.formats.split(",").map((s) => s.trim()).filter(Boolean) : [],
      cities: form.cities ? form.cities.split(",").map((s) => s.trim()).filter(Boolean) : [],
      price_min: form.price_min ? parseInt(form.price_min) : null,
      price_max: form.price_max ? parseInt(form.price_max) : null,
      rider: form.rider || null,
      popularity: parseInt(form.popularity) || 0,
      sort_order: parseInt(form.sort_order) || 0,
      featured: form.featured,
      published: form.published,
    };
    const { error } = editing
      ? await supabase.from("artists").update(payload).eq("id", editing)
      : await supabase.from("artists").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Обновлено" : "Создано");
    reset();
    qc.invalidateQueries({ queryKey: ["admin_artists"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить артиста?")) return;
    const { error } = await supabase.from("artists").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin_artists"] });
  };

  const input = "rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground w-full";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Артисты</h2>
        <button onClick={() => (showForm ? reset() : setShowForm(true))} className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
          {showForm ? <><X size={14} /> Отмена</> : <><Plus size={14} /> Новый артист</>}
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <h3 className="text-sm font-semibold">{editing ? "Редактировать артиста" : "Новый артист"}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <input placeholder="slug (например, shabbly)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={input} />
            <input placeholder="Имя / название" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
            <input placeholder="URL фото" value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} className={`${input} md:col-span-2`} />
            <input placeholder="Краткое описание" value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} className={`${input} md:col-span-2`} />
            <textarea placeholder="Био" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4} className={`${input} md:col-span-2 resize-none`} />
            <input placeholder="Жанры (через запятую)" value={form.genres} onChange={(e) => setForm({ ...form, genres: e.target.value })} className={input} />
            <input placeholder="Форматы (через запятую)" value={form.formats} onChange={(e) => setForm({ ...form, formats: e.target.value })} className={input} />
            <input placeholder="Города (через запятую)" value={form.cities} onChange={(e) => setForm({ ...form, cities: e.target.value })} className={`${input} md:col-span-2`} />
            <input type="number" placeholder="Цена от (₽)" value={form.price_min} onChange={(e) => setForm({ ...form, price_min: e.target.value })} className={input} />
            <input type="number" placeholder="Цена до (₽)" value={form.price_max} onChange={(e) => setForm({ ...form, price_max: e.target.value })} className={input} />
            <textarea placeholder="Райдер" value={form.rider} onChange={(e) => setForm({ ...form, rider: e.target.value })} rows={3} className={`${input} md:col-span-2 resize-none`} />
            <input type="number" placeholder="Популярность (0-100)" value={form.popularity} onChange={(e) => setForm({ ...form, popularity: e.target.value })} className={input} />
            <input type="number" placeholder="Порядок сортировки" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className={input} />
          </div>
          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured (на главной)
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Опубликовано
            </label>
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
        ) : artists && artists.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left p-3">Имя</th>
                <th className="text-left p-3">Жанры</th>
                <th className="text-left p-3">Featured</th>
                <th className="text-left p-3">Публикация</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {artists.map((a) => (
                <tr key={a.id} className="border-t border-border">
                  <td className="p-3 font-medium">{a.name}</td>
                  <td className="p-3 text-xs text-muted-foreground">{(a.genres || []).join(", ")}</td>
                  <td className="p-3">{a.featured ? "✓" : "—"}</td>
                  <td className="p-3">{a.published ? "✓" : "Скрыто"}</td>
                  <td className="p-3 flex gap-2 justify-end">
                    <button onClick={() => startEdit(a)} className="text-muted-foreground hover:text-foreground"><Edit size={14} /></button>
                    <button onClick={() => remove(a.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-sm text-muted-foreground">Артистов пока нет</div>
        )}
      </div>
    </div>
  );
};

export default AdminArtists;
