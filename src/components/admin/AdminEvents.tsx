import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Edit } from "lucide-react";

const AdminEvents = () => {
  const qc = useQueryClient();
  const { data: events, isLoading } = useQuery({
    queryKey: ["admin_events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").order("date_start", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", date_start: "", city: "", venue: "", address: "", ticket_url: "", published: false });

  const resetForm = () => { setForm({ title: "", date_start: "", city: "", venue: "", address: "", ticket_url: "", published: false }); setEditing(null); };

  const handleSave = async () => {
    if (!form.title || !form.date_start || !form.city || !form.venue) return toast.error("Заполните обязательные поля");
    const payload = { title: form.title, date_start: form.date_start, city: form.city, venue: form.venue, address: form.address || null, ticket_url: form.ticket_url || null, published: form.published };
    if (editing) {
      const { error } = await supabase.from("events").update(payload).eq("id", editing);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("events").insert(payload);
      if (error) return toast.error(error.message);
    }
    toast.success(editing ? "Обновлено" : "Создано");
    resetForm();
    qc.invalidateQueries({ queryKey: ["admin_events"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить?")) return;
    await supabase.from("events").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin_events"] });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Концерты</h2>
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-semibold">{editing ? "Редактировать" : "Новое событие"}</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <input placeholder="Название" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
          <input type="datetime-local" value={form.date_start} onChange={(e) => setForm({ ...form, date_start: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
          <input placeholder="Город" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
          <input placeholder="Площадка" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
          <input placeholder="Адрес" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
          <input placeholder="Ссылка на билеты" value={form.ticket_url} onChange={(e) => setForm({ ...form, ticket_url: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Опубликовать</label>
          <button onClick={handleSave} className="rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">{editing ? "Сохранить" : "Создать"}</button>
          {editing && <button onClick={resetForm} className="text-xs text-muted-foreground">Отмена</button>}
        </div>
      </div>
      {isLoading ? <p className="text-muted-foreground">Загрузка...</p> : (
        <div className="space-y-3">
          {events?.map((e) => (
            <div key={e.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
              <div>
                <p className="text-sm font-semibold">{e.title}</p>
                <p className="text-xs text-muted-foreground">{e.city} · {e.venue} · {e.published ? "✓" : "Черновик"}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(e.id); setForm({ title: e.title, date_start: e.date_start?.slice(0, 16) || "", city: e.city, venue: e.venue, address: e.address || "", ticket_url: e.ticket_url || "", published: e.published || false }); }} className="text-muted-foreground hover:text-foreground"><Edit size={14} /></button>
                <button onClick={() => handleDelete(e.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
