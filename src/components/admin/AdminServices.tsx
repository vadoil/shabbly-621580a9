import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Edit, Plus, X } from "lucide-react";

const empty = {
  slug: "",
  title: "",
  description: "",
  icon: "sparkles",
  packages: "[]",
  sort_order: "0",
  published: true,
};

const AdminServices = () => {
  const qc = useQueryClient();
  const { data: items, isLoading } = useQuery({
    queryKey: ["admin_services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const [editing, setEditing] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(empty);

  const startEdit = (s: any) => {
    setEditing(s.id);
    setForm({
      slug: s.slug || "",
      title: s.title || "",
      description: s.description || "",
      icon: s.icon || "sparkles",
      packages: JSON.stringify(s.packages || [], null, 2),
      sort_order: s.sort_order?.toString() || "0",
      published: !!s.published,
    });
    setShow(true);
  };

  const reset = () => { setForm(empty); setEditing(null); setShow(false); };

  const save = async () => {
    if (!form.title || !form.slug) return toast.error("Заполните slug и название");
    let pkgs: any = [];
    try { pkgs = JSON.parse(form.packages || "[]"); } catch { return toast.error("Пакеты: невалидный JSON"); }
    const payload = {
      slug: form.slug,
      title: form.title,
      description: form.description || null,
      icon: form.icon || null,
      packages: pkgs,
      sort_order: parseInt(form.sort_order) || 0,
      published: form.published,
    };
    const { error } = editing
      ? await supabase.from("services").update(payload).eq("id", editing)
      : await supabase.from("services").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Обновлено" : "Создано");
    reset();
    qc.invalidateQueries({ queryKey: ["admin_services"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить услугу?")) return;
    await supabase.from("services").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin_services"] });
  };

  const input = "rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground w-full";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Услуги</h2>
        <button onClick={() => (show ? reset() : setShow(true))} className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
          {show ? <><X size={14} /> Отмена</> : <><Plus size={14} /> Новая услуга</>}
        </button>
      </div>

      {show && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <input placeholder="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={input} />
            <input placeholder="Название" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={input} />
            <textarea placeholder="Описание" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={`${input} md:col-span-2 resize-none`} />
            <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className={input}>
              <option value="sparkles">✨ sparkles</option>
              <option value="music">🎵 music</option>
              <option value="mic">🎤 mic</option>
              <option value="briefcase">💼 briefcase</option>
              <option value="party">🎉 party</option>
            </select>
            <input type="number" placeholder="Сортировка" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className={input} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Пакеты (JSON):</label>
            <textarea
              value={form.packages}
              onChange={(e) => setForm({ ...form, packages: e.target.value })}
              rows={8}
              className={`${input} font-mono text-xs resize-y`}
              placeholder='[{"name":"Базовый","price":"от 100 000 ₽","features":["Артист","Звук"]}]'
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Опубликовано
          </label>
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
                <th className="text-left p-3">Slug</th>
                <th className="text-left p-3">Пакеты</th>
                <th className="text-left p-3">Публ.</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="p-3 font-medium">{s.title}</td>
                  <td className="p-3 text-xs text-muted-foreground">{s.slug}</td>
                  <td className="p-3 text-xs">{((s.packages as any[]) || []).length}</td>
                  <td className="p-3">{s.published ? "✓" : "Скрыто"}</td>
                  <td className="p-3 flex gap-2 justify-end">
                    <button onClick={() => startEdit(s)} className="text-muted-foreground hover:text-foreground"><Edit size={14} /></button>
                    <button onClick={() => remove(s.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-sm text-muted-foreground">Услуг пока нет</div>
        )}
      </div>
    </div>
  );
};

export default AdminServices;
