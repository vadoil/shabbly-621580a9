import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Edit, Users } from "lucide-react";

const AdminTeam = () => {
  const qc = useQueryClient();
  const { data: members, isLoading } = useQuery({
    queryKey: ["admin_team"],
    queryFn: async () => {
      const { data, error } = await supabase.from("team_members").select("*").order("order_index");
      if (error) throw error;
      return data;
    },
  });

  const [form, setForm] = useState({ name: "", role: "", bio: "", photo_url: "", order_index: 0 });
  const [editing, setEditing] = useState<string | null>(null);

  const reset = () => { setForm({ name: "", role: "", bio: "", photo_url: "", order_index: 0 }); setEditing(null); };

  const handleSave = async () => {
    if (!form.name) return toast.error("Укажите имя");
    const payload = { ...form, published: true };
    if (editing) {
      const { error } = await supabase.from("team_members").update(payload).eq("id", editing);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("team_members").insert(payload);
      if (error) return toast.error(error.message);
    }
    toast.success(editing ? "Обновлено" : "Создано");
    reset();
    qc.invalidateQueries({ queryKey: ["admin_team"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить?")) return;
    await supabase.from("team_members").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin_team"] });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Команда</h2>

      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-semibold">{editing ? "Редактировать" : "Добавить участника"}</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <input placeholder="Имя" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
          <input placeholder="Роль" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
          <input placeholder="Фото URL" value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
          <input type="number" placeholder="Порядок" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
        </div>
        <textarea placeholder="Био" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={2} className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground resize-none" />
        <div className="flex gap-2">
          <button onClick={handleSave} className="rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">{editing ? "Сохранить" : "Добавить"}</button>
          {editing && <button onClick={reset} className="text-xs text-muted-foreground">Отмена</button>}
        </div>
      </div>

      {isLoading ? <p className="text-muted-foreground text-sm">Загрузка...</p> : (
        <div className="space-y-3">
          {members?.map((m) => (
            <div key={m.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                {m.photo_url ? (
                  <img src={m.photo_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"><Users size={16} className="text-muted-foreground" /></div>
                )}
                <div>
                  <p className="text-sm font-semibold">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(m.id); setForm({ name: m.name, role: m.role || "", bio: m.bio || "", photo_url: m.photo_url || "", order_index: m.order_index }); }} className="text-muted-foreground hover:text-foreground"><Edit size={14} /></button>
                <button onClick={() => handleDelete(m.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTeam;
