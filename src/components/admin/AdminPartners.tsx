import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Upload, Award } from "lucide-react";

const AdminPartners = () => {
  const qc = useQueryClient();
  const { data: partners, isLoading } = useQuery({
    queryKey: ["admin_partners"],
    queryFn: async () => {
      const { data, error } = await supabase.from("partners").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", url: "", sort_order: 0, published: true });

  const resetForm = () => { setForm({ name: "", url: "", sort_order: 0, published: true }); setEditing(null); };

  const handleSave = async () => {
    if (!form.name) return toast.error("Заполните название");
    if (editing) {
      const { error } = await supabase.from("partners").update({ name: form.name, url: form.url || null, sort_order: form.sort_order, published: form.published }).eq("id", editing);
      if (error) return toast.error(error.message);
      toast.success("Обновлено");
    } else {
      const { error } = await supabase.from("partners").insert({ name: form.name, url: form.url || null, sort_order: form.sort_order, published: form.published });
      if (error) return toast.error(error.message);
      toast.success("Создано");
    }
    resetForm();
    qc.invalidateQueries({ queryKey: ["admin_partners"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить?")) return;
    await supabase.from("partners").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin_partners"] });
  };

  const handleLogo = async (partnerId: string, file: File) => {
    const path = `partners/${partnerId}/${file.name}`;
    const { error: uploadErr } = await supabase.storage.from("covers").upload(path, file, { upsert: true });
    if (uploadErr) return toast.error(uploadErr.message);
    const { data: { publicUrl } } = supabase.storage.from("covers").getPublicUrl(path);
    await supabase.from("partners").update({ logo_url: publicUrl }).eq("id", partnerId);
    qc.invalidateQueries({ queryKey: ["admin_partners"] });
    toast.success("Логотип загружен");
  };

  const startEdit = (p: any) => {
    setEditing(p.id);
    setForm({ name: p.name, url: p.url || "", sort_order: p.sort_order, published: p.published });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Партнёры</h2>

      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-semibold">{editing ? "Редактировать" : "Новый партнёр"}</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <input placeholder="Название" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
          <input placeholder="URL сайта" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
          <input type="number" placeholder="Порядок" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
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

      {isLoading ? <p className="text-muted-foreground">Загрузка...</p> : (
        <div className="space-y-3">
          {partners?.map((p) => (
            <div key={p.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
              <div className="w-12 h-12 rounded bg-secondary overflow-hidden shrink-0 flex items-center justify-center">
                {p.logo_url ? <img src={p.logo_url} alt="" className="max-h-8 max-w-full object-contain" /> : (
                  <Award size={16} className="text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground truncate">{p.url || "Без ссылки"} · {p.published ? "✓" : "Черновик"}</p>
              </div>
              <label className="cursor-pointer shrink-0">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleLogo(p.id, e.target.files[0])} />
                <Upload size={14} className="text-muted-foreground hover:text-foreground" />
              </label>
              <button onClick={() => startEdit(p)} className="text-muted-foreground hover:text-foreground"><Edit size={14} /></button>
              <button onClick={() => handleDelete(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPartners;
