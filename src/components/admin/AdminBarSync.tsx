import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RefreshCw, Calendar, MapPin, Ticket, Edit, Save, X } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const AdminBarSync = () => {
  const qc = useQueryClient();
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<Record<string, unknown> | null>(null);
  const [editingBar, setEditingBar] = useState(false);
  const [barForm, setBarForm] = useState({ address: "", phone: "", website_url: "" });

  const { data: bar } = useQuery({
    queryKey: ["admin_bar"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bars")
        .select("*")
        .eq("slug", "rhythm-blues-cafe")
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: recentEvents, isLoading } = useQuery({
    queryKey: ["admin_bar_events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bar_events")
        .select("*")
        .order("date_start", { ascending: true })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  const runSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("sync-rhythm-blues-cafe");
      if (error) throw error;
      setSyncResult(data);
      toast.success(`Синхронизация: +${data.inserted} новых, ${data.updated} обновлено`);
      qc.invalidateQueries({ queryKey: ["admin_bar_events"] });
    } catch (e: any) {
      toast.error(`Ошибка: ${e.message}`);
    } finally {
      setSyncing(false);
    }
  };

  const startEditBar = () => {
    if (!bar) return;
    setBarForm({ address: bar.address || "", phone: bar.phone || "", website_url: bar.website_url || "" });
    setEditingBar(true);
  };

  const saveBar = async () => {
    if (!bar) return;
    const { error } = await supabase.from("bars").update(barForm).eq("id", bar.id);
    if (error) return toast.error(error.message);
    toast.success("Обновлено");
    setEditingBar(false);
    qc.invalidateQueries({ queryKey: ["admin_bar"] });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Rhythm & Blues Cafe</h2>

      {/* Bar info */}
      {bar && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Площадка</h3>
            {!editingBar ? (
              <button onClick={startEditBar} className="text-xs text-primary hover:underline flex items-center gap-1"><Edit size={12} /> Редактировать</button>
            ) : (
              <div className="flex gap-2">
                <button onClick={saveBar} className="text-xs text-primary hover:underline flex items-center gap-1"><Save size={12} /> Сохранить</button>
                <button onClick={() => setEditingBar(false)} className="text-xs text-muted-foreground hover:underline flex items-center gap-1"><X size={12} /> Отмена</button>
              </div>
            )}
          </div>
          {editingBar ? (
            <div className="grid gap-3 md:grid-cols-3">
              <input placeholder="Адрес" value={barForm.address} onChange={(e) => setBarForm({ ...barForm, address: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
              <input placeholder="Телефон" value={barForm.phone} onChange={(e) => setBarForm({ ...barForm, phone: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
              <input placeholder="Сайт" value={barForm.website_url} onChange={(e) => setBarForm({ ...barForm, website_url: e.target.value })} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground" />
            </div>
          ) : (
            <div className="text-sm text-muted-foreground space-y-1">
              <p><MapPin size={12} className="inline text-primary mr-1" /> {bar.address || "—"}</p>
              <p>📞 {bar.phone || "—"}</p>
              <p>🌐 {bar.website_url || "—"}</p>
            </div>
          )}
        </div>
      )}

      {/* Sync controls */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-semibold">Синхронизация с сайтом R&B Cafe</h3>
        <p className="text-xs text-muted-foreground">
          Парсит главную страницу rhythm-blues-cafe.ru и загружает все события в базу.
        </p>
        <button
          onClick={runSync}
          disabled={syncing}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
          {syncing ? "Синхронизация..." : "Синхронизировать сейчас"}
        </button>
      </div>

      {/* Sync result */}
      {syncResult && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm space-y-1">
          <p className="font-semibold text-foreground">Результат:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
            <div>Найдено: <span className="text-foreground font-medium">{String(syncResult.parsed)}</span></div>
            <div>Новых: <span className="text-foreground font-medium">{String(syncResult.inserted)}</span></div>
            <div>Обновлено: <span className="text-foreground font-medium">{String(syncResult.updated)}</span></div>
            <div>Ошибки: <span className="text-foreground font-medium">{String(syncResult.errors)}</span></div>
          </div>
        </div>
      )}

      {/* Events table */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">События ({recentEvents?.length || 0})</h3>
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Загрузка...</p>
        ) : recentEvents && recentEvents.length > 0 ? (
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {recentEvents.map((ev) => (
              <div key={ev.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{ev.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1"><Calendar size={10} /> {format(new Date(ev.date_start), "d MMM HH:mm", { locale: ru })}</span>
                    {ev.hall && <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px]">{ev.hall}</span>}
                    {ev.ticket_url && <Ticket size={10} className="text-primary" />}
                  </p>
                </div>
                {ev.source_url && (
                  <a href={ev.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline shrink-0 ml-2">
                    Ссылка
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Событий пока нет. Запустите синхронизацию.</p>
        )}
      </div>
    </div>
  );
};

export default AdminBarSync;
