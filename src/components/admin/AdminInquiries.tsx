import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { formatDate } from "@/lib/format";

const STATUSES = ["new", "in_progress", "won", "lost"] as const;

const AdminInquiries = () => {
  const qc = useQueryClient();
  const { data: items, isLoading } = useQuery({
    queryKey: ["admin_inquiries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("event_inquiries").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("event_inquiries").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin_inquiries"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить заявку?")) return;
    await supabase.from("event_inquiries").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin_inquiries"] });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Заявки на мероприятия</h2>
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Загрузка…</div>
        ) : items && items.length > 0 ? (
          items.map((i) => (
            <div key={i.id} className="rounded-lg border border-border bg-card p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{i.name}</h3>
                    {i.company && <span className="text-xs text-muted-foreground">· {i.company}</span>}
                  </div>
                  <p className="text-sm text-foreground">{i.contact}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(i.created_at)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={i.status}
                    onChange={(e) => updateStatus(i.id, e.target.value)}
                    className="rounded-md border border-input bg-secondary px-2 py-1 text-xs"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => remove(i.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="grid md:grid-cols-4 gap-2 text-xs text-muted-foreground border-t border-border pt-3">
                {i.format && <div><span className="text-foreground">Формат:</span> {i.format}</div>}
                {i.event_date && <div><span className="text-foreground">Дата:</span> {i.event_date}</div>}
                {i.city && <div><span className="text-foreground">Город:</span> {i.city}</div>}
                {i.budget && <div><span className="text-foreground">Бюджет:</span> {i.budget}</div>}
              </div>
              {i.comment && (
                <div className="text-sm text-secondary-foreground border-t border-border pt-3 whitespace-pre-line">
                  {i.comment}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground p-6 rounded-lg border border-border bg-card">Заявок пока нет</div>
        )}
      </div>
    </div>
  );
};

export default AdminInquiries;
