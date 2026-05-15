import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Upload, Music } from "lucide-react";

import { proxify } from "@/lib/storage";
const AdminMembers = () => {
  const qc = useQueryClient();
  const { data: members, isLoading } = useQuery({
    queryKey: ["admin_members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("band_members").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", role: "", sort_order: 0, published: true });

  const resetForm = () => { setForm({ name: "", role: "", sort_order: 0, published: true }); setEditing(null); };

  const handleSave = async () => {
    if (!form.name) return toast.error("Заполните имя");
    if (editing) {
      const { error } = await supabase.from("band_members").update({ name: form.name, role: form.role, sort_order: form.sort_order, published: form.published }).eq("id", editing);
      if (error) return toast.error(error.message);
      toast.success("Обновлено");
    } else {
      const { error } = await supabase.from("band_members").insert({ name: form.name, role: form.role, sort_order: form.sort_order, published: form.published });
      if (error) return toast.error(error.message);
      toast.success("Создано");
    }
    resetForm();
    qc.invalidateQueries({ queryKey: ["admin_members"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить?")) return;
    await supabase.from("band_members").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin_members"] });
  };

  const handlePhoto = async (memberId: string, file: File) => {
    const path = `members/${memberId}/${file.name}`;
    const { error: uploadErr } = await supabase.storage.from("covers").upload(path, file, { upsert: true });
    if (uploadErr) return toast.error(uploadErr.message);
    const { data: { publicUrl } } = supabase.storage.from("covers").getPublicUrl(path);
    await supabase.from("band_members").update({ photo_url: publicUrl }).eq("id", memberId);
    qc.invalidateQueries({ queryKey: ["admin_members"] });
    toast.success("Фото загружено");
  };

  const startEdit = (m: any) => {
    setEditing(m.id);
    setForm({ name: m.name, role: m.role, sort_order: m.sort_order, published: m.published });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Участники группы</h2>

      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-semibold">{editing ? "Редактировать" : "Новый участник"}</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <input placeholder="Имя" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
          <input placeholder="Роль (гитарист, вокалист...)" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
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
          {members?.map((m) => (
            <div key={m.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
              <div className="w-12 h-12 rounded-full bg-secondary overflow-hidden shrink-0">
                {m.photo_url ? <img src={proxify(m.photo_url)} alt="" className="w-full h-full object-cover" /> : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Music size={16} /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.role} · {m.published ? "✓" : "Черновик"}</p>
              </div>
              <label className="cursor-pointer shrink-0">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handlePhoto(m.id, e.target.files[0])} />
                <Upload size={14} className="text-muted-foreground hover:text-foreground" />
              </label>
              <button onClick={() => startEdit(m)} className="text-muted-foreground hover:text-foreground"><Edit size={14} /></button>
              <button onClick={() => handleDelete(m.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMembers;
