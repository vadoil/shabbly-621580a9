import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Edit, Save, X } from "lucide-react";

const AdminSections = () => {
  const qc = useQueryClient();
  const { data: sections, isLoading } = useQuery({
    queryKey: ["admin_sections"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_sections").select("*").order("key");
      if (error) throw error;
      return data;
    },
  });

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", content: "" });

  const startEdit = (s: any) => {
    setEditing(s.id);
    setForm({ title: s.title, content: s.content });
  };

  const handleSave = async () => {
    if (!editing) return;
    const { error } = await supabase.from("site_sections").update({ title: form.title, content: form.content }).eq("id", editing);
    if (error) return toast.error(error.message);
    toast.success("Сохранено");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin_sections"] });
  };

  const keyLabels: Record<string, string> = {
    hero_tagline: "Hero (подзаголовок)",
    about_therapy: "Искусство как терапия",
    about_band: "О группе",
    stats: "Статистика (формат: значение|подпись, каждая строка)",
    partners_text: "Текст о партнёрах",
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Секции сайта</h2>
      {isLoading ? (
        <p className="text-muted-foreground">Загрузка...</p>
      ) : (
        <div className="space-y-4">
          {sections?.map((s) => (
            <div key={s.id} className="rounded-lg border border-border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{keyLabels[s.key] || s.key}</p>
                  <p className="text-xs text-muted-foreground font-mono">{s.key}</p>
                </div>
                {editing === s.id ? (
                  <div className="flex gap-2">
                    <button onClick={handleSave} className="rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:opacity-90">
                      <Save size={12} className="inline mr-1" /> Сохранить
                    </button>
                    <button onClick={() => setEditing(null)} className="text-xs text-muted-foreground hover:text-foreground">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => startEdit(s)} className="text-muted-foreground hover:text-foreground">
                    <Edit size={14} />
                  </button>
                )}
              </div>
              {editing === s.id ? (
                <div className="space-y-2">
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Заголовок"
                    className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground"
                  />
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    placeholder="Содержимое"
                    rows={5}
                    className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground resize-none"
                  />
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium">{s.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap line-clamp-3">{s.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSections;
