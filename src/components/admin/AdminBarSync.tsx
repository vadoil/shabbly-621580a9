import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RefreshCw, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const AdminBarSync = () => {
  const qc = useQueryClient();
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<Record<string, unknown> | null>(null);
  const [customYear, setCustomYear] = useState(new Date().getFullYear());
  const [customMonth, setCustomMonth] = useState(new Date().getMonth() + 1);

  const { data: recentEvents, isLoading } = useQuery({
    queryKey: ["admin_bar_events_recent"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bar_events_external")
        .select("*, venue:venues_external(name)")
        .order("date_start", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });

  const runSync = async (year?: number, month?: number) => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const body = year && month ? { year, month } : {};
      const { data, error } = await supabase.functions.invoke("sync-restoclub-msk", { body });
      if (error) throw error;
      setSyncResult(data);
      toast.success(`Синхронизация завершена: ${data.events_upserted || 0} событий`);
      qc.invalidateQueries({ queryKey: ["admin_bar_events_recent"] });
    } catch (e: any) {
      toast.error(`Ошибка: ${e.message}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Бары и шоу (Restoclub)</h2>

      {/* Sync controls */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <h3 className="text-sm font-semibold">Быстрая синхронизация</h3>
          <p className="text-xs text-muted-foreground">
            Автоматически определит месяц: если сегодня ≥ 24 числа — следующий месяц, иначе текущий.
          </p>
          <button
            onClick={() => runSync()}
            disabled={syncing}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Синхронизация..." : "Синхронизировать"}
          </button>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <h3 className="text-sm font-semibold">Произвольный месяц</h3>
          <div className="flex gap-2">
            <input
              type="number"
              min={2024}
              max={2030}
              value={customYear}
              onChange={(e) => setCustomYear(Number(e.target.value))}
              className="w-24 rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground"
            />
            <select
              value={customMonth}
              onChange={(e) => setCustomMonth(Number(e.target.value))}
              className="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground flex-1"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {format(new Date(2024, i), "LLLL", { locale: ru })}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => runSync(customYear, customMonth)}
            disabled={syncing}
            className="inline-flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-xs font-semibold text-secondary-foreground hover:bg-muted disabled:opacity-50 transition-colors"
          >
            <Calendar size={14} />
            Синхронизировать {customYear}-{String(customMonth).padStart(2, "0")}
          </button>
        </div>
      </div>

      {/* Sync result */}
      {syncResult && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm space-y-1">
          <p className="font-semibold text-foreground">Результат синхронизации:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
            <div>Месяц: <span className="text-foreground font-medium">{String(syncResult.target)}</span></div>
            <div>Страниц: <span className="text-foreground font-medium">{String(syncResult.pages_crawled)}</span></div>
            <div>Заведений: <span className="text-foreground font-medium">{String(syncResult.venues_found)}</span></div>
            <div>Событий: <span className="text-foreground font-medium">{String(syncResult.events_upserted)}</span></div>
          </div>
        </div>
      )}

      {/* Recent events */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Последние 20 событий</h3>
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Загрузка...</p>
        ) : recentEvents && recentEvents.length > 0 ? (
          <div className="space-y-2">
            {recentEvents.map((ev: any) => (
              <div key={ev.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{ev.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="inline-flex items-center gap-1"><MapPin size={10} /> {ev.venue?.name || "—"}</span>
                    <span className="inline-flex items-center gap-1"><Calendar size={10} /> {format(new Date(ev.date_start), "d MMM HH:mm", { locale: ru })}</span>
                  </p>
                </div>
                <a href={ev.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline shrink-0 ml-2">
                  Ссылка
                </a>
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
