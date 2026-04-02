import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Edit, Plus } from "lucide-react";

const AdminGallery = () => {
  const qc = useQueryClient();
  const { data: albums, isLoading } = useQuery({
    queryKey: ["admin_gallery_albums"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_albums").select("*, gallery_items(count)").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const [form, setForm] = useState({ slug: "", title: "", cover_url: "", description: "" });
  const [editing, setEditing] = useState<string | null>(null);

  const reset = () => { setForm({ slug: "", title: "", cover_url: "", description: "" }); setEditing(null); };

  const handleSave = async () => {
    if (!form.title || !form.slug) return toast.error("Заполните slug и название");
    const payload = { ...form, published: true };
    if (editing) {
      const { error } = await supabase.from("gallery_albums").update(payload).eq("id", editing);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("gallery_albums").insert(payload);
      if (error) return toast.error(error.message);
    }
    toast.success(editing ? "Обновлено" : "Создано");
    reset();
    qc.invalidateQueries({ queryKey: ["admin_gallery_albums"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить альбом?")) return;
    await supabase.from("gallery_albums").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin_gallery_albums"] });
  };

  // Item management
  const [itemAlbum, setItemAlbum] = useState<string | null>(null);
  const [itemUrl, setItemUrl] = useState("");
  const [itemCaption, setItemCaption] = useState("");

  const { data: items } = useQuery({
    queryKey: ["admin_gallery_items", itemAlbum],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_items").select("*").eq("album_id", itemAlbum!).order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: !!itemAlbum,
  });

  const addItem = async () => {
    if (!itemUrl || !itemAlbum) return toast.error("Укажите URL");
    const { error } = await supabase.from("gallery_items").insert({ album_id: itemAlbum, image_url: itemUrl, caption: itemCaption || null });
    if (error) return toast.error(error.message);
    toast.success("Фото добавлено");
    setItemUrl("");
    setItemCaption("");
    qc.invalidateQueries({ queryKey: ["admin_gallery_items", itemAlbum] });
  };

  const deleteItem = async (id: string) => {
    await supabase.from("gallery_items").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin_gallery_items", itemAlbum] });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Галерея</h2>

      {/* Album form */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-semibold">{editing ? "Редактировать альбом" : "Новый альбом"}</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <input placeholder="Slug (url)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
          <input placeholder="Название" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
          <input placeholder="Cover URL" value={form.cover_url} onChange={(e) => setForm({ ...form, cover_url: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
          <input placeholder="Описание" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} className="rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">{editing ? "Сохранить" : "Создать"}</button>
          {editing && <button onClick={reset} className="text-xs text-muted-foreground">Отмена</button>}
        </div>
      </div>

      {/* Albums list */}
      {isLoading ? <p className="text-muted-foreground text-sm">Загрузка...</p> : (
        <div className="space-y-3">
          {albums?.map((a) => (
            <div key={a.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold">{a.title} <span className="text-xs text-muted-foreground">/{a.slug}</span></p>
                  <p className="text-xs text-muted-foreground">{(a as any).gallery_items?.[0]?.count || 0} фото</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setItemAlbum(itemAlbum === a.id ? null : a.id)} className="text-xs text-primary hover:underline">
                    {itemAlbum === a.id ? "Скрыть фото" : "Фото"}
                  </button>
                  <button onClick={() => { setEditing(a.id); setForm({ slug: a.slug, title: a.title, cover_url: a.cover_url || "", description: a.description || "" }); }} className="text-muted-foreground hover:text-foreground"><Edit size={14} /></button>
                  <button onClick={() => handleDelete(a.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                </div>
              </div>

              {/* Items panel */}
              {itemAlbum === a.id && (
                <div className="mt-3 pt-3 border-t border-border space-y-3">
                  <div className="flex gap-2">
                    <input placeholder="Image URL" value={itemUrl} onChange={(e) => setItemUrl(e.target.value)} className="flex-1 rounded-md border border-input bg-secondary px-3 py-1.5 text-sm text-foreground" />
                    <input placeholder="Подпись" value={itemCaption} onChange={(e) => setItemCaption(e.target.value)} className="w-40 rounded-md border border-input bg-secondary px-3 py-1.5 text-sm text-foreground" />
                    <button onClick={addItem} className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"><Plus size={14} /></button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {items?.map((item) => (
                      <div key={item.id} className="relative group aspect-square rounded-md overflow-hidden bg-secondary">
                        <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                        <button onClick={() => deleteItem(item.id)} className="absolute top-1 right-1 p-1 bg-background/80 rounded text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
