import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Edit } from "lucide-react";

const AdminFriendEvents = () => {
  const qc = useQueryClient();
  const { data: events, isLoading } = useQuery({
    queryKey: ["admin_friend_events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("friend_events").select("*").order("date_start", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ source: "", source_id: "", title: "", date_start: "", city: "", venue: "", url: "" });

  const resetForm = () => { setForm({ source: "", source_id: "", title: "", date_start: "", city: "", venue: "", url: "" }); setEditing(null); };

  const handleSave = async () => {
    if (!form.title || !form.date_start || !form.city || !form.venue || !form.url || !form.source || !form.source_id) return toast.error("Заполните все поля");
    const payload = { source: form.source, source_id: form.source_id, title: form.title, date_start: form.date_start, city: form.city, venue: form.venue, url: form.url };
    if (editing) {
      const { error } = await supabase.from("friend_events").update(payload).eq("id", editing);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("friend_events").insert(payload);
      if (error) return toast.error(error.message);
    }
    toast.success(editing ? "Обновлено" : "Создано");
    resetForm();
    qc.invalidateQueries({ queryKey: ["admin_friend_events"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить?")) return;
    await supabase.from("friend_events").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin_friend_events"] });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Друзья по барам</h2>
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-semibold">{editing ? "Редактировать" : "Добавить"}</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <input placeholder="Источник" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
          <input placeholder="ID источника" value={form.source_id} onChange={(e) => setForm({ ...form, source_id: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
          <input placeholder="Название" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
          <input type="datetime-local" value={form.date_start} onChange={(e) => setForm({ ...form, date_start: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
          <input placeholder="Город" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
          <input placeholder="Площадка" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
        </div>
        <input placeholder="URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
        <div className="flex items-center gap-4">
          <button onClick={handleSave} className="rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">{editing ? "Сохранить" : "Добавить"}</button>
          {editing && <button onClick={resetForm} className="text-xs text-muted-foreground">Отмена</button>}
        </div>
      </div>
      {isLoading ? <p className="text-muted-foreground">Загрузка...</p> : (
        <div className="space-y-3">
          {events?.map((e) => (
            <div key={e.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
              <div>
                <p className="text-sm font-semibold">{e.title}</p>
                <p className="text-xs text-muted-foreground">{e.city} · {e.venue}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(e.id); setForm({ source: e.source, source_id: e.source_id, title: e.title, date_start: e.date_start?.slice(0, 16) || "", city: e.city, venue: e.venue, url: e.url }); }} className="text-muted-foreground hover:text-foreground"><Edit size={14} /></button>
                <button onClick={() => handleDelete(e.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFriendEvents;
