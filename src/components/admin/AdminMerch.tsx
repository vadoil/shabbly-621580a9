import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Edit, ShoppingBag } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const AdminMerch = () => {
  const qc = useQueryClient();
  const { data: products, isLoading } = useQuery({
    queryKey: ["admin_merch"],
    queryFn: async () => {
      const { data, error } = await supabase.from("merch_products").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: requests } = useQuery({
    queryKey: ["admin_merch_requests"],
    queryFn: async () => {
      const { data, error } = await supabase.from("merch_requests").select("*, product:merch_products(title)").order("created_at", { ascending: false }).limit(20);
      if (error) throw error;
      return data;
    },
  });

  const [form, setForm] = useState({ slug: "", title: "", description: "", price_text: "", cover_url: "", category: "other" });
  const [editing, setEditing] = useState<string | null>(null);

  const reset = () => { setForm({ slug: "", title: "", description: "", price_text: "", cover_url: "", category: "other" }); setEditing(null); };

  const handleSave = async () => {
    if (!form.title || !form.slug) return toast.error("Заполните slug и название");
    const payload = { ...form, published: !editing };
    if (editing) {
      const { error } = await supabase.from("merch_products").update(payload).eq("id", editing);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("merch_products").insert(payload);
      if (error) return toast.error(error.message);
    }
    toast.success(editing ? "Обновлено" : "Создано");
    reset();
    qc.invalidateQueries({ queryKey: ["admin_merch"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить товар?")) return;
    await supabase.from("merch_products").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin_merch"] });
  };

  const togglePublished = async (id: string, current: boolean | null) => {
    await supabase.from("merch_products").update({ published: !current }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin_merch"] });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Мерч</h2>

      {/* Form */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-semibold">{editing ? "Редактировать" : "Новый товар"}</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
          <input placeholder="Название" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
          <input placeholder="Цена (текст)" value={form.price_text} onChange={(e) => setForm({ ...form, price_text: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
          <input placeholder="Cover URL" value={form.cover_url} onChange={(e) => setForm({ ...form, cover_url: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground">
            <option value="clothing">Одежда</option>
            <option value="accessories">Аксессуары</option>
            <option value="other">Другое</option>
          </select>
        </div>
        <textarea placeholder="Описание" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground resize-none" />
        <div className="flex gap-2">
          <button onClick={handleSave} className="rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">{editing ? "Сохранить" : "Создать"}</button>
          {editing && <button onClick={reset} className="text-xs text-muted-foreground">Отмена</button>}
        </div>
      </div>

      {/* Products */}
      {isLoading ? <p className="text-muted-foreground text-sm">Загрузка...</p> : (
        <div className="space-y-3">
          {products?.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                {p.cover_url ? (
                  <img src={p.cover_url} alt="" className="w-12 h-12 rounded-md object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-md bg-secondary flex items-center justify-center"><ShoppingBag size={16} className="text-muted-foreground" /></div>
                )}
                <div>
                  <p className="text-sm font-semibold">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.price_text} · {p.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => togglePublished(p.id, p.published)} className={`text-xs px-2 py-1 rounded ${p.published ? "bg-green-900/30 text-green-400" : "bg-secondary text-muted-foreground"}`}>
                  {p.published ? "Опубл." : "Черновик"}
                </button>
                <button onClick={() => { setEditing(p.id); setForm({ slug: p.slug, title: p.title, description: p.description || "", price_text: p.price_text || "", cover_url: p.cover_url || "", category: p.category || "other" }); }} className="text-muted-foreground hover:text-foreground"><Edit size={14} /></button>
                <button onClick={() => handleDelete(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Requests */}
      {requests && requests.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Заявки на мерч</h3>
          {requests.map((r: any) => (
            <div key={r.id} className="rounded-lg border border-border bg-card p-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">{r.name}</span>
                <span className="text-xs text-muted-foreground">{format(new Date(r.created_at), "d MMM HH:mm", { locale: ru })}</span>
              </div>
              <p className="text-xs text-muted-foreground">{r.contact} · {(r as any).product?.title || "—"}</p>
              {r.comment && <p className="text-xs text-muted-foreground mt-1 italic">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMerch;
